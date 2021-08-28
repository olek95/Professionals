import { fireEvent, getByTestId } from '@testing-library/react';
import { i18n } from 'i18next';
import * as React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { WithTranslation } from 'react-i18next';
import ReactTooltip from 'react-tooltip';
import { TooltipType } from '../../../../models/common/tooltip/tooltip-type';
import Field from './field';
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
    ReactTooltip.show = jest.fn();
  });
  describe('label', () => {
    const labelSelector = '.field';
    let container: HTMLDivElement;

    beforeEach(() => {
      container = document.createElement('div');
    });

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
          expect(container.querySelectorAll('.field-required')).toHaveLength(0);
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
            const requireError = 'This field is required';
            jest
              .spyOn(FieldValidator, 'validateRequire')
              .mockReturnValue(requireError);
            jest
              .spyOn(FieldValidator, 'validateEmail')
              .mockReturnValue(testScenario.emailError);
            const onChange = jest.fn<void, string[]>();
            act(() => {
              ReactDOM.render(
                <Field
                  label=''
                  value='Some value'
                  onChange={onChange}
                  required
                  type={testScenario.type}
                />,
                container
              );
            });
            ReactTooltip.show = jest.fn();
            const value = '';

            // when
            act(() => {
              fireEvent.change(
                container.querySelector(inputSelector) as HTMLInputElement,
                { target: { value: value } }
              );
            });

            // then
            expect(container.querySelector(inputSelector)).toHaveAttribute(
              'data-tip',
              requireError
            );
            expect(FieldValidator.validateRequire).toHaveBeenCalledWith(value);
            testScenario.type === FieldType.EMAIL
              ? expect(FieldValidator.validateEmail).toHaveBeenCalledWith(value)
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
            const emailError = 'Email has incorrect format';
            jest
              .spyOn(FieldValidator, 'validateEmail')
              .mockReturnValue(emailError);
            jest
              .spyOn(FieldValidator, 'validateRequire')
              .mockReturnValue(testScenario.requireError);
            const onChange = jest.fn<void, string[]>();
            act(() => {
              ReactDOM.render(
                <Field
                  label=''
                  value='Some value'
                  onChange={onChange}
                  type={FieldType.EMAIL}
                  required={testScenario.required}
                />,
                container
              );
            });
            ReactTooltip.show = jest.fn();
            const value = 'Some email';

            // when
            act(() => {
              fireEvent.change(
                container.querySelector(inputSelector) as HTMLInputElement,
                { target: { value: value } }
              );
            });

            // then
            expect(container.querySelector(inputSelector)).toHaveAttribute(
              'data-tip',
              emailError
            );
            expect(FieldValidator.validateEmail).toHaveBeenCalledWith(value);
            testScenario.required
              ? expect(FieldValidator.validateRequire).toHaveBeenCalledWith(
                  value
                )
              : expect(FieldValidator.validateRequire).not.toHaveBeenCalled();
          });
        });

        it('should set required and email errors to data tip if field is required, has email type and both validators return error', () => {
          // given
          const emailError = 'Email has incorrect format';
          jest
            .spyOn(FieldValidator, 'validateEmail')
            .mockReturnValue(emailError);
          const requireError = 'This field is required';
          jest
            .spyOn(FieldValidator, 'validateRequire')
            .mockReturnValue(requireError);
          const onChange = jest.fn<void, string[]>();
          act(() => {
            ReactDOM.render(
              <Field
                label=''
                value='Some value'
                onChange={onChange}
                type={FieldType.EMAIL}
                required
              />,
              container
            );
          });
          ReactTooltip.show = jest.fn();
          const value = 'Some other value';

          // when
          act(() => {
            fireEvent.change(
              container.querySelector(inputSelector) as HTMLInputElement,
              { target: { value: value } }
            );
          });

          // then
          expect(container.querySelector(inputSelector)).toHaveAttribute(
            'data-tip',
            `${requireError}\n${emailError}`
          );
          expect(FieldValidator.validateEmail).toHaveBeenCalledWith(value);
          expect(FieldValidator.validateRequire).toHaveBeenCalledWith(value);
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
            }, type is ${emailTestScenario.type} and validateEmail returns ${
              emailTestScenario.emailError ? 'error' : 'empty string'
            }`, () => {
              // given
              jest
                .spyOn(FieldValidator, 'validateEmail')
                .mockReturnValue(emailTestScenario.emailError);
              jest
                .spyOn(FieldValidator, 'validateRequire')
                .mockReturnValue(requireTestScenario.requireError);
              const onChange = jest.fn<void, string[]>();
              act(() => {
                ReactDOM.render(
                  <Field
                    label=''
                    value='Some value'
                    onChange={onChange}
                    type={emailTestScenario.type}
                    required={requireTestScenario.required}
                  />,
                  container
                );
              });
              ReactTooltip.show = jest.fn();
              const value = 'Some other value';

              // when
              act(() => {
                fireEvent.change(
                  container.querySelector(inputSelector) as HTMLInputElement,
                  { target: { value: value } }
                );
              });

              // then
              expect(container.querySelector(inputSelector)).toHaveAttribute(
                'data-tip',
                ''
              );
              requireTestScenario.required
                ? expect(FieldValidator.validateRequire).toHaveBeenCalledWith(
                    value
                  )
                : expect(FieldValidator.validateRequire).not.toHaveBeenCalled();
              emailTestScenario.type === FieldType.EMAIL
                ? expect(FieldValidator.validateEmail).toHaveBeenCalledWith(
                    value
                  )
                : expect(FieldValidator.validateEmail).not.toHaveBeenCalled();
            });
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
