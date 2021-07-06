export interface RegistrationProps {
  email: string;
  emailChange: (email: string) => void;
  login: string;
  loginChange: (login: string) => void;
  password: string;
  passwordChange: (password: string) => void;
}
