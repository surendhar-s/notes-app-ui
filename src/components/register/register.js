import React, { Component } from 'react';
import axios from 'axios';
import './register.css'
import { Link } from 'react-router-dom';

class Register extends Component {

  flag = false;
  constructor(porps) {
    super(porps)
    this.state = {
      email: null,
      password: null,
      name: null,
      contactNumber: 1000000000,
      isValidPassword: false,
      isValidEmail: false,
      isNewEmail: false,
      isAllFieldFilled: false
    }
  }

  setEmailValue = (e) => {
    this.setState({ email: e.target.value })
  }

  setPasswordValue = async (e) => {
    this.setState({ password: e.target.value })
  }

  setNameValue = (e) => {
    this.setState({ name: e.target.value })
  }

  setContactNumberValue = (e) => {
    this.setState({ contactNumber: e.target.value })
  }

  checkUserEmail = async () => {
    const data = await axios.get("http://localhost:3200/api/users/checkUserEmail/" + this.state.email)
    if (!data.data.message.success) {
      this.setState({
        isNewEmail: true
      })
    }
    else {
      this.setState({
        isNewEmail: false
      })
    }
  }

  checkFileds() {
    if (this.state.name !== null && this.state.email !== null && this.state.password !== null) {
      this.setState({ isAllFieldFilled: true })
      if (this.state.password.length >= 5) {
        this.setState({ isValidPassword: true })
      }
      else {
        this.setState({ isValidPassword: false })
      }
      if ((this.state.email.indexOf('@') !== -1) && (this.state.email.indexOf('.') !== -1)) {
        this.setState({ isValidEmail: true })
      }
      else {
        this.setState({ isValidEmail: false })
      }
      if (this.state.isValidEmail && this.state.isValidPassword) {
        return true
      }
    }
    else {
      this.setState({ isAllFieldFilled: false })
      return false
    }
  }

  handleSubmit = async () => {
    this.flag = true
    await this.checkUserEmail()
    if (this.checkFileds() && this.state.isNewEmail) {
      const data = await axios.post("http://localhost:3200/api/users/createUser", {
        name: this.state.name,
        password: this.state.password,
        email: this.state.email,
        contactNumber: this.state.contactNumber
      })
      const userDetails = data.data.message
      if (data.data.message.success) {
        console.log(userDetails.message)
        this.props.history.replace("/");
      }
      else {
        console.log(userDetails.message)
      }
    }
  }

  render() {
    return (
      <div className="form-container">
        <div className="con">
          <header className="head-form login-header">
            <h2>Sign up</h2>
            <p>Sign up here using mail ID</p>
          </header>
          <br />
          <div>
            <input className="form-input" type="text" placeholder="Name*" onChange={this.setNameValue} required />
            <br />
            <input className="form-input" type="email" placeholder="Email*" onChange={this.setEmailValue} required />
            <br />
            <input className="form-input" type="password" placeholder="Password*" id="pwd" name="password" onChange={this.setPasswordValue} required />
            <br />
            <input className="form-input" type="text" placeholder="Mobile number without +" onChange={this.setContactNumberValue} />
            <br />
            <button className="button log-in" type="submit" onClick={this.handleSubmit}> Sign up </button>
          </div>
          <div>
            {this.flag ? <div>{this.state.isAllFieldFilled ? <div>
              {this.state.isValidPassword ? <div>
                {this.state.isValidEmail ? <div>
                  {this.state.isNewEmail ? <div></div> : <div><span style={{ color: "red" }}>Email already registered.</span></div>}
                </div> : <div><span style={{ color: "red" }}>Please enter valid email</span></div>}
              </div> : <div><span style={{ color: "red" }}>Password should have a minimum of 5 characters</span></div>}
            </div> : <div><span style={{ color: "red" }}>Please fill all mandatory fields</span></div>}</div> : <div></div>}
          </div>
          <div>
            <Link style={{ textDecoration: "none", color: "black" }} to={{ pathname: "/login" }} ><button className="button sign-up">Login</button></Link>
          </div>
        </div>
      </div>
    );
  }
}

export default Register;


/**
 * a b c
 * 0 0
 * 0 1
 * 1 0
 * 1 1
 */