import React, { ChangeEvent } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { LoginProps } from './login-props';
import './login.scss';

class Login extends React.Component<LoginProps & WithTranslation> {
  render(): JSX.Element {
    return (
      <div className='login'>
        <label>
          {this.props.t('USER.LOGIN')}
          <input
            className='login-input'
            value={this.props.login}
            onChange={this.onLoginChanged}
          />
        </label>
        <label className='login-password'>
          {this.props.t('USER.PASSWORD')}
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

  onLoginChanged = (event: ChangeEvent<HTMLInputElement>): void =>
    this.props.loginChange(event.target.value);

  onPasswordChanged = (event: ChangeEvent<HTMLInputElement>): void =>
    this.props.passwordChange(event.target.value);
}

export default withTranslation()(Login);
