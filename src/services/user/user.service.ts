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
      throw response;
    });
  }
}
