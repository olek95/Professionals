import * as fs from 'fs';
import { sign, verify } from 'jsonwebtoken';
import { Router } from 'express';
import { User } from '../../model/user/user';
import { HttpError } from '../../model/common/http-error/http-error';
import { ParamsDictionary } from 'express-serve-static-core';
import { HttpStatus } from '../../model/common/http-status/http-status.enum';

export default class UserController {
  private static readonly SECRET_KEY = '123456789';
  private static URL = '/user';
  private static readonly LOGIN_URL = `${UserController.URL}/login`;
  private static readonly USER_DB: User[] = JSON.parse(
    fs.readFileSync('./src/db/users.json', {
      encoding: 'utf-8',
    })
  );

  static readonly ROUTES = [
    UserController.onLogin(),
    UserController.onIsLogin(),
  ];

  private static onLogin(): Router {
    return Router().post<ParamsDictionary, string | HttpError, User>(
      `${UserController.LOGIN_URL}`,
      (request, response) => {
        UserController.isAuthenticated(request.body)
          ? response
              .status(HttpStatus.OK)
              .send(UserController.createToken(request.body))
          : response.status(HttpStatus.UNAUTHORIZED).json({
              status: HttpStatus.UNAUTHORIZED,
              message: 'Incorrect login or password',
            });
      }
    );
  }

  private static onIsLogin(): Router {
    return Router().use<ParamsDictionary, HttpError>(
      new RegExp(`^(?!${UserController.LOGIN_URL}$)`),
      (request, response, next) => {
        const authorization = request.headers.authorization?.split(' ');
        if (authorization && authorization[0] === 'Bearer') {
          try {
            UserController.verifyToken(authorization[1]);
            next();
          } catch (err) {
            response.status(HttpStatus.UNAUTHORIZED).json({
              status: HttpStatus.UNAUTHORIZED,
              message: 'Error: accessToken is not valid',
            });
          }
        } else {
          response.status(HttpStatus.UNAUTHORIZED).json({
            status: HttpStatus.UNAUTHORIZED,
            message: 'Bad authorization header',
          });
        }
      }
    );
  }

  private static isAuthenticated(user: User): boolean {
    return UserController.USER_DB.some(
      (storedUser) =>
        storedUser.login === user.login && storedUser.password === user.password
    );
  }

  private static createToken(user: User): string {
    return sign(user, UserController.SECRET_KEY, { expiresIn: '1h' });
  }

  private static verifyToken(token: string): void {
    verify(
      token,
      UserController.SECRET_KEY,
      (errors, decodedObject) => decodedObject || errors
    );
  }
}
