export interface LoginProps {
  login: string;
  loginChange: (login: string) => void;
  password: string;
  passwordChange: (password: string) => void;
}
