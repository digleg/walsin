/**
 *
 * DevicePage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';

// material-ui
import FontIcon from 'material-ui/FontIcon';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';

// material-ui-next
import Tooltip from 'material-ui-next/Tooltip';

// @material-ui
import { withStyles } from '@material-ui/core/styles';
import withWidth from '@material-ui/core/withWidth';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import CircularProgress from '@material-ui/core/CircularProgress';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Snackbar from '@material-ui/core/Snackbar';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import Icon from '@material-ui/core/Icon';

// material-ui/svg-icons
import RefreshIcon from 'material-ui/svg-icons/navigation/refresh';
import EditIcon from 'material-ui/svg-icons/image/edit';
import ClearIcon from 'material-ui/svg-icons/content/clear';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import AddIcon from 'material-ui/svg-icons/content/add';

// bootstrap table
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import 'react-bootstrap-table/dist/react-bootstrap-table.min.css';
import 'react-bootstrap-table/dist/react-bootstrap-table.min';

// antd
import { message as antdMessage } from 'antd';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { makeSelectDevicePage, SelectGetGwListResp, SelectGetSensorListResp, SelectErrMsgResp, SelectSuccMsgResp } from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';

import { SelectMenuOpened, SelectSendingReq, SelectSendingReqS, SelectSendingReqM } from '../App/selectors';

import {
  getGwList,
  getSensorList,
  setDevByAdmin,
  delDevByAdmin,
  getCpList,
  getUserList,
  editDevByAdmin,
  setErrMsg,
  setSuccMsg,
} from './actions';

import { getFormState } from '../../utils/storageUtility';

export class DevicePage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tabValue: 0,
      status: 'read',
      // dialog
      addDevDia: false,
      deleteDia: false,
      editDevDia: false,
      // hdl show of addDevDia
      addDevTextFieldArrVal: ['addDevMac', 'addDevName', 'addDevFport', 'addDevShare', 'addDevOrg', 'addDevType'],
      // hdl show of editDevDia
      editDevTextFieldArrVal: [
        'editDevId',
        'editDevName',
        'editDevFport',
        'editDevStatus',
        'editDevCpId',
        'editDevUserId',
        'editDevShare',
        'editDevRemark',
      ],
      bootTableHeadArr: [
        'deviceId',
        'device_mac',
        'device_name',
        'device_type',
        'device_share',
        'statusDesc',
        'device_IoT_org',
        'device_IoT_type',
        'device_cp_id',
        'device_user_id',
        'mDate',
        'device_status',
        'remark',
      ],
      // snackBar
      errSnackBarOpen: false,
    };
  }

  componentDidMount() {
    this.props.dispatch(getGwList());
    this.props.dispatch(getSensorList());
    this.props.dispatch(getCpList());
    this.props.dispatch(getUserList());
  }

  hdlTabChg = (e, tabValue) => {
    this.setState(() => ({
      tabValue,
    }));
  };

  tabFunc() {
    const { classes, intl, getGwListResp, getSensorListResp } = this.props;
    const { tabValue, status, bootTableHeadArr } = this.state;
    const tabsList = [];
    const tabDataList = [];
    const LoRaData = [];
    const sensorData = [];
    const formattedEditDevInfo = intl.formatMessage({ id: 'MERC.containers.DevicePage.editDevInfo' });
    const formattedDelDevInfo = intl.formatMessage({ id: 'MERC.containers.DevicePage.delDevInfo' });

    // LoRa Data Process
    for (let i = 0; i < getGwListResp.mList.length; i += 1) {
      const prodObj = {};
      for (let j = 0; j < bootTableHeadArr.length; j += 1) {
        if (bootTableHeadArr[j] === 'statusDesc' || bootTableHeadArr[j] === 'mStatus') {
          const message = intl.formatMessage({
            id: 'MERC.containers.DevicePage.'.concat(getGwListResp.mList[i][bootTableHeadArr[j]]),
          });
          prodObj[bootTableHeadArr[j]] = message;
        } else {
          prodObj[bootTableHeadArr[j]] = getGwListResp.mList[i][bootTableHeadArr[j]];
        }
      }
      LoRaData.push(prodObj);
    }

    // Sensor Data Process
    for (let i = 0; i < getSensorListResp.mList.length; i += 1) {
      const prodObj = {};
      for (let j = 0; j < bootTableHeadArr.length; j += 1) {
        if (bootTableHeadArr[j] === 'statusDesc' || bootTableHeadArr[j] === 'LoRaAP') {
          const message = intl.formatMessage({
            id: 'MERC.containers.DevicePage.'.concat(getSensorListResp.mList[i][bootTableHeadArr[j]]),
          });
          prodObj[bootTableHeadArr[j]] = message;
        } else {
          prodObj[bootTableHeadArr[j]] = getSensorListResp.mList[i][bootTableHeadArr[j]];
        }
      }
      sensorData.push(prodObj);
    }

    const buttonEditFormatter = (cell, row) => {
      return (
        <Tooltip title={formattedEditDevInfo} placement="left" classes={{ tooltip: classes.tooltipCus }}>
          <IconButton
            className={classes.button}
            aria-label="Edit"
            onClick={() => {
              const { editDevTextFieldArrVal } = this.state;
              this.setState({
                editDevDia: true,
                editDevDiaInfo: row,
                [editDevTextFieldArrVal[0]]: row.deviceId,
                [editDevTextFieldArrVal[1]]: row.device_name,
                [editDevTextFieldArrVal[2]]: row.device_type,
                [editDevTextFieldArrVal[3]]: row.device_status,
                [editDevTextFieldArrVal[4]]: row.device_cp_id,
                [editDevTextFieldArrVal[5]]: row.device_user_id,
                [editDevTextFieldArrVal[6]]: row.device_share,
                [editDevTextFieldArrVal[7]]: row.remark === null ? '' : row.remark,
              });
            }}
          >
            <EditIcon />
          </IconButton>
        </Tooltip>
      );
    };

    const buttonDeleteFormatter = (cell, row) => {
      return (
        <Tooltip title={formattedDelDevInfo} placement="left" classes={{ tooltip: classes.tooltipCus }}>
          <IconButton
            className={classes.button}
            aria-label="Delete"
            onClick={() => {
              this.setState({
                deleteDia: true,
                diaInfo: row,
                diaInfoId: row.deviceId,
              });
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      );
    };

    // *** tabs start *** //
    tabsList.push(
      <Tab
        value={0}
        icon={<FontIcon className="material-icons">wifi_tethering</FontIcon>}
        label="LoRa存取点资讯"
        key={Math.random()}
        classes={{ root: classes.tabRoot }}
      />,
      <Tab
        value={1}
        icon={<FontIcon className="material-icons">settings_input_antenna</FontIcon>}
        label="感测器资讯"
        key={Math.random()}
        classes={{ root: classes.tabRoot }}
      />
    );
    // *** tabs end *** //

    // *** tab start *** //
    tabDataList.push(
      tabValue === 0 && (
        <TabContainer style={{ margin: 0, padding: 0 }} key={Math.random()}>
          <Paper style={{ margin: '-1em', border: '1px solid #ced4da', backgroundColor: '#FAFAFA' }}>
            <BootstrapTable data={LoRaData} striped hover keys={Math.random()}>
              {this.renderHeaderDataBoot(bootTableHeadArr)}
              {status === 'edit' && <TableHeaderColumn dataField="icon" dataFormat={buttonEditFormatter} width="40" keys={Math.random()} />}
              {status === 'edit' && (
                <TableHeaderColumn dataField="icon" dataFormat={buttonDeleteFormatter} width="40" keys={Math.random()} />
              )}
            </BootstrapTable>
          </Paper>
        </TabContainer>
      ),
      tabValue === 1 && (
        <TabContainer style={{ margin: 0, padding: 0 }} key={Math.random()}>
          <Paper style={{ margin: '-1em', border: '1px solid #ced4da', backgroundColor: '#FAFAFA' }}>
            <BootstrapTable data={sensorData} striped hover>
              {this.renderHeaderDataBoot(bootTableHeadArr)}
              {status === 'edit' && <TableHeaderColumn dataField="icon" dataFormat={buttonEditFormatter} width="40" keys={Math.random()} />}
              {status === 'edit' && (
                <TableHeaderColumn dataField="icon" dataFormat={buttonDeleteFormatter} width="40" keys={Math.random()} />
              )}
            </BootstrapTable>
          </Paper>
        </TabContainer>
      )
    );
    // *** tab end *** //

    return { tabsList, tabDataList };
  }

  floatBtnFunc() {
    const { waiting, waitingS, classes } = this.props;
    const { status } = this.state;
    const bool = waiting || waitingS;
    return (
      <div>
        <Tooltip
          id="tooltip-icon"
          title={<FormattedMessage {...messages.updateDevInfo} />}
          placement="left"
          classes={{ tooltip: classes.tooltipCus }}
        >
          <FlatButton
            style={{
              position: 'fixed',
              minWidth: 60,
              width: 60,
              height: 60,
              right: 20,
              bottom: 80,
              borderRadius: 100,
              opacity: 0.5,
            }}
            icon={status === 'read' ? <EditIcon /> : <ClearIcon />}
            backgroundColor="#EF5350"
            color="primary"
            onClick={evt => {
              evt.preventDefault();
              if (status === 'read') {
                this.setState({ status: 'edit' });
              } else if (status === 'edit') {
                this.setState({ status: 'read' });
              }
              this.forceUpdate();
            }}
          />
        </Tooltip>
        <Tooltip
          id="tooltip-icon"
          title={<FormattedMessage {...messages.refreshPage} />}
          placement="left"
          classes={{ tooltip: classes.tooltipCus }}
        >
          <FlatButton
            style={{
              position: 'fixed',
              minWidth: 60,
              width: 60,
              height: 60,
              right: 20,
              bottom: 10,
              borderRadius: 100,
              opacity: 0.5,
            }}
            icon={bool ? <CircularProgress color="secondary" size={50} /> : <RefreshIcon />}
            backgroundColor="#0072bc"
            color="primary"
            onClick={evt => {
              evt.preventDefault();
              this.props.dispatch(getGwList());
              this.props.dispatch(getSensorList());
              this.forceUpdate();
            }}
          />
        </Tooltip>
        <Tooltip
          id="tooltip-icon"
          title={<FormattedMessage {...messages.addNewDev} />}
          placement="left"
          classes={{ tooltip: classes.tooltipCus }}
        >
          <FlatButton
            style={{
              position: 'fixed',
              minWidth: 60,
              width: 60,
              height: 60,
              right: 90,
              bottom: 10,
              borderRadius: 100,
              opacity: 0.3,
            }}
            icon={<AddIcon />}
            backgroundColor="#0072bc"
            color="primary"
            onClick={evt => {
              evt.preventDefault();
              this.setState({ addDevDia: true });
            }}
          />
        </Tooltip>
      </div>
    );
  }

  dialogFunc() {
    const { classes, intl } = this.props;
    // dia open control
    const { addDevDia, deleteDia, editDevDia, editDevDiaInfo } = this.state;
    // dia content
    const { addDevTextFieldArrVal, diaInfoId, editDevTextFieldArrVal } = this.state;
    // dia i18l
    const addDevDiaTitle = intl.formatMessage({ id: 'MERC.containers.DevicePage.addDevDiaTitle' });
    const deleteDiaTitle = intl.formatMessage({ id: 'MERC.containers.DevicePage.deleteDiaTitle' });
    const editDevDiaTitle = intl.formatMessage({ id: 'MERC.containers.DevicePage.editDevDiaTitle' });

    const hdlDiaClose = () => {
      // states reset
      if (addDevDia) {
        this.setState({ addDevDia: false });
        for (let i = 0; i < addDevTextFieldArrVal.length; i += 1) {
          this.setState({ [addDevTextFieldArrVal[i]]: '' });
        }
      } else if (deleteDia) {
        this.setState({ deleteDia: false });
      } else if (editDevDia) {
        this.setState({ editDevDia: false });
      }
    };
    const hldDiaConfirm = () => {
      if (addDevDia) {
        this.props.dispatch(
          setDevByAdmin({
            mac: this.state[addDevTextFieldArrVal[0]],
            name: this.state[addDevTextFieldArrVal[1]],
            fport: this.state[addDevTextFieldArrVal[2]],
            share: this.state[addDevTextFieldArrVal[3]],
            org: this.state[addDevTextFieldArrVal[4]],
            type: this.state[addDevTextFieldArrVal[5]],
            statusDesc: this.state[addDevTextFieldArrVal[6]],
          })
        );
        this.forceUpdate();
      } else if (deleteDia) {
        this.props.dispatch(
          delDevByAdmin({
            deviceId: diaInfoId,
          })
        );
      } else if (editDevDia) {
        if (this.state[editDevTextFieldArrVal[3]] === 0) {
          this.props.dispatch(
            editDevByAdmin({
              deviceId: this.state[editDevTextFieldArrVal[0]],
              d: {
                name: this.state[editDevTextFieldArrVal[1]],
                fport: this.state[editDevTextFieldArrVal[2]],
                status: this.state[editDevTextFieldArrVal[3]],
                bindCp: Number(this.state[editDevTextFieldArrVal[4]]),
                share: this.state[editDevTextFieldArrVal[6]],
                remark: this.state[editDevTextFieldArrVal[7]],
              },
            })
          );
        } else {
          this.props.dispatch(
            editDevByAdmin({
              deviceId: this.state[editDevTextFieldArrVal[0]],
              d: {
                name: this.state[editDevTextFieldArrVal[1]],
                fport: this.state[editDevTextFieldArrVal[2]],
                status: this.state[editDevTextFieldArrVal[3]],
                bindCp: Number(this.state[editDevTextFieldArrVal[4]]),
                bindUser: Number(this.state[editDevTextFieldArrVal[5]]),
                share: this.state[editDevTextFieldArrVal[6]],
                remark: this.state[editDevTextFieldArrVal[7]],
              },
            })
          );
        }
      }
      hdlDiaClose();
    };
    const actions = [
      <FlatButton label={<FormattedMessage {...messages.cancel} />} primary onClick={hdlDiaClose} />,
      (addDevDia || deleteDia || editDevDia) && (
        <FlatButton label={<FormattedMessage {...messages.confirm} />} primary onClick={hldDiaConfirm} />
      ),
    ];

    const addDevTextFieldArr = [];
    for (let i = 0; i < addDevTextFieldArrVal.length; i += 1) {
      const stringI18l = 'MERC.containers.DevicePage.'.concat(addDevTextFieldArrVal[i]);
      const addDevIntl = intl.formatMessage({ id: stringI18l });
      addDevTextFieldArr.push(
        <Grid item xs={12} sm={12} md={6} lg={6}>
          <Grid
            container
            justify="center"
            style={{
              backgroundColor: '#FAFAFA',
              borderRadius: 5,
              paddingLeft: '1em',
              paddingRight: '1em',
            }}
          >
            <TextField
              id={addDevTextFieldArrVal[i]}
              label={<FormattedMessage {...messages[addDevTextFieldArrVal[i]]} />}
              className={classes.addDevTextField}
              InputLabelProps={{
                shrink: true,
                className: classes.addDevResize,
              }}
              InputProps={{
                classes: {
                  input: classes.addDevResize,
                },
              }}
              style={{ width: '100%' }}
              value={this.state[addDevTextFieldArrVal[i]]}
              onChange={e => {
                this.setState({ [addDevTextFieldArrVal[i]]: e.target.value });
              }}
              margin="normal"
              placeholder={addDevIntl}
            />
          </Grid>
        </Grid>
      );
    }
    addDevTextFieldArr.push(<Grid item xs={12} sm={12} md={6} lg={6} />);

    const editDevTextFieldArr = [];
    if (editDevDiaInfo !== undefined) {
      for (let i = 0; i < editDevTextFieldArrVal.length; i += 1) {
        if (editDevTextFieldArrVal[i] === 'editDevUserId' && editDevDiaInfo.device_status === 0) {
          editDevTextFieldArr.push();
        } else if (editDevTextFieldArrVal[i] === 'editDevId') {
          editDevTextFieldArr.push();
        } else {
          const stringI18l = 'MERC.containers.DevicePage.'.concat(editDevTextFieldArrVal[i]);
          const editDevIntl = intl.formatMessage({ id: stringI18l });
          editDevTextFieldArr.push(
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <Grid
                container
                justify="center"
                style={{
                  backgroundColor: '#FAFAFA',
                  borderRadius: 5,
                  paddingLeft: '1em',
                  paddingRight: '1em',
                }}
              >
                <TextField
                  id={editDevTextFieldArrVal[i]}
                  label={<FormattedMessage {...messages[editDevTextFieldArrVal[i]]} />}
                  className={classes.addDevTextField}
                  InputLabelProps={{
                    shrink: true,
                    className: classes.addDevResize,
                  }}
                  InputProps={{
                    classes: {
                      input: classes.addDevResize,
                    },
                  }}
                  style={{ width: '100%' }}
                  value={this.state[editDevTextFieldArrVal[i]]}
                  onChange={e => {
                    this.setState({ [editDevTextFieldArrVal[i]]: e.target.value });
                  }}
                  margin="normal"
                  placeholder={editDevIntl}
                />
              </Grid>
            </Grid>
          );
        }
      }
    }

    editDevTextFieldArr.push(<Grid item xs={12} sm={12} md={6} lg={6} />);

    const addDevFunc = () => {
      return (
        <Grid container className={classes.addDevContainer} justify="center" spacing={8} style={{ marginTop: 5, marginBottom: 5 }}>
          {addDevTextFieldArr}
        </Grid>
      );
    };

    const deleteFunc = () => {
      const messageDeleteDiaText = intl.formatMessage({ id: 'MERC.containers.DevicePage.messageDeleteDiaText' });
      return (
        <div>
          {messageDeleteDiaText} {diaInfoId} ?
        </div>
      );
    };

    const editDevFunc = () => {
      return (
        <Grid container className={classes.addDevContainer} justify="center" spacing={8} style={{ marginTop: 5, marginBottom: 5 }}>
          {editDevTextFieldArr}
        </Grid>
      );
    };

    const contentStyleWidthNormal = {
      borderRadius: 4,
    };

    return (
      <Dialog
        title={(addDevDia && addDevDiaTitle) || (deleteDia && deleteDiaTitle) || (editDevDia && editDevDiaTitle)}
        actions={actions}
        modal={false}
        open={addDevDia || deleteDia || editDevDia}
        onRequestClose={hdlDiaClose}
        contentStyle={contentStyleWidthNormal}
        titleStyle={{ fontWeight: 800 }}
        autoScrollBodyContent
      >
        {addDevDia && addDevFunc()}
        {deleteDia && deleteFunc()}
        {editDevDia && editDevFunc()}
      </Dialog>
    );
  }

  msgFunc() {
    const { errMsg, succMsg } = this.props;
    const error = () => {
      antdMessage.error(errMsg, 3);
    };
    if (errMsg !== '') {
      this.props.dispatch(setErrMsg(''));
      return error();
    }
    return null;
  }

  snackBarFunc() {
    const { errMsg, succMsg } = this.props;
    const hdlCls = () => {
      this.props.dispatch(setErrMsg(''));
      this.props.dispatch(setSuccMsg(''));
    };
    if (errMsg !== '' || succMsg !== '') {
      return (
        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          open={errMsg !== '' || succMsg !== ''}
          autoHideDuration={2000}
          onClose={hdlCls}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={
            (errMsg !== '' && (
              <span style={{ fontWeight: 800, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Icon style={{ color: '#EF5350', marginRight: '0.5em' }}>error</Icon>
                {errMsg.toUpperCase()}
              </span>
            )) ||
            (succMsg !== '' && (
              <span style={{ fontWeight: 800, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Icon style={{ color: '#76FF03', marginRight: '0.5em' }}>check</Icon>
                {succMsg.toUpperCase()}
              </span>
            ))
          }
        />
      );
    }
    return null;
  }

  renderHeaderDataBoot(column) {
    const TableHeaderColumnArr = [];
    for (let i = 0; i < column.length; i += 1) {
      if (i === 0) {
        TableHeaderColumnArr.push(
          <TableHeaderColumn isKey dataField={column[i]} key={Math.random()}>
            {<FormattedMessage {...messages[column[i]]} />}
          </TableHeaderColumn>
        );
      } else if (i === 4 || i === 6 || i === 7 || i === 8 || i === 9 || i === 10 || i === 11) {
        TableHeaderColumnArr.push(
          <TableHeaderColumn dataField={column[i]} hidden key={Math.random()}>
            {<FormattedMessage {...messages[column[i]]} />}
          </TableHeaderColumn>
        );
      } else {
        TableHeaderColumnArr.push(
          <TableHeaderColumn dataField={column[i]} key={Math.random()}>
            {<FormattedMessage {...messages[column[i]]} />}
          </TableHeaderColumn>
        );
      }
    }
    return TableHeaderColumnArr;
  }

  render() {
    const { menuOpen, classes, getGwListResp, getSensorListResp, errMsg } = this.props;
    const { tabValue } = this.state;
    const formState = getFormState();
    return (
      <div>
        <Helmet>
          <title>DevicePage</title>
          <meta name="description" content="Description of DevicePage" />
        </Helmet>
        {getGwListResp.size === 0 ||
          (getSensorListResp.size === 0 && (
            <div
              style={{
                display: 'flex',
                flex: 1,
                justifyContent: 'center',
                alignContent: 'center',
                alignItems: 'center',
                height: '5em',
              }}
            >
              <CircularProgress size={20} thickness={10} style={{ color: '#0277BD' }} />
            </div>
          ))}
        {getGwListResp.size !== 0 &&
          (getSensorListResp.size !== 0 && (
            <div>
              <AppBar position="static" color="default">
                <Tabs
                  id="eventTable"
                  value={tabValue}
                  onChange={(event, value) => this.hdlTabChg(event, value)}
                  classes={{
                    root: classes.tabsRoot,
                    indicator: classes.tabsIndicator,
                  }}
                  variant="scrollable"
                  scrollButtons="on"
                >
                  {this.tabFunc().tabsList}
                </Tabs>
              </AppBar>
              {/* <div style={{ margin: '-1em' }}>{this.tabFunc().tabDataList}</div> */}
              {this.tabFunc().tabDataList}
              {formState.role === 'superAdmin' && this.floatBtnFunc()}
              {this.dialogFunc()}
              {/* {this.msgFunc()} */}
              {this.snackBarFunc()}
            </div>
          ))}
      </div>
    );
  }
}

