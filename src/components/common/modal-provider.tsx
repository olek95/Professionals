import React, { PropsWithChildren, useCallback, useState } from 'react';
import { ModalConfiguration } from './modal-configuration';
import { ModalContext } from './modal-context';
import Modal from './modal';

export const ModalProvider = <T extends {}>(props: PropsWithChildren<{}>) => {
  const [configuration, setConfiguration] = useState<ModalConfiguration<T>>();
  const [updatedConfiguration, setUpdatedConfiguration] = useState<
    Partial<ModalConfiguration<Partial<T>>>
  >();
  const finalConfiguration = configuration
    ? ({
        ...configuration,
        ...updatedConfiguration,
        bodyParams: {
          ...configuration.bodyParams,
          ...updatedConfiguration?.bodyParams,
        },
      } as ModalConfiguration<T>)
    : undefined;
  const Body = finalConfiguration?.body as React.ComponentType<T>;
  const close = useCallback(() => {
    setConfiguration(undefined);
    setUpdatedConfiguration(undefined);
  }, []);
  return (
    <ModalContext.Provider
      value={{
        configure: setConfiguration,
        update: setUpdatedConfiguration,
        close: close,
      }}
    >
      {finalConfiguration && (
        <Modal
          close={close}
          title={finalConfiguration.title}
          leftButtons={finalConfiguration.leftButtons}
          rightButtons={finalConfiguration.rightButtons}
        >
          <Body {...finalConfiguration.bodyParams}></Body>
        </Modal>
      )}
      {props.children}
    </ModalContext.Provider>
  );
};
