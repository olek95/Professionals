import {HttpErrorResponse} from "../../models/common/http/error/http-error-response";
import {HttpError} from "../../models/common/http/error/http-error";

export class UserService {
  static login(login: string, password: string): Promise<string> {
    return fetch('http://localhost:3001/user/login', {
      body: JSON.stringify({
        login: login,
        password: password,
      }),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((response) => {
      if (response.ok) {
        return response.text();
      }
      return response.json().then((error: HttpError) => {
        throw new HttpErrorResponse(error.message, error.status, response.statusText);
      });
    });
  }
}
