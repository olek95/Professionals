import React, { Context, ReactNode } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { ToastContainer } from 'react-toastr';
import { Button } from '../../models/button/button';
import { HttpErrorResponse } from '../../models/common/http/error/http-error-response';
import { UserService } from '../../services/user/user.service';
import { ModalContext } from '../common/modal/modal-context';
import { ModalContextProps } from '../common/modal/modal-context-props';
import { ToastContext } from '../common/toast/toast-context';
import Login from '../login/login';
import { LoginProps } from '../login/login-props';
import Registration from '../registration/registration';
import { RegistrationProps } from '../registration/registration-props';
import { TopBarState } from './top-bar-state';
import './top-bar.scss';

class TopBar extends React.Component<WithTranslation, TopBarState> {
  private static readonly DEFAULT_MODALS_CONF: Readonly<TopBarState> = {
    email: '',
    disabledConfirmation: true,
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
      disabled: this.state.disabledConfirmation,
      label: 'TOP_BAR.LOGIN_BUTTON',
      onClick: () =>
        UserService.login(this.state.login, this.state.password)
          .then(this.loginModal?.close)
          .catch(this.onError),
    };
    this.registerButton = {
      disabled: this.state.disabledConfirmation,
      label: 'TOP_BAR.SIGN_UP_BUTTON',
      onClick: () =>
        UserService.signUp(
          this.state.login,
          this.state.password,
          this.state.email
        )
          .then(this.registrationModal?.close)
          .catch(this.onError),
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
          loginChange: (login) =>
            this.onLoginChanged(login, this.updateLoginEnableState),
          passwordChange: (password) =>
            this.onPasswordChanged(password, this.updateLoginEnableState),
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
        onCancel: this.onLoginModalClose,
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
          loginChange: (login) =>
            this.onLoginChanged(login, this.updateRegistrationEnableState),
          passwordChange: (password) =>
            this.onPasswordChanged(
              password,
              this.updateRegistrationEnableState
            ),
          login: this.state.login,
          password: this.state.password,
        },
        title: 'TOP_BAR.REGISTRATION_TITLE',
        leftButtons: [
          {
            label: 'COMMON.CANCEL_BUTTON',
            onClick: this.onRegistrationModalClose,
          },
        ],
        rightButtons: [this.registerButton],
        onEnterPressed: this.registerButton.onClick,
        onCancel: this.onRegistrationModalClose,
      });
    });
  };

  private onError = (error: HttpErrorResponse): void => {
    this.context?.error(error.message, error.statusText);
  };

  private onEmailChanged = (email: string): void => {
    this.setState(
      {
        email,
      },
      this.updateRegistrationEnableState
    );
  };

  private onLoginChanged(login: string, updateEnableState: () => void): void {
    this.setState(
      {
        login,
      },
      updateEnableState
    );
  }

  private onPasswordChanged(password: string, updateEnableState: () => void) {
    this.setState(
      {
        password,
      },
      updateEnableState
    );
  }

  private updateLoginEnableState(): void {
    this.setState(
      (state) => ({
        disabledConfirmation: !state.password || !state.login,
      }),
      this.updateLoginModal
    );
  }

  private updateLoginModal(): void {
    this.updateModal(this.loginButton);
  }

  private onLoginModalClose = (): void => {
    this.loginModal?.close();
    this.setState(TopBar.DEFAULT_MODALS_CONF, this.updateLoginModal);
  };

  private updateRegistrationEnableState(): void {
    this.setState(
      (state) => ({
        disabledConfirmation: !state.password || !state.login || !state.email,
      }),
      this.updateRegistrationModal
    );
  }

  private updateRegistrationModal(): void {
    this.updateModal(this.registerButton, { email: this.state.email });
  }

  private updateModal(
    confirmationButton: Button,
    additionalParams?: Partial<RegistrationProps>
  ): void {
    confirmationButton.disabled = this.state.disabledConfirmation;
    this.registrationModal?.update({
      bodyParams: {
        login: this.state.login,
        password: this.state.password,
        ...additionalParams,
      },
      rightButtons: [confirmationButton],
    });
  }

  private onRegistrationModalClose = (): void => {
    this.registrationModal?.close();
    this.setState(TopBar.DEFAULT_MODALS_CONF, this.updateRegistrationModal);
  };
}

export default withTranslation()(TopBar);
