export class HttpException extends Error {
  statusCode: number;
  message: string;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestException extends HttpException {
  constructor(message = "Bad Request") {
    super(message, 400);
  }
}

export class NotFoundException extends HttpException {
  constructor(message = "Not Found") {
    super(message, 404);
  }
}

export class UnauthorizedException extends HttpException {
  constructor(message = "Unauthorized") {
    super(message, 401);
  }
}

export class ForbiddenException extends HttpException {
  constructor(message = "Forbidden") {
    super(message, 403);
  }
}

export class InternalServerErrorException extends HttpException {
  constructor(message = "Internal Server Error") {
    super(message, 500);
  }
}

export class ConflictException extends HttpException {
  constructor(message = "Conflict") {
    super(message, 409);
  }
}

export class UnprocessableEntityException extends HttpException {
  constructor(message = "Unprocessable Entity") {
    super(message, 422);
  }
}

export class MethodNotAllowedException extends HttpException {
  constructor(message = "Method Not Allowed") {
    super(message, 405);
  }
}

export class GoneException extends HttpException {
  constructor(message = "Gone") {
    super(message, 410);
  }
}

export class LengthRequiredException extends HttpException {
  constructor(message = "Length Required") {
    super(message, 411);
  }
}

export class PreconditionFailedException extends HttpException {
  constructor(message = "Precondition Failed") {
    super(message, 412);
  }
}

export class RequestEntityTooLargeException extends HttpException {
  constructor(message = "Request Entity Too Large") {
    super(message, 413);
  }
}

export class RequestUriTooLongException extends HttpException {
  constructor(message = "Request-URI Too Long") {
    super(message, 414);
  }
}

export class UnsupportedMediaTypeException extends HttpException {
  constructor(message = "Unsupported Media Type") {
    super(message, 415);
  }
}

export class RangeNotSatisfiableException extends HttpException {
  constructor(message = "Range Not Satisfiable") {
    super(message, 416);
  }
}

export class UnavailableForLegalReasonsException extends HttpException {
  constructor(message = "Unavailable For Legal Reasons") {
    super(message, 451);
  }
}


export class NotAcceptableException extends HttpException {
  constructor(message = "Not Acceptable") {
    super(message, 406);
  }
}

export class RequestTimeoutException extends HttpException {
  constructor(message = "Request Timeout") {
    super(message, 408);
  }
}

export class ImATeapotException extends HttpException {
  constructor(message = "I'm a teapot") {
    super(message, 418);
  }
}

export class HttpVersionNotSupportedException extends HttpException {
  constructor(message = "HTTP Version Not Supported") {
    super(message, 505);
  }
}

export class PayloadTooLargeException extends HttpException {
  constructor(message = "Payload Too Large") {
    super(message, 413);
  }
}

export class BadGatewayException extends HttpException {
  constructor(message = "Bad Gateway") {
    super(message, 502);
  }
}

export class ServiceUnavailableException extends HttpException {
  constructor(message = "Service Unavailable") {
    super(message, 503);
  }
}

export class GatewayTimeoutException extends HttpException {
  constructor(message = "Gateway Timeout") {
    super(message, 504);
  }
}

export class NotImplementedException extends HttpException {
  constructor(message = "Not Implemented") {
    super(message, 501);
  }
}

export class TooManyRequestException extends HttpException{
  constructor(message = "Too Many Request") {
    super(message, 429);
  }
}