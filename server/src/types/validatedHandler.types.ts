// validatedHandler.types.ts
import { Request, Response, NextFunction } from 'express';
import { AuthUser } from "../types/authUser.types"

type TResponse<T> = {
  message: string;
  data: T;
}


export type ValidatedHandler<
  TBody = unknown,
  TParams = unknown,
  TQuery = unknown,
  TData = any,
> = (
  req: Request<TParams, TResponse<TData>, TBody, TQuery>,
  res: Response<TResponse<TData>>,
  next: NextFunction
) => Promise<void> | void;


export type AuthenticatedHandler<
  TBody = unknown,
  TParams = unknown,
  TQuery = unknown,
  TData = any,
> = (
  req: Request<TParams, TResponse<TData>, TBody, TQuery> & { user?: AuthUser },
  res: Response<TResponse<TData>>,
  next: NextFunction
) => Promise<void> | void;
