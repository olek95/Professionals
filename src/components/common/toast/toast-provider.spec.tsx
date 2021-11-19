import { getAllByTestId, getByTestId, render } from '@testing-library/react';
import React, { DependencyList, ProviderProps } from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { ToastContainer, ToastMessageAnimated } from 'react-toastr';
import { MaybeMocked } from 'ts-jest/dist/utils/testing';
import { mocked } from 'ts-jest/utils';
import { ToastContext } from './toast-context';
import { ToastProvider } from './toast-provider';

// Example of mocking class
/*jest.mock('react-toastr', () => {
    const React = require('react');
    return {
        ToastContainer: class MockSomeClass extends React.Component<{
            toastMessageFactory: any;
            className?: string;
        }> {
            render() {
                return <div data-testid='toast-container'/>;
            }
        }
    }
});*/

jest.mock('react-toastr');
jest.mock('./toast-context', () => {
  return {
    ToastContext: {
      Provider: (props: ProviderProps<ToastContainer>): React.ReactNode => {
        return props.children;
      },
    },
  };
});

describe('ToastProvider', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
  });

  describe('ToastContext.Provider', () => {
    let mockedToastContext: MaybeMocked<typeof ToastContext>;
    let toastContextProviderSpy: jest.SpiedFunction<
      (props: ProviderProps<ToastContainer | undefined>) => React.ReactNode
    >;

    beforeEach(() => {
      mockedToastContext = mocked(ToastContext);
      toastContextProviderSpy = jest.spyOn(mockedToastContext, 'Provider');
    });

    it('should be rendered', () => {
      // given
      const toastContextProviderId = 'toast-context-provider';
      toastContextProviderSpy.mockReturnValue(
        <div data-testid={toastContextProviderId} />
      );

      // when
      act(() => {
        ReactDOM.render(<ToastProvider />, container);
      });

      // then
      expect(getAllByTestId(container, toastContextProviderId)).toHaveLength(1);
    });

    describe('value', () => {
      it('should be undefined during creation', () => {
        // when
        act(() => {
          ReactDOM.render(<ToastProvider />, container);
        });

        // then
        expect(
          mockedToastContext.Provider.mock.calls[0][0].value
        ).toBeUndefined();
      });

      it('should have assigned toast container after recreation', () => {
        // when
        act(() => {
          ReactDOM.render(<ToastProvider />, container);
        });

        // then
        expect(mockedToastContext.Provider.mock.calls[1][0].value).toBe(
          mocked(ToastContainer).mock.instances[0]
        );
      });

      it('should have assigned the same toast container after rerender when children are not changed', () => {
        // given
        const toastContextProvider = render(<ToastProvider />);

        // when
        toastContextProvider.rerender(<ToastProvider />);

        // then
        expect(mockedToastContext.Provider.mock.calls[2][0].value).toBe(
          mockedToastContext.Provider.mock.calls[1][0].value
        );
      });

      it('should have assigned the same toast container after rerender when children are changed', () => {
        // given
        const toastContextProvider = render(
          <ToastProvider>
            <div />
          </ToastProvider>
        );

        // when
        toastContextProvider.rerender(
          <ToastProvider>
            <span />
          </ToastProvider>
        );

        // then
        expect(mockedToastContext.Provider.mock.calls[2][0].value).toBe(
          mockedToastContext.Provider.mock.calls[1][0].value
        );
      });
    });

    describe('children', () => {
      const toastContextProviderId = 'toast-context-provider-id';

      it('should contain ToastContainer if children are not defined', () => {
        // given
        toastContextProviderSpy.mockImplementation(
          (props: ProviderProps<ToastContainer | undefined>) => (
            <div data-testid={toastContextProviderId}>{props.children}</div>
          )
        );
        const toastContainerId = 'toast-container';
        jest
          .spyOn(ToastContainer.prototype, 'render')
          .mockReturnValue(<div data-testid={toastContainerId} />);

        // when
        act(() => {
          ReactDOM.render(<ToastProvider />, container);
        });

        // then
        expect(
          getByTestId(
            getByTestId(container, toastContextProviderId),
            toastContainerId
          )
        ).toBeDefined();
      });

      it('should contain ToastContainer if children are defined', () => {
        // given
        toastContextProviderSpy.mockImplementation(
          (props: ProviderProps<ToastContainer | undefined>) => (
            <div data-testid={toastContextProviderId}>{props.children}</div>
          )
        );
        const toastContainerId = 'toast-container';
        jest
          .spyOn(ToastContainer.prototype, 'render')
          .mockReturnValue(<div data-testid={toastContainerId} />);

        // when
        act(() => {
          ReactDOM.render(
            <ToastProvider>
              <div />
            </ToastProvider>,
            container
          );
        });

        // then
        expect(
          getByTestId(
            getByTestId(container, toastContextProviderId),
            toastContainerId
          )
        ).toBeDefined();
      });

      it('should contain children passed to ToastProvider', () => {
        // given
        toastContextProviderSpy.mockImplementation(
          (props: ProviderProps<ToastContainer | undefined>) => (
            <div data-testid={toastContextProviderId}>{props.children}</div>
          )
        );
        const childId = 'child';

        // when
        act(() => {
          ReactDOM.render(
            <ToastProvider>
              <div data-testid={childId} />
            </ToastProvider>,
            container
          );
        });

        // then
        expect(
          getByTestId(getByTestId(container, toastContextProviderId), childId)
        ).toBeDefined();
      });
    });
  });

  describe('ToastContainer', () => {
    let mockedToastContainer: MaybeMocked<typeof ToastContainer>;

    beforeEach(() => {
      mockedToastContainer = mocked(ToastContainer);
    });

    it('should be rendered', () => {
      // given
      const id = 'toast-container';
      jest
        .spyOn(ToastContainer.prototype, 'render')
        .mockReturnValue(<div data-testid={id}></div>);

      // when
      act(() => {
        ReactDOM.render(<ToastProvider />, container);
      });

      // then
      expect(getAllByTestId(container, id)).toHaveLength(1);
    });

    describe('toastMessageFactory', () => {
      it('should have assigned correct function', () => {
        // when
        act(() => {
          ReactDOM.render(<ToastProvider />, container);
        });

        // then
        expect(
          mockedToastContainer.mock.instances[0].props.toastMessageFactory
        ).toEqual(expect.any(Function));
      });

      it('should have assigned the same function in second render if children are not changed', () => {
        // given
        const toastProvider = render(<ToastProvider />);

        // when
        toastProvider.rerender(<ToastProvider />);

        // then
        expect(
          mockedToastContainer.mock.instances[0].props.toastMessageFactory
        ).toBe(mockedToastContainer.mock.calls[0][0].toastMessageFactory);
      });

      it('should have assigned the same function in second render if children are changed', () => {
        // given
        const toastProvider = render(
          <ToastProvider>
            <div />
          </ToastProvider>
        );

        // when
        toastProvider.rerender(
          <ToastProvider>
            <span />
          </ToastProvider>
        );

        // then
        expect(
          mockedToastContainer.mock.instances[0].props.toastMessageFactory
        ).toBe(mockedToastContainer.mock.calls[0][0].toastMessageFactory);
      });

      it('should return ToastMessageAnimated element with assigned correct props if they were passed into toastMessageFactory function', () => {
        // given
        act(() => {
          ReactDOM.render(<ToastProvider />, container);
        });
        const className = 'some-class';
        const id = 'some-id';

        // when
        const toastMessageAnimated: JSX.Element = mockedToastContainer.mock.instances[0].props.toastMessageFactory(
          {
            className,
            id,
          }
        );

        // then
        expect(toastMessageAnimated).toEqual(
          <ToastMessageAnimated className={className} id={id} />
        );
      });

      [
        {
          props: null,
          propsDescription: 'null',
        },
        {
          props: undefined,
          propsDescription: 'undefined',
        },
        {
          props: {},
          propsDescription: 'empty object',
        },
      ].forEach((testScenario) => {
        it(`should return ToastMessageAnimated element without assigned props if there is ${testScenario.propsDescription} passed into toastMessageFactory function`, () => {
          // given
          act(() => {
            ReactDOM.render(<ToastProvider />, container);
          });

          // when
          const toastMessageAnimated: JSX.Element = mockedToastContainer.mock.instances[0].props.toastMessageFactory(
            testScenario.props
          );

          // then
          expect(toastMessageAnimated).toEqual(<ToastMessageAnimated />);
        });
      });
    });

    describe('ref', () => {
      it('should be passed to function returned by useCallback', () => {
        // given
        const onToastMountedSpy = jest.fn();
        jest.spyOn(React, 'useCallback').mockReturnValue(onToastMountedSpy);

        // when
        act(() => {
          ReactDOM.render(<ToastProvider />, container);
        });

        // then
        expect(onToastMountedSpy).toHaveBeenCalledTimes(1);
        expect(onToastMountedSpy).toHaveBeenCalledWith(
          mockedToastContainer.mock.instances[0]
        );
      });
    });
  });

  describe('Children', () => {
    it('should contain passed child', () => {
      // given
      const id = 'child';

      // when
      act(() => {
        ReactDOM.render(
          <ToastProvider>
            <div data-testid={id} />
          </ToastProvider>,
          container
        );
      });

      // then
      expect(getByTestId(container, id)).toBeDefined();
    });

    it('should contain passed children', () => {
      // given
      const id1 = 'child-1';
      const id2 = 'child-2';

      // when
      act(() => {
        ReactDOM.render(
          <ToastProvider>
            <div data-testid={id1} />
            <div data-testid={id2} />
          </ToastProvider>,
          container
        );
      });

      // then
      expect(getByTestId(container, id1)).toBeDefined();
      expect(getByTestId(container, id2)).toBeDefined();
    });
  });

  describe('useCallback', () => {
    let useCallbackSpy: jest.SpiedFunction<
      <T extends (...args: any[]) => any>(
        callback: T,
        deps: DependencyList
      ) => T
    >;

    beforeEach(() => {
      useCallbackSpy = jest.spyOn(React, 'useCallback');
    });

    it('should be called twice and return the same function each time', () => {
      // when
      act(() => {
        ReactDOM.render(<ToastProvider />, container);
      });

      // then
      expect(useCallbackSpy).toHaveBeenCalledTimes(2);
      expect(useCallbackSpy.mock.results[0].value).toBe(
        useCallbackSpy.mock.results[1].value
      );
    });

    it('should return the same function in second render if children are not changed', () => {
      // given
      const toastProvider = render(<ToastProvider />);

      // when
      toastProvider.rerender(<ToastProvider />);

      // then
      expect(useCallbackSpy.mock.results).toHaveLength(3);
      expect(useCallbackSpy.mock.results[0].value).toBe(
        useCallbackSpy.mock.results[1].value
      );
      expect(useCallbackSpy.mock.results[0].value).toBe(
        useCallbackSpy.mock.results[2].value
      );
    });

    it('should return the same function in second render if children are changed', () => {
      // given
      const toastProvider = render(
        <ToastProvider>
          <div />
        </ToastProvider>
      );

      // when
      toastProvider.rerender(
        <ToastProvider>
          <span />
        </ToastProvider>
      );

      // then
      expect(useCallbackSpy.mock.results).toHaveLength(3);
      expect(useCallbackSpy.mock.results[0].value).toBe(
        useCallbackSpy.mock.results[1].value
      );
      expect(useCallbackSpy.mock.results[0].value).toBe(
        useCallbackSpy.mock.results[2].value
      );
    });
  });
});
