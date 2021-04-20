import './top-bar.scss';
import { WithTranslation, withTranslation } from 'react-i18next';
import React, { Context } from 'react';
import { Login } from '../login/login';
import { TopBarState } from './top-bar-state';
import { ModalContext } from '../common/modal-context';
import { LoginProps } from '../login/login-props';
import { ModalContextProps } from '../common/modal-context-props';

class TopBar extends React.Component<WithTranslation, TopBarState> {
  static contextType = ModalContext;

  context:
    | React.ContextType<Context<ModalContextProps<LoginProps>>>
    | undefined;

  constructor(props: WithTranslation) {
    super(props);
    this.state = {
      enabledLogin: false,
      login: '',
      password: '',
    };
  }

  onLoginChanged = (login: string) => {
    this.setState(
      {
        login,
      },
      this.updateLoginEnableState
    );
  };

  onPasswordChanged = (password: string) => {
    this.setState(
      {
        password,
      },
      this.updateLoginEnableState
    );
  };

  openModal = () =>
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
          onClick: () => {},
        },
      ],
      rightButtons: [
        {
          disabled: !this.state.enabledLogin,
          label: 'TOP_BAR.LOGIN_BUTTON',
          onClick: () => {},
        },
      ],
    });

  render() {
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

  private updateLoginEnableState() {
    this.setState(
      (state) => ({
        enabledLogin: !!state.password && !!state.login,
      }),
      this.updateLoginModal
    );
  }

  private updateLoginModal() {
    this.context?.update({
      bodyParams: {
        login: this.state.login,
        password: this.state.password,
      },
      rightButtons: [
        {
          disabled: !this.state.enabledLogin,
          label: 'TOP_BAR.LOGIN_BUTTON',
          onClick: () => {},
        },
      ],
    });
  }
}

export default withTranslation()(TopBar);
