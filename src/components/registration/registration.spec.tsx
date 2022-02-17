import { queryAllByTestId } from '@testing-library/react';
import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { MaybeMocked } from 'ts-jest/dist/utils/testing';
import { mocked } from 'ts-jest/utils';
import Field from '../common/form/field/field';
import { FieldType } from '../common/form/field/field-type';
import { Registration } from './registration';

jest.mock('../common/form/field/field');

describe('Registration', () => {
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

      it('should be rendered three elements', () => {
        // given
        const fieldId = 'field';
        jest
          .spyOn(Field.prototype, 'render')
          .mockReturnValue(<div data-testid={fieldId} />);

        // when
        act(() => {
          ReactDOM.render(
            <Registration
              email=''
              emailChange={() => {}}
              login=''
              loginChange={() => {}}
              password=''
              passwordChange={() => {}}
            />,
            container
          );
        });

        // then
        expect(queryAllByTestId(container, fieldId)).toHaveLength(3);
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
              <Registration
                email=''
                emailChange={() => {}}
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
              <Registration
                email=''
                emailChange={() => {}}
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
              <Registration
                email=''
                emailChange={() => {}}
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
              <Registration
                email=''
                emailChange={() => {}}
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
              <Registration
                email=''
                emailChange={() => {}}
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
              <Registration
                email=''
                emailChange={() => {}}
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
              <Registration
                email=''
                emailChange={() => {}}
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
              <Registration
                email=''
                emailChange={() => {}}
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
              <Registration
                email=''
                emailChange={() => {}}
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
            'registration-password'
          );
        });

        it('should have assigned correct label', () => {
          // when
          act(() => {
            ReactDOM.render(
              <Registration
                email=''
                emailChange={() => {}}
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
              <Registration
                email=''
                emailChange={() => {}}
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
              <Registration
                email=''
                emailChange={() => {}}
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
              <Registration
                email=''
                emailChange={() => {}}
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
              <Registration
                email=''
                emailChange={() => {}}
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

      describe('Email', () => {
        it('should be rendered', () => {
          // given
          const fieldId = 'field';
          jest
            .spyOn(Field.prototype, 'render')
            .mockReturnValue(<div data-testid={fieldId} />);

          // when
          act(() => {
            ReactDOM.render(
              <Registration
                email=''
                emailChange={() => {}}
                login=''
                loginChange={() => {}}
                password=''
                passwordChange={() => {}}
              />,
              container
            );
          });

          // then
          expect(queryAllByTestId(container, fieldId)[2]).toBeDefined();
        });

        it('should have assigned correct className', () => {
          // when
          act(() => {
            ReactDOM.render(
              <Registration
                email=''
                emailChange={() => {}}
                login=''
                loginChange={() => {}}
                password=''
                passwordChange={() => {}}
              />,
              container
            );
          });

          // then
          expect(mockedField.mock.instances[2]?.props.className).toBe(
            'registration-email'
          );
        });

        it('should have assigned correct label', () => {
          // when
          act(() => {
            ReactDOM.render(
              <Registration
                email=''
                emailChange={() => {}}
                login=''
                loginChange={() => {}}
                password=''
                passwordChange={() => {}}
              />,
              container
            );
          });

          // then
          expect(mockedField.mock.instances[2]?.props.label).toBe('USER.EMAIL');
        });

        it('should have assigned correct type', () => {
          // when
          act(() => {
            ReactDOM.render(
              <Registration
                email=''
                emailChange={() => {}}
                login=''
                loginChange={() => {}}
                password=''
                passwordChange={() => {}}
              />,
              container
            );
          });

          // then
          expect(mockedField.mock.instances[2]?.props.type).toBe(
            FieldType.EMAIL
          );
        });

        it('should have assigned email from props to value', () => {
          // given
          const email = 'Some email';

          // when
          act(() => {
            ReactDOM.render(
              <Registration
                email={email}
                emailChange={() => {}}
                login=''
                loginChange={() => {}}
                password=''
                passwordChange={() => {}}
              />,
              container
            );
          });

          // then
          expect(mockedField.mock.instances[2]?.props.value).toBe(email);
        });

        it('should call emailChange from props if onChange event was triggered', () => {
          // given
          const emailChange = jest.fn();
          act(() => {
            ReactDOM.render(
              <Registration
                email=''
                emailChange={emailChange}
                login=''
                loginChange={() => {}}
                password=''
                passwordChange={() => {}}
              />,
              container
            );
          });
          const value = 'Some value';

          // when
          mockedField.mock.instances[2]?.props.onChange(value);

          // then
          expect(emailChange).toHaveBeenCalledWith(value);
        });

        it('should have assigned true to required', () => {
          // when
          act(() => {
            ReactDOM.render(
              <Registration
                email=''
                emailChange={() => {}}
                login=''
                loginChange={() => {}}
                password=''
                passwordChange={() => {}}
              />,
              container
            );
          });

          // then
          expect(mockedField.mock.instances[2]?.props.required).toBe(true);
        });
      });
    });
  });
});
