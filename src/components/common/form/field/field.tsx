import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import ReactTooltip from 'react-tooltip';
import { TooltipType } from '../../../../models/common/tooltip/tooltip-type';
import { FieldProps } from './field-props';
import { FieldState } from './field-state';
import { FieldType } from './field-type';
import { FieldValidator } from './field-validator';
import './field.scss';
import { Validator } from './validator';

class Field extends React.Component<FieldProps & WithTranslation, FieldState> {
  private static readonly FIELD_DEFAULT_CLASS = 'field';

  private static retrieveClassName(
    props: FieldProps & WithTranslation
  ): string {
    return props.className
      ? `${Field.FIELD_DEFAULT_CLASS} ${props.className}`
      : Field.FIELD_DEFAULT_CLASS;
  }

  private static retrieveType(props: FieldProps & WithTranslation): FieldType {
    return !props.type || props.type === FieldType.EMAIL
      ? FieldType.TEXT
      : props.type;
  }

  private static isRequiredPropertyChanged(
    required: boolean | undefined,
    validators: Validator[]
  ): boolean {
    return (
      (required && !validators.includes(FieldValidator.validateRequire)) ||
      (!required && validators.includes(FieldValidator.validateRequire))
    );
  }

  private static getUpdatedValidators(
    props: FieldProps,
    actualValidators: Validator[]
  ): ((value: string) => string)[] | undefined {
    const validators: Validator[] = [];
    if (props.required) {
      validators.push(FieldValidator.validateRequire);
    }
    if (props.type === FieldType.EMAIL) {
      validators.push(FieldValidator.validateEmail);
    }
    if (
      validators.length !== actualValidators.length ||
      !validators.every((validator) => actualValidators.includes(validator))
    ) {
      return validators;
    }
  }

  private static getError(value: string, validators: Validator[]): string {
    return validators.flatMap((validator) => validator(value) || []).join('\n');
  }

  static getDerivedStateFromProps(
    props: FieldProps & WithTranslation,
    state: FieldState
  ): Partial<FieldState> | null {
    const nextState: Partial<FieldState> = {};
    const type = Field.retrieveType(props);
    if (props.type !== state.originType) {
      nextState.type = type;
      nextState.originType = props.type;
    }
    if (
      props.type !== state.originType ||
      Field.isRequiredPropertyChanged(props.required, state.validators)
    ) {
      const validators = Field.getUpdatedValidators(props, state.validators);
      if (validators) {
        nextState.validators = validators;
        nextState.errors = Field.getError('', nextState.validators);
      }
    }
    if (props.className !== state.className) {
      nextState.className = Field.retrieveClassName(props);
    }
    return Object.keys(nextState).length ? nextState : null;
  }

  private readonly inputRef = React.createRef<HTMLInputElement>();

  constructor(props: FieldProps & WithTranslation) {
    super(props);
    const originType = FieldType.TEXT;
    this.state = {
      className: Field.retrieveClassName(props),
      errors: '',
      originType: originType,
      type: originType,
      validators: [],
    };
  }

  render(): JSX.Element {
    return (
      <label className={this.state.className}>
        {this.props.t(this.props.label)}
        {this.props.required && <span className='field-required' />}
        <input
          ref={this.inputRef}
          data-class='field-input-tooltip'
          data-tip={this.state.errors}
          data-type={TooltipType.ERROR}
          className='field-input'
          value={this.props.value}
          onChange={this.emitOnChange}
          type={this.state.type}
        />
        <ReactTooltip />
      </label>
    );
  }

  emitOnChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    this.validateInput(event.target.value);
    this.props.onChange(event.target.value);
  };

  private validateInput(value: string): void {
    let previousError: string;
    this.setState(
      (state) => {
        previousError = state.errors;
        return {
          errors: Field.getError(value, state.validators),
        };
      },
      () => {
        if (previousError !== this.state.errors) {
          this.state.errors
            ? ReactTooltip.show(this.inputRef.current as HTMLInputElement)
            : ReactTooltip.hide();
        }
      }
    );
  }
}

export default withTranslation()(Field);
