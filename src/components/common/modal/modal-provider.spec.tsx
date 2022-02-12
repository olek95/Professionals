import {
  fireEvent,
  getAllByTestId,
  queryAllByTestId,
  render,
} from '@testing-library/react';
import React, { ProviderProps } from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { MaybeMocked } from 'ts-jest/dist/utils/testing';
import { mocked } from 'ts-jest/utils';
import { Button } from '../../../models/common/button/button';
import { KeyboardKey } from '../../../models/common/keyboard-key/keyboard-key';
import Modal from './modal';
import { ModalContext } from './modal-context';
import { ModalContextProps } from './modal-context-props';
import { ModalProvider } from './modal-provider';

jest.mock('./modal');
jest.mock('./modal-context', () => {
  return {
    ModalContext: {
      Provider: (
        props: ProviderProps<ModalContextProps<any>>
      ): React.ReactNode => {
        return props.children;
      },
    },
  };
});

describe('ModalProvider', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
  });

  describe('ModalContext.Provider', () => {
    let mockedModalContext: MaybeMocked<typeof ModalContext>;
    let modalContextProviderSpy: jest.SpiedFunction<
      (props: ProviderProps<ModalContextProps<any>>) => React.ReactNode
    >;

    beforeEach(() => {
      mockedModalContext = mocked(ModalContext);
      modalContextProviderSpy = jest.spyOn(mockedModalContext, 'Provider');
    });

    it('should be rendered', () => {
      // given
      const modalContextProviderId = 'modal-context-provider';
      modalContextProviderSpy.mockReturnValue(
        <div data-testid={modalContextProviderId} />
      );

      // when
      act(() => {
        ReactDOM.render(<ModalProvider />, container);
      });

      // then
      expect(getAllByTestId(container, modalContextProviderId)).toHaveLength(1);
    });

    it('should have assigned configure function', () => {
      // when
      act(() => {
        ReactDOM.render(<ModalProvider />, container);
      });

      // then
      expect(
        modalContextProviderSpy.mock.calls[0][0].value.configure
      ).toBeDefined();
    });

    it('should have assigned update function', () => {
      // when
      act(() => {
        ReactDOM.render(<ModalProvider />, container);
      });

      // then
      expect(
        modalContextProviderSpy.mock.calls[0][0].value.update
      ).toBeDefined();
    });

    it('should have assigned close function', () => {
      // given
      const close = jest.fn();
      jest
        .spyOn(React, 'useCallback')
        .mockReturnValueOnce(close)
        .mockReturnValue(jest.fn());

      // when
      act(() => {
        ReactDOM.render(<ModalProvider />, container);
      });

      // then
      expect(modalContextProviderSpy.mock.calls[0][0].value.close).toBe(close);
    });

    it('should have assigned the same close function when children are changed', () => {
      // given
      const modalProvider = render(
        <ModalProvider>
          <div />
        </ModalProvider>
      );

      // when
      modalProvider.rerender(
        <ModalProvider>
          <span />
        </ModalProvider>
      );

      // then
      const close = modalContextProviderSpy.mock.calls[0][0].value.close;
      expect(close).toBeDefined();
      expect(close).toBe(modalContextProviderSpy.mock.calls[1][0].value.close);
    });

    describe('close', () => {
      it('should remove modal', () => {
        // given
        const modalId = 'modal';
        jest
          .spyOn(Modal.prototype, 'render')
          .mockReturnValue(<div data-testid={modalId} />);
        act(() => {
          ReactDOM.render(<ModalProvider />, container);
        });
        act(() => {
          mockedModalContext.Provider.mock.calls[0][0].value.configure({
            body: () => <div />,
            bodyParams: {},
            leftButtons: [],
            rightButtons: [],
            title: '',
          });
        });

        // when
        act(() => {
          modalContextProviderSpy.mock.calls[0][0].value.close();
        });

        // then
        expect(queryAllByTestId(container, modalId)).toHaveLength(0);
      });
    });

    describe('Modal', () => {
      let mockedModal: MaybeMocked<typeof Modal>;

      beforeEach(() => {
        mockedModal = mocked(Modal);
      });

      it('should be rendered if configure has been called', () => {
        // given
        const modalId = 'modal';
        jest
          .spyOn(Modal.prototype, 'render')
          .mockReturnValue(<div data-testid={modalId} />);
        act(() => {
          ReactDOM.render(<ModalProvider />, container);
        });

        // when
        act(() => {
          mockedModalContext.Provider.mock.calls[0][0].value.configure({
            body: () => <div />,
            bodyParams: {},
            leftButtons: [],
            rightButtons: [],
            title: '',
          });
        });

        // then
        expect(queryAllByTestId(container, modalId)).toHaveLength(1);
      });

      it('should not be rendered if configure has not been called', () => {
        // given
        const modalId = 'modal';
        jest
          .spyOn(Modal.prototype, 'render')
          .mockReturnValue(<div data-testid={modalId} />);

        // when
        act(() => {
          ReactDOM.render(<ModalProvider />, container);
        });

        // then
        expect(queryAllByTestId(container, modalId)).toHaveLength(0);
      });

      it('should not be rendered if configure has been called with undefined parameter', () => {
        // given
        const modalId = 'modal';
        jest
          .spyOn(Modal.prototype, 'render')
          .mockReturnValue(<div data-testid={modalId} />);
        act(() => {
          ReactDOM.render(<ModalProvider />, container);
          mockedModalContext.Provider.mock.calls[0][0].value.configure({
            body: () => <div />,
            bodyParams: {},
            leftButtons: [],
            rightButtons: [],
            title: '',
          });
        });

        // when
        act(() => {
          mockedModalContext.Provider.mock.calls[0][0].value.configure(
            undefined
          );
        });

        // then
        expect(queryAllByTestId(container, modalId)).toHaveLength(0);
      });

      it('should have assigned correct close function', () => {
        // given
        const close = jest.fn();
        const otherFunction = jest.fn();
        jest
          .spyOn(React, 'useCallback')
          .mockReturnValueOnce(otherFunction)
          .mockReturnValueOnce(close)
          .mockReturnValue(otherFunction)
          .mockReturnValueOnce(otherFunction)
          .mockReturnValueOnce(otherFunction)
          .mockReturnValueOnce(otherFunction)
          .mockReturnValueOnce(close)
          .mockReturnValue(otherFunction);
        act(() => {
          ReactDOM.render(<ModalProvider />, container);
        });

        // when
        act(() => {
          mockedModalContext.Provider.mock.calls[0][0].value.configure({
            body: () => <div />,
            bodyParams: {},
            leftButtons: [],
            rightButtons: [],
            title: '',
          });
        });

        // then
        expect(mockedModal.mock.instances[0]?.props.close).toBe(close);
      });

      it('should have assigned different close function if passed different onCancel function by configure function', () => {
        // given
        act(() => {
          ReactDOM.render(<ModalProvider />, container);
        });
        const configure =
          mockedModalContext.Provider.mock.calls[0][0].value.configure;
        act(() => {
          configure({
            body: () => <div />,
            bodyParams: {},
            leftButtons: [],
            rightButtons: [],
            title: '',
            onCancel: () => {},
          });
        });
        const closeBefore = mockedModal.mock.instances[0]?.props.close;

        // when
        act(() => {
          configure({
            body: () => <div />,
            bodyParams: {},
            leftButtons: [],
            rightButtons: [],
            title: '',
            onCancel: () => {},
          });
        });

        // then
        expect(closeBefore).toBeDefined();
        const close = mockedModal.mock.instances[0]?.props.close;
        expect(close).toBeDefined();
        expect(closeBefore).not.toEqual(close);
      });

      it('should have assigned the same close function if children have been changed', () => {
        // given
        const modalProvider = render(
          <ModalProvider>
            <div />
          </ModalProvider>
        );
        const configure =
          mockedModalContext.Provider.mock.calls[0][0].value.configure;
        act(() => {
          configure({
            body: () => <div />,
            bodyParams: {},
            leftButtons: [],
            rightButtons: [],
            title: '',
            onCancel: () => {},
          });
        });
        const closeBefore = mockedModal.mock.instances[0]?.props.close;

        // when
        modalProvider.rerender(
          <ModalProvider>
            <span />
          </ModalProvider>
        );

        // then
        expect(closeBefore).toBeDefined();
        const close = mockedModal.mock.instances[0]?.props.close;
        expect(closeBefore).toBe(close);
      });

      describe('parameters passed by configure function', () => {
        beforeEach(() => {
          act(() => {
            ReactDOM.render(<ModalProvider />, container);
          });
        });

        it('should have assigned title', () => {
          // given
          const title = 'Some title';

          // when
          act(() => {
            mockedModalContext.Provider.mock.calls[0][0].value.configure({
              body: () => <div />,
              bodyParams: {},
              leftButtons: [],
              rightButtons: [],
              title,
            });
          });

          // then
          expect(mockedModal.mock.instances[0]?.props.title).toBe(title);
        });

        it('should have assigned leftButtons', () => {
          // given
          const onClick = () => {};
          const leftButtons: Button[] = [
            {
              onClick,
              label: 'Some label',
            },
          ];

          // when
          act(() => {
            mockedModalContext.Provider.mock.calls[0][0].value.configure({
              body: () => <div />,
              bodyParams: {},
              leftButtons,
              rightButtons: [],
              title: '',
            });
          });

          // then
          expect(mockedModal.mock.instances[0]?.props.leftButtons).toEqual([
            {
              onClick,
              label: 'Some label',
            },
          ]);
        });

        it('should have assigned rightButtons', () => {
          // given
          const onClick = () => {};
          const rightButtons: Button[] = [
            {
              onClick,
              label: 'Some label',
            },
          ];

          // when
          act(() => {
            mockedModalContext.Provider.mock.calls[0][0].value.configure({
              body: () => <div />,
              bodyParams: {},
              leftButtons: [],
              rightButtons,
              title: '',
            });
          });

          // then
          expect(mockedModal.mock.instances[0]?.props.rightButtons).toEqual([
            {
              onClick,
              label: 'Some label',
            },
          ]);
        });
      });

      describe('parameters passed by update function', () => {
        beforeEach(() => {
          act(() => {
            ReactDOM.render(<ModalProvider />, container);
          });
        });

        it('should have assigned title', () => {
          // given
          const modalContextValue =
            mockedModalContext.Provider.mock.calls[0][0].value;
          act(() => {
            modalContextValue.configure({
              body: () => <div />,
              bodyParams: {},
              leftButtons: [],
              rightButtons: [],
              title: 'Some title',
            });
          });
          const title = 'Some other title';

          // when
          act(() => {
            modalContextValue.update({
              title,
            });
          });

          // then
          expect(mockedModal.mock.instances[0]?.props.title).toBe(title);
        });

        it('should have assigned leftButtons', () => {
          // given
          const onClick = () => {};
          const modalContextValue =
            mockedModalContext.Provider.mock.calls[0][0].value;
          act(() => {
            modalContextValue.configure({
              body: () => <div />,
              bodyParams: {},
              leftButtons: [
                {
                  onClick: () => {},
                  label: 'Some label',
                },
              ],
              rightButtons: [],
              title: '',
            });
          });
          const leftButtons: Button[] = [
            {
              onClick,
              label: 'Some other label',
            },
          ];

          // when
          act(() => {
            modalContextValue.update({
              leftButtons,
            });
          });

          // then
          expect(mockedModal.mock.instances[0]?.props.leftButtons).toEqual([
            {
              onClick,
              label: 'Some other label',
            },
          ]);
        });

        it('should have assigned rightButtons', () => {
          // given
          const onClick = () => {};
          const modalContextValue =
            mockedModalContext.Provider.mock.calls[0][0].value;
          act(() => {
            modalContextValue.configure({
              body: () => <div />,
              bodyParams: {},
              leftButtons: [],
              rightButtons: [
                {
                  onClick: () => {},
                  label: 'Some label',
                },
              ],
              title: '',
            });
          });
          const rightButtons: Button[] = [
            {
              onClick,
              label: 'Some other label',
            },
          ];

          // when
          act(() => {
            modalContextValue.update({
              rightButtons,
            });
          });

          // then
          expect(mockedModal.mock.instances[0]?.props.rightButtons).toEqual([
            {
              onClick,
              label: 'Some other label',
            },
          ]);
        });
      });

      describe('close', () => {
        it('should remove modal', () => {
          // given
          const modalId = 'modal';
          jest
            .spyOn(Modal.prototype, 'render')
            .mockReturnValue(<div data-testid={modalId} />);
          act(() => {
            ReactDOM.render(<ModalProvider />, container);
          });
          act(() => {
            mockedModalContext.Provider.mock.calls[0][0].value.configure({
              body: () => <div />,
              bodyParams: {},
              leftButtons: [],
              rightButtons: [],
              title: '',
            });
          });

          // when
          act(() => {
            mockedModal.mock.instances[0]?.props.close();
          });

          // then
          expect(queryAllByTestId(container, modalId)).toHaveLength(0);
        });

        it('should call onCancel function passed by configure function', () => {
          // given
          const modalId = 'modal';
          jest
            .spyOn(Modal.prototype, 'render')
            .mockReturnValue(<div data-testid={modalId} />);
          act(() => {
            ReactDOM.render(<ModalProvider />, container);
          });
          const onCancel = jest.fn();
          act(() => {
            mockedModalContext.Provider.mock.calls[0][0].value.configure({
              body: () => <div />,
              bodyParams: {},
              leftButtons: [],
              rightButtons: [],
              title: '',
              onCancel,
            });
          });

          // when
          act(() => {
            mockedModal.mock.instances[0]?.props.close();
          });

          // then
          expect(onCancel).toHaveBeenCalled();
        });

        it('should call onCancel function passed by update function', () => {
          // given
          const modalId = 'modal';
          jest
            .spyOn(Modal.prototype, 'render')
            .mockReturnValue(<div data-testid={modalId} />);
          act(() => {
            ReactDOM.render(<ModalProvider />, container);
          });
          const onCancel = jest.fn();
          act(() => {
            mockedModalContext.Provider.mock.calls[0][0].value.configure({
              body: () => <div />,
              bodyParams: {},
              leftButtons: [],
              rightButtons: [],
              title: '',
              onCancel: () => {},
            });
            mockedModalContext.Provider.mock.calls[0][0].value.update({
              onCancel,
            });
          });

          // when
          act(() => {
            mockedModal.mock.instances[0]?.props.close();
          });

          // then
          expect(onCancel).toHaveBeenCalled();
        });
      });

      describe('Body', () => {
        describe('parameters passed by configure function', () => {
          beforeEach(() => {
            jest
              .spyOn(Modal.prototype, 'render')
              .mockImplementation(
                () => mockedModal.mock.instances[0]?.props.children
              );
            act(() => {
              ReactDOM.render(<ModalProvider />, container);
            });
          });

          it('should be rendered', () => {
            // given
            const bodyId = 'body';
            const Body = () => <div data-testid={bodyId} />;

            // when
            act(() => {
              mockedModalContext.Provider.mock.calls[0][0].value.configure({
                body: Body,
                bodyParams: {},
                leftButtons: [],
                rightButtons: [],
                title: '',
              });
            });

            // then
            expect(queryAllByTestId(container, bodyId)).toHaveLength(1);
          });

          it('should have assigned correct body params', () => {
            // given
            const Body = jest.fn(() => <div />);
            const bodyParams = {
              field1: 1,
              field2: 'Some string',
            };

            // when
            act(() => {
              mockedModalContext.Provider.mock.calls[0][0].value.configure({
                body: Body,
                bodyParams,
                leftButtons: [],
                rightButtons: [],
                title: '',
              });
            });

            // then
            expect(Body).toHaveBeenCalledWith(bodyParams, {});
          });
        });

        describe('parameters passed by update function', () => {
          beforeEach(() => {
            jest
              .spyOn(Modal.prototype, 'render')
              .mockImplementation(
                () => mockedModal.mock.instances[0]?.props.children
              );
            act(() => {
              ReactDOM.render(<ModalProvider />, container);
            });
          });

          it('should be rendered', () => {
            // given
            const bodyId = 'body';
            const Body = () => <div data-testid={bodyId} />;
            const modalContextValue =
              mockedModalContext.Provider.mock.calls[0][0].value;
            act(() => {
              modalContextValue.configure({
                body: () => <span />,
                bodyParams: {},
                leftButtons: [],
                rightButtons: [],
                title: '',
              });
            });

            // when
            act(() => {
              modalContextValue.update({
                body: Body,
              });
            });

            // then
            expect(queryAllByTestId(container, bodyId)).toHaveLength(1);
          });

          it('should have assigned correct body params', () => {
            // given
            const Body = jest.fn(() => <div />);
            const bodyParams1 = {
              field1: 1,
              field2: 'Some string',
            };
            const modalContextValue =
              mockedModalContext.Provider.mock.calls[0][0].value;
            act(() => {
              modalContextValue.configure({
                body: Body,
                bodyParams: bodyParams1,
                leftButtons: [],
                rightButtons: [],
                title: '',
              });
            });
            const bodyParams2 = {
              field3: 2,
              field4: 'Some value',
            };

            // when
            act(() => {
              modalContextValue.update({
                bodyParams: bodyParams2,
              });
            });

            // then
            expect(Body).toHaveBeenCalledWith(
              { ...bodyParams1, ...bodyParams2 },
              {}
            );
          });
        });
      });
    });

    describe('Children', () => {
      it('should be rendered as passed children', () => {
        // given
        const child1 = 'child1';
        const child2 = 'child2';

        // when
        act(() => {
          ReactDOM.render(
            <ModalProvider>
              <div data-testid={child1} />
              <span data-testid={child2} />
            </ModalProvider>,
            container
          );
        });

        // then
        expect(queryAllByTestId(container, child1)).toHaveLength(1);
        expect(queryAllByTestId(container, child2)).toHaveLength(1);
      });
    });
  });

  describe('onEscPress', () => {
    let mockedModalContext: MaybeMocked<typeof ModalContext>;
    let mockedModal: MaybeMocked<typeof Modal>;

    beforeEach(() => {
      mockedModalContext = mocked(ModalContext);
      jest.spyOn(mockedModalContext, 'Provider');
      mockedModal = mocked(Modal);
    });

    it('should register function returned by useCallback on keydown event', () => {
      // given
      const useCallbackSpy = jest.spyOn(React, 'useCallback');
      jest.spyOn(document, 'addEventListener');

      // when
      act(() => {
        ReactDOM.render(<ModalProvider />, container);
      });

      // then
      expect(document.addEventListener).toHaveBeenCalledWith(
        'keydown',
        useCallbackSpy.mock.results[2].value
      );
    });

    it('should register different function returned by useCallback on keydown event if onCancel function is passed by configure function', () => {
      // given
      const useCallbackSpy = jest.spyOn(React, 'useCallback');
      jest.spyOn(document, 'addEventListener');
      act(() => {
        ReactDOM.render(<ModalProvider />, container);
      });

      // when
      act(() => {
        mockedModalContext.Provider.mock.calls[0][0].value.configure({
          body: () => <span />,
          bodyParams: {},
          leftButtons: [],
          rightButtons: [],
          title: '',
          onCancel: () => {},
        });
      });

      // then
      const onEscPress = useCallbackSpy.mock.results[6].value;
      expect(document.addEventListener).toHaveBeenCalledWith(
        'keydown',
        onEscPress
      );
      expect(useCallbackSpy.mock.results[2].value).not.toEqual(onEscPress);
    });

    it('should register different function returned by useCallback on keydown event if onCancel function is passed by update function', () => {
      // given
      const useCallbackSpy = jest.spyOn(React, 'useCallback');
      jest.spyOn(document, 'addEventListener');
      let modalContextValue: ModalContextProps<any>;
      act(() => {
        ReactDOM.render(<ModalProvider />, container);
        modalContextValue = mockedModalContext.Provider.mock.calls[0][0].value;
        modalContextValue.configure({
          body: () => <span />,
          bodyParams: {},
          leftButtons: [],
          rightButtons: [],
          title: '',
          onCancel: () => {},
        });
      });

      // when
      act(() => {
        modalContextValue.update({
          onCancel: () => {},
        });
      });

      // then
      const onEscPress = useCallbackSpy.mock.results[10].value;
      expect(document.addEventListener).toHaveBeenCalledWith(
        'keydown',
        onEscPress
      );
      expect(useCallbackSpy.mock.results[2].value).not.toEqual(onEscPress);
      expect(useCallbackSpy.mock.results[6].value).not.toEqual(onEscPress);
    });

    it('should register different function returned by useCallback on keydown event if modal context provider close function is called', () => {
      // given
      const useCallbackSpy = jest.spyOn(React, 'useCallback');
      jest.spyOn(document, 'addEventListener');
      let modalContextValue: ModalContextProps<any>;
      act(() => {
        ReactDOM.render(<ModalProvider />, container);
        modalContextValue = mockedModalContext.Provider.mock.calls[0][0].value;
        modalContextValue.configure({
          body: () => <span />,
          bodyParams: {},
          leftButtons: [],
          rightButtons: [],
          title: '',
          onCancel: () => {},
        });
      });

      // when
      act(() => {
        modalContextValue.close();
      });

      // then
      const onEscPress = useCallbackSpy.mock.results[10].value;
      expect(document.addEventListener).toHaveBeenCalledWith(
        'keydown',
        onEscPress
      );
      expect(useCallbackSpy.mock.results[2].value).not.toEqual(onEscPress);
      expect(useCallbackSpy.mock.results[6].value).not.toEqual(onEscPress);
    });

    it('should register different function returned by useCallback on keydown event if modal close function is called', () => {
      // given
      const useCallbackSpy = jest.spyOn(React, 'useCallback');
      jest.spyOn(document, 'addEventListener');
      let modalContextValue: ModalContextProps<any>;
      act(() => {
        ReactDOM.render(<ModalProvider />, container);
        modalContextValue = mockedModalContext.Provider.mock.calls[0][0].value;
        modalContextValue.configure({
          body: () => <span />,
          bodyParams: {},
          leftButtons: [],
          rightButtons: [],
          title: '',
          onCancel: () => {},
        });
      });

      // when
      act(() => {
        mockedModal.mock.instances[0]?.props.close();
      });

      // then
      const onEscPress = useCallbackSpy.mock.results[10].value;
      expect(document.addEventListener).toHaveBeenCalledWith(
        'keydown',
        onEscPress
      );
      expect(useCallbackSpy.mock.results[2].value).not.toEqual(onEscPress);
      expect(useCallbackSpy.mock.results[6].value).not.toEqual(onEscPress);
    });

    it('should call onCancel function passed by configure function if esc key was pressed', () => {
      // given
      const onCancel = jest.fn();
      act(() => {
        ReactDOM.render(<ModalProvider />, container);
        mockedModalContext.Provider.mock.calls[0][0].value.configure({
          body: () => <span />,
          bodyParams: {},
          leftButtons: [],
          rightButtons: [],
          title: '',
          onCancel,
        });
      });

      // when
      fireEvent.keyDown(document, {
        key: KeyboardKey.ESCAPE,
      });

      // then
      expect(onCancel).toHaveBeenCalled();
    });

    it('should not call onCancel function passed by configure function if different key than esc was pressed', () => {
      // given
      const onCancel = jest.fn();
      act(() => {
        ReactDOM.render(<ModalProvider />, container);
        mockedModalContext.Provider.mock.calls[0][0].value.configure({
          body: () => <span />,
          bodyParams: {},
          leftButtons: [],
          rightButtons: [],
          title: '',
          onCancel,
        });
      });

      // when
      fireEvent.keyDown(document, {
        key: KeyboardKey.ENTER,
      });

      // then
      expect(onCancel).not.toHaveBeenCalled();
    });

    it('should call onCancel function passed by update function if esc key was pressed', () => {
      // given
      const onCancel1 = jest.fn();
      const onCancel2 = jest.fn();
      act(() => {
        ReactDOM.render(<ModalProvider />, container);
        const modalContextValue =
          mockedModalContext.Provider.mock.calls[0][0].value;
        modalContextValue.configure({
          body: () => <span />,
          bodyParams: {},
          leftButtons: [],
          rightButtons: [],
          title: '',
          onCancel: onCancel1,
        });
        modalContextValue.update({
          onCancel: onCancel2,
        });
      });

      // when
      fireEvent.keyDown(document, {
        key: KeyboardKey.ESCAPE,
      });

      // then
      expect(onCancel1).not.toHaveBeenCalled();
      expect(onCancel2).toHaveBeenCalled();
    });

    it('should not call onCancel function passed by update function if different key than esc was pressed', () => {
      // given
      const onCancel1 = jest.fn();
      const onCancel2 = jest.fn();
      act(() => {
        ReactDOM.render(<ModalProvider />, container);
        const modalContextValue =
          mockedModalContext.Provider.mock.calls[0][0].value;
        modalContextValue.configure({
          body: () => <span />,
          bodyParams: {},
          leftButtons: [],
          rightButtons: [],
          title: '',
          onCancel: onCancel1,
        });
        modalContextValue.update({
          onCancel: onCancel2,
        });
      });

      // when
      fireEvent.keyDown(document, {
        key: KeyboardKey.ENTER,
      });

      // then
      expect(onCancel1).not.toHaveBeenCalled();
      expect(onCancel2).not.toHaveBeenCalled();
    });

    it('should remove modal if esc key was pressed', () => {
      // given
      const modalId = 'modal';
      jest
        .spyOn(Modal.prototype, 'render')
        .mockReturnValue(<div data-testid={modalId} />);
      act(() => {
        ReactDOM.render(<ModalProvider />, container);
        mockedModalContext.Provider.mock.calls[0][0].value.configure({
          body: () => <div />,
          bodyParams: {},
          leftButtons: [],
          rightButtons: [],
          title: '',
        });
      });

      // when
      fireEvent.keyDown(document, {
        key: KeyboardKey.ESCAPE,
      });

      // then
      expect(queryAllByTestId(container, modalId)).toHaveLength(0);
    });

    it('should not remove modal if different key than esc was pressed', () => {
      // given
      const modalId = 'modal';
      jest
        .spyOn(Modal.prototype, 'render')
        .mockReturnValue(<div data-testid={modalId} />);
      act(() => {
        ReactDOM.render(<ModalProvider />, container);
        mockedModalContext.Provider.mock.calls[0][0].value.configure({
          body: () => <div />,
          bodyParams: {},
          leftButtons: [],
          rightButtons: [],
          title: '',
        });
      });

      // when
      fireEvent.keyDown(document, {
        key: KeyboardKey.ENTER,
      });

      // then
      expect(queryAllByTestId(container, modalId)).toHaveLength(1);
    });

    it('should register different function returned by useCallback on keydown event if esc key was pressed', () => {
      // given
      const useCallbackSpy = jest.spyOn(React, 'useCallback');
      jest.spyOn(document, 'addEventListener');
      act(() => {
        ReactDOM.render(<ModalProvider />, container);
        mockedModalContext.Provider.mock.calls[0][0].value.configure({
          body: () => <div />,
          bodyParams: {},
          leftButtons: [],
          rightButtons: [],
          title: '',
          onCancel: () => {},
        });
      });

      // when
      fireEvent.keyDown(document, {
        key: KeyboardKey.ESCAPE,
      });

      // then
      const onEscPress = useCallbackSpy.mock.results[10].value;
      expect(document.addEventListener).toHaveBeenCalledWith(
        'keydown',
        onEscPress
      );
      expect(useCallbackSpy.mock.results[2].value).not.toEqual(onEscPress);
      expect(useCallbackSpy.mock.results[6].value).not.toEqual(onEscPress);
    });

    it('should register the same function returned by useCallback on keydown event if different key than esc was pressed', () => {
      // given
      const useCallbackSpy = jest.spyOn(React, 'useCallback');
      jest.spyOn(document, 'addEventListener');
      act(() => {
        ReactDOM.render(<ModalProvider />, container);
        mockedModalContext.Provider.mock.calls[0][0].value.configure({
          body: () => <div />,
          bodyParams: {},
          leftButtons: [],
          rightButtons: [],
          title: '',
          onCancel: () => {},
        });
      });

      // when
      fireEvent.keyDown(document, {
        key: KeyboardKey.ENTER,
      });

      // then
      const onEscPress = useCallbackSpy.mock.results[6].value;
      expect(document.addEventListener).toHaveBeenCalledWith(
        'keydown',
        onEscPress
      );
      expect(useCallbackSpy.mock.results[2].value).not.toEqual(onEscPress);
      expect(useCallbackSpy.mock.results[10]).toBeUndefined();
    });

    it('should unregister function used by keydown event if component is unmounted', () => {
      // given
      const useCallbackSpy = jest.spyOn(React, 'useCallback');
      act(() => {
        ReactDOM.render(<ModalProvider />, container);
      });
      jest.spyOn(document, 'removeEventListener');

      // when
      act(() => {
        ReactDOM.unmountComponentAtNode(container);
      });

      // then
      expect(document.removeEventListener).toHaveBeenCalledWith(
        'keydown',
        useCallbackSpy.mock.results[2].value
      );
    });

    it('should unregister function used by keydown event if onCancel function is passed by configure function', () => {
      // given
      const useCallbackSpy = jest.spyOn(React, 'useCallback');
      act(() => {
        ReactDOM.render(<ModalProvider />, container);
      });
      jest.spyOn(document, 'removeEventListener');

      // when
      act(() => {
        mockedModalContext.Provider.mock.calls[0][0].value.configure({
          body: () => <span />,
          bodyParams: {},
          leftButtons: [],
          rightButtons: [],
          title: '',
          onCancel: () => {},
        });
      });

      // then
      expect(document.removeEventListener).toHaveBeenCalledWith(
        'keydown',
        useCallbackSpy.mock.results[2].value
      );
      expect(document.removeEventListener).not.toHaveBeenCalledWith(
        'keydown',
        useCallbackSpy.mock.results[6].value
      );
    });

    it('should unregister function used by keydown event if onCancel function is passed by update function', () => {
      // given
      const useCallbackSpy = jest.spyOn(React, 'useCallback');
      let modalContextValue: ModalContextProps<any>;
      act(() => {
        ReactDOM.render(<ModalProvider />, container);
        modalContextValue = mockedModalContext.Provider.mock.calls[0][0].value;
        modalContextValue.configure({
          body: () => <span />,
          bodyParams: {},
          leftButtons: [],
          rightButtons: [],
          title: '',
          onCancel: () => {},
        });
      });
      jest.spyOn(document, 'removeEventListener');

      // when
      act(() => {
        modalContextValue.update({
          onCancel: () => {},
        });
      });

      // then
      expect(document.removeEventListener).toHaveBeenCalledWith(
        'keydown',
        useCallbackSpy.mock.results[6].value
      );
      expect(document.removeEventListener).not.toHaveBeenCalledWith(
        'keydown',
        useCallbackSpy.mock.results[10].value
      );
    });

    it('should unregister function used by keydown event if modal context provider close function is called', () => {
      // given
      const useCallbackSpy = jest.spyOn(React, 'useCallback');
      let modalContextValue: ModalContextProps<any>;
      act(() => {
        ReactDOM.render(<ModalProvider />, container);
        modalContextValue = mockedModalContext.Provider.mock.calls[0][0].value;
        modalContextValue.configure({
          body: () => <span />,
          bodyParams: {},
          leftButtons: [],
          rightButtons: [],
          title: '',
          onCancel: () => {},
        });
      });
      jest.spyOn(document, 'removeEventListener');

      // when
      act(() => {
        modalContextValue.close();
      });

      // then
      expect(document.removeEventListener).toHaveBeenCalledWith(
        'keydown',
        useCallbackSpy.mock.results[6].value
      );
      expect(document.removeEventListener).not.toHaveBeenCalledWith(
        'keydown',
        useCallbackSpy.mock.results[10].value
      );
    });

    it('should unregister function used by keydown event if modal close function is called', () => {
      // given
      const useCallbackSpy = jest.spyOn(React, 'useCallback');
      let modalContextValue: ModalContextProps<any>;
      act(() => {
        ReactDOM.render(<ModalProvider />, container);
        modalContextValue = mockedModalContext.Provider.mock.calls[0][0].value;
        modalContextValue.configure({
          body: () => <span />,
          bodyParams: {},
          leftButtons: [],
          rightButtons: [],
          title: '',
          onCancel: () => {},
        });
      });
      jest.spyOn(document, 'removeEventListener');

      // when
      act(() => {
        mockedModal.mock.instances[0]?.props.close();
      });

      // then
      expect(document.removeEventListener).toHaveBeenCalledWith(
        'keydown',
        useCallbackSpy.mock.results[6].value
      );
      expect(document.removeEventListener).not.toHaveBeenCalledWith(
        'keydown',
        useCallbackSpy.mock.results[10].value
      );
    });

    it('should unregister function used by keydown event if esc key was pressed', () => {
      // given
      const useCallbackSpy = jest.spyOn(React, 'useCallback');
      act(() => {
        ReactDOM.render(<ModalProvider />, container);
        mockedModalContext.Provider.mock.calls[0][0].value.configure({
          body: () => <div />,
          bodyParams: {},
          leftButtons: [],
          rightButtons: [],
          title: '',
          onCancel: () => {},
        });
      });
      jest.spyOn(document, 'removeEventListener');

      // when
      fireEvent.keyDown(document, {
        key: KeyboardKey.ESCAPE,
      });

      // then
      expect(document.removeEventListener).toHaveBeenCalledWith(
        'keydown',
        useCallbackSpy.mock.results[6].value
      );
      expect(document.removeEventListener).not.toHaveBeenCalledWith(
        'keydown',
        useCallbackSpy.mock.results[10].value
      );
    });

    it('should not unregister function used by keydown event if different key than esc was pressed', () => {
      // given
      act(() => {
        ReactDOM.render(<ModalProvider />, container);
        mockedModalContext.Provider.mock.calls[0][0].value.configure({
          body: () => <div />,
          bodyParams: {},
          leftButtons: [],
          rightButtons: [],
          title: '',
          onCancel: () => {},
        });
      });
      jest.spyOn(document, 'removeEventListener');

      // when
      fireEvent.keyDown(document, {
        key: KeyboardKey.ENTER,
      });

      // then
      expect(document.removeEventListener).not.toHaveBeenCalled();
    });
  });

  describe('onEnterPress', () => {
    let mockedModalContext: MaybeMocked<typeof ModalContext>;
    let mockedModal: MaybeMocked<typeof Modal>;

    beforeEach(() => {
      mockedModalContext = mocked(ModalContext);
      jest.spyOn(mockedModalContext, 'Provider');
      mockedModal = mocked(Modal);
    });

    it('should register function returned by useCallback on keydown event', () => {
      // given
      const useCallbackSpy = jest.spyOn(React, 'useCallback');
      jest.spyOn(document, 'addEventListener');

      // when
      act(() => {
        ReactDOM.render(<ModalProvider />, container);
      });

      // then
      expect(document.addEventListener).toHaveBeenCalledWith(
        'keydown',
        useCallbackSpy.mock.results[3].value
      );
    });

    it('should register different function returned by useCallback on keydown event if onEnterPressed function is passed by configure function', () => {
      // given
      const useCallbackSpy = jest.spyOn(React, 'useCallback');
      jest.spyOn(document, 'addEventListener');
      act(() => {
        ReactDOM.render(<ModalProvider />, container);
      });

      // when
      act(() => {
        mockedModalContext.Provider.mock.calls[0][0].value.configure({
          body: () => <span />,
          bodyParams: {},
          leftButtons: [],
          rightButtons: [],
          title: '',
          onEnterPressed: () => {},
        });
      });

      // then
      const onEscPress = useCallbackSpy.mock.results[7].value;
      expect(document.addEventListener).toHaveBeenCalledWith(
        'keydown',
        onEscPress
      );
      expect(useCallbackSpy.mock.results[3].value).not.toEqual(onEscPress);
    });

    it('should register different function returned by useCallback on keydown event if onEnterPressed function is passed by update function', () => {
      // given
      const useCallbackSpy = jest.spyOn(React, 'useCallback');
      jest.spyOn(document, 'addEventListener');
      let modalContextValue: ModalContextProps<any>;
      act(() => {
        ReactDOM.render(<ModalProvider />, container);
        modalContextValue = mockedModalContext.Provider.mock.calls[0][0].value;
        modalContextValue.configure({
          body: () => <span />,
          bodyParams: {},
          leftButtons: [],
          rightButtons: [],
          title: '',
          onEnterPressed: () => {},
        });
      });

      // when
      act(() => {
        modalContextValue.update({
          onEnterPressed: () => {},
        });
      });

      // then
      const onEscPress = useCallbackSpy.mock.results[11].value;
      expect(document.addEventListener).toHaveBeenCalledWith(
        'keydown',
        onEscPress
      );
      expect(useCallbackSpy.mock.results[3].value).not.toEqual(onEscPress);
      expect(useCallbackSpy.mock.results[7].value).not.toEqual(onEscPress);
    });

    it('should register different function returned by useCallback on keydown event if modal context provider close function is called', () => {
      // given
      const useCallbackSpy = jest.spyOn(React, 'useCallback');
      jest.spyOn(document, 'addEventListener');
      let modalContextValue: ModalContextProps<any>;
      act(() => {
        ReactDOM.render(<ModalProvider />, container);
        modalContextValue = mockedModalContext.Provider.mock.calls[0][0].value;
        modalContextValue.configure({
          body: () => <span />,
          bodyParams: {},
          leftButtons: [],
          rightButtons: [],
          title: '',
          onEnterPressed: () => {},
        });
      });

      // when
      act(() => {
        modalContextValue.close();
      });

      // then
      const onEscPress = useCallbackSpy.mock.results[11].value;
      expect(document.addEventListener).toHaveBeenCalledWith(
        'keydown',
        onEscPress
      );
      expect(useCallbackSpy.mock.results[3].value).not.toEqual(onEscPress);
      expect(useCallbackSpy.mock.results[7].value).not.toEqual(onEscPress);
    });

    it('should register different function returned by useCallback on keydown event if modal close function is called', () => {
      // given
      const useCallbackSpy = jest.spyOn(React, 'useCallback');
      jest.spyOn(document, 'addEventListener');
      let modalContextValue: ModalContextProps<any>;
      act(() => {
        ReactDOM.render(<ModalProvider />, container);
        modalContextValue = mockedModalContext.Provider.mock.calls[0][0].value;
        modalContextValue.configure({
          body: () => <span />,
          bodyParams: {},
          leftButtons: [],
          rightButtons: [],
          title: '',
          onEnterPressed: () => {},
        });
      });

      // when
      act(() => {
        mockedModal.mock.instances[0]?.props.close();
      });

      // then
      const onEscPress = useCallbackSpy.mock.results[11].value;
      expect(document.addEventListener).toHaveBeenCalledWith(
        'keydown',
        onEscPress
      );
      expect(useCallbackSpy.mock.results[3].value).not.toEqual(onEscPress);
      expect(useCallbackSpy.mock.results[7].value).not.toEqual(onEscPress);
    });

    it('should call onEnterPressed function passed by configure function if enter key was pressed', () => {
      // given
      const onEnterPressed = jest.fn();
      act(() => {
        ReactDOM.render(<ModalProvider />, container);
        mockedModalContext.Provider.mock.calls[0][0].value.configure({
          body: () => <span />,
          bodyParams: {},
          leftButtons: [],
          rightButtons: [],
          title: '',
          onEnterPressed,
        });
      });

      // when
      fireEvent.keyDown(document, {
        key: KeyboardKey.ENTER,
      });

      // then
      expect(onEnterPressed).toHaveBeenCalled();
    });

    it('should not call onEnterPressed function passed by configure function if different key than enter was pressed', () => {
      // given
      const onEnterPressed = jest.fn();
      act(() => {
        ReactDOM.render(<ModalProvider />, container);
        mockedModalContext.Provider.mock.calls[0][0].value.configure({
          body: () => <span />,
          bodyParams: {},
          leftButtons: [],
          rightButtons: [],
          title: '',
          onEnterPressed,
        });
      });

      // when
      fireEvent.keyDown(document, {
        key: KeyboardKey.ESCAPE,
      });

      // then
      expect(onEnterPressed).not.toHaveBeenCalled();
    });

    it('should call onEnterPressed function passed by update function if enter key was pressed', () => {
      // given
      const onEnterPressed1 = jest.fn();
      const onEnterPressed2 = jest.fn();
      act(() => {
        ReactDOM.render(<ModalProvider />, container);
        const modalContextValue =
          mockedModalContext.Provider.mock.calls[0][0].value;
        modalContextValue.configure({
          body: () => <span />,
          bodyParams: {},
          leftButtons: [],
          rightButtons: [],
          title: '',
          onEnterPressed: onEnterPressed1,
        });
        modalContextValue.update({
          onEnterPressed: onEnterPressed2,
        });
      });

      // when
      fireEvent.keyDown(document, {
        key: KeyboardKey.ENTER,
      });

      // then
      expect(onEnterPressed1).not.toHaveBeenCalled();
      expect(onEnterPressed2).toHaveBeenCalled();
    });

    it('should not call onEnterPressed function passed by update function if different key than enter was pressed', () => {
      // given
      const onEnterPressed1 = jest.fn();
      const onEnterPressed2 = jest.fn();
      act(() => {
        ReactDOM.render(<ModalProvider />, container);
        const modalContextValue =
          mockedModalContext.Provider.mock.calls[0][0].value;
        modalContextValue.configure({
          body: () => <span />,
          bodyParams: {},
          leftButtons: [],
          rightButtons: [],
          title: '',
          onEnterPressed: onEnterPressed1,
        });
        modalContextValue.update({
          onEnterPressed: onEnterPressed2,
        });
      });

      // when
      fireEvent.keyDown(document, {
        key: KeyboardKey.ESCAPE,
      });

      // then
      expect(onEnterPressed1).not.toHaveBeenCalled();
      expect(onEnterPressed2).not.toHaveBeenCalled();
    });

    it('should unregister function used by keydown event if onEnterPressed function is passed by configure function', () => {
      // given
      const useCallbackSpy = jest.spyOn(React, 'useCallback');
      act(() => {
        ReactDOM.render(<ModalProvider />, container);
      });
      jest.spyOn(document, 'removeEventListener');

      // when
      act(() => {
        mockedModalContext.Provider.mock.calls[0][0].value.configure({
          body: () => <span />,
          bodyParams: {},
          leftButtons: [],
          rightButtons: [],
          title: '',
          onEnterPressed: () => {},
        });
      });

      // then
      expect(document.removeEventListener).toHaveBeenCalledWith(
        'keydown',
        useCallbackSpy.mock.results[3].value
      );
      expect(document.removeEventListener).not.toHaveBeenCalledWith(
        'keydown',
        useCallbackSpy.mock.results[7].value
      );
    });

    it('should unregister function used by keydown event if onEnterPressed function is passed by update function', () => {
      // given
      const useCallbackSpy = jest.spyOn(React, 'useCallback');
      let modalContextValue: ModalContextProps<any>;
      act(() => {
        ReactDOM.render(<ModalProvider />, container);
        modalContextValue = mockedModalContext.Provider.mock.calls[0][0].value;
        modalContextValue.configure({
          body: () => <span />,
          bodyParams: {},
          leftButtons: [],
          rightButtons: [],
          title: '',
          onEnterPressed: () => {},
        });
      });
      jest.spyOn(document, 'removeEventListener');

      // when
      act(() => {
        modalContextValue.update({
          onEnterPressed: () => {},
        });
      });

      // then
      expect(document.removeEventListener).not.toHaveBeenCalledWith(
        'keydown',
        useCallbackSpy.mock.results[11].value
      );
      expect(document.removeEventListener).toHaveBeenCalledWith(
        'keydown',
        useCallbackSpy.mock.results[7].value
      );
    });

    it('should unregister function used by keydown event if modal context provider close function is called', () => {
      // given
      const useCallbackSpy = jest.spyOn(React, 'useCallback');
      let modalContextValue: ModalContextProps<any>;
      act(() => {
        ReactDOM.render(<ModalProvider />, container);
        modalContextValue = mockedModalContext.Provider.mock.calls[0][0].value;
        modalContextValue.configure({
          body: () => <span />,
          bodyParams: {},
          leftButtons: [],
          rightButtons: [],
          title: '',
          onEnterPressed: () => {},
        });
      });
      jest.spyOn(document, 'removeEventListener');

      // when
      act(() => {
        modalContextValue.close();
      });

      // then
      expect(document.removeEventListener).not.toHaveBeenCalledWith(
        'keydown',
        useCallbackSpy.mock.results[11].value
      );
      expect(document.removeEventListener).toHaveBeenCalledWith(
        'keydown',
        useCallbackSpy.mock.results[7].value
      );
    });

    it('should unregister function used by keydown event if modal close function is called', () => {
      // given
      const useCallbackSpy = jest.spyOn(React, 'useCallback');
      let modalContextValue: ModalContextProps<any>;
      act(() => {
        ReactDOM.render(<ModalProvider />, container);
        modalContextValue = mockedModalContext.Provider.mock.calls[0][0].value;
        modalContextValue.configure({
          body: () => <span />,
          bodyParams: {},
          leftButtons: [],
          rightButtons: [],
          title: '',
          onEnterPressed: () => {},
        });
      });
      jest.spyOn(document, 'removeEventListener');

      // when
      act(() => {
        mockedModal.mock.instances[0]?.props.close();
      });

      // then
      expect(document.removeEventListener).not.toHaveBeenCalledWith(
        'keydown',
        useCallbackSpy.mock.results[11].value
      );
      expect(document.removeEventListener).toHaveBeenCalledWith(
        'keydown',
        useCallbackSpy.mock.results[7].value
      );
    });

    it('should unregister function used by keydown event when component is unmounted', () => {
      // given
      const useCallbackSpy = jest.spyOn(React, 'useCallback');
      act(() => {
        ReactDOM.render(<ModalProvider />, container);
      });
      jest.spyOn(document, 'removeEventListener');

      // when
      act(() => {
        ReactDOM.unmountComponentAtNode(container);
      });

      // then
      expect(document.removeEventListener).toHaveBeenCalledWith(
        'keydown',
        useCallbackSpy.mock.results[3].value
      );
    });
  });

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(container);
  });
});
