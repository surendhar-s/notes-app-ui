import React, { Component } from 'react';
import './header.css';
import { Link } from 'react-router-dom'
import AuthHetperMethods from '../utils/AuthHelperMethods';

class Header extends Component {
  Auth = new AuthHetperMethods()
  handleLogout = () => {
    this.Auth.logout()

  }
  render() {
    return (
      <div>
        <div className="navbar-top">
          <div>
            <h2 className="title">Notes</h2>
          </div>
          <div>
            <Link style={{ textDecoration: "none", color: "black" }} to={{ pathname: "/login" }}><button className="button logout-button" onClick={this.handleLogout}>Logout</button></Link>
          </div>
        </div>
      </div>
    );
  }
}

export default Header;
