import React from 'react';
import { Button } from '../../models/button/button';
import './modal.scss';
import { WithTranslation, withTranslation } from 'react-i18next';
import { ModalProps } from './modal-props';

class Modal extends React.Component<ModalProps & WithTranslation> {
  render() {
    return (
      <div className='modal'>
        <div className='modal-content'>
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

  private mapButtons(buttons: Button[]) {
    return buttons.map((button) => (
      <button
        onClick={button.onClick}
        disabled={button.disabled}
        key={button.label}
      >
        {this.props.t(button.label)}
      </button>
    ));
  }
}

export default withTranslation()(Modal);
