export interface RegistrationProps {
  login: string;
  loginChange: (login: string) => void;
  password: string;
  passwordChange: (password: string) => void;
}
