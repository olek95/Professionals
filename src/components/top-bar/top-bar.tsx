import './top-bar.scss';
import { WithTranslation, withTranslation } from 'react-i18next';
import React, { Context, ReactNode } from 'react';
import { Login } from '../login/login';
import { TopBarState } from './top-bar-state';
import { ModalContext } from '../common/modal/modal-context';
import { LoginProps } from '../login/login-props';
import { ModalContextProps } from '../common/modal/modal-context-props';
import { UserService } from '../../services/user/user.service';
import { Button } from '../../models/button/button';
import { ToastContext } from '../common/toast/toast-context';
import { ToastContainer } from 'react-toastr';
import { HttpErrorResponse } from '../../models/common/http/error/http-error-response';
import { Registration } from '../registration/registration';
import { RegistrationProps } from '../registration/registration-props';

class TopBar extends React.Component<WithTranslation, TopBarState> {
  private static readonly DEFAULT_MODALS_CONF: Readonly<TopBarState> = {
    email: '',
    disabledLogin: true,
    login: '',
    password: '',
  };

  static contextType = ToastContext;

  context: React.ContextType<Context<ToastContainer | undefined>> | undefined;

  private readonly loginButton: Button;
  private readonly registerButton: Button;

  private loginModal: ModalContextProps<LoginProps> | undefined;
  private registrationModal: ModalContextProps<RegistrationProps> | undefined;

  constructor(props: WithTranslation) {
    super(props);
    this.state = TopBar.DEFAULT_MODALS_CONF;
    this.loginButton = {
      disabled: this.state.disabledLogin,
      label: 'TOP_BAR.LOGIN_BUTTON',
      onClick: () =>
        UserService.login(this.state.login, this.state.password)
          .then(this.loginModal?.close)
          .catch(this.onLoginError),
    };
    this.registerButton = {
      disabled: false,
      label: 'TOP_BAR.SIGN_UP_BUTTON',
      onClick: () =>
        UserService.signUp('test1', 'test2')
          .then(this.registrationModal?.close)
          .catch(this.onLoginError),
    };
  }

  render(): JSX.Element {
    return (
      <div className='top-bar'>
        <ModalContext.Consumer>{this.setLoginModal}</ModalContext.Consumer>
        <ModalContext.Consumer>
          {this.setRegistrationModal}
        </ModalContext.Consumer>
        <button className='top-bar-login' onClick={this.openLoginModal}>
          {this.props.t('TOP_BAR.LOGIN_BUTTON')}
        </button>
        <button onClick={this.openRegistrationModal}>
          {this.props.t('TOP_BAR.SIGN_UP_BUTTON')}
        </button>
      </div>
    );
  }

  setLoginModal = (
    modalContextProps: ModalContextProps<LoginProps>
  ): ReactNode => {
    this.loginModal = modalContextProps;
    return;
  };

  setRegistrationModal = (
    modalContextProps: ModalContextProps<RegistrationProps>
  ): ReactNode => {
    this.registrationModal = modalContextProps;
    return;
  };

  openLoginModal = (): void => {
    this.setState(TopBar.DEFAULT_MODALS_CONF, () =>
      this.loginModal?.configure({
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
            onClick: this.onLoginModalClose,
          },
        ],
        rightButtons: [this.loginButton],
        onEnterPressed: this.loginButton.onClick,
      })
    );
  };

  openRegistrationModal = (): void => {
    this.setState(TopBar.DEFAULT_MODALS_CONF, () => {
      this.registrationModal?.configure({
        body: Registration,
        bodyParams: {
          email: this.state.email,
          emailChange: this.onEmailChanged,
          loginChange: this.onLoginChanged,
          passwordChange: this.onPasswordChanged,
          login: this.state.login,
          password: this.state.password,
        },
        title: 'TOP_BAR.REGISTRATION_TITLE',
        leftButtons: [
          {
            label: 'COMMON.CANCEL_BUTTON',
            onClick: this.registrationModal?.close,
          },
        ],
        rightButtons: [this.registerButton],
        onEnterPressed: this.registerButton.onClick,
      });
    });
  };

  private onLoginError = (error: HttpErrorResponse): void => {
    this.context?.error(error.message, error.statusText);
  };

  private onEmailChanged = (email: string): void => {
    this.setState({
      email,
    });
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
    this.loginModal?.update({
      bodyParams: {
        login: this.state.login,
        password: this.state.password,
      },
      rightButtons: [this.loginButton],
    });
  }

  private onLoginModalClose = (): void => {
    this.loginModal?.close();
    this.setState(TopBar.DEFAULT_MODALS_CONF, this.updateLoginModal);
  };
}

export default withTranslation()(TopBar);
