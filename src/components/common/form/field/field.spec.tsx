import { fireEvent, getByTestId } from '@testing-library/react';
import { i18n } from 'i18next';
import * as React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { WithTranslation } from 'react-i18next';
import ReactTooltip from 'react-tooltip';
import { TooltipType } from '../../../../models/common/tooltip/tooltip-type';
import Field from './field';
import { FieldProps } from './field-props';
import { FieldState } from './field-state';
import { FieldType } from './field-type';
import { FieldValidator } from './field-validator';

jest.mock('react-i18next', () => ({
  withTranslation: () => <
    C extends React.ComponentType<React.ComponentProps<C>>
  >(
    Component: C
  ): C & WithTranslation => {
    (Component.defaultProps as Partial<C> & WithTranslation) = {
      ...Component.defaultProps,
      t: (key: string) => key,
      tReady: true,
      i18n: {} as i18n,
    } as Partial<C> & WithTranslation;
    return Component as C & WithTranslation;
  },
}));

jest.mock('react-tooltip', () => () => <div data-testid='react-tooltip' />);

describe('Field', () => {
  beforeEach(() => {
    ReactTooltip.show = () => ({});
    ReactTooltip.hide = () => ({});
  });

  describe('render', () => {
    let container: HTMLDivElement;

    beforeEach(() => {
      container = document.createElement('div');
    });

    describe('label', () => {
      const labelSelector = '.field';

      it('should have set default class if className is not applied', () => {
        // when
        act(() => {
          ReactDOM.render(
            <Field label='' value='' onChange={() => {}} />,
            container
          );
        });

        // then
        expect(container.querySelector('label')).toHaveClass('field');
      });

      it('should have appended specified className to default class', () => {
        // when
        act(() => {
          ReactDOM.render(
            <Field
              label=''
              value=''
              onChange={() => {}}
              className={'custom-class'}
            />,
            container
          );
        });

        // then
        expect(container.querySelector(labelSelector)).toHaveClass(
          'field',
          'custom-class'
        );
      });

      it('should have appended specified multiple className to default class', () => {
        // when
        act(() => {
          ReactDOM.render(
            <Field
              label=''
              value=''
              onChange={() => {}}
              className={'custom-class-1 custom-class-2'}
            />,
            container
          );
        });

        // then
        expect(container.querySelector(labelSelector)).toHaveClass(
          'field',
          'custom-class-1',
          'custom-class-2'
        );
      });

      it('should have displayed specified not empty label', () => {
        // given
        const label = 'Some label';

        // when
        act(() => {
          ReactDOM.render(
            <Field label={label} value='' onChange={() => {}} />,
            container
          );
        });

        // then
        expect(container.querySelector(labelSelector)).toHaveTextContent(
          new RegExp(`^${label}$`)
        );
      });

      it('should have displayed specified empty label', () => {
        // given
        const label = '';

        // when
        act(() => {
          ReactDOM.render(
            <Field label={label} value='' onChange={() => {}} />,
            container
          );
        });

        // then
        expect(container.querySelector(labelSelector)).toHaveTextContent(
          new RegExp(`^${label}$`)
        );
      });

      describe('required dot', () => {
        it('should be displayed if required is true', () => {
          // when
          act(() => {
            ReactDOM.render(
              <Field label='' value='' onChange={() => {}} required />,
              container
            );
          });

          // then
          expect(container.querySelectorAll('.field-required')).toHaveLength(1);
        });

        [false, undefined].forEach((required) => {
          it(`should not be displayed if required is ${required}`, () => {
            // when
            act(() => {
              ReactDOM.render(
                <Field
                  label=''
                  value=''
                  onChange={() => {}}
                  required={required}
                />,
                container
              );
            });

            // then
            expect(container.querySelectorAll('.field-required')).toHaveLength(
              0
            );
          });
        });
      });

      describe('input', () => {
        const inputSelector = '.field-input';

        it('should have assigned value', () => {
          // when
          act(() => {
            ReactDOM.render(
              <Field label='' value='Some value' onChange={() => {}} />,
              container
            );
          });

          // then
          expect(container.querySelector(inputSelector)).toHaveValue(
            'Some value'
          );
        });

        it('should have assigned empty value', () => {
          // when
          act(() => {
            ReactDOM.render(
              <Field label='' value='' onChange={() => {}} />,
              container
            );
          });

          // then
          expect(container.querySelector(inputSelector)).toHaveValue('');
        });

        it(`should have set ${FieldType.TEXT} type by default`, () => {
          // when
          act(() => {
            ReactDOM.render(
              <Field label='' value='' onChange={() => {}} />,
              container
            );
          });

          // then
          expect(
            container.querySelector<HTMLInputElement>(inputSelector)?.type
          ).toBe(FieldType.TEXT);
        });

        describe('onChange', () => {
          let onChange: jest.Mock<void, string[]>;

          beforeEach(() => {
            onChange = jest.fn<void, string[]>();
          });

          it('should call onChange from props on change event', () => {
            // given
            act(() => {
              ReactDOM.render(
                <Field label='' value='' onChange={onChange} />,
                container
              );
            });
            const value = 'Some value';

            // when
            fireEvent.change(
              container.querySelector(inputSelector) as HTMLInputElement,
              { target: { value: value } }
            );

            // then
            expect(onChange).toHaveBeenCalledWith(value);
          });

          it('should not call onChange from props if onChange event is not triggered', () => {
            // when
            act(() => {
              ReactDOM.render(
                <Field label='' value='' onChange={onChange} />,
                container
              );
            });

            // then
            expect(onChange).not.toHaveBeenCalled();
          });

          describe('Displaying error', () => {
            let requireValidatorSpy: jest.SpiedFunction<
              (value: string) => string
            >;
            let emailValidatorSpy: jest.SpiedFunction<
              (email: string) => string
            >;

            beforeEach(() => {
              requireValidatorSpy = jest.spyOn(
                FieldValidator,
                'validateRequire'
              );
              emailValidatorSpy = jest.spyOn(FieldValidator, 'validateEmail');
            });

            [
              {
                type: FieldType.TEXT,
                emailError: '',
              },
              {
                type: FieldType.PASSWORD,
                emailError: '',
              },
              {
                type: FieldType.EMAIL,
                emailError: '',
              },
              {
                type: undefined,
                emailError: '',
              },
              {
                type: FieldType.TEXT,
                emailError: 'Email has incorrect format',
              },
              {
                type: FieldType.PASSWORD,
                emailError: 'Email has incorrect format',
              },
              {
                type: undefined,
                emailError: 'Email has incorrect format',
              },
            ].forEach((testScenario) => {
              it(`should set only required error to data tip if field is required, validateRequire returns error, type is ${
                testScenario.type
              } and validateEmail returns ${
                testScenario.emailError ? 'error' : 'empty string'
              }`, () => {
                // given
                act(() => {
                  ReactDOM.render(
                    <Field
                      label=''
                      value='Some value'
                      onChange={() => {}}
                      required
                      type={testScenario.type}
                    />,
                    container
                  );
                });
                const value = '';
                const requireError = 'This field is required';
                requireValidatorSpy.mockReturnValue(requireError);
                emailValidatorSpy.mockReturnValue(testScenario.emailError);
                requireValidatorSpy.mockClear();
                emailValidatorSpy.mockClear();

                // when
                fireEvent.change(
                  container.querySelector(inputSelector) as HTMLInputElement,
                  { target: { value: value } }
                );

                // then
                expect(container.querySelector(inputSelector)).toHaveAttribute(
                  'data-tip',
                  requireError
                );
                expect(FieldValidator.validateRequire).toHaveBeenCalledWith(
                  value
                );
                testScenario.type === FieldType.EMAIL
                  ? expect(FieldValidator.validateEmail).toHaveBeenCalledWith(
                      value
                    )
                  : expect(FieldValidator.validateEmail).not.toHaveBeenCalled();
              });
            });

            [
              {
                required: true,
                requireError: '',
              },
              {
                required: undefined,
                requireError: '',
              },
              {
                required: false,
                requireError: '',
              },
              {
                required: undefined,
                requireError: 'This field is required',
              },
              {
                required: false,
                requireError: 'This field is required',
              },
            ].forEach((testScenario) => {
              it(`should set only email error to data tip if field has email type, validateEmail returns error, required value is ${
                testScenario.required
              } and validateRequire returns ${
                testScenario.requireError ? 'error' : 'empty string'
              }`, () => {
                // given
                act(() => {
                  ReactDOM.render(
                    <Field
                      label=''
                      value='Some value'
                      onChange={() => {}}
                      type={FieldType.EMAIL}
                      required={testScenario.required}
                    />,
                    container
                  );
                });
                const value = 'Some email';
                const emailError = 'Email has incorrect format';
                emailValidatorSpy.mockReturnValue(emailError);
                requireValidatorSpy.mockReturnValue(testScenario.requireError);
                emailValidatorSpy.mockClear();
                requireValidatorSpy.mockClear();

                // when
                fireEvent.change(
                  container.querySelector(inputSelector) as HTMLInputElement,
                  { target: { value: value } }
                );

                // then
                expect(container.querySelector(inputSelector)).toHaveAttribute(
                  'data-tip',
                  emailError
                );
                expect(FieldValidator.validateEmail).toHaveBeenCalledWith(
                  value
                );
                testScenario.required
                  ? expect(FieldValidator.validateRequire).toHaveBeenCalledWith(
                      value
                    )
                  : expect(
                      FieldValidator.validateRequire
                    ).not.toHaveBeenCalled();
              });
            });

            it('should set required and email errors to data tip if field is required, has email type and both validators return error', () => {
              // given
              act(() => {
                ReactDOM.render(
                  <Field
                    label=''
                    value='Some value'
                    onChange={() => {}}
                    type={FieldType.EMAIL}
                    required
                  />,
                  container
                );
              });
              const value = 'Some other value';
              const emailError = 'Email has incorrect format';
              emailValidatorSpy.mockReturnValue(emailError);
              const requireError = 'This field is required';
              requireValidatorSpy.mockReturnValue(requireError);
              emailValidatorSpy.mockClear();
              requireValidatorSpy.mockClear();

              // when
              fireEvent.change(
                container.querySelector(inputSelector) as HTMLInputElement,
                { target: { value: value } }
              );

              // then
              expect(container.querySelector(inputSelector)).toHaveAttribute(
                'data-tip',
                `${requireError}\n${emailError}`
              );
              expect(FieldValidator.validateEmail).toHaveBeenCalledWith(value);
              expect(FieldValidator.validateRequire).toHaveBeenCalledWith(
                value
              );
            });

            [
              {
                type: FieldType.TEXT,
                emailError: '',
              },
              {
                type: FieldType.PASSWORD,
                emailError: '',
              },
              {
                type: FieldType.EMAIL,
                emailError: '',
              },
              {
                type: undefined,
                emailError: '',
              },
              {
                type: FieldType.TEXT,
                emailError: 'Email has incorrect format',
              },
              {
                type: FieldType.PASSWORD,
                emailError: 'Email has incorrect format',
              },
              {
                type: undefined,
                emailError: 'Email has incorrect format',
              },
            ].forEach((emailTestScenario) => {
              [
                {
                  required: true,
                  requireError: '',
                },
                {
                  required: undefined,
                  requireError: '',
                },
                {
                  required: false,
                  requireError: '',
                },
                {
                  required: undefined,
                  requireError: 'This field is required',
                },
                {
                  required: false,
                  requireError: 'This field is required',
                },
              ].forEach((requireTestScenario) => {
                it(`should have no errors assigned to data tip if required value is ${
                  requireTestScenario.required
                }, validateRequire returns ${
                  requireTestScenario.requireError ? 'error' : 'empty string'
                }, type is ${
                  emailTestScenario.type
                } and validateEmail returns ${
                  emailTestScenario.emailError ? 'error' : 'empty string'
                }`, () => {
                  // given
                  act(() => {
                    ReactDOM.render(
                      <Field
                        label=''
                        value='Some value'
                        onChange={() => {}}
                        type={emailTestScenario.type}
                        required={requireTestScenario.required}
                      />,
                      container
                    );
                  });
                  const value = 'Some other value';
                  emailValidatorSpy.mockReturnValue(
                    emailTestScenario.emailError
                  );
                  requireValidatorSpy.mockReturnValue(
                    requireTestScenario.requireError
                  );
                  emailValidatorSpy.mockClear();
                  requireValidatorSpy.mockClear();

                  // when
                  fireEvent.change(
                    container.querySelector(inputSelector) as HTMLInputElement,
                    { target: { value: value } }
                  );

                  // then
                  expect(
                    container.querySelector(inputSelector)
                  ).toHaveAttribute('data-tip', '');
                  requireTestScenario.required
                    ? expect(
                        FieldValidator.validateRequire
                      ).toHaveBeenCalledWith(value)
                    : expect(
                        FieldValidator.validateRequire
                      ).not.toHaveBeenCalled();
                  emailTestScenario.type === FieldType.EMAIL
                    ? expect(FieldValidator.validateEmail).toHaveBeenCalledWith(
                        value
                      )
                    : expect(
                        FieldValidator.validateEmail
                      ).not.toHaveBeenCalled();
                });
              });
            });
          });

          describe('Tooltip managing', () => {
            const emailValidator: Exclude<
              keyof typeof FieldValidator,
              'prototype'
            > = 'validateEmail';
            const requireValidator: Exclude<
              keyof typeof FieldValidator,
              'prototype'
            > = 'validateRequire';

            [
              {
                validator: requireValidator,
                name: 'has require error',
              },
              {
                validator: emailValidator,
                name: 'has email error',
              },
            ].forEach((testScenario) => {
              it(`should call ReactTooltip.show with correct parameter if actually field ${testScenario.name} and no previous error`, () => {
                // given
                const validatorSpy = jest.spyOn(
                  FieldValidator,
                  testScenario.validator
                );
                act(() => {
                  ReactDOM.render(
                    <Field
                      label=''
                      value='Some value'
                      onChange={() => {}}
                      required
                      type={FieldType.EMAIL}
                    />,
                    container
                  );
                });
                jest.spyOn(ReactTooltip, 'show');
                jest.spyOn(ReactTooltip, 'hide');
                validatorSpy.mockReturnValue('Some error');
                const inputElement = container.querySelector(
                  inputSelector
                ) as HTMLInputElement;
                validatorSpy.mockClear();
                const value = '';

                // when
                fireEvent.change(inputElement, {
                  target: {
                    value: value,
                  },
                });

                // then
                expect(validatorSpy).toHaveBeenCalledWith(value);
                expect(ReactTooltip.show).toHaveBeenCalledWith(inputElement);
                expect(ReactTooltip.hide).not.toHaveBeenCalled();
              });
            });

            [
              {
                firstValidator: requireValidator,
                secondValidator: emailValidator,
                name: 'has email error and previous error was require error',
              },
              {
                firstValidator: emailValidator,
                secondValidator: requireValidator,
                name: 'has require error and previous error was email error',
              },
            ].forEach((testScenario) => {
              it(`should call ReactTooltip.show with correct parameter if actually field ${testScenario.name}`, () => {
                // given
                const firstValidatorSpy = jest.spyOn(
                  FieldValidator,
                  testScenario.firstValidator
                );
                const secondValidatorSpy = jest.spyOn(
                  FieldValidator,
                  testScenario.secondValidator
                );
                act(() => {
                  ReactDOM.render(
                    <Field
                      label=''
                      value='Some value'
                      onChange={() => {}}
                      required
                      type={FieldType.EMAIL}
                    />,
                    container
                  );
                });
                firstValidatorSpy.mockReturnValue('Some error');
                const inputElement = container.querySelector(
                  inputSelector
                ) as HTMLInputElement;
                fireEvent.change(inputElement, {
                  target: {
                    value: '',
                  },
                });
                firstValidatorSpy.mockReturnValue('');
                secondValidatorSpy.mockReturnValue('Some error 2');
                jest.spyOn(ReactTooltip, 'show');
                jest.spyOn(ReactTooltip, 'hide');
                firstValidatorSpy.mockClear();
                secondValidatorSpy.mockClear();
                const value = 'Some other value';

                // when
                fireEvent.change(inputElement, {
                  target: {
                    value: value,
                  },
                });

                // then
                expect(firstValidatorSpy).toHaveBeenCalledWith(value);
                expect(secondValidatorSpy).toHaveBeenCalledWith(value);
                expect(ReactTooltip.show).toHaveBeenCalledWith(inputElement);
                expect(ReactTooltip.hide).not.toHaveBeenCalled();
              });
            });

            [
              {
                validator: requireValidator,
                name:
                  'first call of require validator gives different error than second call',
              },
              {
                validator: emailValidator,
                name:
                  'first call of email validator gives different error than second call',
              },
            ].forEach((testScenario) => {
              it(`should call ReactTooltip.show if ${testScenario.name}`, () => {
                // given
                const validatorSpy = jest.spyOn(
                  FieldValidator,
                  testScenario.validator
                );
                act(() => {
                  ReactDOM.render(
                    <Field
                      label=''
                      value='Some value'
                      onChange={() => {}}
                      required
                      type={FieldType.EMAIL}
                    />,
                    container
                  );
                });
                validatorSpy.mockReturnValue('Some error');
                const inputElement = container.querySelector(
                  inputSelector
                ) as HTMLInputElement;
                fireEvent.change(inputElement, {
                  target: {
                    value: '',
                  },
                });
                validatorSpy.mockReturnValue('Some other error');
                jest.spyOn(ReactTooltip, 'show');
                jest.spyOn(ReactTooltip, 'hide');
                validatorSpy.mockClear();
                const value = 'Some other value';

                // when
                fireEvent.change(inputElement, {
                  target: {
                    value: 'Some other value',
                  },
                });

                // then
                expect(validatorSpy).toHaveBeenCalledWith(value);
                expect(ReactTooltip.show).toHaveBeenCalledWith(inputElement);
                expect(ReactTooltip.hide).not.toHaveBeenCalled();
              });
            });

            [
              {
                firstValidator: requireValidator,
                secondValidator: emailValidator,
                name: 'has no email error and previous error was require error',
              },
              {
                firstValidator: emailValidator,
                secondValidator: requireValidator,
                name: 'has no require error and previous error was email error',
              },
            ].forEach((testScenario) => {
              it(`should call ReactTooltip.hide if actually field ${testScenario.name}`, () => {
                // given
                const firstValidatorSpy = jest.spyOn(
                  FieldValidator,
                  testScenario.firstValidator
                );
                const secondValidatorSpy = jest.spyOn(
                  FieldValidator,
                  testScenario.secondValidator
                );
                act(() => {
                  ReactDOM.render(
                    <Field
                      label=''
                      value='Some value'
                      onChange={() => {}}
                      required
                      type={FieldType.EMAIL}
                    />,
                    container
                  );
                });
                firstValidatorSpy.mockReturnValue('Some error');
                const inputElement = container.querySelector(
                  inputSelector
                ) as HTMLInputElement;
                fireEvent.change(inputElement, {
                  target: {
                    value: '',
                  },
                });
                firstValidatorSpy.mockReturnValue('');
                secondValidatorSpy.mockReturnValue('');
                jest.spyOn(ReactTooltip, 'show');
                jest.spyOn(ReactTooltip, 'hide');
                firstValidatorSpy.mockClear();
                secondValidatorSpy.mockClear();
                const value = 'Some other value';

                // when
                fireEvent.change(inputElement, {
                  target: {
                    value: value,
                  },
                });

                // then
                expect(firstValidatorSpy).toHaveBeenCalledWith(value);
                expect(secondValidatorSpy).toHaveBeenCalledWith(value);
                expect(ReactTooltip.show).not.toHaveBeenCalled();
                expect(ReactTooltip.hide).toHaveBeenCalledWith();
              });
            });

            [
              {
                validator: requireValidator,
                name:
                  'first call of require validator gives error but second call no error',
              },
              {
                validator: emailValidator,
                name:
                  'first call of email validator gives error but second call no error',
              },
            ].forEach((testScenario) => {
              it(`should call ReactTooltip.hide if ${testScenario.name}`, () => {
                // given
                const validatorSpy = jest.spyOn(
                  FieldValidator,
                  testScenario.validator
                );
                act(() => {
                  ReactDOM.render(
                    <Field
                      label=''
                      value='Some value'
                      onChange={() => {}}
                      required
                      type={FieldType.EMAIL}
                    />,
                    container
                  );
                });
                validatorSpy.mockReturnValue('Some error');
                const inputElement = container.querySelector(
                  inputSelector
                ) as HTMLInputElement;
                fireEvent.change(inputElement, {
                  target: {
                    value: '',
                  },
                });
                validatorSpy.mockReturnValue('');
                jest.spyOn(ReactTooltip, 'show');
                jest.spyOn(ReactTooltip, 'hide');
                validatorSpy.mockClear();
                const value = 'Some other value';

                // when
                fireEvent.change(inputElement, {
                  target: {
                    value: value,
                  },
                });

                // then
                expect(validatorSpy).toHaveBeenCalledWith(value);
                expect(ReactTooltip.show).not.toHaveBeenCalled();
                expect(ReactTooltip.hide).toHaveBeenCalledWith();
              });
            });

            [
              {
                validator: requireValidator,
                name: 'has require error',
              },
              {
                validator: emailValidator,
                name: 'has email error',
              },
            ].forEach((testScenario) => {
              it(`should not call ReactTooltip.show and ReactTooltip.hide if actually field ${testScenario.name} and previous error was the same`, () => {
                // given
                const validatorSpy = jest.spyOn(
                  FieldValidator,
                  testScenario.validator
                );
                act(() => {
                  ReactDOM.render(
                    <Field
                      label=''
                      value='Some value'
                      onChange={() => {}}
                      required
                      type={FieldType.EMAIL}
                    />,
                    container
                  );
                });
                validatorSpy.mockReturnValue('Some error');
                const inputElement = container.querySelector(
                  inputSelector
                ) as HTMLInputElement;
                fireEvent.change(inputElement, {
                  target: {
                    value: '',
                  },
                });
                validatorSpy.mockReturnValue('Some error');
                jest.spyOn(ReactTooltip, 'show');
                jest.spyOn(ReactTooltip, 'hide');
                validatorSpy.mockClear();
                const value = 'Some other value';

                // when
                fireEvent.change(inputElement, {
                  target: {
                    value: value,
                  },
                });

                // then
                expect(validatorSpy).toHaveBeenCalledWith(value);
                expect(ReactTooltip.show).not.toHaveBeenCalled();
                expect(ReactTooltip.hide).not.toHaveBeenCalled();
              });
            });

            [
              {
                firstValidator: requireValidator,
                secondValidator: emailValidator,
                name:
                  'first - require validator returns the same error like second - email validator',
              },
              {
                firstValidator: emailValidator,
                secondValidator: requireValidator,
                name:
                  'first - email validator returns the same error like second - require validator',
              },
            ].forEach((testScenario) => {
              it(`should not call ReactTooltip.show and ReactTooltip.hide if ${testScenario.name}`, () => {
                // given
                const firstValidatorSpy = jest.spyOn(
                  FieldValidator,
                  testScenario.firstValidator
                );
                const secondValidatorSpy = jest.spyOn(
                  FieldValidator,
                  testScenario.secondValidator
                );
                act(() => {
                  ReactDOM.render(
                    <Field
                      label=''
                      value='Some value'
                      onChange={() => {}}
                      required
                      type={FieldType.EMAIL}
                    />,
                    container
                  );
                });
                firstValidatorSpy.mockReturnValue('Some error');
                const inputElement = container.querySelector(
                  inputSelector
                ) as HTMLInputElement;
                fireEvent.change(inputElement, {
                  target: {
                    value: '',
                  },
                });
                firstValidatorSpy.mockReturnValue('');
                secondValidatorSpy.mockReturnValue('Some error');
                jest.spyOn(ReactTooltip, 'show');
                jest.spyOn(ReactTooltip, 'hide');
                firstValidatorSpy.mockClear();
                secondValidatorSpy.mockClear();
                const value = 'Some other value';

                // when
                fireEvent.change(inputElement, {
                  target: {
                    value: 'Some other value',
                  },
                });

                // then
                expect(firstValidatorSpy).toHaveBeenCalledWith(value);
                expect(secondValidatorSpy).toHaveBeenCalledWith(value);
                expect(ReactTooltip.show).not.toHaveBeenCalled();
                expect(ReactTooltip.hide).not.toHaveBeenCalled();
              });
            });

            it('should not call ReactTooltip.show and ReactTooltip.hide if now and previously there were no errors', () => {
              // given
              const emailValidatorSpy = jest
                .spyOn(FieldValidator, 'validateEmail')
                .mockReturnValue('');
              const requireValidatorSpy = jest
                .spyOn(FieldValidator, 'validateRequire')
                .mockReturnValue('');
              act(() => {
                ReactDOM.render(
                  <Field
                    label=''
                    value='Some value'
                    onChange={() => {}}
                    required
                    type={FieldType.EMAIL}
                  />,
                  container
                );
              });
              jest.spyOn(ReactTooltip, 'show');
              jest.spyOn(ReactTooltip, 'hide');
              emailValidatorSpy.mockClear();
              requireValidatorSpy.mockClear();
              const value = '';

              // when
              fireEvent.change(
                container.querySelector(inputSelector) as HTMLInputElement,
                {
                  target: {
                    value: value,
                  },
                }
              );

              // then
              expect(emailValidatorSpy).toHaveBeenCalledWith(value);
              expect(requireValidatorSpy).toHaveBeenCalledWith(value);
              expect(ReactTooltip.show).not.toHaveBeenCalled();
              expect(ReactTooltip.hide).not.toHaveBeenCalled();
            });
          });
        });

        describe('tooltip', () => {
          it('should have set correct value to data class', () => {
            // when
            act(() => {
              ReactDOM.render(
                <Field label='' value='' onChange={() => {}} />,
                container
              );
            });

            // then
            expect(container.querySelector(inputSelector)).toHaveAttribute(
              'data-class',
              'field-input-tooltip'
            );
          });

          it('should have assigned no errors to data tip by default', () => {
            // when
            act(() => {
              ReactDOM.render(
                <Field label='' value='' onChange={() => {}} />,
                container
              );
            });

            // then
            expect(container.querySelector(inputSelector)).toHaveAttribute(
              'data-tip',
              ''
            );
          });

          it(`should have set ${TooltipType.ERROR} to data type`, () => {
            // when
            act(() => {
              ReactDOM.render(
                <Field label='' value='' onChange={() => {}} />,
                container
              );
            });

            // then
            expect(container.querySelector(inputSelector)).toHaveAttribute(
              'data-type',
              TooltipType.ERROR
            );
          });
        });
      });

      describe('tooltip', () => {
        it('should be rendered', () => {
          // when
          act(() => {
            ReactDOM.render(
              <Field label='' value='' onChange={() => {}} />,
              container
            );
          });

          // expect
          expect(getByTestId(container, 'react-tooltip')).toBeDefined();
        });
      });
    });
  });

  describe('getDerivedStateFromProps', () => {
    let FieldComponent: React.StaticLifecycle<
      FieldProps & WithTranslation,
      FieldState
    > = {};
    let fieldProps: FieldProps & WithTranslation;
    let fieldState: FieldState;

    beforeEach(() => {
      FieldComponent = Field as React.StaticLifecycle<
        FieldProps & WithTranslation,
        FieldState
      >;
      fieldProps = {
        className: '',
        label: '',
        onChange: () => {},
        value: '',
        tReady: true,
        t: () => '',
        i18n: {} as i18n,
      };
      fieldState = {
        className: '',
        errors: '',
        originType: FieldType.TEXT,
        type: FieldType.TEXT,
        validators: [],
      };
    });

    it('should be defined', () => {
      // when
      const { getDerivedStateFromProps } = FieldComponent;

      // then
      expect(getDerivedStateFromProps).toBeDefined();
    });

    describe('Type change', () => {
      [
        {
          originType: FieldType.TEXT,
          type: FieldType.TEXT,
          previousTypes: [FieldType.EMAIL, FieldType.PASSWORD],
        },
        {
          originType: FieldType.EMAIL,
          type: FieldType.TEXT,
          previousTypes: [FieldType.TEXT, FieldType.PASSWORD],
        },
        {
          originType: FieldType.PASSWORD,
          type: FieldType.PASSWORD,
          previousTypes: [FieldType.TEXT, FieldType.EMAIL],
        },
        {
          originType: undefined,
          type: FieldType.TEXT,
          previousTypes: [FieldType.EMAIL, FieldType.PASSWORD],
        },
      ].forEach((testScenario) => {
        testScenario.previousTypes.forEach((previousType) => {
          it(`should set type to ${testScenario.type} and originType to ${testScenario.originType} if actual type is ${testScenario.originType} and previous originType was ${previousType}`, () => {
            // given
            fieldProps.type = testScenario.originType;
            fieldState.originType = previousType;

            // when
            const state = FieldComponent.getDerivedStateFromProps!(
              fieldProps,
              fieldState
            );

            // then
            expect(state?.type).toBe(testScenario.type);
            expect(state?.originType).toBe(testScenario.originType);
          });
        });
      });

      [FieldType.TEXT, FieldType.PASSWORD, FieldType.EMAIL].forEach((type) => {
        it(`should not set type and originType if new type is ${type} and originType was ${type}`, () => {
          // given
          fieldProps.type = type;
          fieldState.originType = type;

          // when
          const state = FieldComponent.getDerivedStateFromProps!(
            fieldProps,
            fieldState
          );

          // then
          expect(state?.type).toBeUndefined();
          expect(state?.originType).toBeUndefined();
        });
      });

      it(`should not set type and originType if new type is undefined and originType was ${FieldType.TEXT}`, () => {
        // given
        fieldProps.type = undefined;
        fieldState.originType = FieldType.TEXT;

        // when
        const state = FieldComponent.getDerivedStateFromProps!(
          fieldProps,
          fieldState
        );

        // then
        expect(state?.type).toBeUndefined();
        expect(state?.originType).toBeUndefined();
      });
    });

    describe('Validators change', () => {
      [
        {
          type: FieldType.TEXT,
          previousTypes: [FieldType.EMAIL, FieldType.PASSWORD],
          validators: [FieldValidator.validateRequire],
          validatorsNames: 'require validator',
        },
        {
          type: FieldType.EMAIL,
          previousTypes: [FieldType.TEXT, FieldType.PASSWORD],
          validators: [
            FieldValidator.validateRequire,
            FieldValidator.validateEmail,
          ],
          validatorsNames: 'email and require validators',
        },
        {
          type: FieldType.PASSWORD,
          previousTypes: [FieldType.TEXT, FieldType.EMAIL],
          validators: [FieldValidator.validateRequire],
          validatorsNames: 'require validator',
        },
        {
          type: undefined,
          previousTypes: [FieldType.EMAIL, FieldType.PASSWORD, FieldType.TEXT],
          validators: [FieldValidator.validateRequire],
          validatorsNames: 'require validator',
        },
      ].forEach((testScenario) => {
        testScenario.previousTypes.forEach((previousType) => {
          it(`should assign ${testScenario.validatorsNames} if actual type is ${testScenario.type}, previous type was ${previousType}, required is true and previously there was not require validator`, () => {
            // given
            fieldProps.type = testScenario.type;
            fieldProps.required = true;
            fieldState.originType = previousType;
            fieldState.validators = [];

            // when
            const state = FieldComponent.getDerivedStateFromProps!(
              fieldProps,
              fieldState
            );

            // then
            expect(state?.validators).toEqual(testScenario.validators);
          });
        });
      });

      [
        {
          type: FieldType.TEXT,
          previousTypes: [FieldType.EMAIL, FieldType.PASSWORD],
          validators: undefined,
          validatorsNames: 'no validators',
        },
        {
          type: FieldType.EMAIL,
          previousTypes: [FieldType.TEXT, FieldType.PASSWORD],
          validators: [
            FieldValidator.validateRequire,
            FieldValidator.validateEmail,
          ],
          validatorsNames: 'require and email validators',
        },
        {
          type: FieldType.PASSWORD,
          previousTypes: [FieldType.TEXT, FieldType.EMAIL],
          validators: undefined,
          validatorsNames: 'no validators',
        },
        {
          type: undefined,
          previousTypes: [FieldType.EMAIL, FieldType.PASSWORD, FieldType.TEXT],
          validators: undefined,
          validatorsNames: 'no validators',
        },
      ].forEach((testScenario) => {
        testScenario.previousTypes.forEach((previousType) => {
          it(`should assign ${testScenario.validatorsNames} if actual type is ${testScenario.type}, previous type was ${previousType}, required is true and previously there was require validator`, () => {
            // given
            fieldProps.type = testScenario.type;
            fieldProps.required = true;
            fieldState.originType = previousType;
            fieldState.validators = [FieldValidator.validateRequire];

            // when
            const state = FieldComponent.getDerivedStateFromProps!(
              fieldProps,
              fieldState
            );

            // then
            expect(state?.validators).toEqual(testScenario.validators);
          });
        });
      });

      [FieldType.TEXT, FieldType.PASSWORD, FieldType.EMAIL].forEach((type) => {
        [false, undefined].forEach((required) => {
          it(`should not set validators if new type is ${type}, originType was ${type}, required is ${required} and previously there was not require validator`, () => {
            // given
            fieldProps.type = type;
            fieldProps.required = required;
            fieldState.originType = type;
            fieldState.validators = [];

            // when
            const state = FieldComponent.getDerivedStateFromProps!(
              fieldProps,
              fieldState
            );

            // then
            expect(state?.validators).toBeUndefined();
          });
        });

        it(`should set validators if new type is ${type}, originType was ${type}, require is true and previously there was not require validator`, () => {
          // given
          fieldProps.type = type;
          fieldProps.required = true;
          fieldState.originType = type;
          fieldState.validators = [];

          // when
          const state = FieldComponent.getDerivedStateFromProps!(
            fieldProps,
            fieldState
          );

          // then
          const validators = [FieldValidator.validateRequire];
          if (type === FieldType.EMAIL) {
            validators.push(FieldValidator.validateEmail);
          }
          expect(state?.validators).toEqual(validators);
        });

        it(`should not set validators if new type is ${type}, originType was ${type}, require is true and previously there was require validator`, () => {
          // given
          fieldProps.type = type;
          fieldProps.required = true;
          fieldState.originType = type;
          fieldState.validators = [FieldValidator.validateRequire];

          // when
          const state = FieldComponent.getDerivedStateFromProps!(
            fieldProps,
            fieldState
          );

          // then
          expect(state?.validators).toBeUndefined();
        });
      });

      [false, undefined].forEach((required) => {
        it(`should set validators if new type is ${FieldType.EMAIL}, originType was ${FieldType.EMAIL}, require is ${required} and previously there was require validator`, () => {
          // given
          fieldProps.type = FieldType.EMAIL;
          fieldProps.required = required;
          fieldState.originType = FieldType.EMAIL;
          fieldState.validators = [FieldValidator.validateRequire];

          // when
          const state = FieldComponent.getDerivedStateFromProps!(
            fieldProps,
            fieldState
          );

          // then
          expect(state?.validators).toEqual([FieldValidator.validateEmail]);
        });

        [FieldType.TEXT, FieldType.PASSWORD].forEach((type) => {
          it(`should not set validators if new type is ${type}, originType was ${type}, required is changed to ${required} and previously there was require validator`, () => {
            // given
            fieldProps.type = type;
            fieldProps.required = required;
            fieldState.originType = type;
            fieldState.validators = [FieldValidator.validateRequire];

            // when
            const state = FieldComponent.getDerivedStateFromProps!(
              fieldProps,
              fieldState
            );

            // then
            expect(state?.validators).toEqual([]);
          });

          it(`should assign email validator if actual type is ${FieldType.EMAIL}, previous type was ${type}, required is ${required} and previously there was require validator`, () => {
            // given
            fieldProps.type = FieldType.EMAIL;
            fieldProps.required = required;
            fieldState.originType = type;
            fieldState.validators = [FieldValidator.validateRequire];

            // when
            const state = FieldComponent.getDerivedStateFromProps!(
              fieldProps,
              fieldState
            );

            // then
            expect(state?.validators).toEqual([FieldValidator.validateEmail]);
          });

          it(`should assign email validator if actual type is ${FieldType.EMAIL}, previous type was ${type}, required is ${required} and previously there was not require validator`, () => {
            // given
            fieldProps.type = FieldType.EMAIL;
            fieldProps.required = required;
            fieldState.originType = type;
            fieldState.validators = [];

            // when
            const state = FieldComponent.getDerivedStateFromProps!(
              fieldProps,
              fieldState
            );

            // then
            expect(state?.validators).toEqual([FieldValidator.validateEmail]);
          });
        });

        it(`should not set validators if new type is undefined, originType was ${FieldType.TEXT}, required is ${required} and previously there was not require validator`, () => {
          // given
          fieldProps.type = undefined;
          fieldProps.required = required;
          fieldState.originType = FieldType.TEXT;
          fieldState.validators = [];

          // when
          const state = FieldComponent.getDerivedStateFromProps!(
            fieldProps,
            fieldState
          );

          // then
          expect(state?.validators).toBeUndefined();
        });

        it(`should not set validators if new type is undefined, originType was ${FieldType.TEXT}, required is ${required} and previously there was require validator`, () => {
          // given
          fieldProps.type = undefined;
          fieldProps.required = required;
          fieldState.originType = FieldType.TEXT;
          fieldState.validators = [];

          // when
          const state = FieldComponent.getDerivedStateFromProps!(
            fieldProps,
            fieldState
          );

          // then
          expect(state?.validators).toBeUndefined();
        });
      });
    });

    describe('Errors change', () => {
      let emailValidatorSpy: jest.SpiedFunction<(email: string) => string>;
      let requireValidatorSpy: jest.SpiedFunction<(value: string) => string>;

      beforeEach(() => {
        emailValidatorSpy = jest.spyOn(FieldValidator, 'validateEmail');
        requireValidatorSpy = jest.spyOn(FieldValidator, 'validateRequire');
      });

      [
        {
          type: FieldType.TEXT,
          previousTypes: [FieldType.EMAIL, FieldType.PASSWORD],
          errorsNames: 'require error',
          requireError: 'This field is required',
          emailError: '',
          expectedErrors: 'This field is required',
        },
        {
          type: FieldType.TEXT,
          previousTypes: [FieldType.EMAIL, FieldType.PASSWORD],
          errorsNames: 'empty errors',
          requireError: '',
          emailError: '',
          expectedErrors: '',
        },
        {
          type: FieldType.EMAIL,
          previousTypes: [FieldType.TEXT, FieldType.PASSWORD],
          errorsNames: 'email and require errors',
          requireError: 'This field is required',
          emailError: 'Incorrect email format',
          expectedErrors: 'This field is required\nIncorrect email format',
        },
        {
          type: FieldType.EMAIL,
          previousTypes: [FieldType.TEXT, FieldType.PASSWORD],
          errorsNames: 'empty errors',
          requireError: '',
          emailError: '',
          expectedErrors: '',
        },
        {
          type: FieldType.PASSWORD,
          previousTypes: [FieldType.TEXT, FieldType.EMAIL],
          errorsNames: 'require error',
          requireError: 'This field is required',
          emailError: '',
          expectedErrors: 'This field is required',
        },
        {
          type: FieldType.PASSWORD,
          previousTypes: [FieldType.TEXT, FieldType.EMAIL],
          errorsNames: 'empty errors',
          requireError: '',
          emailError: '',
          expectedErrors: '',
        },
        {
          type: undefined,
          previousTypes: [FieldType.EMAIL, FieldType.PASSWORD],
          errorsNames: 'require error',
          requireError: 'This field is required',
          emailError: '',
          expectedErrors: 'This field is required',
        },
        {
          type: undefined,
          previousTypes: [FieldType.EMAIL, FieldType.PASSWORD],
          errorsNames: 'empty errors',
          requireError: '',
          emailError: '',
          expectedErrors: '',
        },
      ].forEach((testScenario) => {
        testScenario.previousTypes.forEach((previousType) => {
          it(`should assign ${testScenario.errorsNames} if actual type is ${
            testScenario.type
          }, previous type was ${previousType}, required is true, email validator returns ${
            testScenario.emailError ? 'error' : 'no error'
          }, require validator returns ${
            testScenario.requireError ? 'error' : 'no error'
          } and previously there was not require validator`, () => {
            // given
            emailValidatorSpy.mockReturnValue(testScenario.emailError);
            requireValidatorSpy.mockReturnValue(testScenario.requireError);
            fieldProps.type = testScenario.type;
            const value = 'Some value';
            fieldProps.value = value;
            fieldProps.required = true;
            fieldState.originType = previousType;
            fieldState.validators = [];

            // when
            const state = FieldComponent.getDerivedStateFromProps!(
              fieldProps,
              fieldState
            );

            // then
            expect(requireValidatorSpy).toHaveBeenCalledWith(value);
            testScenario.type === FieldType.EMAIL
              ? expect(emailValidatorSpy).toHaveBeenCalledWith(value)
              : expect(emailValidatorSpy).not.toHaveBeenCalled();
            expect(state?.errors).toEqual(testScenario.expectedErrors);
          });
        });
      });

      [
        {
          type: FieldType.TEXT,
          previousTypes: [FieldType.EMAIL, FieldType.PASSWORD],
          errorsNames: 'no errors',
          requireError: 'This field is required',
          emailError: '',
          expectedErrors: undefined,
        },
        {
          type: FieldType.TEXT,
          previousTypes: [FieldType.EMAIL, FieldType.PASSWORD],
          errorsNames: 'no errors',
          requireError: '',
          emailError: '',
          expectedErrors: undefined,
        },
        {
          type: FieldType.EMAIL,
          previousTypes: [FieldType.TEXT, FieldType.PASSWORD],
          errorsNames: 'email and require errors',
          requireError: 'This field is required',
          emailError: 'Incorrect email format',
          expectedErrors: 'This field is required\nIncorrect email format',
        },
        {
          type: FieldType.EMAIL,
          previousTypes: [FieldType.TEXT, FieldType.PASSWORD],
          errorsNames: 'empty errors',
          requireError: '',
          emailError: '',
          expectedErrors: '',
        },
        {
          type: FieldType.PASSWORD,
          previousTypes: [FieldType.TEXT, FieldType.EMAIL],
          errorsNames: 'no errors',
          requireError: 'This field is required',
          emailError: '',
          expectedErrors: undefined,
        },
        {
          type: FieldType.PASSWORD,
          previousTypes: [FieldType.TEXT, FieldType.EMAIL],
          errorsNames: 'no errors',
          requireError: '',
          emailError: '',
          expectedErrors: undefined,
        },
        {
          type: undefined,
          previousTypes: [FieldType.EMAIL, FieldType.PASSWORD],
          errorsNames: 'no errors',
          requireError: 'This field is required',
          emailError: '',
          expectedErrors: undefined,
        },
        {
          type: undefined,
          previousTypes: [FieldType.EMAIL, FieldType.PASSWORD],
          errorsNames: 'no errors',
          requireError: '',
          emailError: '',
          expectedErrors: undefined,
        },
      ].forEach((testScenario) => {
        testScenario.previousTypes.forEach((previousType) => {
          it(`should assign ${testScenario.errorsNames} if actual type is ${
            testScenario.type
          }, previous type was ${previousType}, required is true, email validator returns ${
            testScenario.emailError ? 'error' : 'no error'
          }, require validator returns ${
            testScenario.requireError ? 'error' : 'no error'
          } and previously there was require validator`, () => {
            // given
            emailValidatorSpy.mockReturnValue(testScenario.emailError);
            requireValidatorSpy.mockReturnValue(testScenario.requireError);
            fieldProps.type = testScenario.type;
            const value = 'Some value';
            fieldProps.value = value;
            fieldProps.required = true;
            fieldState.originType = previousType;
            fieldState.validators = [FieldValidator.validateRequire];

            // when
            const state = FieldComponent.getDerivedStateFromProps!(
              fieldProps,
              fieldState
            );

            // then
            if (testScenario.type === FieldType.EMAIL) {
              expect(requireValidatorSpy).toHaveBeenCalledWith(value);
              expect(emailValidatorSpy).toHaveBeenCalledWith(value);
            } else {
              expect(requireValidatorSpy).not.toHaveBeenCalled();
              expect(emailValidatorSpy).not.toHaveBeenCalled();
            }
            expect(state?.errors).toEqual(testScenario.expectedErrors);
          });
        });
      });

      [FieldType.TEXT, FieldType.PASSWORD, FieldType.EMAIL].forEach((type) => {
        [false, undefined].forEach((required) => {
          it(`should not assign errors if new type is ${type}, originType was ${type}, required is ${required} and previously there was not require validator`, () => {
            // given
            requireValidatorSpy.mockReturnValue('This field is required');
            emailValidatorSpy.mockReturnValue('Incorrect email format');
            fieldProps.type = type;
            fieldProps.required = required;
            fieldState.originType = type;
            fieldState.validators = [];

            // when
            const state = FieldComponent.getDerivedStateFromProps!(
              fieldProps,
              fieldState
            );

            // then
            expect(FieldValidator.validateRequire).not.toHaveBeenCalled();
            expect(FieldValidator.validateEmail).not.toHaveBeenCalled();
            expect(state?.errors).toBeUndefined();
          });
        });

        it(`should assign errors if new type is ${type}, originType was ${type}, require is true and previously there was not require validator`, () => {
          // given
          const value = 'Some value';
          const requireError = 'This field is required';
          const emailError = 'Incorrect email format';
          requireValidatorSpy.mockReturnValue(requireError);
          emailValidatorSpy.mockReturnValue(emailError);
          fieldProps.type = type;
          fieldProps.required = true;
          fieldProps.value = value;
          fieldState.originType = type;
          fieldState.validators = [];

          // when
          const state = FieldComponent.getDerivedStateFromProps!(
            fieldProps,
            fieldState
          );

          // then
          let errors = requireError;
          if (type === FieldType.EMAIL) {
            expect(FieldValidator.validateEmail).toHaveBeenCalledWith(value);
            errors += `\n${emailError}`;
          } else {
            expect(FieldValidator.validateEmail).not.toHaveBeenCalled();
          }
          expect(FieldValidator.validateRequire).toHaveBeenCalledWith(value);
          expect(state?.errors).toEqual(errors);
        });

        it(`should not assign errors if new type is ${type}, originType was ${type}, require is true and previously there was require validator`, () => {
          // given
          requireValidatorSpy.mockReturnValue('This field is required');
          emailValidatorSpy.mockReturnValue('Incorrect email format');
          fieldProps.type = type;
          fieldProps.required = true;
          fieldProps.value = 'Some value';
          fieldState.originType = type;
          fieldState.validators = [FieldValidator.validateRequire];

          // when
          const state = FieldComponent.getDerivedStateFromProps!(
            fieldProps,
            fieldState
          );

          // then
          expect(FieldValidator.validateRequire).not.toHaveBeenCalled();
          expect(FieldValidator.validateEmail).not.toHaveBeenCalled();
          expect(state?.errors).toBeUndefined();
        });
      });

      [
        {
          type: FieldType.TEXT,
          requireError: '',
          emailError: '',
          expectedErrors: '',
        },
        {
          type: FieldType.PASSWORD,
          requireError: '',
          emailError: '',
          expectedErrors: '',
        },
        {
          type: FieldType.EMAIL,
          requireError: '',
          emailError: '',
          expectedErrors: '',
        },
        {
          type: FieldType.EMAIL,
          requireError: 'This field is required',
          emailError: '',
          expectedErrors: 'This field is required',
        },
        {
          type: FieldType.EMAIL,
          requireError: '',
          emailError: 'Incorrect email format',
          expectedErrors: 'Incorrect email format',
        },
      ].forEach((testScenario) => {
        it(`should assign empty errors if new type is ${testScenario.type}, originType was ${testScenario.type}, require is true, required and email validators return empty string and previously there was not require validator`, () => {
          // given
          const value = 'Some value';
          requireValidatorSpy.mockReturnValue(testScenario.requireError);
          emailValidatorSpy.mockReturnValue(testScenario.emailError);
          fieldProps.type = testScenario.type;
          fieldProps.required = true;
          fieldProps.value = value;
          fieldState.originType = testScenario.type;
          fieldState.validators = [];

          // when
          const state = FieldComponent.getDerivedStateFromProps!(
            fieldProps,
            fieldState
          );

          // then
          const expectation = expect(FieldValidator.validateEmail);
          testScenario.type === FieldType.EMAIL
            ? expectation.toHaveBeenCalledWith(value)
            : expectation.not.toHaveBeenCalled();
          expect(FieldValidator.validateRequire).toHaveBeenCalledWith(value);
          expect(state?.errors).toEqual(testScenario.expectedErrors);
        });

        it(`should assign empty errors if new type is ${testScenario.type}, originType was ${testScenario.type}, require is true, required and email validators return empty string and previously there was require validator`, () => {
          // given
          requireValidatorSpy.mockReturnValue(testScenario.requireError);
          emailValidatorSpy.mockReturnValue(testScenario.emailError);
          fieldProps.type = testScenario.type;
          fieldProps.required = true;
          fieldProps.value = 'Some value';
          fieldState.originType = testScenario.type;
          fieldState.validators = [FieldValidator.validateRequire];

          // when
          const state = FieldComponent.getDerivedStateFromProps!(
            fieldProps,
            fieldState
          );

          // then
          expect(FieldValidator.validateRequire).not.toHaveBeenCalled();
          expect(FieldValidator.validateEmail).not.toHaveBeenCalled();
          expect(state?.errors).toBeUndefined();
        });
      });

      it(`should assign only required error if new type is ${FieldType.EMAIL}, originType was ${FieldType.EMAIL}, require is true, require validator returns error, email validator returns empty string, and previously there was not require validator`, () => {
        // given
        const value = 'Some value';
        const error = 'This field is required';
        requireValidatorSpy.mockReturnValue(error);
        emailValidatorSpy.mockReturnValue('');
        fieldProps.type = FieldType.EMAIL;
        fieldProps.required = true;
        fieldProps.value = value;
        fieldState.originType = FieldType.EMAIL;
        fieldState.validators = [];

        // when
        const state = FieldComponent.getDerivedStateFromProps!(
          fieldProps,
          fieldState
        );

        // then
        expect(FieldValidator.validateEmail).toHaveBeenCalledWith(value);
        expect(FieldValidator.validateRequire).toHaveBeenCalledWith(value);
        expect(state?.errors).toEqual(error);
      });

      it(`should assign only email error if new type is ${FieldType.EMAIL}, originType was ${FieldType.EMAIL}, require is true, require validator returns empty string, email validator returns error, and previously there was not require validator`, () => {
        // given
        const value = 'Some value';
        const error = 'Incorrect email format';
        requireValidatorSpy.mockReturnValue('');
        emailValidatorSpy.mockReturnValue(error);
        fieldProps.type = FieldType.EMAIL;
        fieldProps.required = true;
        fieldProps.value = value;
        fieldState.originType = FieldType.EMAIL;
        fieldState.validators = [];

        // when
        const state = FieldComponent.getDerivedStateFromProps!(
          fieldProps,
          fieldState
        );

        // then
        expect(FieldValidator.validateEmail).toHaveBeenCalledWith(value);
        expect(FieldValidator.validateRequire).toHaveBeenCalledWith(value);
        expect(state?.errors).toEqual(error);
      });

      [false, undefined].forEach((required) => {
        it(`should assign errors if new type is ${FieldType.EMAIL}, originType was ${FieldType.EMAIL}, require is ${required} and previously there was require validator`, () => {
          // given
          const value = 'Some value';
          const error = 'Incorrect email format';
          requireValidatorSpy.mockReturnValue('');
          emailValidatorSpy.mockReturnValue(error);
          fieldProps.type = FieldType.EMAIL;
          fieldProps.required = required;
          fieldProps.value = value;
          fieldState.originType = FieldType.EMAIL;
          fieldState.validators = [FieldValidator.validateRequire];

          // when
          const state = FieldComponent.getDerivedStateFromProps!(
            fieldProps,
            fieldState
          );

          // then
          expect(FieldValidator.validateRequire).not.toHaveBeenCalled();
          expect(FieldValidator.validateEmail).toHaveBeenCalledWith(value);
          expect(state?.errors).toEqual(error);
        });

        it(`should assign empty errors if new type is ${FieldType.EMAIL}, originType was ${FieldType.EMAIL}, require is ${required}, email validator returns empty string and previously there was require validator`, () => {
          // given
          const value = 'Some value';
          requireValidatorSpy.mockReturnValue('');
          emailValidatorSpy.mockReturnValue('');
          fieldProps.type = FieldType.EMAIL;
          fieldProps.required = required;
          fieldProps.value = value;
          fieldState.originType = FieldType.EMAIL;
          fieldState.validators = [FieldValidator.validateRequire];

          // when
          const state = FieldComponent.getDerivedStateFromProps!(
            fieldProps,
            fieldState
          );

          // then
          expect(FieldValidator.validateRequire).not.toHaveBeenCalled();
          expect(FieldValidator.validateEmail).toHaveBeenCalledWith(value);
          expect(state?.errors).toEqual('');
        });

        [FieldType.TEXT, FieldType.PASSWORD].forEach((type) => {
          it(`should assign empty errors if new type is ${type}, originType was ${type}, required is changed to ${required} and previously there was require validator`, () => {
            // given
            requireValidatorSpy.mockReturnValue('This field is required');
            emailValidatorSpy.mockReturnValue('Incorrect email format');
            fieldProps.type = type;
            fieldProps.required = required;
            fieldProps.value = 'Some value';
            fieldState.originType = type;
            fieldState.validators = [FieldValidator.validateRequire];

            // when
            const state = FieldComponent.getDerivedStateFromProps!(
              fieldProps,
              fieldState
            );

            // then
            expect(FieldValidator.validateRequire).not.toHaveBeenCalled();
            expect(FieldValidator.validateEmail).not.toHaveBeenCalled();
            expect(state?.errors).toBe('');
          });

          it(`should assign email error if actual type is ${FieldType.EMAIL}, previous type was ${type}, required is ${required} and previously there was require validator`, () => {
            // given
            const emailError = 'Incorrect email format';
            const value = 'Some value';
            requireValidatorSpy.mockReturnValue('This field is required');
            emailValidatorSpy.mockReturnValue(emailError);
            fieldProps.type = FieldType.EMAIL;
            fieldProps.required = required;
            fieldProps.value = value;
            fieldState.originType = type;
            fieldState.validators = [FieldValidator.validateRequire];

            // when
            const state = FieldComponent.getDerivedStateFromProps!(
              fieldProps,
              fieldState
            );

            // then
            expect(FieldValidator.validateRequire).not.toHaveBeenCalled();
            expect(FieldValidator.validateEmail).toHaveBeenCalledWith(value);
            expect(state?.errors).toBe(emailError);
          });

          it(`should assign email error if actual type is ${FieldType.EMAIL}, previous type was ${type}, required is ${required} and previously there was not require validator`, () => {
            // given
            const emailError = 'Incorrect email format';
            const value = 'Some value';
            requireValidatorSpy.mockReturnValue('This field is required');
            emailValidatorSpy.mockReturnValue(emailError);
            fieldProps.type = FieldType.EMAIL;
            fieldProps.required = required;
            fieldProps.value = value;
            fieldState.originType = type;
            fieldState.validators = [];

            // when
            const state = FieldComponent.getDerivedStateFromProps!(
              fieldProps,
              fieldState
            );

            // then
            expect(FieldValidator.validateRequire).not.toHaveBeenCalled();
            expect(FieldValidator.validateEmail).toHaveBeenCalledWith(value);
            expect(state?.errors).toBe(emailError);
          });

          it(`should assign empty errors if actual type is ${FieldType.EMAIL}, previous type was ${type}, required is ${required}, email validator returns empty string and previously there was require validator`, () => {
            // given
            const value = 'Some value';
            requireValidatorSpy.mockReturnValue('This field is required');
            emailValidatorSpy.mockReturnValue('');
            fieldProps.type = FieldType.EMAIL;
            fieldProps.required = required;
            fieldProps.value = value;
            fieldState.originType = type;
            fieldState.validators = [FieldValidator.validateRequire];

            // when
            const state = FieldComponent.getDerivedStateFromProps!(
              fieldProps,
              fieldState
            );

            // then
            expect(FieldValidator.validateRequire).not.toHaveBeenCalled();
            expect(FieldValidator.validateEmail).toHaveBeenCalledWith(value);
            expect(state?.errors).toBe('');
          });

          it(`should assign empty errors if actual type is ${FieldType.EMAIL}, previous type was ${type}, required is ${required}, email validator returns empty string and previously there was not require validator`, () => {
            // given
            const value = 'Some value';
            requireValidatorSpy.mockReturnValue('This field is required');
            emailValidatorSpy.mockReturnValue('');
            fieldProps.type = FieldType.EMAIL;
            fieldProps.required = required;
            fieldProps.value = value;
            fieldState.originType = type;
            fieldState.validators = [];

            // when
            const state = FieldComponent.getDerivedStateFromProps!(
              fieldProps,
              fieldState
            );

            // then
            expect(FieldValidator.validateRequire).not.toHaveBeenCalled();
            expect(FieldValidator.validateEmail).toHaveBeenCalledWith(value);
            expect(state?.errors).toBe('');
          });
        });

        it(`should not assign errors if new type is undefined, originType was ${FieldType.TEXT}, required is ${required} and previously there was not require validator`, () => {
          // given
          requireValidatorSpy.mockReturnValue('This field is required');
          emailValidatorSpy.mockReturnValue('Incorrect email format');
          fieldProps.type = undefined;
          fieldProps.required = required;
          fieldProps.value = 'Some value';
          fieldState.originType = FieldType.TEXT;
          fieldState.validators = [];

          // when
          const state = FieldComponent.getDerivedStateFromProps!(
            fieldProps,
            fieldState
          );

          // then
          expect(FieldValidator.validateRequire).not.toHaveBeenCalled();
          expect(FieldValidator.validateEmail).not.toHaveBeenCalled();
          expect(state?.errors).toBeUndefined();
        });

        it(`should not assign errors if new type is undefined, originType was ${FieldType.TEXT}, required is ${required} and previously there was require validator`, () => {
          // given
          requireValidatorSpy.mockReturnValue('This field is required');
          emailValidatorSpy.mockReturnValue('Incorrect email format');
          fieldProps.type = undefined;
          fieldProps.required = required;
          fieldProps.value = 'Some value';
          fieldState.originType = FieldType.TEXT;
          fieldState.validators = [];

          // when
          const state = FieldComponent.getDerivedStateFromProps!(
            fieldProps,
            fieldState
          );

          // then
          expect(FieldValidator.validateRequire).not.toHaveBeenCalled();
          expect(FieldValidator.validateEmail).not.toHaveBeenCalled();
          expect(state?.errors).toBeUndefined();
        });
      });
    });

    describe('Class name change', () => {
      [
        {
          newClassName: 'some-class',
          oldClassName: 'field other-class',
          expectedClassName: 'field some-class',
          description:
            'new class name is different than old class name with default class name',
        },
        {
          newClassName: undefined,
          oldClassName: 'field some-class',
          expectedClassName: 'field',
          description:
            'new class name is undefined and old class name is together with default class name',
        },
        {
          newClassName: 'some-class',
          oldClassName: 'field',
          expectedClassName: 'field some-class',
          description:
            'new class name is different than old class name without default class name',
        },
      ].forEach((testScenario) => {
        it(`should change className if ${testScenario.description}`, () => {
          // given
          fieldProps.className = testScenario.newClassName;
          fieldState.className = testScenario.oldClassName;

          // when
          const state = FieldComponent.getDerivedStateFromProps!(
            fieldProps,
            fieldState
          );

          // then
          expect(state?.className).toBe(testScenario.expectedClassName);
        });
      });

      [
        {
          newClassName: 'some-class',
          oldClassName: 'field some-class',
          description:
            'new class name is the same like old class name with default class name',
        },
        {
          newClassName: undefined,
          oldClassName: 'field',
          description:
            'new class name is undefined and old class name is default',
        },
      ].forEach((testScenario) => {
        it(`should not assign className if ${testScenario.description}`, () => {
          // given
          fieldProps.className = testScenario.newClassName;
          fieldState.className = testScenario.oldClassName;

          // when
          const state = FieldComponent.getDerivedStateFromProps!(
            fieldProps,
            fieldState
          );

          // then
          expect(state).toBeNull();
        });
      });
    });
  });
});
