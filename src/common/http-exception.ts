export default class HttpException extends Error {
    statusCode: number;
    message: string;
    error: string | null;

    constructor(statusCode: number, message: string, error?: string) {
        if (statusCode < 100 || statusCode > 599) {
            throw new Error('Invalid HTTP status code');
        }

        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.error = error || null;

        if (process.env.NODE_ENV === 'development') {
            console.error(`Development Mode - Stack Trace: ${this.stack}`);
        } else {
            console.log(`Error Logged: ${this.message}`);
        }
    }

    static NotFound(message = 'Resource not found', error?: string): HttpException {
        return new HttpException(404, message, error);
    }

    static InternalServerError(message = 'Internal server error', error?: string): HttpException {
        return new HttpException(500, message, error);
    }

    static BadRequest(message = 'Bad request', error?: string): HttpException {
        return new HttpException(400, message, error);
    }

    static Unauthorized(message = 'Unauthorized access', error?: string): HttpException {
        return new HttpException(401, message, error);
    }

    static CustomError(statusCode: number, message: string, error?: string): HttpException {
        return new HttpException(statusCode, message, error);
    }
}
