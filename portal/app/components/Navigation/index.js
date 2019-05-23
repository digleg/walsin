/*
 *
 * Navigation
 *
 */

import React from 'react';
import { Link } from 'react-router';
import styles from './styles.css';

function Navigation(props) {
  return (
    <div className={styles.navigationwrapper}>
      |{' '}
      <Link to={props.path} className={styles.items} activeClassName={styles.currentPage}>
        &nbsp;{props.text}&nbsp;
      </Link>{' '}
      |
    </div>
  );
}

Navigation.propTypes = {
  // eslint-disable-next-line
  className: React.PropTypes.string,
  text: React.PropTypes.string,
  path: React.PropTypes.string,
};

export default Navigation;
