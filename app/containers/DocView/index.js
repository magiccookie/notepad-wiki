/*
 *
 * DocView
 *
 */

import React, { PropTypes } from 'react';
import { Container, Form, Grid, Input, Segment, TextArea } from 'semantic-ui-react';

import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import marked from 'marked';

import Panel from '../../components/Panel';

import * as a from './actions';
import * as s from './selectors';

import './style.css';

class DocView extends React.Component { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props);
    this.state = {
      noteHeaderEditState: '',
      noteContentEditState: '',
      isSplitMode: false,
      isEditMode: false,
    };
  }

  componentWillMount() {
    const noteName = this.props.params.note;
    this.props.dispatch(a.getNoteByName(noteName));
  }

  toggleSplitMode = () => {
    const curSplit = this.state.isSplitMode;
    this.setState({ isSplitMode: !curSplit });
  }

  toggleEditMode = () => {
    const nextEditMode = !this.state.isEditMode;
    const nextSplitMode = nextEditMode;
    const noteHeaderEditState = nextEditMode ? this.props.activeNote.get("header") : '';
    const noteContentEditState = nextEditMode ? this.props.activeNote.get("content") : '';
    this.setState({
      noteContentEditState: noteContentEditState,
      noteHeaderEditState: noteHeaderEditState,
      isSplitMode: nextSplitMode,
      isEditMode: nextEditMode,
    });
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
    const noteContentEditState = e.target.value;
    this.setState({ noteContentEditState });
    this.props.dispatch(a.updateActiveNoteContent(noteContentEditState));
  }

  handleHeaderEdit = (e) => {
    const noteHeaderEditState = e.target.value;
    this.setState({ noteHeaderEditState });
    this.props.dispatch(a.updateActiveNoteHeader(noteHeaderEditState));
  }

  markedText = (text) => {
    const mdHtml = marked(text || '', { sanitize: true });
    return { __html: mdHtml };
  }

  render() {
    return (
      <div>
        <Panel />
        <Container>
          <Grid
            columns={2}
            padded="vertically"
            centered={!this.state.isSplitMode}
          >
            <Grid.Row>
              <Grid.Column>
                <Segment>
                  { this.state.isEditMode ? (
                  <article>
                    <header>
                      <Input
                        type="text"
                        value={this.state.noteHeaderEditState}
                        onChange={this.handleHeaderEdit}
                      />
                      <a
                        className="article__edit"
                        href="#edit"
                        onClick={(e) => this.handleClickEdit(e)}
                      >
                        { this.state.isEditMode ? 'done' : 'edit' }
                      </a>
                    </header>
                    <Form>
                      <TextArea
                        autoHeight
                        value={this.state.noteContentEditState}
                        onChange={this.handleEdit}
                      />
                    </Form>
                  </article>
                  ) : (
                    <article>
                        <header>
                          <h1 className="article__h1">{this.props.activeNote.get("header")}</h1>
                          <a
                            className="article__edit"
                            href="#edit"
                            onClick={(e) => this.handleClickEdit(e)}
                          >
                            { this.state.isEditMode ? 'done' : 'edit' }
                          </a>
                        </header>
                        <p dangerouslySetInnerHTML={this.markedText(this.props.activeNote.get("content"))}></p>
                      </article>
                      )
                    }
                </Segment>
              </Grid.Column>
              { this.state.isSplitMode ?
                (
                  <Grid.Column>
                    { this.state.isEditMode ? (
                        <Segment>
                          <article>
                            <h1>{this.props.activeNote.get("header")}</h1>
                            <p dangerouslySetInnerHTML={this.markedText(this.props.activeNote.get("content"))}></p>
                          </article>
                        </Segment>
                      ) : (
                        <Segment>
                          <article>
                            <h1>{this.props.secondaryNote.get("header")}</h1>
                            <p dangerouslySetInnerHTML={this.markedText(this.props.secondaryNote.get("content"))}></p>
                          </article>
                        </Segment>
                      )
                    }
                  </Grid.Column>
                ) : null
              }
            </Grid.Row>
          </Grid>
        </Container>
      </div>
    );
  }
}

DocView.propTypes = {
  activeNote: PropTypes.object.isRequired,
  secondaryNote: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => (
  {
    activeNote: s.selectActiveNote(state),
    secondaryNote: s.selectSecondaryNote(state),
  }
);

const mapDispatchToProps = (dispatch) => ({ dispatch });

export default connect(mapStateToProps, mapDispatchToProps)(DocView);
