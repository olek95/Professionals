import './registration.scss';
import React, { ChangeEvent } from 'react';
import { RegistrationProps } from './registration-props';

export class Registration extends React.Component<RegistrationProps> {
  render(): JSX.Element {
    return (
      <div className='registration'>
        <label>
          Login:{' '}
          <input
            className='registration-input'
            value={this.props.login}
            onChange={this.onLoginChanged}
          />
        </label>
        <label className='registration-password'>
          Password:{' '}
          <input
            type='password'
            className='registration-password-input'
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
