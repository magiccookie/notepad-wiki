/*
 * HomePage
 *
 */

import React, { PropTypes } from 'react';
import { Card, Container } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import { makeSelectLoggedIn } from '../../reducers/Auth/selectors';
import { makeSelectPosts } from './selectors';

import { getLatestPosts } from './actions';

import Panel from '../../components/Panel';
import './style.css';

class HomePage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    this.props.dispatch(getLatestPosts());
  }

  clickOnCard = (e) => {
    e.preventDefault();
    console.log(e)
    this.props.dispatch(push("/test"));
  }

  render() {
    const content = this.props.posts.map((post) => (
      <Card
        key={post.get("id")}
        className="card_block__item"
        onClick={(e) => this.clickOnCard(e)}
      >
        <Card.Content>
          <Card.Header>
            {post.get('header')}
          </Card.Header>
          <Card.Description>
            {post.get('content')}
          </Card.Description>
        </Card.Content>
      </Card>
    ));

    return (
      <div>
        <Panel />
        <Container>
          <div className="card_block">
            {content}
          </div>
        </Container>
      </div>
    );
  }
}

HomePage.propTypes = {
  posts: PropTypes.object.isRequired,
  loggedIn: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => (
  {
    posts: makeSelectPosts(state),
    loggedIn: makeSelectLoggedIn(state),
  }
);

const mapDispatchToProps = (dispatch) => ({ dispatch });

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
