import './login.scss';
import React, { ChangeEvent } from 'react';
import { LoginProps } from './login-props';

export class Login extends React.Component<LoginProps> {
  onLoginChanged = (event: ChangeEvent<HTMLInputElement>) =>
    this.props.loginChange(event.target.value);

  onPasswordChanged = (event: ChangeEvent<HTMLInputElement>) =>
    this.props.passwordChange(event.target.value);

  render() {
    return (
      <div className='login'>
        <label>
          Login:{' '}
          <input
            className='login-input'
            value={this.props.login}
            onChange={this.onLoginChanged}
          />
        </label>
        <label className='login-password'>
          Password:{' '}
          <input
            type='password'
            className='login-password-input'
            value={this.props.password}
            onChange={this.onPasswordChanged}
          />
        </label>
      </div>
    );
  }
}