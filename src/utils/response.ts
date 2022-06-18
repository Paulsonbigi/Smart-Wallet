import { HttpStatus } from "@nestjs/common";
import { Response} from "express";

export const response = (res: Response, data: any) => {
    res.status(data.code).json(data);
};

export const errorResponse = (errorCode = '500') => {
    let code: HttpStatus;
    switch (errorCode) {
      case '400':
        code = HttpStatus.BAD_REQUEST;
        break;
      case '401':
        code = HttpStatus.UNAUTHORIZED;
        break;
      case '402':
        code = HttpStatus.PAYMENT_REQUIRED;
        break;
      case '403':
        code = HttpStatus.FORBIDDEN;
        break;
      case '404':
        code = HttpStatus.NOT_FOUND;
        break;
      case '405':
        code = HttpStatus.METHOD_NOT_ALLOWED;
        break;
      case '409':
        code = HttpStatus.CONFLICT;
        break;
      case '422':
        code = HttpStatus.UNPROCESSABLE_ENTITY;
        break;
      case '501':
        code = HttpStatus.NOT_IMPLEMENTED;
        break;
      case '502':
        code = HttpStatus.BAD_GATEWAY;
        break;
      case '503':
        code = HttpStatus.SERVICE_UNAVAILABLE;
        break;
      case '504':
        code = HttpStatus.GATEWAY_TIMEOUT;
        break;
      case '505':
        code = HttpStatus.HTTP_VERSION_NOT_SUPPORTED;
        break;
      default:
        code = HttpStatus.BAD_REQUEST;
        break;
    }
}  