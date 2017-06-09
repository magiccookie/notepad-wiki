/*
 * HomePage
 *
 */

import React from 'react';
import { Form, Grid, Segment, TextArea } from 'semantic-ui-react';

import './style.css';

export default class HomePage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props);
    this.note1 = {
      text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad beatae quam sequi, nihil perferendis illum doloribus asperiores molestias est, excepturi magni dolore voluptatem assumenda fugiat nulla tempora dicta quasi sunt. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad beatae quam sequi, nihil perferendis illum doloribus asperiores molestias est, excepturi magni dolore voluptatem assumenda fugiat nulla tempora dicta quasi sunt. ',
      header: 'Header',
    };

    this.note2 = {
      text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad beatae quam sequi, nihil perferendis illum doloribus asperiores molestias est, excepturi magni dolore voluptatem assumenda fugiat nulla tempora dicta quasi sunt. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad beatae quam sequi, nihil perferendis illum doloribus asperiores molestias est, excepturi magni dolore voluptatem assumenda fugiat nulla tempora dicta quasi sunt.',
      header: 'Secondary article',
    };

    this.state = {
      isSplitMode: false,
      isEditMode: false,
      firstNote: this.note1,
      secondNote: this.note2,
    };
  }

  toggleSplitMode = () => {
    const curSplit = this.state.isSplitMode;
    this.setState({ isSplitMode: !curSplit });
  }

  toggleEditMode = () => {
    const curEdit = this.state.isEditMode;
    const curSplit = curEdit;
    this.setState({ isSplitMode: !curSplit, isEditMode: !curEdit });
  }

  handleClickLink = (e) => {
    e.preventDefault();
    this.toggleSplitMode();
  }

  handleClickEdit = (e) => {
    e.preventDefault();
    this.toggleEditMode();
  }

  handleEdit = (e) => {
    const newNote = { ...this.state.firstNote, text: e.target.value };
    this.setState({ firstNote: newNote });
  }

  render() {
    return (
      <Grid
        columns={2}
        padded="vertically"
        centered={!this.state.isSplitMode}
      >
        <Grid.Row>
          <Grid.Column>
            <Segment>
              <article>
                <header>
                  <h1 className="article__h1">{this.state.firstNote.header}</h1>
                  <a
                    className="article__edit"
                    href="#edit"
                    onClick={(e) => this.handleClickEdit(e)}
                  >
                    { this.state.isEditMode ? 'done' : 'edit' }
                  </a>
                </header>
                { this.state.isEditMode ? (
                  <Form>
                    <TextArea
                      autoHeight
                      value={this.state.firstNote.text}
                      onChange={(e) => this.handleEdit(e)}
                    />
                  </Form>
                  ) : (
                    <p>
                      {this.state.firstNote.text}
                      <a href="#note2" onClick={(e) => this.handleClickLink(e)}>
                        Link to another note
                      </a>
                    </p>
                  )
                }
              </article>
            </Segment>
          </Grid.Column>
          { this.state.isSplitMode ?
            (
              <Grid.Column>
                { this.state.isEditMode ? (
                  <Segment>
                    <article>
                      <h1>{this.state.firstNote.header}</h1>
                      <p>{this.state.firstNote.text}</p>
                    </article>
                  </Segment>
                  ) : (
                    <Segment>
                      <article>
                        <h1>{this.state.secondNote.header}</h1>
                        <p>{this.state.secondNote.text}</p>
                      </article>
                    </Segment>
                  )
                }
              </Grid.Column>
            ) : null
          }
        </Grid.Row>
      </Grid>
    );
  }
}
