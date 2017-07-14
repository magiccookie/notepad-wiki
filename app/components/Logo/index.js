/**
*
* Logo
*
*/

import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import './style.css';

const Logo = () => {
  return (
    <div className="logo">
      <h3>
        <Link className="logo__link" to="/">
          notepad-wiki
        </Link>
      </h3>
    </div>
  );
}

export default Logo;
