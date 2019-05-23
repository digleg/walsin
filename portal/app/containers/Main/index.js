/**
 *
 * Main
 *
 */

/* eslint-disable global-require */
/* eslint-disable indent */
/* eslint-disable no-confusing-arrow */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect/lib';
import { compose } from 'redux';
import { NavLink } from 'react-router-dom';
import { push } from 'react-router-redux';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';

// material-ui
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
// import Avatar from 'material-ui/Avatar';
import FlatButton from 'material-ui/FlatButton';
import Popover from 'material-ui/Popover';
import { Card, CardActions } from 'material-ui/Card';
import ListItem from 'material-ui/List/ListItem';
import Divider from 'material-ui/Divider';
import MenuItem from 'material-ui/MenuItem';
import CircularProgress from 'material-ui/CircularProgress';
import { fullWhite } from 'material-ui/styles/colors';

// @material-ui
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import withWidth from '@material-ui/core/withWidth';

import List from '@material-ui/core/List';
import ListItemNew from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

// @icon
import HelpIcon from '@material-ui/icons/Help';
import MenuIcon from '@material-ui/icons/Menu';
import SaveIcon from '@material-ui/icons/Save';
import EditIcon from '@material-ui/icons/Edit';
import RefreshIcon from '@material-ui/icons/Refresh';
import AddIcon from '@material-ui/icons/Add';
import SettingsIcon from '@material-ui/icons/Settings';
import UndoIcon from '@material-ui/icons/Undo';
import CloseIcon from '@material-ui/icons/Close';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import HistoryIcon from '@material-ui/icons/History';
import SearchIcon from '@material-ui/icons/Search';
import DeleteIcon from '@material-ui/icons/Delete';

// material-ui-next
import Tooltip from 'material-ui-next/Tooltip';

// svg-icon
import SystemIcon from 'material-ui/svg-icons/hardware/desktop-windows';
import ReplyIcon from 'material-ui/svg-icons/content/reply';
import ExMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import ExLessIcon from 'material-ui/svg-icons/navigation/expand-less';
import HomeIcon from 'material-ui/svg-icons/action/home';

// antd
import { Menu, Icon, Layout, Avatar, Spin, Button as ButtonA, Tooltip as TooltipA } from 'antd';

import LocaleToggle from 'containers/LocaleToggle';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';

import ListSort from './ListSort';

import { makeSelectMain, SelectMenuList, SelectSubMenuList, SelectLoginRespMsg } from './selectors';
import {
  SelectMenuOpened,
  SelectLoginForm,
  SelectSubMenuAdminOpen,
  SelectSetMenuOpen,
  SelectSendingReqMain,
  SelectFormState,
  SelectLoginInState,
  SelectFocusMenu,
} from '../App/selectors';
import { menuOpened, getFocusMenu, loginStatusChange, setMenuOpen, setUrl, planRefresh } from '../App/actions';
// import { loginRequest } from '../LoginPage/actions';
// import { setUrl } from '../UrlPage/actions';
import { renderMenu, logoutRequest, setLoginRespMsg, loginRequest } from './actions';
// import { renderMenu, logoutRequest, setLoginRespMsg } from './actions';
import reducer from './reducer';
import saga from './saga';
import { getFormState, getLocaleSetting } from '../../utils/storageUtility';
import { changeLocale } from '../LanguageProvider/actions';

// i18l
import messages from './messages';
import './styles.css';

import menuTitleIcon from './img/walsinLogo.png';
import menuTitleIconWOChinese from './img/walsinLogoWOchinese.png';
import menuTitleIconWhite from './img/logo_office_automation.png';

let flag = 0;

// antd variable
const SubMenu = Menu.SubMenu;
const { Header, Sider, Content } = Layout;

const menuIconList = {
  Dashboard: 'dashboard',
  DEVICE: 'laptop',
  ADMIN: 'user',
  Tag: 'idcard',
  Event: 'profile',
  dept: 'bar-chart',
  USER: 'team',
  ROLE: 'solution',
  FUNCTION: 'bars',
  GRP: 'appstore',
  Notify: 'sound',
  NOTIFY_DGRP: 'profile',
  NOTIFY_USER: 'profile',
  NOTIFY_UGRP: 'profile',
  Personnel: 'idcard',
};

// admin: <AdminIcon color="#0072bc" />,
// 'EXPENSE GRP': <ExpGrpIcon color="#0072bc" />,
// CP: <CPIcon color="#0072bc" />,
// SYSTEM: <SystemIcon color="#0072bc" />,
// walsinDept: <HomeIcon color="#0072bc" />,
// ACTIVATE: null,
// BINDING: null,
// LoRa: null,
// officeAutomation: null,
// 'ELECTRICITY EXPENSE': null,
// 'WATER EXPENSE': null,
// RoboticArm: null,
// 'VIRTUAL SHELVE': null,

