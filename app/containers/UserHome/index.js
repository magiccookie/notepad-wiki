/*
 *
 * UserHome
 *
 */

import React, { PropTypes } from 'react';
import { Button, Card, Container, Dropdown, Icon, Grid } from 'semantic-ui-react';
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

  clickOnCard = (note, e) => {
    const name = note.get("name");
    const url = `/note/${name}/`;
    this.props.dispatch(push(url));
  }

  deleteNote = (note, e) => {
    this.props.dispatch(a.deleteNote(note));
  }

  addNew = () => this.props.dispatch(push('/create/'));

  render() {
    const content = this.props.posts.reverse().map((note) => (
      <Grid.Column
        key={note.get("id")}
      >
        <Card
          className="card_item"
          onClick={(e) => this.clickOnCard(note, e)}
        >
          <Card.Content>
            <Card.Header>
              <div className="card_item__head">
                <Dropdown
                  className="card_item__head-dropdown"
                  icon="angle down"
                >
                  <Dropdown.Menu>
                    <Dropdown.Item
                      onClick={(e) => this.deleteNote(note, e)}
                    >
                      Delete
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                <div className="card_item__head-title">
                  {note.get('header')}
                </div>
              </div>
            </Card.Header>
            <Card.Description>
              {note.get('content')}
            </Card.Description>
          </Card.Content>
        </Card>
      </Grid.Column>
    ));

    const addButton = (
      <Grid.Column>
        <div className="ui card card_item">
          <Button
            className="card_item__button"
            color="blue"
            size="huge"
            onClick={this.addNew}
          >
            <Icon name="pencil" />
            add new note
          </Button>
        </div>
      </Grid.Column>
    );

    return (
      <div>
        <Panel />
        <Container>
          <Grid
            relaxed
            padded="vertically"
            reversed="computer"
            columns={4}
          >
            {addButton}
            {content}
          </Grid>
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
