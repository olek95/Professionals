import i18next from 'i18next';

export class FieldValidator {
  private static readonly EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  static validateRequire(value: string): string {
    return value.trim() ? '' : i18next.t('COMMON.REQUIRED_ERROR');
  }

  static validateEmail(email: string): string {
    return !FieldValidator.validateRequire(email) &&
      FieldValidator.EMAIL_REGEX.test(email.toLowerCase())
      ? ''
      : i18next.t('COMMON.EMAIL_ERROR');
  }
}
