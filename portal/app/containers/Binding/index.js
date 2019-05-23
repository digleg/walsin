/**
 *
 * Binding
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
import { makeSelectBinding, SelectBindingCodeResp } from './selectors';
import reducer from './reducer';
import saga from './saga';
import { codeBinding, bindingCodeResp } from './actions';

import { SelectMenuOpened } from '../App/selectors';
import Header from '../Main/index';

// i18l
import messages from './messages';

// eslint-disable-line react/prefer-stateless-function
export class Binding extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      bindingCode: '',
    };
  }

  submitBinding = () => {
    this.props.dispatch(codeBinding({ d: this.state.bindingCode }));
  };

  render() {
    const { bindingResp, menuOpen } = this.props;
    return (
      <div
        style={
          menuOpen
            ? { backgroundColor: '#f2f5f8', minHeight: '100vh', marginLeft: 300 }
            : { backgroundColor: '#f2f5f8', minHeight: '100vh' }
        }
      >
        <Helmet>
          <title>Binding</title>
          <meta name="description" content="Description of Binding" />
        </Helmet>
        <Header />
        <Card style={{ margin: 30, padding: 30 }}>
          <div>
            <div style={{ fontWeight: 'bold' }}>
              <FormattedMessage {...messages.CodeBinding} />
            </div>
            <TextField
              style={{ width: '350px', fontWeight: 'bold' }}
              hintText={<FormattedMessage {...messages.CodeBindingHint} />}
              value={this.state.bindingCode}
              onChange={e => this.setState({ bindingCode: e.target.value })}
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
              label={<FormattedMessage {...messages.CodeBindingBtn} />}
              buttonStyle={{ backgroundColor: '#0072bc' }}
              onClick={this.submitBinding}
            />
          </div>
        </Card>
        <Snackbar
          // open={this.state.inputError}
          open={bindingResp !== ''}
          message={
            bindingResp.responseMsg !== undefined ? (
              bindingResp.responseMsg.toUpperCase() === 'MISSING PARAMETER' ? (
                <FormattedMessage {...messages[bindingResp.responseMsg.toUpperCase()]} />
              ) : (
                bindingResp.responseMsg.toUpperCase()
              )
            ) : (
              ''
            )
          }
          autoHideDuration={2000}
          bodyStyle={{ backgroundColor: '#424242', width: 50, fontWeight: 800, borderRadius: 4, fontFamily: 'Oxygen' }}
          contentStyle={
            bindingResp.responseCode === '999'
              ? { color: 'red', textAlign: 'center', fontFamily: 'Oxygen', fontWeight: '500' }
              : { color: '#0072bc', textAlign: 'center', fontFamily: 'Oxygen', fontWeight: '500' }
          }
          onRequestClose={() => {
            this.props.dispatch(bindingCodeResp(''));
          }}
        />
      </div>
    );
  }
}

Binding.propTypes = {
  dispatch: PropTypes.func.isRequired,
  bindingResp: PropTypes.any,
  menuOpen: PropTypes.bool,
};

const mapStateToProps = createStructuredSelector({
  binding: makeSelectBinding(),
  bindingResp: SelectBindingCodeResp(),
  menuOpen: SelectMenuOpened(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'binding', reducer });
const withSaga = injectSaga({ key: 'binding', saga });

export default compose(withReducer, withSaga, withConnect)(Binding);
