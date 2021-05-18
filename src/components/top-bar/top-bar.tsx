import './top-bar.scss';
import { WithTranslation, withTranslation } from 'react-i18next';
import React, { Context } from 'react';
import { Login } from '../login/login';
import { TopBarState } from './top-bar-state';
import { ModalContext } from '../common/modal/modal-context';
import { LoginProps } from '../login/login-props';
import { ModalContextProps } from '../common/modal/modal-context-props';
import { UserService } from '../../services/user/user.service';
import { Button } from '../../models/button/button';

class TopBar extends React.Component<WithTranslation, TopBarState> {
  private static readonly DEFAULT_LOGIN_CONF: Readonly<TopBarState> = {
    disabledLogin: true,
    login: '',
    password: '',
  };

  static contextType = ModalContext;

  context:
    | React.ContextType<Context<ModalContextProps<LoginProps>>>
    | undefined;

  private readonly loginButton: Button;

  constructor(props: WithTranslation) {
    super(props);
    this.state = TopBar.DEFAULT_LOGIN_CONF;
    this.loginButton = {
      disabled: this.state.disabledLogin,
      label: 'TOP_BAR.LOGIN_BUTTON',
      onClick: () =>
        UserService.login(this.state.login, this.state.password)
          .then(this.context?.close)
          .catch(console.error),
    };
  }

  render(): JSX.Element {
    return (
      <div className='top-bar'>
        <div>
          <button className='top-bar-login' onClick={this.openModal}>
            {this.props.t('TOP_BAR.LOGIN_BUTTON')}
          </button>
          <button>{this.props.t('TOP_BAR.SIGN_UP_BUTTON')}</button>
        </div>
      </div>
    );
  }

  openModal = (): void => {
    this.setState(TopBar.DEFAULT_LOGIN_CONF, () =>
      this.context?.configure({
        body: Login,
        bodyParams: {
          loginChange: this.onLoginChanged,
          passwordChange: this.onPasswordChanged,
          login: this.state.login,
          password: this.state.password,
        },
        title: 'TOP_BAR.LOGIN_TITLE',
        leftButtons: [
          {
            label: 'COMMON.CANCEL_BUTTON',
            onClick: this.context?.close,
          },
        ],
        rightButtons: [this.loginButton],
        onEnterPressed: this.loginButton.onClick,
      })
    );
  };

  private onLoginChanged = (login: string): void => {
    this.setState(
      {
        login,
      },
      this.updateLoginEnableState
    );
  };

  private onPasswordChanged = (password: string): void => {
    this.setState(
      {
        password,
      },
      this.updateLoginEnableState
    );
  };

  private updateLoginEnableState(): void {
    this.setState(
      (state) => ({
        disabledLogin: !state.password || !state.login,
      }),
      this.updateLoginModal
    );
  }

  private updateLoginModal(): void {
    this.loginButton.disabled = this.state.disabledLogin;
    this.context?.update({
      bodyParams: {
        login: this.state.login,
        password: this.state.password,
      },
      rightButtons: [this.loginButton],
    });
  }
}

export default withTranslation()(TopBar);
