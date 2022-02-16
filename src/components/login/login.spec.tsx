import { queryAllByTestId } from '@testing-library/react';
import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { MaybeMocked } from 'ts-jest/dist/utils/testing';
import { mocked } from 'ts-jest/utils';
import Field from '../common/form/field/field';
import { FieldType } from '../common/form/field/field-type';
import { Login } from './login';

jest.mock('../common/form/field/field');

describe('Login', () => {
  describe('render', () => {
    let container: HTMLDivElement;

    beforeEach(() => {
      container = document.createElement('div');
    });

    describe('Fields', () => {
      let mockedField: MaybeMocked<
        typeof Field & React.StaticLifecycle<any, any>
      >;

      beforeEach(() => {
        mockedField = mocked(Field);
        delete mockedField.getDerivedStateFromProps;
      });

      it('should be rendered two elements', () => {
        // given
        const fieldId = 'field';
        jest
          .spyOn(Field.prototype, 'render')
          .mockReturnValue(<div data-testid={fieldId} />);

        // when
        act(() => {
          ReactDOM.render(
            <Login
              login=''
              loginChange={() => {}}
              password=''
              passwordChange={() => {}}
            />,
            container
          );
        });

        // then
        expect(queryAllByTestId(container, fieldId)).toHaveLength(2);
      });

      describe('Login', () => {
        it('should be rendered', () => {
          // given
          const fieldId = 'field';
          jest
            .spyOn(Field.prototype, 'render')
            .mockReturnValue(<div data-testid={fieldId} />);

          // when
          act(() => {
            ReactDOM.render(
              <Login
                login=''
                loginChange={() => {}}
                password=''
                passwordChange={() => {}}
              />,
              container
            );
          });

          // then
          expect(queryAllByTestId(container, fieldId)[0]).toBeDefined();
        });

        it('should have assigned undefined className', () => {
          // when
          act(() => {
            ReactDOM.render(
              <Login
                login=''
                loginChange={() => {}}
                password=''
                passwordChange={() => {}}
              />,
              container
            );
          });

          // then
          expect(
            mockedField.mock.instances[0]?.props.className
          ).toBeUndefined();
        });

        it('should have assigned correct label', () => {
          // when
          act(() => {
            ReactDOM.render(
              <Login
                login=''
                loginChange={() => {}}
                password=''
                passwordChange={() => {}}
              />,
              container
            );
          });

          // then
          expect(mockedField.mock.instances[0]?.props.label).toBe('USER.LOGIN');
        });

        it('should have assigned undefined type', () => {
          // when
          act(() => {
            ReactDOM.render(
              <Login
                login=''
                loginChange={() => {}}
                password=''
                passwordChange={() => {}}
              />,
              container
            );
          });

          // then
          expect(mockedField.mock.instances[0]?.props.type).toBeUndefined();
        });

        it('should have assigned login from props to value', () => {
          // given
          const login = 'Some login';

          // when
          act(() => {
            ReactDOM.render(
              <Login
                login={login}
                loginChange={() => {}}
                password=''
                passwordChange={() => {}}
              />,
              container
            );
          });

          // then
          expect(mockedField.mock.instances[0]?.props.value).toBe(login);
        });

        it('should call loginChange from props if onChange event was triggered', () => {
          // given
          const loginChange = jest.fn();
          act(() => {
            ReactDOM.render(
              <Login
                login=''
                loginChange={loginChange}
                password=''
                passwordChange={() => {}}
              />,
              container
            );
          });
          const value = 'Some value';

          // when
          mockedField.mock.instances[0]?.props.onChange(value);

          // then
          expect(loginChange).toHaveBeenCalledWith(value);
        });

        it('should have assigned true to required', () => {
          // when
          act(() => {
            ReactDOM.render(
              <Login
                login=''
                loginChange={() => {}}
                password=''
                passwordChange={() => {}}
              />,
              container
            );
          });

          // then
          expect(mockedField.mock.instances[0]?.props.required).toBe(true);
        });
      });

      describe('Password', () => {
        it('should be rendered', () => {
          // given
          const fieldId = 'field';
          jest
            .spyOn(Field.prototype, 'render')
            .mockReturnValue(<div data-testid={fieldId} />);

          // when
          act(() => {
            ReactDOM.render(
              <Login
                login=''
                loginChange={() => {}}
                password=''
                passwordChange={() => {}}
              />,
              container
            );
          });

          // then
          expect(queryAllByTestId(container, fieldId)[1]).toBeDefined();
        });

        it('should have assigned correct className', () => {
          // when
          act(() => {
            ReactDOM.render(
              <Login
                login=''
                loginChange={() => {}}
                password=''
                passwordChange={() => {}}
              />,
              container
            );
          });

          // then
          expect(mockedField.mock.instances[1]?.props.className).toBe(
            'login-password'
          );
        });

        it('should have assigned correct label', () => {
          // when
          act(() => {
            ReactDOM.render(
              <Login
                login=''
                loginChange={() => {}}
                password=''
                passwordChange={() => {}}
              />,
              container
            );
          });

          // then
          expect(mockedField.mock.instances[1]?.props.label).toBe(
            'USER.PASSWORD'
          );
        });

        it('should have assigned correct type', () => {
          // when
          act(() => {
            ReactDOM.render(
              <Login
                login=''
                loginChange={() => {}}
                password=''
                passwordChange={() => {}}
              />,
              container
            );
          });

          // then
          expect(mockedField.mock.instances[1]?.props.type).toBe(
            FieldType.PASSWORD
          );
        });

        it('should have assigned password from props to value', () => {
          // given
          const password = 'Some password';

          // when
          act(() => {
            ReactDOM.render(
              <Login
                login=''
                loginChange={() => {}}
                password={password}
                passwordChange={() => {}}
              />,
              container
            );
          });

          // then
          expect(mockedField.mock.instances[1]?.props.value).toBe(password);
        });

        it('should call passwordChange from props if onChange event was triggered', () => {
          // given
          const passwordChange = jest.fn();
          act(() => {
            ReactDOM.render(
              <Login
                login=''
                loginChange={() => {}}
                password=''
                passwordChange={passwordChange}
              />,
              container
            );
          });
          const value = 'Some value';

          // when
          mockedField.mock.instances[1]?.props.onChange(value);

          // then
          expect(passwordChange).toHaveBeenCalledWith(value);
        });

        it('should have assigned true to required', () => {
          // when
          act(() => {
            ReactDOM.render(
              <Login
                login=''
                loginChange={() => {}}
                password=''
                passwordChange={() => {}}
              />,
              container
            );
          });

          // then
          expect(mockedField.mock.instances[1]?.props.required).toBe(true);
        });
      });
    });
  });
});
