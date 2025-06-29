import { HttpResponse, HttpStatusCode } from "./protocols";

export const ok = <T>(body: any): HttpResponse<T> => ({
  statusCode: HttpStatusCode.OK,
  body,
});

export const created = <T>(body: any): HttpResponse<T> => ({
  statusCode: HttpStatusCode.CREATED,
  body,
});

export const badRequest = (message: string): HttpResponse<string> => {
  return {
    statusCode: HttpStatusCode.BAD_REQUEST,
    body: message,
  };
};

export const serverError = (message?: string): HttpResponse<string> => {
  return {
    statusCode: HttpStatusCode.SERVER_ERROR,
    body: message || 'Something went wrong',
  };
};

export const unauthorized = (message?: string): HttpResponse<string> => {
  return {
    statusCode: HttpStatusCode.UNAUTHORIZED,
    body: message || 'Unauthorized',
  };
};

export const conflict = (message: string): HttpResponse<string> => {
  return {
    statusCode: HttpStatusCode.CONFLICT,
    body: message,
  };
};

export const notFound = (message: string): HttpResponse<string> => {
  return {
    statusCode: HttpStatusCode.NOT_FOUND,
    body: message,
  };
};

export const forbidden = (message: string): HttpResponse<string> => {
  return {
    statusCode: HttpStatusCode.FORBIDDEN,
    body: message,
  };
};

