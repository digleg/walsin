/**
 *
 * Active
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { FormattedMessage } from 'react-intl';

// material-UI
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Card from 'material-ui/Card';
import Snackbar from 'material-ui/Snackbar';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { makeSelectActive, SelectActiveCodeResp } from './selectors';
import reducer from './reducer';
import saga from './saga';
import { codeActive, activeCodeResp } from './actions';

import { SelectMenuOpened } from '../App/selectors';
import Header from '../Main/index';

// i18l
import messages from './messages';

export class Active extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      activeCode: '',
    };
  }

  submitActive = () => {
    this.props.dispatch(codeActive({ d: this.state.activeCode }));
  };

  // eslint-disable-line react/prefer-stateless-function
  render() {
    const { activeResp, menuOpen } = this.props;
    return (
      <div
        style={
          menuOpen
            ? { backgroundColor: '#f2f5f8', minHeight: '100vh', marginLeft: 300 }
            : { backgroundColor: '#f2f5f8', minHeight: '100vh' }
        }
      >
        <Helmet>
          <title>Active</title>
          <meta name="description" content="Description of Active" />
        </Helmet>
        {/* <FormattedMessage {...messages.header} /> */}
        <Header />
        <Card style={{ margin: 30, padding: 30 }}>
          <div>
            <div style={{ fontWeight: 'bold' }}>
              <FormattedMessage {...messages.CodeAcitvation} />
            </div>
            <TextField
              style={{ width: '350px', fontWeight: 'bold' }}
              hintText={<FormattedMessage {...messages.CodeAcitvationHint} />}
              value={this.state.activeCode}
              onChange={e => this.setState({ activeCode: e.target.value })}
            />
          </div>
          <div
            style={{
              display: 'flex',
              flex: 1,
              flexDirection: 'column',
              alignItems: 'flex-end',
              marginTop: 10,
            }}
          >
            <RaisedButton
              label={<FormattedMessage {...messages.CodeAcitvationBtn} />}
              buttonStyle={{ backgroundColor: '#0072bc' }}
              onClick={this.submitActive}
            />
          </div>
        </Card>
        <Snackbar
          // open={this.state.inputError}
          open={activeResp !== ''}
          message={
            activeResp.responseMsg !== undefined ? (
              activeResp.responseMsg.toUpperCase() === 'MISSING PARAMETER' ? (
                <FormattedMessage {...messages[activeResp.responseMsg.toUpperCase()]} />
              ) : (
                activeResp.responseMsg.toUpperCase()
              )
            ) : (
              ''
            )
          }
          autoHideDuration={2000}
          bodyStyle={{ backgroundColor: '#424242', width: 50, fontWeight: 800, borderRadius: 4, fontFamily: 'Oxygen' }}
          contentStyle={
            activeResp.responseCode === '999'
              ? { color: 'red', textAlign: 'center', fontFamily: 'Oxygen', fontWeight: '500' }
              : { color: '#0072bc', textAlign: 'center', fontFamily: 'Oxygen', fontWeight: '500' }
          }
          onRequestClose={() => {
            this.props.dispatch(activeCodeResp(''));
          }}
        />
      </div>
    );
  }
}

Active.propTypes = {
  dispatch: PropTypes.func.isRequired,
  activeResp: PropTypes.any,
  menuOpen: PropTypes.bool,
};

const mapStateToProps = createStructuredSelector({
  active: makeSelectActive(),
  activeResp: SelectActiveCodeResp(),
  menuOpen: SelectMenuOpened(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'active', reducer });
const withSaga = injectSaga({ key: 'active', saga });

export default compose(withReducer, withSaga, withConnect)(Active);
