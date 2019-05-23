/**
 *
 * UrlPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
// import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { viz } from 'tableau-api';
import TableauReport from 'tableau-react';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { SelectMenuOpened, SelectUrl } from '../App/selectors';
import { makeSelectUrlPage } from './selectors';
import reducer from './reducer';
import saga from './saga';
// import messages from './messages';

export class UrlPage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      contentHeight: 100,
    };
  }

  componentDidMount() {}

  render() {
    const { url } = this.props;

    return (
      <div>
        <Helmet>
          <title>UrlPage</title>
          <meta name="description" content="Description of UrlPage" />
        </Helmet>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <iframe
            src={url.concat('?:iid=7&iframeSizedToWindow=true&:embed=y&:showAppBanner=false&:display_count=no&:showVizHome=no')}
            title="iframe"
            width={window.innerWidth}
            height={window.innerHeight}
            scrolling="auto"
          />
          {/* <TableauReport url="http://mallbi.walsin.com/views/WIP20180730/WIP" token="<TRUSTED TICKET HERE>" /> */}
        </div>
      </div>
    );
  }
}

UrlPage.propTypes = {
  url: PropTypes.string,
};

const mapStateToProps = createStructuredSelector({
  urlpage: makeSelectUrlPage(),
  menuOpen: SelectMenuOpened(),
  url: SelectUrl(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

const withReducer = injectReducer({ key: 'urlPage', reducer });
const withSaga = injectSaga({ key: 'urlPage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect
)(UrlPage);
