/**
*
* LoginButton
*
*/

import React, { PropTypes } from 'react';
import { Link } from 'react-router';

import './style.css';

class LoginButton extends React.Component { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props);
    this.state = {
      authState: {
        status: false,
        username: "",
      }};
  }

  render() {
    return (
      <div className="login">
        <Link
          className="login__link"
          to="/login/"
        >
          Log-in/Sign up
        </Link>
      </div>
    );
  }
}

LoginButton.propTypes = {};

export default LoginButton;
