/*
 *
 * LoginForm
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import Helmet from 'react-helmet';

import { Form, Grid, Header,
         Segment, Message,
         Button, Input } from 'semantic-ui-react';

import Panel from '../../components/Panel';

import makeSelectAuthState from '../../reducers/Auth/selectors';
import './style.css';

export class LoginForm extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
    };
  }

  handleFormChange = (e) => {
    let value = e.target.value;
    if (e.target.name === 'username') value = value.toLowerCase();
    this.setState({ [e.target.name]: value });
  }

  render() {
    return (
      <div>
        <Panel />

        <Grid centered columns={2}>
          <Grid.Column mobile={16} tablet={8}>
            <Helmet title="Login" />

            <div className="authForm">
              <Header as="h2" className="authForm__header">Log-in to your account</Header>
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
                      icon="lock"
                      iconPosition="left"
                      type="password"
                      placeholder="Password"
                      name="password"
                      value={this.state.password}
                      onChange={this.handleFormChange}
                    />
                  </Form.Field>
                  <Button fluid size="large" color="blue">Login</Button>
                </Segment>

                <Message
                  error
                  header="There was some errors with your submission"
                  list={[
                    'You must include both a upper and lower case letters in your password.',
                    'You need to select your home country.']}
                />
              </Form>

              <Message>
                Don't have an account? <Link to="/signup/"><b>Register NOW!</b></Link>
              </Message>

            </div>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

LoginForm.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(null, mapDispatchToProps)(LoginForm);
