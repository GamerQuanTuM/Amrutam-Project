import { Request, Response, NextFunction } from 'express';
import { z, ZodTypeAny } from 'zod';

export const validateRequest = <
  TBody extends ZodTypeAny,
  TParams extends ZodTypeAny,
  TQuery extends ZodTypeAny
>(schemas: {
  body?: TBody;
  params?: TParams;
  query?: TQuery;
}) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      if (schemas.body) {
        req.body = schemas.body.parse(req.body);
      }
      
      if (schemas.params) {
        req.params = schemas.params.parse(req.params) as any;
      }
      
      if (schemas.query) {
        schemas.query.parse(req.query);
      }
  
      next();
    } catch (error:any) {
      console.error('❌ Validation error caught:', error);
      
      if (error instanceof z.ZodError) {
        res.status(422).json({
          message: 'Validation error',
          errors: error,
        });
        return;
      }
      
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  };
};