export class Main extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      width: window.innerWidth,
      height: window.innerHeight,
      openPop: false,
      openHelpPop: false,
      textColorEditProfile: '#7f8fa4',
      textColorSignOut: '#7f8fa4',
      subMenuAdminOpen: false,
      focusMenu: 'DASHBOARD',
      // antd menu
      collapsed: false,
    };
  }

  componentWillMount() {
    if (flag === 0) {
      this.props.dispatch(changeLocale(getLocaleSetting()));
      flag = 1;
    }
    this.forceUpdate();
  }

  componentDidMount() {
    const formState = getFormState();
    if (formState !== null) {
      window.addEventListener('resize', this.updateDimensions);
      this.props.dispatch(renderMenu(this.props.loginResp));
    } else {
      this.props.dispatch(push('./'));
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  handleToggle = () => {
    this.setState({ width: window.innerWidth });
    this.props.dispatch(menuOpened(!this.props.opened));
  };

  checkDocked() {
    if (this.state.width < 800) {
      return false;
    }
    return true;
  }

  updateDimensions = () => {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
    if (window.innerWidth > 800) {
      this.props.dispatch(menuOpened(true));
    } else {
      this.props.dispatch(menuOpened(false));
    }
  };

  handleOpenPopover = (event: Event) => {
    // This prevents ghost click.
    event.preventDefault();
    this.setState({
      openPop: true,
      anchorEl: event.currentTarget,
    });
  };

  handleOpenHelpPopover = (event: Event) => {
    // This prevents ghost click.
    event.preventDefault();
    this.setState({
      openHelpPop: true,
      anchorEl: event.currentTarget,
    });
  };

  handleClosePopover = () => {
    this.props.dispatch(menuOpened(false));
    this.setState({
      textColorEditProfile: '#7f8fa4',
      textColorSignOut: '#7f8fa4',
      openPop: false,
      openHelpPop: false,
    });
  };

  appBarFunc() {
    const { opened, classes, intl } = this.props;
    const formState = getFormState();
    const helpIntl = intl.formatMessage({ id: 'MERC.containers.Main.helpIntl' });
    let loggedIn = false;
    if (formState !== null) {
      if (formState.responseCode === '000') {
        loggedIn = true;
      } else {
        loggedIn = false;
      }
    }

    const showFlg = true;

    const titleArr = [
      <div className={classes.root} key={Math.random()}>
        <div className={classes.container}>
          <Grid container alignItems="center">
            <div>
              <img
                style={{ width: '1.2em', height: '1.2em', marginRight: '0.5em', marginLeft: '-0.1em' }}
                src={menuTitleIconWhite}
                alt="menuTitleIconWhite"
              />
            </div>
            {showFlg && (
              <div>
                <FormattedMessage {...messages.Title} />
              </div>
            )}
          </Grid>
        </div>
      </div>,
    ];

    return (
      <AppBar
        title={titleArr}
        onLeftIconButtonClick={() => {
          this.handleToggle();
        }}
        onRightIconButtonClick={
          loggedIn
            ? this.handleOpenPopover
            : () => {
                this.props.dispatch(push('/'));
              }
        }
        iconElementRight={
          loggedIn ? (
            <div>
              <ListItem
                disabled
                rightAvatar={
                  <Avatar size={36} style={{ cursor: 'pointer', marginRight: 10 }} src={require('../../images/pict_dummy_photo.png')} />
                }
                rightIcon={
                  <div style={{ cursor: 'pointer', marginRight: -5 }}>
                    <img src={require('../../images/btn_arrow_n.png')} alt="arrow" />
                  </div>
                }
              >
                <div style={{ display: 'inline-flex', marginRight: 20, alignItems: 'center' }}>
                  <div style={{ fontFamily: 'Roboto', fontSize: 16, color: '#ffffff', fontWeight: 300 }}>
                    <FormattedMessage {...messages.WelcomeMessage} />
                    {', '}
                    {formState.userInfo.name === undefined ? <FormattedMessage {...messages.WelcomeUserName} /> : formState.userInfo.name}
                    {' !'}
                  </div>
                </div>
              </ListItem>
            </div>
          ) : (
            <FlatButton label={<FormattedMessage {...messages.login} />} />
          )
        }
        style={opened ? { left: 0, backgroundColor: '#0072bc' } : { left: 0, backgroundColor: '#0072bc' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', marginLeft: '1em', marginRight: '-1.5em', marginTop: '0.3em' }}>
          <IconButton aria-label="selectAllOpen" style={{ color: '#F5F5F5', marginTop: '-1.5em', marginBottom: '-1.5em' }}>
            <Tooltip id="help" title={helpIntl} placement="bottom" classes={{ tooltip: classes.tooltipCus }}>
              <HelpIcon onClick={this.handleOpenHelpPopover} />
            </Tooltip>
          </IconButton>
        </div>
      </AppBar>
    );
  }

  drawerFunc() {
    const { opened, menuList, loginRespMsg, focusMenu } = this.props;
    const formState = getFormState();
    return (
      menuList.size !== 0 && (
        <Drawer
          containerStyle={{ backgroundColor: '#ffffff' }}
          open={opened}
          docked={this.checkDocked()}
          onRequestChange={open => this.props.dispatch(menuOpened(open))}
        >
          {/* title */}
          <Grid container direction="row" alignItems="center" justify="center" style={{ height: '62px' }}>
            <MenuItem
              onClick={() => {
                this.handleToggle();
              }}
              style={{
                fontFamily: 'Oxygen',
                color: '#0072bc',
                fontWeight: '800',
                fontSize: '25px',
                marginLeft: 0,
                backgroundColor: '#ffffff',
              }}
              innerDivStyle={{ padding: '0px 16px 0px 60px' }}
              leftIcon={<img src={menuTitleIcon} alt="menuTitleIcon" style={{ marginRight: 0 }} />}
            >
              {<FormattedMessage {...messages.Title} />}
            </MenuItem>
          </Grid>
          <div style={{ paddingLeft: '0.5em', paddingRight: '0.5em' }}>
            <Divider style={{ backgroundColor: '#0072bc', opacity: 0.2, height: 1 }} />
          </div>
          {/* menu */}
          {loginRespMsg === null ? (
            <div
              style={{
                maxHeight: '83vh',
                overflow: 'auto',
                marginBottom: '1em',
                paddingLeft: '0.5em',
                paddingRight: '0.5em',
              }}
            >
              {formState === null ? (
                <MenuItem
                  key={Math.random()}
                  insetChildren
                  initiallyOpen={false}
                  primaryTogglesNestedList
                  leftIcon={<ReplyIcon color="#0072bc" />}
                  onClick={evt => {
                    evt.preventDefault();
                    this.props.dispatch(push('/'));
                  }}
                  style={{
                    backgroundColor: '#ffffff',
                  }}
                >
                  <NavLink
                    key={Math.random()}
                    exact
                    to={'/'}
                    style={{
                      fontSize: '16px',
                      color: '#0072bc',
                      fontWeight: '300',
                      textDecoration: 'none',
                    }}
                    activeStyle={{ fontWeight: '600', backgroundColor: '#f0f7fb' }}
                    onClick={evt => {
                      evt.preventDefault();
                    }}
                  >
                    <FormattedMessage {...messages.goToLogin} />
                  </NavLink>
                </MenuItem>
              ) : menuList.size === 0 ? (
                <CircularProgress
                  size={150}
                  thickness={10}
                  color="#0072bc"
                  style={{
                    margin: 50,
                  }}
                />
              ) : (
                this.renderMenu(menuList)
              )}
              <Divider style={{ backgroundColor: '#0072bc', opacity: 0.2, height: 1 }} />
              {/* alert page */}
              <MenuItem
                key={Math.random()}
                insetChildren
                initiallyOpen={false}
                primaryTogglesNestedList
                leftIcon={<SystemIcon color="#0072bc" />}
                onClick={evt => {
                  evt.preventDefault();
                  this.props.dispatch(push('/alert'));
                  this.props.dispatch(getFocusMenu('ALERT'));
                }}
                style={
                  focusMenu === 'ALERT' ? { backgroundColor: '#f0f7fb', borderLeft: '5px solid #00d166' } : { backgroundColor: '#ffffff' }
                }
              >
                <NavLink
                  key={Math.random()}
                  exact
                  to={'/alert'}
                  style={{
                    fontSize: '16px',
                    color: '#0072bc',
                    fontWeight: '300',
                    textDecoration: 'none',
                  }}
                  activeStyle={{ fontWeight: '600', backgroundColor: '#f0f7fb' }}
                  onClick={evt => {
                    evt.preventDefault();
                    this.props.dispatch(getFocusMenu('ALERT'));
                  }}
                >
                  <FormattedMessage {...messages.ALARM} />
                </NavLink>
              </MenuItem>
              <Divider style={{ backgroundColor: '#0072bc', opacity: 0.2, height: 1 }} />
            </div>
          ) : (
            // login Expired
            <Card style={{ margin: 10, borderRadius: 10, marginTop: '1em' }}>
              <div style={{ fontSize: 20, fontWeight: 800, display: 'flex', justifyContent: 'center' }}>
                <FormattedMessage {...messages.expiredMsg1} />
              </div>
              <div style={{ fontSize: 12, display: 'flex', justifyContent: 'center' }}>
                <FormattedMessage {...messages.expiredMsg2} />
              </div>
              <Divider style={{ height: 1, marginTop: '0.5em', width: '100%' }} />
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <FlatButton
                  style={{ display: 'flex', justifyContent: 'center', color: '#0072bc', width: '100%' }}
                  onClick={() => {
                    this.props.dispatch(setLoginRespMsg(null));
                    this.props.dispatch(push('/'));
                  }}
                >
                  OK
                </FlatButton>
              </div>
            </Card>
          )}

          {/* footer */}
          <div style={{ position: 'absolute', left: '25%', bottom: 10, justifyContent: 'center', margin: 5, zIndex: 2 }}>
            <div style={{ display: 'inline-flex' }}>
              <div style={{ marginRight: 10, color: '#0072bc', fontWeight: 800 }}>
                <FormattedMessage {...messages.Language} /> :
              </div>
              <Card style={{ marginRight: 10, borderRadius: 5 }}>
                <LocaleToggle locale={getLocaleSetting()} />
              </Card>
              {/* <IconButton aria-label="selectAllOpen" style={{ color: '#0072bc' }}>
                <Tooltip id="help" title="log" placement="bottom" classes={{ tooltip: classes.tooltipCus }}>
                  <HelpIcon
                    onClick={() => {
                      this.props.dispatch(push('/event'));
                    }}
                  />
                </Tooltip>
              </IconButton> */}
            </div>
            {/* <div style={{ color: '#0072bc' }}>
            <FormattedMessage {...messages.PowerBy} />
          </div>
          <div style={{ color: '#0072bc' }}>
            <FormattedMessage {...messages.RightReserved} /> &copy;
          </div> */}
          </div>
        </Drawer>
      )
    );
  }

  popoverFunc() {
    const { classes, page } = this.props;
    const formState = getFormState();
    // loggedIn
    let loggedIn = false;
    if (formState !== null) {
      if (formState.responseCode === '000') {
        loggedIn = true;
      } else {
        loggedIn = false;
      }
    }

    const defaultHelp = [
      <div key={Math.random()}>
        <div
          style={{
            height: '2em',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#BBDEFB',
            color: '#ffffff',
          }}
        >
          {<FormattedMessage {...messages.functionDesc} />}
        </div>
        <ListItemNew>
          <ListItemIcon>
            <MenuIcon />
          </ListItemIcon>
          <ListItemText primary={<FormattedMessage {...messages.menu} />} />
        </ListItemNew>
        <ListItemNew>
          <ListItemIcon>
            <Avatar style={{ width: '1.2em', height: '1.2em' }} src={require('../../images/pict_dummy_photo.png')} />
          </ListItemIcon>
          <ListItemText primary={<FormattedMessage {...messages.profileAndLogout} />} />
        </ListItemNew>
      </div>,
    ];

    return (
      loggedIn && (
        <Popover
          style={{
            left: '-31415px',
            borderRadius: '5px',
          }}
          open={this.state.openPop || this.state.openHelpPop}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          targetOrigin={{ horizontal: 'right', vertical: 'top' }}
          onRequestClose={this.handleClosePopover}
        >
          {this.state.openPop && (
            <Card style={{ borderRadius: '5px' }} initiallyExpanded={false}>
              <CardActions style={{ textAlign: 'right' }}>
                <div
                  style={{
                    display: 'flex',
                    flex: 1,
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    width: '120px',
                  }}
                >
                  {/* <FlatButton
                    onClick={() => {
                      this.handleClosePopover();
                    }}
                    labelStyle={{ color: this.state.textColorEditProfile, fontFamily: 'Roboto' }}
                    style={{
                      borderRadius: '5px',
                      width: '130px',
                      textAlign: 'left',
                      fontFamily: 'Roboto',
                    }}
                    label={<FormattedMessage {...messages.EditProfile} />}
                    hoverColor="#00d166"
                    onMouseEnter={() => {
                      this.setState({ textColorEditProfile: '#ffffff' });
                    }}
                    onMouseLeave={() => {
                      this.setState({ textColorEditProfile: '#7f8fa4' });
                    }}
                  /> */}
                  <FlatButton
                    onClick={() => {
                      this.props.dispatch(logoutRequest());
                      this.props.dispatch(loginStatusChange(false));
                      // this.props.dispatch(push('/'));
                      this.handleClosePopover();
                      // removeElectDataTmp();
                    }}
                    labelStyle={{ color: this.state.textColorSignOut, fontFamily: 'Roboto' }}
                    style={{
                      borderRadius: '5px',
                      width: '130px',
                      textAlign: 'left',
                      fontFamily: 'Roboto',
                    }}
                    label={<FormattedMessage {...messages.Logout} />}
                    hoverColor="#00d166"
                    onMouseEnter={() => {
                      this.setState({ textColorSignOut: '#ffffff' });
                    }}
                    onMouseLeave={() => {
                      this.setState({ textColorSignOut: '#7f8fa4' });
                    }}
                  />
                </div>
              </CardActions>
            </Card>
          )}
          {this.state.openHelpPop &&
            (page === 'dashboard' ? (
              <div className={classes.showHelp}>
                <List>
                  {defaultHelp}
                  <ListItemNew>
                    <ListItemIcon>
                      <FlatButton
                        style={{
                          minWidth: 0,
                          width: '3em',
                          height: '3em',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: 100,
                        }}
                        icon={<SaveIcon color={fullWhite} />}
                        backgroundColor="#EF5350"
                        onClick={() => {}}
                      />
                    </ListItemIcon>
                    <ListItemText primary={<FormattedMessage {...messages.save} />} />
                  </ListItemNew>
                  <ListItemNew>
                    <ListItemIcon>
                      <FlatButton
                        style={{
                          minWidth: 0,
                          width: '3em',
                          height: '3em',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: 100,
                        }}
                        icon={<EditIcon color={fullWhite} />}
                        backgroundColor="#1976D2"
                        onClick={() => {}}
                      />
                    </ListItemIcon>
                    <ListItemText primary={<FormattedMessage {...messages.edit} />} />
                  </ListItemNew>
                </List>
              </div>
            ) : page === 'device' ? (
              <div className={classes.showHelp}>
                <List>
                  {defaultHelp}
                  <ListItemNew>
                    <ListItemIcon>
                      <FlatButton
                        style={{
                          minWidth: 0,
                          width: '3em',
                          height: '3em',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: 100,
                        }}
                        icon={<EditIcon />}
                        backgroundColor="#EF5350"
                        color="primary"
                        onClick={() => {}}
                      />
                    </ListItemIcon>
                    <ListItemText primary={<FormattedMessage {...messages.updateDevInfo} />} />
                  </ListItemNew>
                  <ListItemNew>
                    <ListItemIcon>
                      <FlatButton
                        style={{
                          minWidth: 0,
                          width: '3em',
                          height: '3em',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: 100,
                          alignContent: 'center',
                          alignSelf: 'center',
                        }}
                        icon={<RefreshIcon />}
                        backgroundColor="#1976D2"
                        color="primary"
                        onClick={() => {}}
                      />
                    </ListItemIcon>
                    <ListItemText primary={<FormattedMessage {...messages.refreshPage} />} />
                  </ListItemNew>
                  <ListItemNew>
                    <ListItemIcon>
                      <FlatButton
                        style={{
                          minWidth: 0,
                          width: '3em',
                          height: '3em',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: 100,
                        }}
                        icon={<AddIcon />}
                        backgroundColor="#1976D2"
                        color="primary"
                        onClick={() => {}}
                      />
                    </ListItemIcon>
                    <ListItemText primary={<FormattedMessage {...messages.addDev} />} />
                  </ListItemNew>
                </List>
              </div>
            ) : page === 'event' ? (
              <div className={classes.showHelp}>
                <List>
                  {defaultHelp}
                  <ListItemNew>
                    <ListItemIcon>
                      <SettingsIcon style={{ color: '#3949AB' }} />
                    </ListItemIcon>
                    <ListItemText primary={<FormattedMessage {...messages.setTimeInterval} />} />
                  </ListItemNew>
                  <ListItemNew>
                    <ListItemIcon>
                      <UndoIcon style={{ color: '#3949AB' }} />
                    </ListItemIcon>
                    <ListItemText primary={<FormattedMessage {...messages.exportReport} />} />
                  </ListItemNew>
                  <ListItemNew>
                    <ListItemIcon>
                      <RefreshIcon style={{ color: '#3949AB' }} />
                    </ListItemIcon>
                    <ListItemText primary={<FormattedMessage {...messages.refreshPage} />} />
                  </ListItemNew>
                  <ListItemNew>
                    <ListItemIcon>
                      <CloseIcon style={{ color: '#3949AB' }} />
                    </ListItemIcon>
                    <ListItemText primary={<FormattedMessage {...messages.clrSearch} />} />
                  </ListItemNew>
                </List>
              </div>
            ) : page === 'tag' ? (
              <div className={classes.showHelp}>
                <List>
                  {defaultHelp}
                  <ListItemNew>
                    <ListItemIcon>
                      <CheckBoxIcon />
                    </ListItemIcon>
                    <ListItemText primary={<FormattedMessage {...messages.choseShowField} />} />
                  </ListItemNew>
                  <ListItemNew>
                    <ListItemIcon>
                      <HistoryIcon />
                    </ListItemIcon>
                    <ListItemText primary={<FormattedMessage {...messages.historyInfo} />} />
                  </ListItemNew>
                  <ListItemNew>
                    <ListItemIcon>
                      <EditIcon />
                    </ListItemIcon>
                    <ListItemText primary={<FormattedMessage {...messages.editInfo} />} />
                  </ListItemNew>
                  <ListItemNew>
                    <ListItemIcon>
                      <SearchIcon />
                    </ListItemIcon>
                    <ListItemText primary={<FormattedMessage {...messages.searchingStart} />} />
                  </ListItemNew>
                  <ListItemNew>
                    <ListItemIcon>
                      <DeleteIcon />
                    </ListItemIcon>
                    <ListItemText primary={<FormattedMessage {...messages.clearSrh} />} />
                  </ListItemNew>
                </List>
              </div>
            ) : (
              ''
            ))}
        </Popover>
        // openHelpPop
      )
    );
  }

  drawAntFunc() {
    const { classes, menuList, focusMenu, waiting, loginRespMsg } = this.props;
    const { collapsed } = this.state;
    const pattern = new RegExp('[\u4E00-\u9FA5]+');
    const formState = getFormState();
    return (
      <Layout style={{ height: '100vh' }}>
        <Sider trigger={null} collapsible collapsed={this.state.collapsed} style={{ background: '#FAFAFA' }}>
          <div className={classes.logo}>
            <img
              src={!collapsed ? menuTitleIcon : menuTitleIconWOChinese}
              alt="menuTitleIcon"
              style={{
                width: '80%',
                height: '180%',
              }}
            />
          </div>
          <div>
            {loginRespMsg === null ? (
              waiting ? (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10em' }}>
                  <Spin tip="Loading..." />
                </div>
              ) : (
                <Menu mode="vertical" defaultSelectedKeys={[focusMenu]}>
                  {menuList.map(item =>
                    item[2] === 0 ? (
                      <SubMenu
                        key={item[0].toUpperCase()}
                        title={
                          <span style={{ display: 'flex', alignItems: 'center' }}>
                            <Icon type={menuIconList[item[0]]} />
                            {!collapsed && pattern.test(item[0]) === true ? (
                              item[0]
                            ) : (
                              <FormattedMessage {...messages[item[0].toUpperCase()]} />
                            )}
                          </span>
                        }
                      >
                        {item[1].map(subItem => (
                          <Menu.Item
                            key={subItem[0].toUpperCase()}
                            onClick={() => {
                              this.props.dispatch(push(subItem[1]));
                              this.props.dispatch(getFocusMenu(subItem[0].toUpperCase()));
                            }}
                            style={{ display: 'flex', alignItems: 'center' }}
                          >
                            <Icon type={menuIconList[subItem[0]]} />
                            {pattern.test(item[0]) === true ? subItem[0] : <FormattedMessage {...messages[subItem[0].toUpperCase()]} />}
                          </Menu.Item>
                        ))}
                      </SubMenu>
                    ) : item[2] === -1 ? (
                      <Menu.Item
                        key={item[0].toUpperCase()}
                        onClick={() => {
                          this.props.dispatch(push(item[1]));
                          this.props.dispatch(getFocusMenu(item[0].toUpperCase()));
                        }}
                        style={{ display: 'flex', alignItems: 'center' }}
                      >
                        <Icon type={menuIconList[item[0]]} />
                        <span>{pattern.test(item[0]) === true ? item[0] : <FormattedMessage {...messages[item[0].toUpperCase()]} />}</span>
                      </Menu.Item>
                    ) : item[2] === -2 ? (
                      <SubMenu
                        key={item[0].toUpperCase()}
                        title={
                          <span style={{ display: 'flex', alignItems: 'center' }}>
                            <Icon type="bar-chart" />
                            {!collapsed && item[0]}
                          </span>
                        }
                      >
                        {item[1].map(subItem => (
                          <Menu.Item
                            key={subItem[0].toUpperCase()}
                            onClick={() => {
                              this.props.dispatch(setUrl(subItem[1]));
                              this.forceUpdate();
                              this.props.dispatch(push('/dashboard'));
                              this.props.dispatch(push('/urlLink'));
                              this.props.dispatch(getFocusMenu(subItem[0]));
                            }}
                            style={{ display: 'flex', alignItems: 'center' }}
                          >
                            <Icon type="solution" />
                            {subItem[0]}
                          </Menu.Item>
                        ))}
                      </SubMenu>
                    ) : null
                  )}
                  {/* Devin AlertPage */}
                  {/* <Menu.Item
                    key="alertPage"
                    onClick={() => {
                      this.props.dispatch(push('/alert'));
                      this.props.dispatch(getFocusMenu('ALERT'));
                    }}
                  >
                    <Icon type="notification" />
                    <span>{<FormattedMessage {...messages.ALARM} />}</span>
                  </Menu.Item> */}
                  {/* ListSort */}
                  {/* <div className={classes['list-sort-demo-wrapper']}>
                    <div className={this.props.className}>
                      <ListSort
                        dragClassName={classes['list-sort-demo-list.list-drag-selected']}
                        appearAnim={{ animConfig: { marginTop: [5, 30], opacity: [1, 0] } }}
                      >
                        {childrenToRender}
                      </ListSort>
                    </div>
                  </div> */}
                </Menu>
              )
            ) : (
              <Card style={{ margin: 10, borderRadius: 10, marginTop: '1em' }}>
                <div style={{ fontSize: 20, fontWeight: 800, display: 'flex', justifyContent: 'center' }}>
                  <FormattedMessage {...messages.expiredMsg1} />
                </div>
                <div style={{ fontSize: 12, display: 'flex', justifyContent: 'center' }}>
                  <FormattedMessage {...messages.expiredMsg2} />
                </div>
                <Divider style={{ height: 1, marginTop: '0.5em', width: '100%' }} />
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <FlatButton
                    style={{ display: 'flex', justifyContent: 'center', color: '#0072bc', width: '100%' }}
                    onClick={() => {
                      this.props.dispatch(setLoginRespMsg(null));
                      this.props.dispatch(push('/'));
                    }}
                  >
                    OK
                  </FlatButton>
                </div>
              </Card>
            )}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{ position: 'absolute', bottom: '3em', justifyContent: 'center', color: '#0072bc', fontWeight: 800 }}>
                <TooltipA placement="right" title={<FormattedMessage {...messages.reload} />}>
                  <ButtonA
                    shape="circle"
                    onClick={e => {
                      e.preventDefault();
                      this.props.dispatch(loginRequest());
                      setTimeout(() => {
                        this.forceUpdate();
                        window.location.reload();
                      }, 500);
                    }}
                    style={{ paddingBottom: '0.35em' }}
                  >
                    <Icon type="reload" />
                  </ButtonA>
                </TooltipA>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{ position: 'absolute', bottom: '1em', justifyContent: 'center', color: '#0072bc', fontWeight: 800 }}>
                {!collapsed ? (
                  <Card style={{ marginRight: 10, borderRadius: 5, display: 'inline-flex' }}>
                    <LocaleToggle locale={getLocaleSetting()} />
                  </Card>
                ) : getLocaleSetting() === 'en' ? (
                  'Eng'
                ) : getLocaleSetting() === 'zh' ? (
                  '简中'
                ) : (
                  getLocaleSetting() === 'zh-Hans' && '繁中'
                )}
              </div>
            </div>
          </div>
        </Sider>
        <Layout>
          <Header style={{ background: '#0072bc', padding: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ color: '#fff', display: 'inline-flex', fontSize: '1.5em' }}>
                <Icon
                  className={classes.trigger}
                  type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                  onClick={() => {
                    this.setState({
                      collapsed: !this.state.collapsed,
                    });
                    this.props.dispatch(menuOpened(!this.props.opened));
                    this.props.dispatch(planRefresh(true));
                  }}
                />
                <FormattedMessage {...messages.Title} />
              </div>
              <div style={{ color: '#fff', display: 'inline-flex', fontSize: '1em', justifyContent: 'flex-end' }}>
                <FormattedMessage {...messages.WelcomeMessage} />
                {', '}
                {formState.userInfo.name === undefined ? <FormattedMessage {...messages.WelcomeUserName} /> : formState.userInfo.name}
                {' !'}
                <Avatar size="large" icon="user" style={{ marginLeft: '0.5em', marginTop: '0.5em' }} />
                <TooltipA placement="bottom" title={<FormattedMessage {...messages.Logout} />}>
                  <Icon
                    className={classes.trigger}
                    type="logout"
                    onClick={() => {
                      this.props.dispatch(logoutRequest());
                      this.handleClosePopover();
                    }}
                  />
                </TooltipA>
              </div>
            </div>
          </Header>
          <Content
            style={{
              background: '#fff',
            }}
          >
            {this.props.children}
          </Content>
        </Layout>
      </Layout>
    );
  }

  renderMenu(menu) {
    const { focusMenu } = this.props;
    const pattern = new RegExp('[\u4E00-\u9FA5]+');
    return menu.map((item, index) => (
      <div key={Math.random()}>
        <Divider style={{ backgroundColor: '#0072bc', opacity: 0.2, height: 1 }} />
        {item[2] === -1 && item[0].toUpperCase() !== 'ROBOTICARM' ? (
          <div>
            <MenuItem
              key={Math.random()}
              insetChildren
              initiallyOpen={false}
              primaryTogglesNestedList
              leftIcon={menuIconList[item[0]]}
              onClick={evt => {
                evt.preventDefault();
                this.props.dispatch(push(item[1]));
                this.props.dispatch(getFocusMenu(item[0].toUpperCase()));
              }}
              style={
                focusMenu === item[0].toUpperCase()
                  ? { backgroundColor: '#f0f7fb', borderLeft: '5px solid #00d166' }
                  : { backgroundColor: '#ffffff' }
              }
            >
              <NavLink
                key={Math.random()}
                exact
                to={item[1]}
                style={{
                  fontSize: '16px',
                  color: '#0072bc',
                  fontWeight: '300',
                  textDecoration: 'none',
                }}
                activeStyle={{ fontWeight: '600', backgroundColor: '#f0f7fb' }}
                onClick={evt => {
                  evt.preventDefault();
                  this.props.dispatch(getFocusMenu(item[0]));
                }}
              >
                {pattern.test(item[0]) === true ? item[0] : <FormattedMessage {...messages[item[0].toUpperCase()]} />}
                {/* {item[0]} */}
              </NavLink>
            </MenuItem>
          </div>
        ) : item[2] === 0 ? (
          <MenuItem
            key={Math.random()}
            insetChildren
            initiallyOpen={false}
            primaryTogglesNestedList
            leftIcon={menuIconList[item[0]]}
            style={{ color: '#0072bc', fontWeight: 300 }}
            onClick={() => {
              const menuOpenChg = this.props.menuOpen;
              menuOpenChg[index] = !menuOpenChg[index];
              this.props.dispatch(setMenuOpen(menuOpenChg, 'mainIndex'));
              this.forceUpdate();
            }}
            rightIcon={
              this.props.menuOpen[index] === false ? (
                <ExMoreIcon style={{ marginTop: 13, marginLeft: 20 }} color={'#0072bc'} />
              ) : (
                <ExLessIcon style={{ marginTop: 13, marginLeft: 20 }} color={'#0072bc'} />
              )
            }
            open={this.props.menuOpen[index]}
            nestedItems={item[1].map(subItem => (
              // ExMoreIcon
              // ExLessIcon
              <MenuItem
                key={Math.random()}
                onClick={() => {
                  this.props.dispatch(push(subItem[1]));
                  const split = subItem[1].split('/');
                  if (split[1] === 'admin') {
                    this.props.dispatch(getFocusMenu(subItem[0]));
                  } else {
                    this.props.dispatch(getFocusMenu(subItem[0]));
                  }
                }}
                leftIcon={menuIconList[subItem[0]]}
                style={
                  focusMenu === subItem[0].toUpperCase()
                    ? { backgroundColor: '#f0f7fb', marginLeft: 10, borderLeft: '5px solid #00d166' }
                    : { backgroundColor: '#ffffff', marginLeft: 10 }
                }
              >
                <NavLink
                  key={Math.random()}
                  exact
                  to={subItem[1]}
                  style={{
                    marginLeft: -10,
                    fontSize: '16px',
                    color: '#0072bc',
                    fontWeight: '300',
                    textDecoration: 'none',
                    lineHeight: '30px',
                  }}
                  activeStyle={{ fontWeight: '600', backgroundColor: '#f0f7fb' }}
                  onClick={evt => {
                    evt.preventDefault();
                    this.props.dispatch(getFocusMenu(subItem[0]));
                  }}
                >
                  {pattern.test(subItem[0]) === true ? (
                    subItem[0]
                  ) : (
                    <FormattedMessage {...messages[subItem[0]]} defaultMessages={subItem[0]} />
                  )}

                  {/* {subItem[0]} */}
                </NavLink>
              </MenuItem>
            ))}
          >
            {pattern.test(item[0]) === true ? item[0] : <FormattedMessage {...messages[item[0].toUpperCase()]} defaultMessages={item[0]} />}
          </MenuItem>
        ) : item[2] === -2 ? (
          // walsinDept
          <MenuItem
            key={Math.random()}
            insetChildren
            initiallyOpen={false}
            primaryTogglesNestedList
            // leftIcon={menuIconList[item[0]]}
            leftIcon={<HomeIcon color="#0072bc" />}
            style={{ color: '#0072bc', fontWeight: 300 }}
            onClick={() => {
              const menuOpenChg = this.props.menuOpen;
              menuOpenChg[index] = !menuOpenChg[index];
              this.props.dispatch(setMenuOpen(menuOpenChg, 'mainIndex'));
              this.forceUpdate();
            }}
            rightIcon={
              this.props.menuOpen[index] === false ? (
                <ExMoreIcon style={{ marginTop: 13, marginLeft: 20 }} color={'#0072bc'} />
              ) : (
                <ExLessIcon style={{ marginTop: 13, marginLeft: 20 }} color={'#0072bc'} />
              )
            }
            open={this.props.menuOpen[index]}
            nestedItems={item[1].map(subItem => (
              <MenuItem
                key={Math.random()}
                onClick={() => {
                  this.props.dispatch(setUrl(subItem[1]));
                  this.props.dispatch(push('/urlLink'));
                  this.props.dispatch(getFocusMenu(subItem[0]));
                }}
                leftIcon={menuIconList.dept}
                style={
                  focusMenu === subItem[0]
                    ? { backgroundColor: '#f0f7fb', marginLeft: 10, borderLeft: '5px solid #00d166', width: 20 }
                    : { backgroundColor: '#ffffff', marginLeft: 10, width: 20 }
                }
              >
                <NavLink
                  key={Math.random()}
                  exact
                  to={'/urlLink'}
                  style={{
                    marginLeft: -10,
                    fontSize: '16px',
                    color: '#0072bc',
                    fontWeight: '300',
                    textDecoration: 'none',
                    lineHeight: '30px',
                  }}
                  activeStyle={focusMenu === subItem[0] ? { fontWeight: '600', backgroundColor: '#f0f7fb' } : {}}
                  onClick={evt => {
                    evt.preventDefault();
                    this.props.dispatch(setUrl(subItem[1]));
                    this.props.dispatch(getFocusMenu(subItem[0]));
                  }}
                >
                  {/* {pattern.test(subItem[0]) === true ? subItem[0] : <FormattedMessage {...messages[subItem[0]]} />} */}
                  {subItem[0]}
                </NavLink>
              </MenuItem>
            ))}
          >
            {/* {pattern.test(item[0]) === true ? item[0] : <FormattedMessage {...messages[item[0]]} />} */}
            {item[0]}
          </MenuItem>
        ) : (
          ''
        )}
      </div>
    ));
  }

  renderMenuIcon(menu) {
    const { focusMenu } = this.props;
    return menu.map(item => (
      <div key={Math.random()}>
        <Divider style={{ backgroundColor: '#0072bc', opacity: 0.2, height: 1 }} />
        {item[2] === -1 && item[0].toUpperCase() !== 'ROBOTICARM' ? (
          <div>
            <MenuItem
              key={Math.random()}
              insetChildren
              initiallyOpen={false}
              primaryTogglesNestedList
              leftIcon={menuIconList[item[0]]}
              onClick={evt => {
                evt.preventDefault();
                this.props.dispatch(push(item[1]));
                this.props.dispatch(getFocusMenu(item[0].toUpperCase()));
              }}
              style={focusMenu === item[0].toUpperCase() ? { backgroundColor: '#81C784' } : { backgroundColor: '#ffffff' }}
            >
              <NavLink
                key={Math.random()}
                exact
                to={item[1]}
                style={{
                  fontSize: '16px',
                  color: '#0072bc',
                  fontWeight: '300',
                  textDecoration: 'none',
                }}
                activeStyle={{ fontWeight: '600', backgroundColor: '#f0f7fb' }}
                onClick={evt => {
                  evt.preventDefault();
                  this.props.dispatch(getFocusMenu(item[0].toUpperCase()));
                }}
              />
            </MenuItem>
          </div>
        ) : (
          ''
        )}
      </div>
    ));
  }

  render() {
    const formState = getFormState();
    return (
      <div>
        {/* {this.appBarFunc()} */}
        {/* {this.drawerFunc()} */}
        {this.popoverFunc()}
        {formState !== '' && this.drawAntFunc()}
      </div>
    );
  }
}

Main.propTypes = {
  dispatch: PropTypes.func.isRequired,
  opened: PropTypes.bool,
  // formState: PropTypes.object,
  menuList: PropTypes.any,
  menuOpen: PropTypes.any,
  loginResp: PropTypes.object,
  // loggedIn: PropTypes.bool,
  focusMenu: PropTypes.string,
  // width: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
  // width: PropTypes.string.isRequired,
  intl: intlShape.isRequired,
  page: PropTypes.string,
  loginRespMsg: PropTypes.string,
  children: PropTypes.object,
  waiting: PropTypes.bool,
};

const mapStateToProps = createStructuredSelector({
  main: makeSelectMain(),
  opened: SelectMenuOpened(),
  formState: SelectLoginForm(),
  menuList: SelectMenuList(),
  subMenuList: SelectSubMenuList(),
  // waiting: SelectSendingReq(),
  subMenuAdminOpenSelect: SelectSubMenuAdminOpen(),
  menuOpen: SelectSetMenuOpen(),
  waiting: SelectSendingReqMain(),
  loginResp: SelectFormState(),
  loggedIn: SelectLoginInState(),
  focusMenu: SelectFocusMenu(),
  loginRespMsg: SelectLoginRespMsg(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  container: {
    display: 'flex',
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
    flex: '1 0 auto',
    margin: theme.spacing.unit,
  },
  tooltipCus: {
    fontSize: 20,
  },
  showHelp: {
    backgroundColor: theme.palette.background.paper,
    padding: '0.5em',
    // opacity: '0.5',
  },
  saveButton: {
    backgroundColor: '#D32F2F',
    color: 'primary',
    margin: 0,
  },
  trigger: {
    fontSize: '18px',
    lineHeight: '64px',
    padding: '0 24px',
    cursor: 'pointer',
    transition: 'color 0.3s',
    color: '#ffffff',
    '&:hover': {
      color: '#1890ff',
    },
  },
  logo: {
    background: 'rgba(255, 255, 255, 0.2)',
    fontFamily: 'Oxygen',
    display: 'flex',
    justifyContent: 'center',
    marginTop: '0.1em',
  },

  'list-sort-demo-wrapper': {
    position: 'relative',
    background: '#e6e6e6',
    overflow: 'hidden',
    height: '385px',
  },
  'list-sort-demo': {
    margin: '40px auto',
    maxWidth: '350px',
    width: '90%',
    position: 'relative',
    height: '305px',
  },
  'list-sort-demo > div': {
    overflow: 'hidden',
  },
  'list-sort-demo-list': {
    background: '#fff',
    borderRadius: '6px',
    margin: '5px auto',
    padding: '10px',
    height: '70px',
    transition: 'box-shadow .5s, transform .5s',
  },
  'list-sort-demo-list.list-drag-selected': {
    boxShadow: '0 8px 20px #E6E6E6',
    transform: 'scale(1.1) !important',
  },
  'list-sort-demo-icon': {
    width: '20%',
    display: 'inline-block',
    textAlign: 'center',
    fontSize: '24px',
    lineHeight: '50px',
    verticalAlign: 'top',
  },
  'list-sort-demo-text': {
    width: '80%',
    display: 'inline-block',
    fontSize: '18px',
  },
  'list-sort-demo-text h1': {
    fontSize: '18px',
  },
  'list-sort-demo-text p': {
    fontSize: '12px',
  },
  '@media screen and (max-width: 320px)': {
    'list-sort-demo-text h1': {
      fontSize: '14px',
      lineHeight: '28px',
    },
  },
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

const withReducer = injectReducer({ key: 'main', reducer });
const withSaga = injectSaga({ key: 'main', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
  injectIntl,
  withWidth(),
  withStyles(styles)
)(Main);
