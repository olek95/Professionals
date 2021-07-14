import { HttpError } from '../../models/common/http/error/http-error';
import { HttpErrorResponse } from '../../models/common/http/error/http-error-response';

export class HttpService {
  private static readonly BASE_URL = 'http://localhost:3001';

  static post<V>(url: string, data: V): Promise<string> {
    return fetch(`${HttpService.BASE_URL}${url}`, {
      body: JSON.stringify(data),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((response) => {
      if (response.ok) {
        return response.text();
      }
      return response.json().then((error: HttpError) => {
        throw new HttpErrorResponse(
          error.message,
          error.status,
          response.statusText
        );
      });
    });
  }
}
