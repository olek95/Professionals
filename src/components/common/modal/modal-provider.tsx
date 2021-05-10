import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { ModalConfiguration } from './modal-configuration';
import { ModalContext } from './modal-context';
import Modal from './modal';
import { KeyboardKey } from '../../../models/common/keyboard-key/keyboard-key.enum';

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
  const { onEscPressed, onEnterPressed } = { ...finalConfiguration };
  const onEscPress = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === KeyboardKey.ESCAPE) {
        close();
        if (onEscPressed) {
          onEscPressed();
        }
      }
    },
    [close, onEscPressed]
  );
  const onEnterPress = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === KeyboardKey.ENTER && onEnterPressed) {
        onEnterPressed();
      }
    },
    [onEnterPressed]
  );
  useEffect(() => updateKeyDownEventListener(onEscPress), [onEscPress]);
  useEffect(() => updateKeyDownEventListener(onEnterPress), [onEnterPress]);
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

const updateKeyDownEventListener = (
  eventHandler: (event: KeyboardEvent) => void
) => {
  document.addEventListener('keydown', eventHandler);
  return () => document.removeEventListener('keydown', eventHandler);
};
