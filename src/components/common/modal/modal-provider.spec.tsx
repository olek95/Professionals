import {
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
      jest.spyOn(React, 'useCallback').mockReturnValue(close);

      // when
      act(() => {
        ReactDOM.render(<ModalProvider />, container);
      });

      // then
      expect(modalContextProviderSpy.mock.calls[0][0].value.close).toBe(close);
    });

    it('should have assigned the same close function when children are changed', () => {
      // given
      jest.spyOn(React, 'useCallback').mockReturnValue(jest.fn());
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
      expect(modalContextProviderSpy.mock.calls[0][0].value.close).toBe(
        modalContextProviderSpy.mock.calls[1][0].value.close
      );
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
        jest.spyOn(React, 'useCallback').mockReturnValue(close);
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
});
