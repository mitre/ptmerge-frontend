import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';
import { Link } from 'react-router';

import Logo from './Logo';

export default class Nav extends Component {
  render() {
    return (
      <nav className="nav navbar navbar-inverse navbar-static-top">
        <div className="container">
          <div className="navbar-header">
            <Logo />

            <button type="button"
                    className="navbar-toggle collapsed"
                    data-toggle="collapse"
                    data-target="#navbar"
                    aria-expanded="false"
                    aria-controls="navbar">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
          </div>

          <div id="navbar" className="collapse navbar-collapse">
            <ul className="nav navbar-nav navbar-right">
              <li>
                <Link to="/" activeClassName="active">
                  <FontAwesome name="pie-chart" /> Dashboard
                </Link>
              </li>

              <li>
                <Link to="/merge" activeClassName="active">
                  <FontAwesome name="sitemap" /> Merge
                </Link>
              </li>

              <li>
                <Link to="/record-sets" activeClassName="active">
                  <FontAwesome name="database" /> Record Sets
                </Link>
              </li>

              <li role="presentation" className="dropdown">
                <a href="#"
                   className="dropdown-toggle"
                   data-toggle="dropdown"
                   role="button"
                   aria-haspopup="true"
                   aria-expanded="false">
                  Name <span className="caret"></span>
                </a>

                <ul className="dropdown-menu">
                  <li><a href="#">Logout</a></li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}

Nav.displayName = 'Nav';
