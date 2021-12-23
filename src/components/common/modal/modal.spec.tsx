import { act, fireEvent, getByTestId } from '@testing-library/react';
import * as React from 'react';
import ReactDOM from 'react-dom';
import * as translation from '../../../__mocks__/react-i18next';
import { Button } from '../../../models/common/button/button';
import Modal from './modal';

jest.mock('react-i18next');

describe('Modal', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
  });

  describe('render', () => {
    describe('modal', () => {
      describe('onClick', () => {
        let onClose: jest.MockedFunction<() => void>;

        beforeEach(() => {
          onClose = jest.fn();
          act(() => {
            ReactDOM.render(
              <Modal
                close={onClose}
                leftButtons={[]}
                rightButtons={[]}
                title=''
              />,
              container
            );
          });
        });

        it('should call passed close function if clicked modal container', () => {
          // when
          fireEvent.click(container.querySelector('.modal') as HTMLDivElement);

          // then
          expect(onClose).toHaveBeenCalled();
        });

        it('should not call passed close function if clicked modal content', () => {
          // when
          fireEvent.click(
            container.querySelector('.modal-content') as HTMLDivElement
          );

          // then
          expect(onClose).not.toHaveBeenCalled();
        });

        it('should not call passed close function if clicked modal title', () => {
          // when
          fireEvent.click(
            container.querySelector(
              '.modal-content-title'
            ) as HTMLHeadingElement
          );

          // then
          expect(onClose).not.toHaveBeenCalled();
        });

        it('should not call passed close function if clicked modal body', () => {
          // when
          fireEvent.click(
            container.querySelector('.modal-content-body') as HTMLDivElement
          );

          // then
          expect(onClose).not.toHaveBeenCalled();
        });

        it('should not call passed close function if clicked modal buttons', () => {
          // when
          fireEvent.click(
            container.querySelector('.modal-content-buttons') as HTMLDivElement
          );

          // then
          expect(onClose).not.toHaveBeenCalled();
        });
      });

      describe('title', () => {
        it('should contain translated passed title', () => {
          // given
          const title = 'Some title';
          jest.spyOn(translation, 't').mockReturnValue(title);

          // when
          act(() => {
            ReactDOM.render(
              <Modal
                close={() => {}}
                leftButtons={[]}
                rightButtons={[]}
                title={title}
              />,
              container
            );
          });

          // then
          expect(
            container.querySelector('.modal-content-title')
          ).toHaveTextContent(new RegExp(`^${title}$`));
          expect(translation.t).toHaveBeenCalledWith(title);
        });
      });

      describe('body', () => {
        const bodySelector = '.modal-content-body';

        it('should display child as body', () => {
          // given
          const childId = 'child';

          // when
          act(() => {
            ReactDOM.render(
              <Modal
                close={() => {}}
                leftButtons={[]}
                rightButtons={[]}
                title=''
              >
                <div data-testid={childId} />
              </Modal>,
              container
            );
          });

          // then
          expect(
            getByTestId(
              container.querySelector(bodySelector) as HTMLElement,
              childId
            )
          ).toBeDefined();
        });

        it('should display children as body', () => {
          // given
          const childId1 = 'child1';
          const childId2 = 'child2';

          // when
          act(() => {
            ReactDOM.render(
              <Modal
                close={() => {}}
                leftButtons={[]}
                rightButtons={[]}
                title=''
              >
                <div data-testid={childId1} />
                <div data-testid={childId2} />
              </Modal>,
              container
            );
          });

          // then
          const body = container.querySelector(bodySelector) as HTMLElement;
          expect(getByTestId(body, childId1)).toBeDefined();
          expect(getByTestId(body, childId2)).toBeDefined();
        });
      });

      describe('buttons', () => {
        const buttonsSelector = '.modal-content-buttons';

        describe('left', () => {
          let leftButtons: Button[];
          let onClick: () => void;
          const disabled1 = true;
          const disabled2 = false;
          const disabled3 = undefined;
          const labelTranslationKey1 = 'Key 1';
          const labelTranslationKey2 = 'Key 2';
          const labelTranslationKey3 = 'Key 3';

          beforeEach(() => {
            onClick = () => {};
            leftButtons = [
              {
                disabled: disabled1,
                onClick,
                label: labelTranslationKey1,
              },
              {
                disabled: disabled2,
                onClick,
                label: labelTranslationKey2,
              },
              {
                disabled: disabled3,
                onClick,
                label: labelTranslationKey3,
              },
            ];
          });

          it('should render buttons passed as leftButtons', () => {
            // when
            act(() => {
              ReactDOM.render(
                <Modal
                  close={() => {}}
                  leftButtons={leftButtons}
                  rightButtons={[]}
                  title=''
                />,
                container
              );
            });

            // then
            expect(
              container
                .querySelector(buttonsSelector)
                ?.querySelectorAll('button')
            ).toHaveLength(3);
          });

          it('should assign correct disabled property to leftButtons', () => {
            // when
            act(() => {
              ReactDOM.render(
                <Modal
                  close={() => {}}
                  leftButtons={leftButtons}
                  rightButtons={[]}
                  title=''
                />,
                container
              );
            });

            // then
            const buttons = container
              .querySelector(buttonsSelector)
              ?.querySelectorAll('button') as NodeListOf<HTMLButtonElement>;
            expect(buttons[0].disabled).toBe(disabled1);
            expect(buttons[1].disabled).toBe(disabled2);
            expect(buttons[2].disabled).toBe(!!disabled3);
          });

          it('should display correct labels for leftButtons', () => {
            // given
            const label1 = 'Label 1';
            const label2 = 'Label 2';
            const label3 = 'Label 3';
            jest.spyOn(translation, 't').mockImplementation((key) => {
              if (key === labelTranslationKey1) {
                return label1;
              } else {
                return key === labelTranslationKey2 ? label2 : label3;
              }
            });

            // when
            act(() => {
              ReactDOM.render(
                <Modal
                  close={() => {}}
                  leftButtons={leftButtons}
                  rightButtons={[]}
                  title=''
                />,
                container
              );
            });

            // then
            const buttons = container
              .querySelector(buttonsSelector)
              ?.querySelectorAll('button') as NodeListOf<HTMLButtonElement>;
            expect(buttons[0]).toHaveTextContent(new RegExp(`^${label1}$`));
            expect(translation.t).toHaveBeenCalledWith(labelTranslationKey1);
            expect(buttons[1]).toHaveTextContent(new RegExp(`^${label2}$`));
            expect(translation.t).toHaveBeenCalledWith(labelTranslationKey2);
            expect(buttons[2]).toHaveTextContent(new RegExp(`^${label3}$`));
            expect(translation.t).toHaveBeenCalledWith(labelTranslationKey3);
          });

          it('should call correct onClick function on click event if disabled is falsy', () => {
            // given
            const onClick1 = jest.fn();
            const onClick2 = jest.fn();
            leftButtons.shift();
            leftButtons[0].onClick = onClick1;
            leftButtons[1].onClick = onClick2;

            // when
            act(() => {
              ReactDOM.render(
                <Modal
                  close={() => {}}
                  leftButtons={leftButtons}
                  rightButtons={[]}
                  title=''
                />,
                container
              );
            });

            // then
            const buttons = container
              .querySelector(buttonsSelector)
              ?.querySelectorAll('button') as NodeListOf<HTMLButtonElement>;
            fireEvent.click(buttons[0]);
            expect(onClick1).toHaveBeenCalled();
            expect(onClick2).not.toHaveBeenCalled();
            fireEvent.click(buttons[1]);
            expect(onClick2).toHaveBeenCalled();
          });

          it('should not call onClick function on click event if disabled is true', () => {
            // given
            const onClick = jest.fn();
            leftButtons.splice(1, 2);
            leftButtons[0].onClick = onClick;

            // when
            act(() => {
              ReactDOM.render(
                <Modal
                  close={() => {}}
                  leftButtons={leftButtons}
                  rightButtons={[]}
                  title=''
                />,
                container
              );
            });

            // then
            fireEvent.click(
              (container
                .querySelector(buttonsSelector)
                ?.querySelectorAll(
                  'button'
                ) as NodeListOf<HTMLButtonElement>)[0]
            );
            expect(onClick).not.toHaveBeenCalled();
          });
        });

        describe('right', () => {
          let rightButtons: Button[];
          let onClick: () => void;
          const disabled1 = true;
          const disabled2 = false;
          const disabled3 = undefined;
          const labelTranslationKey1 = 'Key 1';
          const labelTranslationKey2 = 'Key 2';
          const labelTranslationKey3 = 'Key 3';

          beforeEach(() => {
            onClick = () => {};
            rightButtons = [
              {
                disabled: disabled1,
                onClick,
                label: labelTranslationKey1,
              },
              {
                disabled: disabled2,
                onClick,
                label: labelTranslationKey2,
              },
              {
                disabled: disabled3,
                onClick,
                label: labelTranslationKey3,
              },
            ];
          });

          it('should render buttons passed as rightButtons', () => {
            // when
            act(() => {
              ReactDOM.render(
                <Modal
                  close={() => {}}
                  leftButtons={[]}
                  rightButtons={rightButtons}
                  title=''
                />,
                container
              );
            });

            // then
            expect(
              container
                .querySelector(buttonsSelector)
                ?.querySelectorAll('button')
            ).toHaveLength(3);
          });

          it('should assign correct disabled property to rightButtons', () => {
            // when
            act(() => {
              ReactDOM.render(
                <Modal
                  close={() => {}}
                  leftButtons={[]}
                  rightButtons={rightButtons}
                  title=''
                />,
                container
              );
            });

            // then
            const buttons = container
              .querySelector(buttonsSelector)
              ?.querySelectorAll('button') as NodeListOf<HTMLButtonElement>;
            expect(buttons[0].disabled).toBe(disabled1);
            expect(buttons[1].disabled).toBe(disabled2);
            expect(buttons[2].disabled).toBe(!!disabled3);
          });

          it('should display correct labels for rightButtons', () => {
            // given
            const label1 = 'Label 1';
            const label2 = 'Label 2';
            const label3 = 'Label 3';
            jest.spyOn(translation, 't').mockImplementation((key) => {
              if (key === labelTranslationKey1) {
                return label1;
              } else {
                return key === labelTranslationKey2 ? label2 : label3;
              }
            });

            // when
            act(() => {
              ReactDOM.render(
                <Modal
                  close={() => {}}
                  leftButtons={[]}
                  rightButtons={rightButtons}
                  title=''
                />,
                container
              );
            });

            // then
            const buttons = container
              .querySelector(buttonsSelector)
              ?.querySelectorAll('button') as NodeListOf<HTMLButtonElement>;
            expect(buttons[0]).toHaveTextContent(new RegExp(`^${label1}$`));
            expect(translation.t).toHaveBeenCalledWith(labelTranslationKey1);
            expect(buttons[1]).toHaveTextContent(new RegExp(`^${label2}$`));
            expect(translation.t).toHaveBeenCalledWith(labelTranslationKey2);
            expect(buttons[2]).toHaveTextContent(new RegExp(`^${label3}$`));
            expect(translation.t).toHaveBeenCalledWith(labelTranslationKey3);
          });

          it('should call correct onClick function on click event if disabled is falsy', () => {
            // given
            const onClick1 = jest.fn();
            const onClick2 = jest.fn();
            rightButtons.shift();
            rightButtons[0].onClick = onClick1;
            rightButtons[1].onClick = onClick2;

            // when
            act(() => {
              ReactDOM.render(
                <Modal
                  close={() => {}}
                  leftButtons={[]}
                  rightButtons={rightButtons}
                  title=''
                />,
                container
              );
            });

            // then
            const buttons = container
              .querySelector(buttonsSelector)
              ?.querySelectorAll('button') as NodeListOf<HTMLButtonElement>;
            fireEvent.click(buttons[0]);
            expect(onClick1).toHaveBeenCalled();
            expect(onClick2).not.toHaveBeenCalled();
            fireEvent.click(buttons[1]);
            expect(onClick2).toHaveBeenCalled();
          });

          it('should not call onClick function on click event if disabled is true', () => {
            // given
            const onClick = jest.fn();
            rightButtons.splice(1, 2);
            rightButtons[0].onClick = onClick;

            // when
            act(() => {
              ReactDOM.render(
                <Modal
                  close={() => {}}
                  leftButtons={[]}
                  rightButtons={rightButtons}
                  title=''
                />,
                container
              );
            });

            // then
            fireEvent.click(
              (container
                .querySelector(buttonsSelector)
                ?.querySelectorAll(
                  'button'
                ) as NodeListOf<HTMLButtonElement>)[0]
            );
            expect(onClick).not.toHaveBeenCalled();
          });
        });

        describe('left and right', () => {
          let leftButtons: Button[];
          let rightButtons: Button[];
          let onClick: () => void;
          const disabled1 = true;
          const disabled2 = false;
          const disabled3 = undefined;
          const labelTranslationKey1 = 'Key 1';
          const labelTranslationKey2 = 'Key 2';
          const labelTranslationKey3 = 'Key 3';
          const labelTranslationKey4 = 'Key 4';
          const labelTranslationKey5 = 'Key 5';
          const labelTranslationKey6 = 'Key 6';

          beforeEach(() => {
            onClick = () => {};
            leftButtons = [
              {
                disabled: disabled1,
                onClick,
                label: labelTranslationKey1,
              },
              {
                disabled: disabled2,
                onClick,
                label: labelTranslationKey2,
              },
              {
                disabled: disabled3,
                onClick,
                label: labelTranslationKey3,
              },
            ];
            rightButtons = [
              {
                disabled: disabled1,
                onClick,
                label: labelTranslationKey4,
              },
              {
                disabled: disabled2,
                onClick,
                label: labelTranslationKey5,
              },
              {
                disabled: disabled3,
                onClick,
                label: labelTranslationKey6,
              },
            ];
          });

          it('should render buttons passed as leftButtons and rightButtons', () => {
            // when
            act(() => {
              ReactDOM.render(
                <Modal
                  close={() => {}}
                  leftButtons={leftButtons}
                  rightButtons={rightButtons}
                  title=''
                />,
                container
              );
            });

            // then
            expect(
              container
                .querySelector(buttonsSelector)
                ?.querySelectorAll('button')
            ).toHaveLength(6);
          });

          it('should assign correct disabled property to leftButtons and rightButtons', () => {
            // when
            act(() => {
              ReactDOM.render(
                <Modal
                  close={() => {}}
                  leftButtons={leftButtons}
                  rightButtons={rightButtons}
                  title=''
                />,
                container
              );
            });

            // then
            const buttons = container
              .querySelector(buttonsSelector)
              ?.querySelectorAll('button') as NodeListOf<HTMLButtonElement>;
            expect(buttons[0].disabled).toBe(disabled1);
            expect(buttons[1].disabled).toBe(disabled2);
            expect(buttons[2].disabled).toBe(!!disabled3);
            expect(buttons[3].disabled).toBe(disabled1);
            expect(buttons[4].disabled).toBe(disabled2);
            expect(buttons[5].disabled).toBe(!!disabled3);
          });

          it('should display correct labels for leftButtons and rightButtons', () => {
            // given
            const label1 = 'Label 1';
            const label2 = 'Label 2';
            const label3 = 'Label 3';
            const label4 = 'Label 4';
            const label5 = 'Label 5';
            const label6 = 'Label 6';
            jest.spyOn(translation, 't').mockImplementation((key) => {
              switch (key) {
                case labelTranslationKey1:
                  return label1;
                case labelTranslationKey2:
                  return label2;
                case labelTranslationKey3:
                  return label3;
                case labelTranslationKey4:
                  return label4;
                case labelTranslationKey5:
                  return label5;
              }
              return label6;
            });

            // when
            act(() => {
              ReactDOM.render(
                <Modal
                  close={() => {}}
                  leftButtons={leftButtons}
                  rightButtons={rightButtons}
                  title=''
                />,
                container
              );
            });

            // then
            const buttons = container
              .querySelector(buttonsSelector)
              ?.querySelectorAll('button') as NodeListOf<HTMLButtonElement>;
            expect(buttons[0]).toHaveTextContent(new RegExp(`^${label1}$`));
            expect(translation.t).toHaveBeenCalledWith(labelTranslationKey1);
            expect(buttons[1]).toHaveTextContent(new RegExp(`^${label2}$`));
            expect(translation.t).toHaveBeenCalledWith(labelTranslationKey2);
            expect(buttons[2]).toHaveTextContent(new RegExp(`^${label3}$`));
            expect(translation.t).toHaveBeenCalledWith(labelTranslationKey3);
            expect(buttons[3]).toHaveTextContent(new RegExp(`^${label4}$`));
            expect(translation.t).toHaveBeenCalledWith(labelTranslationKey4);
            expect(buttons[4]).toHaveTextContent(new RegExp(`^${label5}$`));
            expect(translation.t).toHaveBeenCalledWith(labelTranslationKey5);
            expect(buttons[5]).toHaveTextContent(new RegExp(`^${label6}$`));
            expect(translation.t).toHaveBeenCalledWith(labelTranslationKey6);
          });

          it('should call correct onClick function on click event if disabled is falsy', () => {
            // given
            const onClick1 = jest.fn();
            const onClick2 = jest.fn();
            leftButtons.shift();
            leftButtons[0].onClick = onClick1;
            leftButtons[1].onClick = onClick2;
            const onClick3 = jest.fn();
            const onClick4 = jest.fn();
            rightButtons.shift();
            rightButtons[0].onClick = onClick3;
            rightButtons[1].onClick = onClick4;

            // when
            act(() => {
              ReactDOM.render(
                <Modal
                  close={() => {}}
                  leftButtons={leftButtons}
                  rightButtons={rightButtons}
                  title=''
                />,
                container
              );
            });

            // then
            const buttons = container
              .querySelector(buttonsSelector)
              ?.querySelectorAll('button') as NodeListOf<HTMLButtonElement>;
            fireEvent.click(buttons[0]);
            expect(onClick1).toHaveBeenCalled();
            expect(onClick2).not.toHaveBeenCalled();
            expect(onClick3).not.toHaveBeenCalled();
            expect(onClick4).not.toHaveBeenCalled();
            fireEvent.click(buttons[1]);
            expect(onClick2).toHaveBeenCalled();
            expect(onClick3).not.toHaveBeenCalled();
            expect(onClick4).not.toHaveBeenCalled();
            fireEvent.click(buttons[2]);
            expect(onClick3).toHaveBeenCalled();
            expect(onClick4).not.toHaveBeenCalled();
            fireEvent.click(buttons[3]);
            expect(onClick4).toHaveBeenCalled();
          });

          it('should not call onClick function on click event if disabled is true', () => {
            // given
            const onClick1 = jest.fn();
            leftButtons.splice(1, 2);
            leftButtons[0].onClick = onClick1;
            const onClick2 = jest.fn();
            rightButtons.splice(1, 2);
            rightButtons[0].onClick = onClick2;

            // when
            act(() => {
              ReactDOM.render(
                <Modal
                  close={() => {}}
                  leftButtons={leftButtons}
                  rightButtons={rightButtons}
                  title=''
                />,
                container
              );
            });

            // then
            const buttons = container
              .querySelector(buttonsSelector)
              ?.querySelectorAll('button') as NodeListOf<HTMLButtonElement>;
            fireEvent.click(buttons[0]);
            expect(onClick1).not.toHaveBeenCalled();
            fireEvent.click(buttons[1]);
            expect(onClick2).not.toHaveBeenCalled();
          });
        });
      });
    });
  });
});
