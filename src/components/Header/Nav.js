import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';
import { Link } from 'react-router';

import Logo from './Logo';

export default class Nav extends Component {
  render() {
    return (
      <nav className="nav navbar navbar-toggleable-md navbar-inverse fixed-top">
        <button type="button"
                className="navbar-toggler navbar-toggler-right"
                data-toggle="collapse"
                data-target="#navbarCollapse"
                aria-expanded="false"
                aria-controls="navbarCollapse"
                aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <Logo />

        <div id="navbarCollapse" className="collapse navbar-collapse">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link to="/" activeClassName="active">
                <FontAwesome name="pie-chart" /> Dashboard
              </Link>
            </li>

            <li className="nav-item">
              <Link to="/merge" activeClassName="active">
                <FontAwesome name="sitemap" /> Merge
              </Link>
            </li>

            <li className="nav-item">
              <Link to="/record-sets" activeClassName="active">
                <FontAwesome name="database" /> Record Sets
              </Link>
            </li>

            <li role="presentation" className="nav-item dropdown">
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
      </nav>
    );
  }
}

Nav.displayName = 'Nav';
