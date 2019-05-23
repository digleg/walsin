/**
 *
 * LoginPage
 *
 */

// eslint-disable-line react/prefer-stateless-function

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';

// material-UI
import Snackbar from 'material-ui/Snackbar';
import { Icon, Form, Input, Button, message } from 'antd';

import LocaleToggle from 'containers/LocaleToggle';

import { makeSelectLoginPage, SelectLoginError, SelectLogoutSuccessMsg } from './selectors';
import { SelectLoginForm, SelectLoginInState } from '../App/selectors';
import reducer from './reducer';
import saga from './saga';
import A from './styled/A';

// i18l
import messages from './messages';

// img
import logoCompany from './image/walsinLogo.png';

import { loginRequest, changeForm, loginError, logoutSuccessMsg } from './actions';
import { changeLocale } from '../LanguageProvider/actions';
import { setLocaleSetting, setFormState } from '../../utils/storageUtility';

let flag = 0;
let flagLogoutMsg = false;
let handleSubmit;

export class LoginPage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      textAccount: '',
      textPassword: '',
      realAccount: 'admin@gemteks.com',
      realPassword: 'admin123',
      inputError: false,
      redirect: false,
      blankInput: false,
    };
  }

  componentWillMount() {
    this.props.dispatch(changeForm({ account: '', username: '', pw: '' }));
    this.props.dispatch(loginError({ status: false, msg: null }));
    document.addEventListener('keydown', this.onKeyPressed.bind(this));

    if (flag === 0) {
      this.props.dispatch(changeLocale('zh-Hans'));
      setLocaleSetting('zh-Hans');
      flag = 1;
    }
  }

  componentWillReceiveProps(nextProps) {
    const { intl } = this.props;
    // antd message func
    if (nextProps.loginErrorMsg.status === true && flagLogoutMsg === false) {
      let errorMsg = '';
      if (nextProps.loginErrorMsg.msg === 'No user data') {
        errorMsg = intl.formatMessage({ id: 'MERC.containers.LoginPage.noUserData' });
      } else if (nextProps.loginErrorMsg.msg === 'password incorrect') {
        errorMsg = intl.formatMessage({ id: 'MERC.containers.LoginPage.passwordIncorrect' });
      }
      flagLogoutMsg = true;
      message.error(errorMsg, 1.5, this.props.dispatch(loginError({ status: false, msg: null })));
    }
  }

  componentDidUpdate(prevProps) {
    const { intl } = this.props;
    // antd message func
    if (prevProps.logoutSuccess === true && flagLogoutMsg === false) {
      flagLogoutMsg = true;
      const errorMsg = intl.formatMessage({ id: 'MERC.containers.LoginPage.logoutSuccess' });
      message.success(errorMsg, 1.5, this.props.dispatch(logoutSuccessMsg(false)));
    }
  }

  onKeyPressed(e) {
    if (e.keyCode === 13) {
      handleSubmit(e);
    }
  }

  snackbarClose = () => {
    this.setState({
      inputError: false,
    });
    this.props.dispatch(loginError({ status: false, msg: null }));
  };

  logoFunc() {
    return (
      <div style={{ position: 'absolute', bottom: 0 }}>
        <A href="https://www.gemteks.com/">
          <img style={{ width: '30%', height: '30%', margin: 20 }} src={logoCompany} alt="Logo Company" />
        </A>
      </div>
    );
  }

  loginForm() {
    return (
      <div
        style={{
          display: 'flex',
          flex: 1,
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: '17em',
        }}
      >
        <Icon type="login" style={{ fontSize: '4em', color: '#fff', marginBottom: '0.2em' }} />
        <div style={{ fontSize: '1.8em', color: 'white', fontFamily: 'Oxygen', fontWeight: '300', marginBottom: '20px' }}>
          <FormattedMessage {...messages.welcomeMessage} />
        </div>
      </div>
    );
  }

  loginFormFunc() {
    const { intl } = this.props;
    const { getFieldDecorator } = this.props.form;
    const messageUsername = intl.formatMessage({ id: 'MERC.containers.LoginPage.userName' });
    const messagePassword = intl.formatMessage({ id: 'MERC.containers.LoginPage.password' });

    handleSubmit = e => {
      e.preventDefault();
      flagLogoutMsg = false;
      this.props.dispatch(loginError({ status: false, msg: null }));
      this.props.form.validateFields((err, values) => {
        if (!err) {
          const { username, password } = values;
          // setFormState(null);
          this.props.dispatch(loginRequest({ username, password }));
        }
      });
    };

    return (
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Form onSubmit={handleSubmit} style={{ width: '20em' }}>
          <Form.Item>
            {getFieldDecorator('username', {
              rules: [{ required: true, message: <FormattedMessage {...messages.pleaseInputUsername} /> }],
            })(<Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder={messageUsername} />)}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('password', {
              rules: [{ required: true, message: <FormattedMessage {...messages.pleaseInputPassword} /> }],
            })(<Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder={messagePassword} />)}
          </Form.Item>
          <Form.Item>
            {/* {getFieldDecorator('remember', {
              valuePropName: 'checked',
              initialValue: true,
            })(<Checkbox>Remember me</Checkbox>)} */}
            {/* <a href="" style={{ float: 'right' }}>
              Forgot password
            </a> */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '2em' }}>
              <div style={{ color: '#fff', display: 'inline-flex' }}>
                <FormattedMessage {...messages.language} /> :
              </div>
              <div
                style={{
                  marginRight: '1em',
                  marginLeft: '0.5em',
                  backgroundColor: '#fff',
                  borderRadius: 4,
                  height: '2em',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <LocaleToggle />
              </div>
              <Button type="primary" htmlType="submit">
                <FormattedMessage {...messages.login} />
                <Icon type="right" />
              </Button>
            </div>
            {/* Or <a href="">register now!</a> */}
          </Form.Item>
        </Form>
      </div>
    );
  }

  copyRightFunc() {
    return (
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ position: 'absolute', bottom: 20, color: 'white' }}>
          Copyright &copy; 2019 Gemtek Technology Co Ltd. All right reserved.
        </div>
      </div>
    );
  }

  snackbarFunc() {
    const { blankInput } = this.state;
    const { loginErrorMsg, logoutSuccess } = this.props;
    return (
      <div>
        <Snackbar
          // open={this.state.inputError}
          open={loginErrorMsg !== ''}
          message={loginErrorMsg === '' ? loginErrorMsg : 'Account  or  password  error !'}
          autoHideDuration={2000}
          bodyStyle={{ width: 300, borderRadius: 5, backgroundColor: '#1E6C97', fontFamily: 'Oxygen' }}
          contentStyle={{ color: 'white', textAlign: 'center', fontFamily: 'Oxygen', fontWeight: '100' }}
          onRequestClose={this.snackbarClose}
        />
        {/* logoutSuccessMsg */}
        <Snackbar
          // open={this.state.inputError}
          open={logoutSuccess !== ''}
          message={'Logout Success !'}
          autoHideDuration={2000}
          bodyStyle={{ width: 300, borderRadius: 5, backgroundColor: '#1E6C97', fontFamily: 'Oxygen' }}
          contentStyle={{ color: 'white', textAlign: 'center', fontFamily: 'Oxygen', fontWeight: '100' }}
          onRequestClose={() => {
            this.props.dispatch(logoutSuccessMsg(''));
          }}
        />
        <Snackbar
          open={blankInput}
          message={<FormattedMessage {...messages.blankInputHint} />}
          autoHideDuration={2000}
          bodyStyle={{ width: 300, borderRadius: 5, backgroundColor: '#1E6C97', fontFamily: 'Oxygen' }}
          contentStyle={{ color: 'white', textAlign: 'center', fontFamily: 'Oxygen', fontWeight: '100' }}
          onRequestClose={() => {
            this.setState({ blankInput: false });
          }}
        />
      </div>
    );
  }

  messageFunc() {
    const { loginErrorMsg, logoutSuccess } = this.props;
    return (
      (logoutSuccess &&
        message.success(
          'This is a message of success',
          1.5,
          setTimeout(() => {
            this.props.dispatch(logoutSuccessMsg(false));
          }, 100)
        )) ||
      (loginErrorMsg.status && message.success(loginErrorMsg.msg, 1.5, this.props.dispatch(loginError({ status: false, msg: null }))))
    );
  }

  render() {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundImage: 'linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.5))',
        }}
      >
        <Helmet>
          <title>Walsin IIoT - Login Page</title>
          <meta name="description" content="Walsin IIoT - Login Page" />
        </Helmet>
        {this.logoFunc()}
        {this.loginForm()}
        {this.loginFormFunc()}
        {this.copyRightFunc()}
        {/* {this.snackbarFunc()} */}
        {/* {this.messageFunc()} */}
      </div>
    );
  }
}

LoginPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
  loginErrorMsg: PropTypes.object,
  logoutSuccess: PropTypes.bool,
  intl: intlShape.isRequired,
  getFieldDecorator: PropTypes.any,
  form: PropTypes.any,
  validateFields: PropTypes.any,
};

const mapStateToProps = createStructuredSelector({
  loginpage: makeSelectLoginPage(),
  loggedIn: SelectLoginInState(),
  formState: SelectLoginForm(),
  loginErrorMsg: SelectLoginError(),
  logoutSuccess: SelectLogoutSuccessMsg(),
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

const withReducer = injectReducer({ key: 'loginPage', reducer });
const withSaga = injectSaga({ key: 'loginPage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
  injectIntl,
  Form.create({ name: 'normal_login' })
)(LoginPage);
