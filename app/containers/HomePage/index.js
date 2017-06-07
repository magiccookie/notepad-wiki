/*
 * HomePage
 *
 */

import React from 'react';
import { Grid, Segment } from 'semantic-ui-react';
import './style.css';

export default class HomePage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props);
    this.state = { isSplit: false };
  }

  toggleSplit = () => {
    const curSplit = this.state.isSplit;
    this.setState({ isSplit: !curSplit });
  }

  handleLink = (e) => {
    e.preventDefault();
    this.toggleSplit();
  }

  render() {
    return (
      <Grid
        columns={2}
        padded="vertically"
        centered={!this.state.isSplit}
      >
        <Grid.Row>
          <Grid.Column>
            <Segment>
              <h1>Header</h1>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad beatae quam sequi, nihil perferendis illum doloribus asperiores
                molestias est, excepturi magni dolore voluptatem assumenda fugiat nulla tempora dicta quasi sunt. Lorem ipsum
                dolor sit amet, consectetur adipisicing elit. Ad beatae quam sequi, nihil perferendis illum doloribus asperiores
                molestias est, excepturi magni dolore voluptatem assumenda fugiat nulla tempora dicta quasi sunt.
                <a href="#note2" onClick={(e) => this.handleLink(e)}>
                  Link to another note
                </a>
              </p>
            </Segment>
          </Grid.Column>
          { this.state.isSplit ?
            (
              <Grid.Column>
                <Segment>
                  <h1>Secondary article</h1>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad beatae quam sequi, nihil perferendis illum doloribus asperiores
                    molestias est, excepturi magni dolore voluptatem assumenda fugiat nulla tempora dicta quasi sunt. Lorem ipsum
                    dolor sit amet, consectetur adipisicing elit. Ad beatae quam sequi, nihil perferendis illum doloribus asperiores
                    molestias est, excepturi magni dolore voluptatem assumenda fugiat nulla tempora dicta quasi sunt.
                  </p>
                </Segment>
              </Grid.Column>
            ) : null
          }
        </Grid.Row>
      </Grid>
    );
  }
}
