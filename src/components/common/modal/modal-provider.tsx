import {
  ComponentType,
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { KeyboardKey } from '../../../models/common/keyboard-key/keyboard-key';
import Modal from './modal';
import { ModalConfiguration } from './modal-configuration';
import { ModalContext } from './modal-context';

export const ModalProvider = <T extends {}>(
  props: PropsWithChildren<{}>
): JSX.Element => {
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
  const Body = finalConfiguration?.body as ComponentType<T>;
  const close = useCallback(() => {
    setConfiguration(undefined);
    setUpdatedConfiguration(undefined);
  }, []);
  const { onCancel, onEnterPressed } = { ...finalConfiguration };
  const closeAndUpdateModal = useCallback(() => {
    close();
    if (onCancel) {
      onCancel();
    }
  }, [close, onCancel]);
  const onEscPress = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === KeyboardKey.ESCAPE) {
        closeAndUpdateModal();
      }
    },
    [closeAndUpdateModal]
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
          close={closeAndUpdateModal}
          title={finalConfiguration.title}
          leftButtons={finalConfiguration.leftButtons}
          rightButtons={finalConfiguration.rightButtons}
        >
          <Body {...finalConfiguration.bodyParams} />
        </Modal>
      )}
      {props.children}
    </ModalContext.Provider>
  );
};

const updateKeyDownEventListener = (
  eventHandler: (event: KeyboardEvent) => void
): (() => void) => {
  document.addEventListener('keydown', eventHandler);
  return () => document.removeEventListener('keydown', eventHandler);
};
