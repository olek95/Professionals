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

jest.mock('react-tooltip', () => () => <div data-testid='react-tooltip'></div>);

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
          it('should call onChange from props on change event', () => {
            // given
            const onChange = jest.fn<void, string[]>();
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
            // given
            const onChange = jest.fn<void, string[]>();

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
                const requireValidatorSpy = jest.spyOn(
                  FieldValidator,
                  'validateRequire'
                );
                const emailValidatorSpy = jest.spyOn(
                  FieldValidator,
                  'validateEmail'
                );
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
                ReactTooltip.show = jest.fn();
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
                const requireValidatorSpy = jest.spyOn(
                  FieldValidator,
                  'validateRequire'
                );
                const emailValidatorSpy = jest.spyOn(
                  FieldValidator,
                  'validateEmail'
                );
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
                ReactTooltip.show = jest.fn();
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
              const requireValidatorSpy = jest.spyOn(
                FieldValidator,
                'validateRequire'
              );
              const emailValidatorSpy = jest.spyOn(
                FieldValidator,
                'validateEmail'
              );
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
              ReactTooltip.show = jest.fn();
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
                  const requireValidatorSpy = jest.spyOn(
                    FieldValidator,
                    'validateRequire'
                  );
                  const emailValidatorSpy = jest.spyOn(
                    FieldValidator,
                    'validateEmail'
                  );
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
                  ReactTooltip.show = jest.fn();
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

    describe('state of type', () => {
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
    });
  });
});
