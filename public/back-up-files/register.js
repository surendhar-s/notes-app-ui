import React, { Component } from 'react';
import axios from 'axios';
import './register.css'
import { Link } from 'react-router-dom';

class Register extends Component {

  constructor(porps) {
    super(porps)
    this.state = {
      email: null,
      password: null,
      name: null,
      contactNumber: null,
      isValidPassword: false,
      isValidEmail: false,
      isNewEmail: false,
      isPasswordFieldFocused: false,
      isEmailChecked: false,
    }
  }

  setEmailValue = (e) => {
    this.setState({ email: e.target.value, isValidEmail: false })
  }

  setPasswordValue = async (e) => {
    this.setState({ isPasswordFieldFocused: true })
    this.setState({ password: e.target.value })
    if (e.target.value.length >= 5) {
      this.setState({ isValidPassword: true })
    }
    else {
      this.setState({ isValidPassword: false })

    }
  }

  setNameValue = (e) => {
    this.setState({ name: e.target.value })
  }

  setContactNumberValue = (e) => {
    this.setState({ contactNumber: e.target.value })
  }

  checkUserEmail = async () => {
    // if (this.state.name !== null && this.state.email !== null && this.state.password !== null) {
    this.setState({ isEmailChecked: true })
    // const email = this.state.email
    // if ((email.indexOf('@') !== -1) && (email.indexOf('.') !== -1)) {
    //   this.setState({
    //     isValidEmail: true,
    //   })
    const data = await axios.get("http://localhost:3200/api/users/checkUserEmail/" + this.state.email)
    if (!data.data.message.success) {
      this.setState({
        isNewEmail: true
      })
      this.handleSubmit()
    }
    else {
      this.setState({
        isNewEmail: false
      })
    }
    // }
    // else {
    //   this.setState({
    //     isValidEmail: false
    //   })
    // }
    // }
  }

  checkFileds() {
    if (this.state.name !== null && this.state.email !== null && this.state.password !== null) {
      if (this.state.password.length >= 5) {
        this.setState({ isValidPassword: true })
      }
      else {
        this.setState({ isValidPassword: true })
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
      return false
    }
  }

  handleSubmit = async () => {
    if (this.checkFileds) {
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
      // <div>
      //   <input type="text" placeholder="Name" onChange={this.setNameValue} /><br />
      //   <input type="text" placeholder="Email" onChange={this.setEmailValue} /><button onClick={this.checkUserEmail}>Check email</button><br />
      //   <input type="password" placeholder="Password" onChange={this.setPasswordValue} /><br />
      //   <input type="text" placeholder="Contact Number" onChange={this.setContactNumberValue} /><br />
      //   <button type="submit" disabled={!(this.state.isValidEmail && this.state.isValidPassword)} onClick={this.handleSubmit}>Register</button><br />
      //   {this.state.isEmailChecked ? <div>{!this.state.isValidEmail ? <div style={{ color: "red" }}>Please enter valid email</div> : <div></div>}</div> : <div></div>}
      //   {!this.state.isValidPassword && this.isPasswordFieldFocused ? <div style={{ color: "red" }}>Please choose minimum length of password is 5</div> : <div></div>}
      // </div>
      <div className="form-container">
        {/* <form> */}
        <div className="con">
          <header className="head-form">
            <h2>Sign up</h2>
            <p>Sign up here using mail ID</p>
          </header>
          <br />
          <div>
            <input className="form-input" type="text" placeholder="Name*" onChange={this.setNameValue} required />
            <br />
            <input className="form-input" type="email" placeholder="Email*" onChange={this.setEmailValue} required />
            {/* <button className="checkButton" onClick={this.checkUserEmail}>Check Availability</button><br /> */}
            <br />
            <input className="form-input" type="password" placeholder="Password*" id="pwd" name="password" onChange={this.setPasswordValue} required />
            <br />
            <input className="form-input" type="text" placeholder="Mobile number without +" onChange={this.setContactNumberValue} />
            <br />
            <button className="button log-in" type="submit" onClick={this.checkUserEmail}> Sign up </button>
            {/* <button className="button log-in" disabled={!(this.state.isValidEmail && this.state.isValidPassword)} onClick={this.checkUserEmail}> Sign up </button> */}
            {/* {this.state.valid ? < div style={{ color: "red", textAlign: "center" }}>Invaild credentials!<br /></div> : <div></div>} */}
          </div>
          <div>
            {this.state.isEmailChecked ? <div>{!this.state.isValidEmail ? <div style={{ color: "red" }}><span style={{ color: "red" }}>Please enter valid email</span></div> : <div> {this.state.isNewEmail ? <div></div> : <div><span style={{ color: "red" }}>Email address is already taken, login to continue</span></div>} </div>}</div> : <div></div>}
            {!this.state.isValidPassword && this.isPasswordFieldFocused ? <div style={{ color: "red" }}><span style={{ color: "red" }}>Please choose minimum length of password is 5</span></div> : <div></div>}
          </div>
          <div>
            <Link style={{ textDecoration: "none", color: "black" }} to={{ pathname: "/login" }} ><button className="button sign-up">Login</button></Link>
          </div>
        </div>
        {/* </form> */}
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