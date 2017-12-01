/**
*
* Panel
*
*/

import React from 'react';
import { Segment } from 'semantic-ui-react';
import Logo from '../../components/Logo';
import LoginButton from '../../components/LoginButton';
import SearchBar from '../../components/SearchBar';

import './style.css';

const searchbar = show => !!show ? <SearchBar className="panel__box" /> : null;
const Panel = props => {
  return (
    <Segment>
      <div className="panel">
        <Logo className="panel__box" />
        {searchbar(props.search)}
        <LoginButton className="panel__box" />
      </div>
    </Segment>
  );
}

export default Panel;
