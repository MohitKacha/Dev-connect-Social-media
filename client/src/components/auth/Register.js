import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { setAlert } from "../../actions/alert";
import { register } from "../../actions/auth";
import PropTypes from "prop-types";

const Register = ({ setAlert, register }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
  });

  const { name, email, password, password2 } = formData;

  const handleOnChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    if (password !== password2) {
      setAlert("password does not match", "danger");
      return;
    } else {
      console.log("into else");
      register({
        name,
        email,
        password,
      });
    }
  };

  return (
    <Fragment>
      <h1 className="large text-primary">Sign Up</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Create Your Account
      </p>
      {localStorage.setItem("hey", "hey")}
      <form className="form" onSubmit={(e) => handleOnSubmit(e)}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Name"
            name="name"
            value={name}
            onChange={(e) => handleOnChange(e)}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={email}
            onChange={(e) => handleOnChange(e)}
            required
          />
          <small className="form-text">
            This site uses Gravatar so if you want a profile image, use a
            Gravatar email
          </small>
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            minLength="6"
            onChange={(e) => handleOnChange(e)}
            value={password}
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Confirm Password"
            name="password2"
            minLength="6"
            value={password2}
            onChange={(e) => handleOnChange(e)}
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Register" />
      </form>
      <p className="my-1">
        Already have an account? <Link to="/login">Sign In</Link>
      </p>
    </Fragment>
  );
};

Register.prototypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
};

export default connect(null, { setAlert, register })(Register);
