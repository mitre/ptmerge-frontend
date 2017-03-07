import React, { Component, PropTypes } from 'react';

import { Collapse } from 'react-bootstrap';
import classNames from 'classnames';
import FontAwesome from 'react-fontawesome';

export default class CollapsiblePanel extends Component {
  constructor(...args) {
    super(...args);

    this.state = {
      open: this.props.defaultOpen == null ? false : this.props.defaultOpen
    };
  }

  panelIcon() {
    if (this.props.panelIcon == null || this.props.panelIcon === '') {
      return;
    }

    if (this.props.panelIcon.startsWith("fc")) {
      return <i className={this.props.panelIcon}></i>;
    }

    return <FontAwesome name={this.props.panelIcon} />;
  }

  hasConflicts() {
    return this.props.conflictCount > 0;
  }

  renderedButtons() {
    if (this.hasConflicts()) {
      let clickHandler = (event) => {
        event.stopPropagation();
        this.props.onAccept();
      };

      return (
        <div className="has-conflict-buttons">
          <button type="button" className="btn btn-primary send-mail-button"><FontAwesome name="paper-plane" /></button>
          <button type="button" className="btn btn-primary accept-conflict-button" onClick={clickHandler}>{this.props.hasNested ? 'Accept All' : 'Accept'}</button>
        </div>
      );
    }
  }

  render() {
    let chevronClassNames = classNames('collapsible-chevron', 'pull-right', 'fa', 'fa-chevron-circle-down', 'rotate',
                                       { left: !this.state.open }, { 'has-conflicts': this.hasConflicts()});
    let panelClassNames = classNames('panel', 'collapsible-panel',
                                     { 'is-nested': this.props.isNested },
                                     { 'has-nested': this.props.hasNested });
    let panelHeadingClassNames = classNames('panel-heading', { 'has-nested': this.props.hasNested });

    return (
      <div className={panelClassNames}>
        <div className={panelHeadingClassNames}>
          <a onClick={ ()=> this.setState({ open: !this.state.open, chevronToggle: !this.state.open })}>
            <span className="panel-title">{this.panelIcon()} {`${this.props.panelTitle}`}</span>

            <i className={chevronClassNames}></i>
            <span className="conflict-count">{this.props.conflictCount}</span>
            {this.renderedButtons()}
          </a>
        </div>

        <Collapse className="panel-collapse" in={this.state.open}>
          <div className="panel-body">
            {this.props.children}
          </div>
        </Collapse>
      </div>
    );
  }
}

CollapsiblePanel.displayName = "CollapsiblePanel";

CollapsiblePanel.propTypes = {
  children: PropTypes.element,
  conflictCount: PropTypes.number,
  hasNested: PropTypes.bool,
  isNested: PropTypes.bool,
  defaultOpen: PropTypes.bool,
  panelIcon: PropTypes.string,
  panelTitle: PropTypes.string.isRequired,
  onAccept: PropTypes.func
};

CollapsiblePanel.defaultProps = { isNested: false, hasNested: false };
