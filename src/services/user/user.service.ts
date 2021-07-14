import { HttpService } from '../common/http.service';

export class UserService {
  private static readonly URL = '/user';

  static login(login: string, password: string): Promise<string> {
    return HttpService.post(`${UserService.URL}/login`, { login, password });
  }

  static signUp(
    login: string,
    password: string,
    email: string
  ): Promise<string> {
    return HttpService.post(`${UserService.URL}/register`, {
      login,
      password,
      email,
    });
  }
}
