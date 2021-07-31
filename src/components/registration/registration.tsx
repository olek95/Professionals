import React from 'react';
import Field from '../common/form/field/field';
import { FieldType } from '../common/form/field/field-type';
import { RegistrationProps } from './registration-props';
import './registration.scss';

export class Registration extends React.Component<RegistrationProps> {
  render(): JSX.Element {
    return (
      <div className='registration'>
        <Field
          label='USER.LOGIN'
          value={this.props.login}
          onChange={this.onLoginChanged}
          required
        />
        <Field
          label='USER.PASSWORD'
          value={this.props.password}
          onChange={this.onPasswordChanged}
          type={FieldType.PASSWORD}
          required
          className='registration-password'
        />
        <Field
          label='USER.EMAIL'
          value={this.props.email}
          onChange={this.onEmailChanged}
          type={FieldType.EMAIL}
          required
          className='registration-email'
        />
      </div>
    );
  }

  onLoginChanged = (login: string): void => this.props.loginChange(login);

  onPasswordChanged = (password: string): void =>
    this.props.passwordChange(password);

  onEmailChanged = (email: string): void => this.props.emailChange(email);
}
