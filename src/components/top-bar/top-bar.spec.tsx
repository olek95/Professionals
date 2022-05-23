import {fireEvent, queryAllByTestId} from "@testing-library/react";
import {ConsumerProps, Dispatch, ReactNode, SetStateAction} from "react";
import ReactDOM from "react-dom";
import {act} from "react-dom/test-utils";
import {MaybeMocked} from "ts-jest/dist/utils/testing";
import {mocked} from "ts-jest/utils";
import {UserService} from "../../services/user/user.service";
import {ModalConfiguration} from "../common/modal/modal-configuration";
import {ModalContext} from "../common/modal/modal-context";
import {Login} from "../login/login";
import {LoginProps} from "../login/login-props";
import {Registration} from "../registration/registration";
import {RegistrationProps} from "../registration/registration-props";
import TopBar from "./top-bar";
import * as translation from '../../__mocks__/react-i18next';

jest.mock('../common/modal/modal-context', () => ({
    ModalContext: {
        Consumer: (): ReactNode => <div />
    }
}));
jest.mock('react-i18next');
jest.mock('../../services/user/user.service');

describe('TopBar', () => {
    describe('render', () => {
        let container: HTMLDivElement;

        beforeEach(() => {
            container = document.createElement('div');
        });

        describe('ModalContext.Consumer', () => {
            let modalContextConsumerSpy: jest.SpiedFunction<(props: ConsumerProps<any>) => ReactNode>;

            beforeEach(() => {
                modalContextConsumerSpy = jest.spyOn(mocked(ModalContext), 'Consumer');
            });

            it('should be rendered', () => {
                // given
                const modalContextConsumerId = 'modal-context-consumer';
                modalContextConsumerSpy.mockReturnValue(<div data-testid={modalContextConsumerId}/>);

                // when
                act(() => {
                    ReactDOM.render(<TopBar />, container);
                });

                // then
                expect(queryAllByTestId(container, modalContextConsumerId)).toHaveLength(1);
            });

            it('should pass function as child', () => {
                // when
                act(() => {
                    ReactDOM.render(<TopBar />, container);
                });

                // then
                expect(modalContextConsumerSpy).toHaveBeenCalledWith({
                    children: expect.any(Function)
                }, {});
            });
        });

        describe('Buttons', ()  => {
            it('should be rendered 2 elements', () => {
                // when
                act(() => {
                    ReactDOM.render(<TopBar />, container);
                });

                // then
                expect(container.querySelectorAll('button')).toHaveLength(2);
            });

            describe('Login button', () => {
                const loginButtonSelector = '.top-bar-login';

                it('should have correct text', () => {
                    // given
                    const translationKey = 'TOP_BAR.LOGIN_BUTTON';
                    const text = 'Sign in';
                    translation.t.mockImplementation((key) => key === translationKey ? text : '');

                    // when
                    act(() => {
                        ReactDOM.render(<TopBar />, container);
                    });

                    // then
                    expect(container.querySelector(loginButtonSelector)).toHaveTextContent(new RegExp(`^${text}$`));
                });

                describe('onClick', () => {
                    let modalContextConsumerSpy: jest.SpiedFunction<(props: ConsumerProps<any>) => ReactNode>;
                    let configure: jest.SpiedFunction<Dispatch<ModalConfiguration<LoginProps>>>

                    beforeEach(() => {
                        modalContextConsumerSpy = jest.spyOn(mocked(ModalContext), 'Consumer');
                        act(() => {
                            ReactDOM.render(<TopBar />, container);
                        });
                        configure = jest.fn();
                    });

                    it('should call configure for modal with correct parameters', () => {
                        // given
                        modalContextConsumerSpy.mock.calls[0][0].children({
                            configure
                        });

                        // when
                        fireEvent.click(container.querySelector(loginButtonSelector) as HTMLButtonElement);

                        // then
                        expect(configure).toHaveBeenCalledWith({
                            body: Login,
                            bodyParams: {
                                loginChange: expect.any(Function),
                                passwordChange: expect.any(Function),
                                login: '',
                                password: ''
                            },
                            title: 'TOP_BAR.LOGIN_TITLE',
                            leftButtons: [{
                                label: 'COMMON.CANCEL_BUTTON',
                                onClick: expect.any(Function)
                            }],
                            rightButtons: [{
                                disabled: true,
                                label: 'TOP_BAR.LOGIN_BUTTON',
                                onClick: expect.any(Function)
                            }],
                            onEnterPressed: expect.any(Function),
                            onCancel: expect.any(Function)
                        });
                        const configuration = configure.mock.calls[0][0];
                        expect(configuration.rightButtons[0].onClick).toBe(configuration.onEnterPressed);
                        expect(configuration.leftButtons[0].onClick).toBe(configuration.onCancel);
                    });

                    describe('loginChange', () => {
                        let update: jest.SpiedFunction<Dispatch<Partial<ModalConfiguration<Partial<LoginProps>>> | undefined>>;
                        let params: LoginProps;
                        let close: () => void;

                        beforeEach(() => {
                            update = jest.fn();
                            close = jest.fn();
                            modalContextConsumerSpy.mock.calls[0][0].children({
                                configure,
                                update,
                                close
                            });
                            fireEvent.click(container.querySelector(loginButtonSelector) as HTMLButtonElement);
                            params = configure.mock.calls[0][0].bodyParams;
                        });

                        [{
                            login: 'Some login',
                            description: 'defined'
                        }, {
                            login: '',
                            description: 'empty string'
                        }, {
                            login: null,
                            description: 'null'
                        }, {
                            login: undefined,
                            description: 'undefined'
                        }].forEach((loginTestScenario) => {
                            it(`should call update on modal with correct parameters when loginChange is called with ${loginTestScenario.description} login and password is default`, () => {
                                // when
                                params.loginChange(loginTestScenario.login as string);

                                // then
                                expect(update).toHaveBeenCalledWith({
                                    bodyParams: {
                                        login: loginTestScenario.login,
                                        password: ''
                                    },
                                    rightButtons: [{
                                        disabled: true,
                                        label: 'TOP_BAR.LOGIN_BUTTON',
                                        onClick: expect.any(Function)
                                    }]
                                });
                            });

                            [{
                                password: '',
                                description: 'empty string'
                            }, {
                                password: null,
                                description: 'null'
                            }, {
                                password: undefined,
                                description: 'undefined'
                            }].forEach((passwordTestScenario) => {
                                it(`should call update on modal with correct parameters when loginChange is called with ${loginTestScenario.description} login and earlier passwordChange was called with ${passwordTestScenario.password} password`, () => {
                                    // given
                                    params.passwordChange(passwordTestScenario.password as string);
                                    update.mockReset();

                                    // when
                                    params.loginChange(loginTestScenario.login as string);

                                    // then
                                    expect(update).toHaveBeenCalledWith({
                                        bodyParams: {
                                            login: loginTestScenario.login,
                                            password: passwordTestScenario.password
                                        },
                                        rightButtons: [{
                                            disabled: true,
                                            label: 'TOP_BAR.LOGIN_BUTTON',
                                            onClick: expect.any(Function)
                                        }]
                                    });
                                });
                            });
                        });

                        [{
                            login: '',
                            description: 'empty string'
                        }, {
                            login: null,
                            description: 'null'
                        }, {
                            login: undefined,
                            description: 'undefined'
                        }].forEach((loginTestScenario) => {
                            it(`should call update on modal with correct parameters when loginChange is called with ${loginTestScenario.description} login and earlier passwordChange was called with defined password`, () => {
                                // given
                                const password = 'Some password';
                                params.passwordChange(password);
                                update.mockReset();

                                // when
                                params.loginChange(loginTestScenario.login as string);

                                // then
                                expect(update).toHaveBeenCalledWith({
                                    bodyParams: {
                                        login: loginTestScenario.login,
                                        password
                                    },
                                    rightButtons: [{
                                        disabled: true,
                                        label: 'TOP_BAR.LOGIN_BUTTON',
                                        onClick: expect.any(Function)
                                    }]
                                });
                            });
                        });

                        it(`should call update on modal with correct parameters when loginChange is called with defined login and earlier passwordChange was called with defined password`, () => {
                            // given
                            const password = 'Some password';
                            params.passwordChange(password);
                            const login = 'Some login';
                            update.mockReset();

                            // when
                            params.loginChange(login);

                            // then
                            expect(update).toHaveBeenCalledWith({
                                bodyParams: {
                                    login,
                                    password
                                },
                                rightButtons: [{
                                    disabled: false,
                                    label: 'TOP_BAR.LOGIN_BUTTON',
                                    onClick: expect.any(Function)
                                }]
                            });
                        });

                        describe('login button onClick', () => {
                            let mockedUserService: MaybeMocked<typeof UserService>;
                            const login = 'Some login';

                            beforeEach(() => {
                                mockedUserService = mocked(UserService);
                            });

                            it('should call UserService.login with correct parameters if passwordChange was not called earlier', () => {
                                // given
                                params.loginChange(login);
                                mockedUserService.login.mockReturnValue(new Promise(() => {}))

                                // when
                                update.mock.calls[0][0]?.rightButtons?.[0].onClick();

                                // then
                                expect(UserService.login).toHaveBeenCalledWith(login, '');
                            });

                            it('should call UserService.login with correct parameters if passwordChange was called earlier', () => {
                                // given
                                const password = 'Some password';
                                params.passwordChange(password);
                                update.mockReset();
                                params.loginChange(login);
                                mockedUserService.login.mockReturnValue(new Promise(() => {}))

                                // when
                                update.mock.calls[0][0]?.rightButtons?.[0].onClick();

                                // then
                                expect(UserService.login).toHaveBeenCalledWith(login, password);
                            });

                            describe('UserService.login handler', () => {
                                let resolveLogin: (value: string) => void;

                                beforeEach(() => {
                                    resolveLogin = () => {};
                                    mockedUserService.login.mockReturnValue(new Promise((resolve) => {
                                        resolveLogin = resolve;
                                    }))
                                });

                                it('should call close on modal',  async () => {
                                    // given
                                    params.loginChange(login);
                                    update.mock.calls[0][0]?.rightButtons?.[0].onClick();

                                    // when
                                    await resolveLogin('');

                                    // then
                                    expect(close).toHaveBeenCalled();
                                });

                                [{
                                    login: 'Some login',
                                    description: 'defined'
                                }, {
                                    login: '',
                                    description: 'empty string'
                                }, {
                                    login: null,
                                    description: 'null'
                                }, {
                                    login: undefined,
                                    description: 'undefined'
                                }].forEach((loginTestScenario) => {
                                    it(`should call update on modal with correct parameters when loginChange is called with ${loginTestScenario.description} login and password is default`, async () => {
                                        // given
                                        params.loginChange(loginTestScenario.login as string);
                                        update.mock.calls[0][0]?.rightButtons?.[0].onClick();
                                        update.mockReset();

                                        // when
                                        await resolveLogin('');

                                        // then
                                        expect(update).toHaveBeenCalledWith({
                                            bodyParams: {
                                                login: '',
                                                password: ''
                                            },
                                            rightButtons: [{
                                                disabled: true,
                                                label: 'TOP_BAR.LOGIN_BUTTON',
                                                onClick: expect.any(Function)
                                            }]
                                        });
                                    });

                                    [{
                                        password: 'Some password',
                                        description: 'defined'
                                    }, {
                                        password: '',
                                        description: 'empty string'
                                    }, {
                                        password: null,
                                        description: 'null'
                                    }, {
                                        password: undefined,
                                        description: 'undefined'
                                    }].forEach((passwordTestScenario) => {
                                        it(`should call update on modal with correct parameters when loginChange is called with ${loginTestScenario.description} login and passwordChange is called with ${passwordTestScenario.password} password`, async () => {
                                            // given
                                            params.passwordChange(passwordTestScenario.password as string);
                                            update.mockReset();
                                            params.loginChange(loginTestScenario.login as string);
                                            update.mock.calls[0][0]?.rightButtons?.[0].onClick();
                                            update.mockReset();

                                            // when
                                            await resolveLogin('');

                                            // then
                                            expect(update).toHaveBeenCalledWith({
                                                bodyParams: {
                                                    login: '',
                                                    password: ''
                                                },
                                                rightButtons: [{
                                                    disabled: true,
                                                    label: 'TOP_BAR.LOGIN_BUTTON',
                                                    onClick: expect.any(Function)
                                                }]
                                            });
                                        });
                                    });
                                });

                                it('should call UserService.login with correct parameters if passwordChange was not called earlier', async () => {
                                    // given
                                    params.loginChange(login);
                                    update.mock.calls[0][0]?.rightButtons?.[0].onClick();
                                    update.mockReset();
                                    await resolveLogin('');
                                    mockedUserService.login.mockReset();
                                    mockedUserService.login.mockReturnValue(new Promise(() => {}));

                                    // when
                                    update.mock.calls[0][0]?.rightButtons?.[0].onClick();

                                    // then
                                    expect(UserService.login).toHaveBeenCalledWith('', '');
                                });

                                it('should call UserService.login with correct parameters if passwordChange was called earlier', async () => {
                                    // given
                                    params.passwordChange('Some password');
                                    update.mockReset();
                                    params.loginChange(login);
                                    update.mock.calls[0][0]?.rightButtons?.[0].onClick();
                                    update.mockReset();
                                    await resolveLogin('');
                                    mockedUserService.login.mockReset();
                                    mockedUserService.login.mockReturnValue(new Promise(() => {}));

                                    // when
                                    update.mock.calls[0][0]?.rightButtons?.[0].onClick();

                                    // then
                                    expect(UserService.login).toHaveBeenCalledWith('', '');
                                });
                            });
                        });
                    });
                });
            });

            describe('Registration button', () => {
                it('should have correct text', () => {
                    // given
                    const translationKey = 'TOP_BAR.SIGN_UP_BUTTON';
                    const text = 'Sign up';
                    translation.t.mockImplementation((key) => key === translationKey ? text : '');

                    // when
                    act(() => {
                        ReactDOM.render(<TopBar />, container);
                    });

                    // then
                    expect(container.querySelectorAll('button')[1]).toHaveTextContent(new RegExp(`^${text}$`));
                });

                describe('onClick', () => {
                    let modalContextConsumerSpy: jest.SpiedFunction<(props: ConsumerProps<any>) => ReactNode>;
                    let configure: jest.SpiedFunction<Dispatch<ModalConfiguration<RegistrationProps>>>

                    beforeEach(() => {
                        modalContextConsumerSpy = jest.spyOn(mocked(ModalContext), 'Consumer');
                        act(() => {
                            ReactDOM.render(<TopBar />, container);
                        });
                        configure = jest.fn();
                    });

                    it('should call configure for modal with correct parameters', () => {
                        // given
                        modalContextConsumerSpy.mock.calls[0][0].children({
                            configure
                        });

                        // when
                        fireEvent.click(container.querySelectorAll('button')[1]);

                        // then
                        expect(configure).toHaveBeenCalledWith({
                            body: Registration,
                            bodyParams: {
                                emailChange: expect.any(Function),
                                loginChange: expect.any(Function),
                                passwordChange: expect.any(Function),
                                email: '',
                                login: '',
                                password: ''
                            },
                            title: 'TOP_BAR.REGISTRATION_TITLE',
                            leftButtons: [{
                                label: 'COMMON.CANCEL_BUTTON',
                                onClick: expect.any(Function)
                            }],
                            rightButtons: [{
                                disabled: true,
                                label: 'TOP_BAR.SIGN_UP_BUTTON',
                                onClick: expect.any(Function)
                            }],
                            onEnterPressed: expect.any(Function),
                            onCancel: expect.any(Function)
                        });
                        const configuration = configure.mock.calls[0][0];
                        expect(configuration.rightButtons[0].onClick).toBe(configuration.onEnterPressed);
                        expect(configuration.leftButtons[0].onClick).toBe(configuration.onCancel);
                    });

                    describe('loginChange', () => {
                        let update: jest.SpiedFunction<Dispatch<Partial<ModalConfiguration<Partial<RegistrationProps>>> | undefined>>;
                        let params: RegistrationProps;
                        let close: () => void;

                        beforeEach(() => {
                            update = jest.fn();
                            close = jest.fn();
                            modalContextConsumerSpy.mock.calls[0][0].children({
                                configure,
                                update,
                                close
                            });
                            fireEvent.click(container.querySelectorAll('button')[1]);
                            params = configure.mock.calls[0][0].bodyParams;
                        });

                        [{
                            login: 'Some login',
                            description: 'defined'
                        }, {
                            login: '',
                            description: 'empty string'
                        }, {
                            login: null,
                            description: 'null'
                        }, {
                            login: undefined,
                            description: 'undefined'
                        }].forEach((loginTestScenario) => {
                            it(`should call update on modal with correct parameters when loginChange is called with ${loginTestScenario.description} login, password is default and email is default`, () => {
                                // when
                                params.loginChange(loginTestScenario.login as string);

                                // then
                                expect(update).toHaveBeenCalledWith({
                                    bodyParams: {
                                        login: loginTestScenario.login,
                                        password: '',
                                        email: ''
                                    },
                                    rightButtons: [{
                                        disabled: true,
                                        label: 'TOP_BAR.SIGN_UP_BUTTON',
                                        onClick: expect.any(Function)
                                    }]
                                });
                            });

                            [{
                                password: '',
                                description: 'empty string'
                            }, {
                                password: null,
                                description: 'null'
                            }, {
                                password: undefined,
                                description: 'undefined'
                            }].forEach((passwordTestScenario) => {
                                [{
                                    email: '',
                                    description: 'empty string'
                                }, {
                                    email: null,
                                    description: 'null'
                                }, {
                                    email: undefined,
                                    description: 'undefined'
                                }].forEach((emailTestScenario) => {
                                    it(`should call update on modal with correct parameters when loginChange is called with ${loginTestScenario.description} login, earlier passwordChange was called with ${passwordTestScenario.password} password and emailChange was called with ${emailTestScenario.email} email`, () => {
                                        // given
                                        params.passwordChange(passwordTestScenario.password as string);
                                        params.emailChange(emailTestScenario.email as string);
                                        update.mockReset();

                                        // when
                                        params.loginChange(loginTestScenario.login as string);

                                        // then
                                        expect(update).toHaveBeenCalledWith({
                                            bodyParams: {
                                                login: loginTestScenario.login,
                                                password: passwordTestScenario.password,
                                                email: emailTestScenario.email
                                            },
                                            rightButtons: [{
                                                disabled: true,
                                                label: 'TOP_BAR.SIGN_UP_BUTTON',
                                                onClick: expect.any(Function)
                                            }]
                                        });
                                    });
                                });
                            });
                        });

                        [{
                            login: '',
                            description: 'empty string'
                        }, {
                            login: null,
                            description: 'null'
                        }, {
                            login: undefined,
                            description: 'undefined'
                        }].forEach((loginTestScenario) => {
                            it(`should call update on modal with correct parameters when loginChange is called with ${loginTestScenario.description} login, earlier passwordChange was called with defined password and emailChange was called with defined email`, () => {
                                // given
                                const password = 'Some password';
                                params.passwordChange(password);
                                const email = 'Some email';
                                params.emailChange(email);
                                update.mockReset();

                                // when
                                params.loginChange(loginTestScenario.login as string);

                                // then
                                expect(update).toHaveBeenCalledWith({
                                    bodyParams: {
                                        login: loginTestScenario.login,
                                        password,
                                        email
                                    },
                                    rightButtons: [{
                                        disabled: true,
                                        label: 'TOP_BAR.SIGN_UP_BUTTON',
                                        onClick: expect.any(Function)
                                    }]
                                });
                            });
                        });

                        it(`should call update on modal with correct parameters when loginChange is called with defined login, earlier passwordChange was called with defined password and emailChange was called with defined email`, () => {
                            // given
                            const password = 'Some password';
                            params.passwordChange(password);
                            const email = 'Some email';
                            params.emailChange(email);
                            const login = 'Some login';
                            update.mockReset();

                            // when
                            params.loginChange(login);

                            // then
                            expect(update).toHaveBeenCalledWith({
                                bodyParams: {
                                    login,
                                    password,
                                    email
                                },
                                rightButtons: [{
                                    disabled: false,
                                    label: 'TOP_BAR.SIGN_UP_BUTTON',
                                    onClick: expect.any(Function)
                                }]
                            });
                        });

                        describe('login button onClick', () => {
                            let mockedUserService: MaybeMocked<typeof UserService>;
                            const login = 'Some login';

                            beforeEach(() => {
                                mockedUserService = mocked(UserService);
                            });

                            it('should call UserService.login with correct parameters if passwordChange was not called earlier', () => {
                                // given
                                params.loginChange(login);
                                mockedUserService.login.mockReturnValue(new Promise(() => {}))

                                // when
                                update.mock.calls[0][0]?.rightButtons?.[0].onClick();

                                // then
                                expect(UserService.login).toHaveBeenCalledWith(login, '');
                            });

                            it('should call UserService.login with correct parameters if passwordChange was called earlier', () => {
                                // given
                                const password = 'Some password';
                                params.passwordChange(password);
                                update.mockReset();
                                params.loginChange(login);
                                mockedUserService.login.mockReturnValue(new Promise(() => {}))

                                // when
                                update.mock.calls[0][0]?.rightButtons?.[0].onClick();

                                // then
                                expect(UserService.login).toHaveBeenCalledWith(login, password);
                            });

                            describe('UserService.login handler', () => {
                                let resolveLogin: (value: string) => void;

                                beforeEach(() => {
                                    resolveLogin = () => {};
                                    mockedUserService.login.mockReturnValue(new Promise((resolve) => {
                                        resolveLogin = resolve;
                                    }))
                                });

                                it('should call close on modal',  async () => {
                                    // given
                                    params.loginChange(login);
                                    update.mock.calls[0][0]?.rightButtons?.[0].onClick();

                                    // when
                                    await resolveLogin('');

                                    // then
                                    expect(close).toHaveBeenCalled();
                                });

                                [{
                                    login: 'Some login',
                                    description: 'defined'
                                }, {
                                    login: '',
                                    description: 'empty string'
                                }, {
                                    login: null,
                                    description: 'null'
                                }, {
                                    login: undefined,
                                    description: 'undefined'
                                }].forEach((loginTestScenario) => {
                                    it(`should call update on modal with correct parameters when loginChange is called with ${loginTestScenario.description} login and password is default`, async () => {
                                        // given
                                        params.loginChange(loginTestScenario.login as string);
                                        update.mock.calls[0][0]?.rightButtons?.[0].onClick();
                                        update.mockReset();

                                        // when
                                        await resolveLogin('');

                                        // then
                                        expect(update).toHaveBeenCalledWith({
                                            bodyParams: {
                                                login: '',
                                                password: ''
                                            },
                                            rightButtons: [{
                                                disabled: true,
                                                label: 'TOP_BAR.LOGIN_BUTTON',
                                                onClick: expect.any(Function)
                                            }]
                                        });
                                    });

                                    [{
                                        password: 'Some password',
                                        description: 'defined'
                                    }, {
                                        password: '',
                                        description: 'empty string'
                                    }, {
                                        password: null,
                                        description: 'null'
                                    }, {
                                        password: undefined,
                                        description: 'undefined'
                                    }].forEach((passwordTestScenario) => {
                                        it(`should call update on modal with correct parameters when loginChange is called with ${loginTestScenario.description} login and passwordChange is called with ${passwordTestScenario.password} password`, async () => {
                                            // given
                                            params.passwordChange(passwordTestScenario.password as string);
                                            update.mockReset();
                                            params.loginChange(loginTestScenario.login as string);
                                            update.mock.calls[0][0]?.rightButtons?.[0].onClick();
                                            update.mockReset();

                                            // when
                                            await resolveLogin('');

                                            // then
                                            expect(update).toHaveBeenCalledWith({
                                                bodyParams: {
                                                    login: '',
                                                    password: ''
                                                },
                                                rightButtons: [{
                                                    disabled: true,
                                                    label: 'TOP_BAR.LOGIN_BUTTON',
                                                    onClick: expect.any(Function)
                                                }]
                                            });
                                        });
                                    });
                                });

                                it('should call UserService.login with correct parameters if passwordChange was not called earlier', async () => {
                                    // given
                                    params.loginChange(login);
                                    update.mock.calls[0][0]?.rightButtons?.[0].onClick();
                                    update.mockReset();
                                    await resolveLogin('');
                                    mockedUserService.login.mockReset();
                                    mockedUserService.login.mockReturnValue(new Promise(() => {}));

                                    // when
                                    update.mock.calls[0][0]?.rightButtons?.[0].onClick();

                                    // then
                                    expect(UserService.login).toHaveBeenCalledWith('', '');
                                });

                                it('should call UserService.login with correct parameters if passwordChange was called earlier', async () => {
                                    // given
                                    params.passwordChange('Some password');
                                    update.mockReset();
                                    params.loginChange(login);
                                    update.mock.calls[0][0]?.rightButtons?.[0].onClick();
                                    update.mockReset();
                                    await resolveLogin('');
                                    mockedUserService.login.mockReset();
                                    mockedUserService.login.mockReturnValue(new Promise(() => {}));

                                    // when
                                    update.mock.calls[0][0]?.rightButtons?.[0].onClick();

                                    // then
                                    expect(UserService.login).toHaveBeenCalledWith('', '');
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});