import React from 'react';
import Field from '../common/form/field/field';
import { FieldType } from '../common/form/field/field-type';
import { LoginProps } from './login-props';
import './login.scss';

export class Login extends React.Component<LoginProps> {
  render(): JSX.Element {
    return (
      <div className='login'>
        <Field
          label='USER.LOGIN'
          value={this.props.login}
          onChange={this.onLoginChanged}
          required
        />
        <Field
          className='login-password'
          label='USER.PASSWORD'
          type={FieldType.PASSWORD}
          value={this.props.password}
          onChange={this.onPasswordChanged}
          required
        />
      </div>
    );
  }

  onLoginChanged = (login: string): void => this.props.loginChange(login);

  onPasswordChanged = (password: string): void =>
    this.props.passwordChange(password);
}
