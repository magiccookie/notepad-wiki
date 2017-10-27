/*
 *
 * SignupForm
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import { Link } from 'react-router';
import Helmet from 'react-helmet';

import { Checkbox, Form, Grid, Header,
         Segment, Message,
         Button, Input } from 'semantic-ui-react';

import Panel from '../../components/Panel';

import { makeSelectLoggedIn } from '../../reducers/Auth/selectors';
import { signup } from './actions';

import './style.css';


export class SignUpForm extends React.Component { // eslint-disable-line react/prefer-stateless-function

  initialState = {
    username: '',
    password: '',
    email: '',
    challenge: false,
  };

  constructor(props) {
    super(props);
    this.state = this.initialState;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.loggedIn) this.props.dispatch(push('/'));
  }

  handleCheckboxChange = () => this.setState({ challenge: !this.state.challenge })
  handleFormChange = (e) => {
    let value =  e.target.value;
    if (e.target.name === 'username') {
      value = value.trim().toLowerCase();
    } else if (e.target.name === 'email') {
      value = value.trim().toLowerCase()
    } else if (e.target.name === 'password') {
      value = value.trim();
    }
    this.setState({ [e.target.name]: value });
  }


  handleSubmit = (e) => {
    e.preventDefault();
    if (this.state.username && this.state.password) {
      this.props.dispatch(signup(this.state));
      this.setState(this.initialState);
    }
  }

  render() {
    return (
      <div>
        <Panel />

        <Grid centered columns={2}>
          <Grid.Column mobile={16} tablet={8}>
            <Helmet title="Sign Up" />

            <div className="authForm">
              <Header as="h2" className="authForm__header">Create new account</Header>
              <Form size="large" onSubmit={this.handleSubmit}>
                <Segment raised secondary>
                  <Form.Field>
                    <Input
                      icon="user"
                      iconPosition="left"
                      type="text"
                      placeholder="username"
                      name="username"
                      value={this.state.username}
                      onChange={this.handleFormChange}
                    />
                  </Form.Field>
                  <Form.Field>
                    <Input
                      icon="mail"
                      iconPosition="left"
                      type="text"
                      placeholder="email (optional)"
                      name="email"
                      value={this.state.email}
                      onChange={this.handleFormChange}
                    />
                  </Form.Field>
                  <Form.Field>
                    <Input
                      icon="lock"
                      iconPosition="left"
                      type="password"
                      placeholder="Password"
                      name="password"
                      value={this.state.password}
                      onChange={this.handleFormChange}
                    />
                  </Form.Field>
                  <Form.Field>
                    <Checkbox
                      label='I will behave nice'
                      name="challenge"
                      checked={this.state.challenge}
                      onChange={this.handleCheckboxChange}
                    />
                  </Form.Field>
                  <Button fluid size="large" color="blue">Create account</Button>
                </Segment>

                <Message
                  error
                  header="There was some errors with your submission"
                  list={[
                    'You must include both a upper and lower case letters in your password.',
                    'You need to select your home country.']}
                />
              </Form>
            </div>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

SignUpForm.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => (
  {
    loggedIn: makeSelectLoggedIn(state),
  }
);

const mapDispatchToProps = (dispatch) => ({ dispatch });

export default connect(mapStateToProps, mapDispatchToProps)(SignUpForm);
