import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Link from '@material-ui/core/Link';

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

class DefaultFooter extends Component {
  render() {

    // eslint-disable-next-line
    const { children, ...attributes } = this.props;

    return (
      <React.Fragment>
        <Link href="#">
           <span>AseanSlots  &copy; 2020</span>
        </Link>
      </React.Fragment>
    );
  }
}

DefaultFooter.propTypes = propTypes;
DefaultFooter.defaultProps = defaultProps;

export default DefaultFooter;
