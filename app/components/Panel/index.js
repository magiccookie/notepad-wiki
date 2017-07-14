/**
*
* Panel
*
*/

import React from 'react';
import { Segment } from 'semantic-ui-react';
import Logo from '../../components/Logo';
import LoginButton from '../../components/LoginButton';

import './style.css';

const Panel = () => {
  return (
    <Segment>
      <div className="panel">
        <Logo />
        <LoginButton />
      </div>
    </Segment>
  );
}

export default Panel;
