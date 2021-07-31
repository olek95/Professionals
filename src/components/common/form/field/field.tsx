import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import ReactTooltip from 'react-tooltip';
import { TooltipType } from '../../../../models/common/tooltip/tooltip-type';
import { FieldProps } from './field-props';
import { FieldState } from './field-state';
import { FieldType } from './field-type';
import './field.scss';

class Field extends React.Component<FieldProps & WithTranslation, FieldState> {
  private static readonly EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

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

  private static readonly FIELD_DEFAULT_CLASS = 'field';

  static getDerivedStateFromProps(
    props: FieldProps & WithTranslation,
    state: FieldState
  ): Partial<FieldState> | null {
    const nextState: Partial<FieldState> = {};
    const type = Field.retrieveType(props);
    if (type !== state.type) {
      nextState.type = type;
    }
    if (props.className !== state.className) {
      nextState.className = Field.retrieveClassName(props);
    }
    return Object.keys(nextState).length ? nextState : null;
  }

  private readonly inputRef = React.createRef<HTMLInputElement>();

  private validators: ((value: string) => string)[] = [];

  constructor(props: FieldProps & WithTranslation) {
    super(props);
    this.setValidators();
    this.state = {
      className: Field.retrieveClassName(props),
      errors: this.getError(props.value),
      type: Field.retrieveType(props),
    };
  }

  render() {
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

  private getError(value: string): string {
    return this.validators
      .flatMap((validator) => validator(value) || [])
      .join('\n');
  }

  private validateRequire = (value: string): string => {
    return value.trim() ? '' : this.props.t('COMMON.REQUIRED_ERROR');
  };

  private validateEmail = (email: string): string => {
    return this.validateRequire(email) ||
      Field.EMAIL_REGEX.test(email.toLowerCase())
      ? ''
      : this.props.t('COMMON.EMAIL_ERROR');
  };

  private setValidators(): void {
    this.validators = [];
    if (this.props.required) {
      this.validators.push(this.validateRequire);
    }
    if (this.props.type === FieldType.EMAIL) {
      this.validators.push(this.validateEmail);
    }
  }

  private validateInput(value: string): void {
    let previousError: string;
    this.setState(
      (state) => {
        previousError = state.errors;
        return {
          errors: this.getError(value),
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
