import _ from 'lodash';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Search, Grid, Header } from 'semantic-ui-react';

import { makeSelectPosts } from '../../containers/UserHome/selectors';
import * as a from '../../containers/UserHome/actions';

const source = [
  { title: "hello",  description: "text"},
  { title: "hello2", description: "text"},
  { title: "hello3", description: "text"},
  { title: "hello4", description: "text"},
]

class SearchResults extends React.Component {

  SingleItem = ({ title, description }) => {
    return (
      <div className='result' key={ `item-${title}` }>
        <div className='content'>
          {title && <div className='title'>{title}</div>}
          {description && <div className='description'>{description}</div>}
        </div>
      </div>
    )
  }

  nomatch = () => (
    <div className="results transition visible">
      <div className="message empty">
        <div className="header">No results found.</div>
      </div>
    </div>
  )

  foundResults = (results) => (
    <div className="results transition visible">
      { results.map(i => this.SingleItem(i)) }
    </div>
  )

  render() {
    const { results } = this.props;

    if (results && results.length) {
      return ( this.foundResults(results) )
    } else {
      return ( this.nomatch() )
    }
  }
}

class SearchBar extends React.Component {
  componentWillMount() {
    this.props.dispatch(a.getLatestPosts());
    this.setState({ isLoading: false, results: [], value: '' });
  }

  handleChange = (e) => {
    const value = e.target.value;

    this.setState({ isLoading: true, value: value })
    const re = new RegExp(_.escapeRegExp(this.state.value));

    setTimeout(() => {
      const re = new RegExp(_.escapeRegExp(value), 'i')
      const isMatch = result => re.test(result.title)

      this.setState({
        isLoading: false,
        results: _.filter(source, isMatch),
      })
    }, 100)
  }

  render() {
    const { isLoading, value, results } = this.state;

    return (
      <div className="ui search panel__search">
        <div className="ui icon input">
          <input
            type="text"
            tabIndex="0"
            className="prompt"
            value={value}
            onChange={this.handleChange}
            autoComplete="off"
          />
          <i aria-hidden="true" className="search icon"></i>
        </div>
        {!!this.state.value && <SearchResults results={this.state.results}/> }
      </div>
    );
  }
}

SearchBar.propTypes = {
  source: PropTypes.array.isRequired,
  dispatch: PropTypes.func.isRequired,
};

/* const mapStateToProps = (state) => ({source: makeSelectPosts(state)});*/
const mapStateToProps = (state) => ({ source: source });
const mapDispatchToProps = (dispatch) => ({ dispatch });

export default connect(mapStateToProps, mapDispatchToProps)(SearchBar);
