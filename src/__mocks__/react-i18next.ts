import { i18n } from 'i18next';
import * as React from 'react';
import { TFunction, WithTranslation } from 'react-i18next';

export const t = jest.fn((key: string) => key);

export const withTranslation = () => <
  C extends React.ComponentType<React.ComponentProps<C>>
>(
  Component: C
): C & WithTranslation => {
  (Component.defaultProps as Partial<C> & WithTranslation) = {
    ...Component.defaultProps,
    t: t as TFunction,
    tReady: true,
    i18n: {} as i18n,
  } as Partial<C> & WithTranslation;
  return Component as C & WithTranslation;
};
