/*
 *
 * UserHome
 *
 */

import React, { PropTypes } from 'react';
import { Button, Card, Container, Dropdown, Icon } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import * as s from './selectors';
import * as a from './actions';

import Panel from '../../components/Panel';

import './style.css';

class UserHome extends React.Component { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    this.props.dispatch(a.getLatestPosts());
  }

  clickOnCard = (name, e) => {
    const url = `/note/${name}/`;
    this.props.dispatch(push(url));
  }

  deleteNote = (id, index, e) => {
    this.props.dispatch(a.deleteNote(id, index));
  }

  addNew = () => {
    this.props.dispatch(push('/create/'));
  }

  render() {
    const content = this.props.posts.map((post, index) => (
      <Card
        key={post.get("id")}
        className="card_block__item"
        onClick={(e) => this.clickOnCard(post.get("name"), e)}
      >
        <Card.Content>
          <Card.Header>
            <div className="card_block__heading">
              <Dropdown
                className="card_block__dropdown"
                icon="angle down"
              >
                <Dropdown.Menu>
                  <Dropdown.Item
                    onClick={(e) => this.deleteNote(post.get("id"), index, e)}
                  >
                    Delete
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <div className="card_block__header">
                {post.get('header')}
              </div>
            </div>
          </Card.Header>
          <Card.Description>
            {post.get('content')}
          </Card.Description>
        </Card.Content>
      </Card>
    ));

    const addButton = (
      <div className="ui card card_block__item">
        <Button
          className="card_block__button"
          color="blue"
          size="huge"
          onClick={this.addNew}
        >
          <Icon name="pencil" />
          add new note
        </Button>
      </div>
    );

    return (
      <div>
        <Panel />
        <Container>
          <div className="card_block">
            {addButton}
            {content}
          </div>
        </Container>
      </div>
    );
  }
}

UserHome.propTypes = {
  posts: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({posts: s.makeSelectPosts(state)});

const mapDispatchToProps = (dispatch) => ({ dispatch });

export default connect(mapStateToProps, mapDispatchToProps)(UserHome);
