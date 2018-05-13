import _ from 'lodash';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { fromJS } from 'immutable';
import { Search, Grid, Header } from 'semantic-ui-react';

import { nameToUrl } from '../../utils/helpers';
import * as a from '../../reducers/Search/actions';
import { makeSelectSearchResults } from '../../reducers/Search/selectors';

class SearchBar extends React.Component {

  componentWillMount() {
    this.setState({ isLoading: false, value: '' });
  }

  componentWillReceiveProps(nextProps) {
    if (!!nextProps.source) {
      this.setState({ isLoading: false })
    }
  }

  handleChange = (e) => {
    const value = e.target.value
    this.setState({ isLoading: true, value: value })
    this.props.dispatch(a.search(value))
  }

  handleClick = (result, e) => {
    const noteNameSanitized = nameToUrl(result.get("name"))
    const url = `/note/${noteNameSanitized}/`
    this.setState({ value: '' })
    this.props.dispatch(push(url))
  }

  singleItem = (result) => {
    const id          = result.get('id')
    const title       = result.get('header')
    const description = result.get('content').substr(0, 90)
    return (
      <div className='result' key={`item-${id}`} >
        <div className='content' onClick={() => this.handleClick(result)} >
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
      { results.map(result => this.singleItem(result)) }
    </div>
  )

  searchResults = (results) => {
    if (results && results.size) {
      return ( this.foundResults(results) )
    } else {
      return ( this.nomatch() )
    }
  }

  render() {
    const { isLoading, value } = this.state;
    const { source } = this.props;

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
        {!!value && this.searchResults(source)}
      </div>
    );
  }
}

SearchBar.propTypes = {
  source:   PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({source: makeSelectSearchResults(state)});
const mapDispatchToProps = (dispatch) => ({ dispatch });

export default connect(mapStateToProps, mapDispatchToProps)(SearchBar);
