import React, { ChangeEvent } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { RegistrationProps } from './registration-props';
import './registration.scss';

class Registration extends React.Component<
  RegistrationProps & WithTranslation
> {
  render(): JSX.Element {
    return (
      <div className='registration'>
        <label>
          {this.props.t('USER.LOGIN')}
          <input
            className='registration-input'
            value={this.props.login}
            onChange={this.onLoginChanged}
          />
        </label>
        <label className='registration-password'>
          {this.props.t('USER.PASSWORD')}
          <input
            type='password'
            className='registration-password-input'
            value={this.props.password}
            onChange={this.onPasswordChanged}
          />
        </label>
        <label className='registration-email'>
          {this.props.t('USER.EMAIL')}
          <input
            type='email'
            className='registration-email-input'
            value={this.props.email}
            onChange={this.onEmailChanged}
          />
        </label>
      </div>
    );
  }

  onLoginChanged = (event: ChangeEvent<HTMLInputElement>): void =>
    this.props.loginChange(event.target.value);

  onPasswordChanged = (event: ChangeEvent<HTMLInputElement>): void =>
    this.props.passwordChange(event.target.value);

  onEmailChanged = (event: ChangeEvent<HTMLInputElement>): void =>
    this.props.emailChange(event.target.value);
}

export default withTranslation()(Registration);
