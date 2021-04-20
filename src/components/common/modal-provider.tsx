import React, { PropsWithChildren, useState } from 'react';
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
  const BodyComponent = finalConfiguration?.body as React.ComponentType<T>;
  return (
    <ModalContext.Provider
      value={{ configure: setConfiguration, update: setUpdatedConfiguration }}
    >
      {finalConfiguration && (
        <Modal
          title={finalConfiguration.title}
          leftButtons={finalConfiguration.leftButtons}
          rightButtons={finalConfiguration.rightButtons}
        >
          <BodyComponent {...finalConfiguration.bodyParams}></BodyComponent>
        </Modal>
      )}
      {props.children}
    </ModalContext.Provider>
  );
};
