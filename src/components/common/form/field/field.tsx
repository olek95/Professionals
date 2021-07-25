import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import ReactTooltip from 'react-tooltip';
import { TooltipType } from '../../../../models/common/tooltip/tooltip-type';
import { FieldProps } from './field-props';
import { FieldState } from './field-state';
import { FieldType } from './field-type';
import './field.scss';

class Field extends React.Component<FieldProps & WithTranslation, FieldState> {
  private static retrieveClassName(
    props: FieldProps & WithTranslation
  ): string {
    return props.className
      ? `${Field.FIELD_DEFAULT_CLASS} ${props.className}`
      : Field.FIELD_DEFAULT_CLASS;
  }

  private static retrieveType(props: FieldProps & WithTranslation): FieldType {
    return props.type || FieldType.TEXT;
  }

  private static readonly FIELD_DEFAULT_CLASS = 'field';

  private readonly inputRef = React.createRef<HTMLInputElement>();

  static getDerivedStateFromProps(
    props: FieldProps & WithTranslation,
    state: FieldState
  ): Partial<FieldState> | null {
    const nextState: Partial<FieldState> = {};
    if (props.type !== state.type) {
      nextState.type = Field.retrieveType(props);
    }
    if (props.className !== state.className) {
      nextState.className = Field.retrieveClassName(props);
    }
    return Object.keys(nextState).length ? nextState : null;
  }

  constructor(props: FieldProps & WithTranslation) {
    super(props);
    this.state = {
      className: Field.retrieveClassName(props),
      error: this.getError(props.value),
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
          data-tip={this.state.error}
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
    return this.validateRequire(value)
      ? this.props.t('COMMON.REQUIRED_ERROR')
      : '';
  }

  private validateRequire(value: string): boolean {
    return !!this.props.required && !value.trim();
  }

  private validateInput(value: string): void {
    let previousError: string;
    this.setState(
      (state) => {
        previousError = state.error;
        return {
          error: this.getError(value),
        };
      },
      () => {
        if (previousError !== this.state.error) {
          this.state.error
            ? ReactTooltip.show(this.inputRef.current as HTMLInputElement)
            : ReactTooltip.hide();
        }
      }
    );
  }
}

export default withTranslation()(Field);
