export class UserService {
  static login(login: string, password: string) {
    return fetch('http://localhost:3001/auth/login', {
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
        return response.json();
      } else {
        throw response;
      }
    });
  }
}
