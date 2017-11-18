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
      noteHeaderCreateState: '',
      noteContentCreateState: '',
      isSplitMode: false,
      isEditMode: false,
      isCreateMode: false,
    };
  }

  componentWillMount() {
    if (this.props.route.name === 'create') {
      this.setState({ isCreateMode: true });
      this.toggleEditMode();
    } else {
      const noteName = this.props.params.note;
      this.props.dispatch(a.getNoteByName(noteName));
    }
  }

  toggleSplitMode = () => {
    const curSplit = this.state.isSplitMode;
    this.setState({ isSplitMode: !curSplit });
  }

  toggleEditMode = () => {
    const nextEditMode = !this.state.isEditMode;
    const nextSplitMode = nextEditMode;
    const noteHeaderEditState = nextEditMode ? this.props.activeNote.get("header") || '' : '';
    const noteContentEditState = nextEditMode ? this.props.activeNote.get("content") || '': '';
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

  handleClickDone = (e) => {
    e.preventDefault();
    if (this.state.isCreateMode) {
      const note = {
        header: this.state.noteHeaderCreateState,
        content: this.state.noteContentCreateState,
      }
      this.props.dispatch(a.saveNote(note));
    }
    this.toggleEditMode();
  }

  handleClickEdit = (e) => {
    e.preventDefault();
    this.toggleEditMode();
  }

  handleEdit = (e) => {
    const noteContentEditState = e.target.value;
    this.setState({ noteContentEditState });
    if (this.state.isCreateMode) {
      this.setState({ noteContentCreateState: noteContentEditState.trim()})
    } else {
      this.props.dispatch(a.updateActiveNoteContent(noteContentEditState.trim()));
    }
  }

  handleHeaderEdit = (e) => {
    const noteHeaderEditState = e.target.value;
    this.setState({ noteHeaderEditState });
    if (this.state.isCreateMode) {
      this.setState({ noteHeaderCreateState: noteHeaderEditState.trim()})
    } else {
      this.props.dispatch(a.updateActiveNoteHeader(noteHeaderEditState.trim()));
    }
  }

  markedText = (text) => {
    const t = text || '';
    const mdHtml = marked(t, { sanitize: true });
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
                      { this.state.isEditMode ?
                        (
                          <a
                            className="article__edit"
                            href="#done"
                            onClick={this.handleClickDone}
                          >
                            done
                          </a>
                        ) : (
                          <a
                            className="article__edit"
                            href="#edit"
                            onClick={his.handleClickEdit}
                          >
                            edit
                          </a>
                        )
                      }
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
                          { this.state.isCreateMode ?
                            (
                              <article>
                                <h1>{this.state.noteHeaderCreateState}</h1>
                                <p dangerouslySetInnerHTML={this.markedText(this.state.noteContentCreateState)}></p>
                              </article>
                            ) : (
                              <article>
                                <h1>{this.props.activeNote.get("header")}</h1>
                                <p dangerouslySetInnerHTML={this.markedText(this.props.activeNote.get("content"))}></p>
                              </article>
                            )
                          }
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