DevicePage.propTypes = {
  dispatch: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
  menuOpen: PropTypes.bool,
  waiting: PropTypes.bool,
  waitingS: PropTypes.bool,
  classes: PropTypes.object.isRequired,
  getGwListResp: PropTypes.object,
  getSensorListResp: PropTypes.object,
  errMsg: PropTypes.string,
  succMsg: PropTypes.string,
};

const mapStateToProps = createStructuredSelector({
  devicepage: makeSelectDevicePage(),
  menuOpen: SelectMenuOpened(),
  getGwListResp: SelectGetGwListResp(),
  getSensorListResp: SelectGetSensorListResp(),
  waiting: SelectSendingReq(),
  waitingS: SelectSendingReqS(),
  waitingM: SelectSendingReqM(),
  errMsg: SelectErrMsgResp(),
  succMsg: SelectSuccMsgResp(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

const withReducer = injectReducer({ key: 'devicePage', reducer });
const withSaga = injectSaga({ key: 'devicePage', saga });

const styles = () => ({
  // appbar, tab
  root: {
    flexGrow: 1,
  },
  tabsIndicator: {
    backgroundColor: '#1890ff',
    height: 5,
  },
  // bootstrap-table
  button: {
    margin: -18,
    marginLeft: -7,
    borderRadius: 5,
    width: 40,
  },
  // add dev
  addDevContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  addDevResize: {
    fontSize: 16,
  },
  addDevTextField: {
    fontWeight: 800,
    fontSize: 50,
  },
  tooltipCus: {
    fontSize: 20,
  },
});

export default compose(
  withReducer,
  withSaga,
  withConnect,
  injectIntl,
  withStyles(styles),
  withWidth()
)(DevicePage);
