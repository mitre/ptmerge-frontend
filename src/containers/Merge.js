import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';

import PageHeader from '../components/Header/PageHeader';

export default class Merge extends Component {
  render() {
    return (
      <div className="merge">
        <PageHeader title="Merge" />

        <div className="merge-tool">
          <div className="merge-tool-header">
            <div className="merge-tool-header-titles d-flex justify-content-around">
              <div className="merge-tool-header-title">Source</div>
              <div className="merge-tool-header-title">Target</div>
              <div className="merge-tool-header-title">Source</div>
            </div>

            <div className="merge-tool-header-selectors d-flex justify-content-around">
              <div className="merge-tool-header-selector source d-flex">
                <div className="merge-tool-header-selector-icon source-1">
                  <FontAwesome name="user" />
                  <span className="icon-line"></span>
                </div>

                <span className="source-name">89239857: Johnson, Edward</span>
              </div>

              <div className="merge-tool-header-selector target d-flex">
                <div className="merge-tool-header-selector-icon target">
                  <FontAwesome name="user" />
                  <span className="icon-line"></span>
                </div>

                <span className="source-name">89239857: Johnson, Edward</span>
              </div>

              <div className="merge-tool-header-selector source d-flex">
                <div className="merge-tool-header-selector-icon source-2">
                  <FontAwesome name="user" />
                  <span className="icon-line"></span>
                </div>

                <span className="source-name">98238592: Johnson, Eddy</span>
              </div>
            </div>
          </div>

          <div className="merge-tool-body">

          </div>

          <div className="merge-tool-footer">

          </div>
        </div>
      </div>
    );
  }
}

Merge.displayName = 'Merge';
