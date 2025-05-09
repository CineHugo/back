/* eslint-disable no-unused-vars */
interface HttpResponse<T> {
    statusCode: number;
    body: T | string;
}