import React, { MouseEvent, RefObject } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { Button } from '../../../models/common/button/button';
import { ModalProps } from './modal-props';
import './modal.scss';

class Modal extends React.Component<ModalProps & WithTranslation> {
  private readonly modalRef: RefObject<HTMLDivElement>;

  constructor(props: ModalProps & WithTranslation) {
    super(props);
    this.modalRef = React.createRef();
  }

  render(): JSX.Element {
    return (
      <div className='modal' onClick={this.close}>
        <div className='modal-content' ref={this.modalRef}>
          <h1 className='modal-content-title'>
            {this.props.t(this.props.title)}
          </h1>
          <div className='modal-content-body'>{this.props.children}</div>
          <div className='modal-content-buttons'>
            {this.mapButtons(this.props.leftButtons)}
            {this.mapButtons(this.props.rightButtons)}
          </div>
        </div>
      </div>
    );
  }

  close = (event: MouseEvent): void => {
    if (!this.modalRef.current?.contains(event.target as Node)) {
      this.props.close();
    }
  };

  mapButtons(buttons: Button[]): JSX.Element[] {
    return buttons.map((button) => {
      return (
        <button
          onClick={button.onClick}
          disabled={button.disabled}
          key={button.label}
        >
          {this.props.t(button.label)}
        </button>
      );
    });
  }
}

export default withTranslation()(Modal);
