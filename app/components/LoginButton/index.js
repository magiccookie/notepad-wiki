/**
*
* LoginButton
*
*/

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import {
  makeSelectLoggedIn,
  makeSelectProfile,
} from '../../reducers/Auth/selectors';

import { wipeAuthState } from '../../reducers/Auth/actions';

import './style.css';

class LoginButton extends React.Component { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props);
    this.state = {};
  }

  logOut = (e) => {
    e.preventDefault();
    this.props.dispatch(wipeAuthState());
  };

  render() {
    return (
      <div className="login">
        { this.props.loggedIn ? (
            <span className="login__profile">
              { this.props.profile.username } (<a href="/" onClick={this.logOut}>log out</a>)
            </span>
          ) : (
            <Link
              className="login__link"
              to="/login/"
            >
              Log-in/Sign up
            </Link>
          )
        }
      </div>
    );
  }
}

LoginButton.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
  profile: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) =>({ dispatch });

const mapStateToProps = (state) => (
  {
    loggedIn: makeSelectLoggedIn(state),
    profile: makeSelectProfile(state),
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(LoginButton);
