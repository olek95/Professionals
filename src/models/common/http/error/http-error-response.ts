import {HttpError} from "./http-error";
import {HttpStatus} from "../status/http-status.enum";

export class HttpErrorResponse extends Error implements HttpError {
    constructor(message: string, public status: HttpStatus, public statusText: string) {
        super(message);
        this.name = 'HttpErrorResponse';
    }
}