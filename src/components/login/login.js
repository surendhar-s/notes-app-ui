import React, { Component } from 'react';
import LoadingOverlay from 'react-loading-overlay';
import { Link } from 'react-router-dom';
import AuthHetperMethods from '../utils/AuthHelperMethods';
import './login.css';

class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: null,
      password: null,
      valid: false,
      dataLoading: false
    }
  }
  Auth = new AuthHetperMethods();

  setEmailValue = (e) => {
    const value = e.target.value
    this.setState({ email: value })
  }

  setPasswordValue = (e) => {
    const value = e.target.value
    this.setState({ password: value })
  }

  handleFormSubmit = e => {
    e.preventDefault();
    this.setState({
      dataLoading: true
    })
    if (this.state.email !== null && this.state.password !== null) {
      this.Auth.login(this.state.email, this.state.password)
        .then(res => {
          if (res === false) {
            this.setState({ valid: true })
            // return "Sorry those credentials don't exist!";
          }
          else {
            this.props.history.replace("/");
          }
        })
        .catch(err => {
          console.log(err)
          return err
        });
    }
    this.setState({
      dataLoading: false
    })
  }

  render() {
    return (
      // <div>
      //   <div className="loginContainer">
      //     <input type="text" placeholder="email" name="email" onChange={this.setEmailValue} /><br />
      //     <input type="password" placeholder="password" name="password" onChange={this.setPasswordValue} /><br />
      //     <button onClick={this.handleFormSubmit}>login</button>
      //     {this.state.valid ? < div style={{ color: "red" }}>Invaild credentials!</div> : <div></div>}
      //   </div>
      // </div>
      <div className="form-container">
        <LoadingOverlay
          active={this.state.dataLoading}
          spinner
          text='Please wait...'>
          <div className="con">
            <header className="login-header head-form">
              <h2>Log In</h2>
              <p>login here using your email and password</p>
            </header>
            <br />
            <div>
              <input className="form-input" id="txt-input" type="text" placeholder="Email" onChange={this.setEmailValue} required />
              <br />
              <input className="form-input" type="password" placeholder="Password" id="pwd" name="password" onChange={this.setPasswordValue} required />
              <br />
              <button className="button log-in" onClick={this.handleFormSubmit}> Log In </button>
              {this.state.valid ? <div style={{ color: "red", textAlign: "center" }}>Invaild credentials!<br /></div> : <div></div>}
            </div>
            <div>
              <Link style={{ textDecoration: "none", color: "black" }} to={{ pathname: "/register" }} ><button className="button sign-up">Sign Up</button></Link>
            </div>
          </div>
        </LoadingOverlay>
      </div>
    );
  }
}

export default Login;
