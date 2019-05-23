/**
 *
 * RoboticPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import MaterialUiIconPicker from 'react-material-ui-icon-picker';

// material-ui
import { Tabs, Tab } from 'material-ui/Tabs';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
// eslint-disable-next-line
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import FontIcon from 'material-ui/FontIcon';
import Dialog from 'material-ui/Dialog';
import CircularProgress from 'material-ui/CircularProgress';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
// import DatePicker from 'material-ui/DatePicker';

// material-ui-next
import Tooltip from 'material-ui-next/Tooltip';
import Snackbar from 'material-ui-next/Snackbar';
import Grid from 'material-ui-next/Grid';
// import TextFieldPicker from 'material-ui-next/TextField';
import { withStyles } from 'material-ui-next/styles';

// Data picker
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-datepicker/dist/react-datepicker-cssmodules.css';

// svg-icon
import HistoryIcon from 'material-ui/svg-icons/action/history';
import AddIcon from 'material-ui/svg-icons/content/add';
import EditIcon from 'material-ui/svg-icons/image/edit';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import IconButton from 'material-ui-next/IconButton';
import CloseIcon from 'material-ui-icons/Close';
import UpdateIcon from 'material-ui/svg-icons/file/file-download';
import RefreshIcon from 'material-ui/svg-icons/action/autorenew';

import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap/less/bootstrap.less';
import Pagination from 'react-js-pagination';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import {
  makeSelectRoboticPage,
  SelectSetRoboticList,
  SelectSetScriptList,
  SelectSetExecHistory,
  SelectSetDate,
  SelectSetAll,
  SelectSetScriptListRespMsg,
} from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';
import Header from '../Main/index';
import { SelectMenuOpened, SelectSendingReqM, SelectSendingReqS } from '../App/selectors';

import {
  getRoboticList,
  getScriptList,
  uploadRAScript,
  deleteRAScript,
  editRAScript,
  updateRAScript,
  getExecHistory,
} from './actions';

import { timeFormat } from '../../utils/timeFormat';

import monthIndex from './monthIndex';

export class RoboticPage extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      selectedRows: [],

      RAScriptUpdateDia: false,
      RAScriptAddDia: false,
      RAScriptEditDia: false,
      RAScriptDeleteDia: false,
      RAScriptHistoryDia: false,

      showColumn: ['device_name', 'device_mac', 'station', 'script', 'scriptState', 'statusDesc'],
      showColumnScript: ['name', 'desc', 'content_type', 'version', 'fileName'],
      showColumnExecHistory: ['deviceType', 'deviceId', 'data', 'timestamp'],

      textName: '',
      textDesc: '',
      textVersion: '',
      scriptId: '',

      // Error Msg
      errMsgName: false,
      errMsgDesc: false,
      errMsgVersion: false,

      file: null,
      todayDate: '',

      // data picker
      startDate: moment(),

      // pagination
      activePage: 1,
      pageStart: 0,
    };
    this.onRowSelection = this.onRowSelection.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
  }

  componentDidMount() {
    this.props.dispatch(getRoboticList());
    this.props.dispatch(getScriptList());
  }

  onRowSelection(selectedRows) {
    if (selectedRows.length === 0) {
      setTimeout(() => {
        this.setState({ selectedRows: this.state.selectedRows });
      }, 100);
      return;
    }
    this.setState({ selectedRows });
  }

  getStripedStyle(index) {
    return { backgroundColor: index % 2 ? '#FFFFFF' : '#B3E5FC' };
  }

  handleChange(date) {
    const { pageStart } = this.state;
    // eslint-disable-next-line
    const dateSplit = date._d.toString().split(' ');
    const dateFormat = dateSplit[3]
      .concat('-')
      .concat(monthIndex[dateSplit[1].toUpperCase()])
      .concat('-')
      .concat(dateSplit[2]);
    // monthIndex
    this.setState({
      startDate: date,
      dateFormat,
    });
    this.props.dispatch(getExecHistory({ qTime: dateFormat, skip: pageStart }));
  }

  handlePageChange(pageNumber) {
    const { dateFormat } = this.state;
    this.setState({ activePage: pageNumber });
    this.props.dispatch(getExecHistory({ qTime: dateFormat, skip: (pageNumber - 1) * 5 }));
  }

  handleClose = () => {
    this.setState({
      // dialog
      RAScriptUpdateDia: false,
      RAScriptAddDia: false,
      RAScriptEditDia: false,
      RAScriptDeleteDia: false,
      RAScriptHistoryDia: false,

      // snackbar
      snackbarRAOpen: false,
      snackbarRSOpen: false,

      // textfield
      textName: '',
      textDesc: '',
      textVersion: '',
      id: '',
      scriptId: '',

      // Error Msg
      errMsgName: false,
      errMsgDesc: false,
      errMsgVersion: false,

      file: null,
      selectedRows: [],
      todayDate: '',

      // pagination
      activePage: 1,
      pageStart: 0,
    });
  };

  RAScriptSubmit() {
    const { file, textName, textDesc, textVersion } = this.state;
    // errMsgName, errMsgDesc, errMsgVersion
    // textName, textDesc, textVersion
    if (textName === '') {
      this.setState({ errMsgName: true });
    } else this.setState({ errMsgName: false });
    if (textDesc === '') {
      this.setState({ errMsgDesc: true });
    } else this.setState({ errMsgDesc: false });
    if (textVersion === '') {
      this.setState({ errMsgVersion: true });
    } else this.setState({ errMsgVersion: false });

    if (textName !== '' && textDesc !== '' && textVersion !== '') {
      this.props.dispatch(uploadRAScript({ file, textName, textDesc, textVersion }));
      this.handleClose();
    }
  }

  RAScriptDeleteSubmit() {
    const { id } = this.props.scriptList.fList[this.state.selectedRows[0]];
    this.props.dispatch(deleteRAScript({ id }));
    this.handleClose();
  }

  RAScriptEditSubmit() {
    const { id, file, textName, textDesc, textVersion } = this.state;
    if (textName === '') {
      this.setState({ errMsgName: true });
    } else this.setState({ errMsgName: false });
    if (textDesc === '') {
      this.setState({ errMsgDesc: true });
    } else this.setState({ errMsgDesc: false });
    if (textVersion === '') {
      this.setState({ errMsgVersion: true });
    } else this.setState({ errMsgVersion: false });

    if (textName !== '' && textDesc !== '' && textVersion !== '') {
      this.props.dispatch(editRAScript({ id, file, textName, textDesc, textVersion }));
      this.handleClose();
    }
  }

  RAScriptUpdateSubmit() {
    const { scriptId, selectedRows } = this.state;
    const { roboticList } = this.props;
    const RAId = roboticList.mList[selectedRows[0]].device_mac;
    this.props.dispatch(updateRAScript({ RAId, scriptId }));
    this.handleClose();
  }

  showPickedIcon = icon => {
    this.setState({ pickIcon: icon.name });
  };

  handleFileChange = event => {
    this.setState({
      file: event.target.files[0],
    });
  };

  handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({ snackbarRSOpen: false, snackbarRAOpen: false });
  };

  renderHeaderData(column) {
    return column.map((item, index) => (
      <TableHeaderColumn style={{ fontWeight: 800 }} key={index}>
        {<FormattedMessage {...messages[item]} />}
      </TableHeaderColumn>
    ));
  }

  renderBodyData(list, column) {
    return list.map((item, index) => (
      <TableRow
        key={index}
        selected={this.state.selectedRows.indexOf(index) !== -1}
        style={{ ...this.getStripedStyle(index), fontWeight: 500 }}
      >
        {column.map(
          // eslint-disable-next-line
          (itemCol, indexCol) =>
            itemCol === 'script' ||
            itemCol === 'scriptState' ||
            itemCol === 'statusDesc' ||
            itemCol === 'desc' ||
            itemCol === 'version' ? (
              item[itemCol] === 'NA' ||
              item[itemCol] === '0' ||
              item[itemCol] === '-1' ||
              item[itemCol] === 'processing' ||
              item[itemCol] === 'in used' ||
              item[itemCol] === 'undefined' ? (
                <TableRowColumn key={indexCol}>{<FormattedMessage {...messages[item[itemCol]]} />}</TableRowColumn>
              ) : (
                <TableRowColumn key={indexCol}>{item[itemCol]}</TableRowColumn>
              )
            ) : itemCol === 'timestamp' ? (
              <TableRowColumn style={{ whiteSpace: 'normal' }} key={indexCol}>
                {timeFormat(item[itemCol])}
              </TableRowColumn>
            ) : itemCol === 'data' ? (
              <TableRowColumn style={{ whiteSpace: 'normal' }} key={indexCol}>
                {item[itemCol].status}
              </TableRowColumn>
            ) : (
              <TableRowColumn key={indexCol}>{item[itemCol]}</TableRowColumn>
            )
        )}
      </TableRow>
    ));
  }

  render() {
    const { menuOpen, waiting, roboticList, scriptList, intl, execuHistory, allNumber, scriptListRespMsg } = this.props;
    const {
      selectedRows,
      RAScriptUpdateDia,
      RAScriptAddDia,
      RAScriptEditDia,
      RAScriptDeleteDia,
      RAScriptHistoryDia,
      pageStart,
    } = this.state;
    const { snackbarRAOpen, snackbarRSOpen } = this.state;
    const actions = [
      <FlatButton label={<FormattedMessage {...messages.cancel} />} primary onClick={this.handleClose} />,
      <FlatButton
        label={<FormattedMessage {...messages.confirm} />}
        primary
        onClick={evt => {
          evt.preventDefault();
          // eslint-disable-next-line
          RAScriptUpdateDia
            ? this.RAScriptUpdateSubmit()
            : RAScriptAddDia
              ? this.RAScriptSubmit()
              : RAScriptEditDia
                ? this.RAScriptEditSubmit()
                : RAScriptDeleteDia
                  ? this.RAScriptDeleteSubmit()
                  : RAScriptHistoryDia
                    ? ''
                    : '';
        }}
      />,
    ];

    const RoboticArmScriptUpdate = intl.formatMessage({ id: 'IIoT.containers.RoboticPage.RoboticArmScriptUpdate' });
    const AddAnScript = intl.formatMessage({ id: 'IIoT.containers.RoboticPage.AddAnScript' });
    const EditTheScript = intl.formatMessage({ id: 'IIoT.containers.RoboticPage.EditTheScript' });
    const DeleteAScript = intl.formatMessage({ id: 'IIoT.containers.RoboticPage.DeleteAScript' });
    const ExecutionHistoryList = intl.formatMessage({ id: 'IIoT.containers.RoboticPage.ExecutionHistoryList' });

    return (
      <div
        style={
          menuOpen
            ? { backgroundColor: '#f2f5f8', minHeight: '100vh', marginLeft: 300 }
            : { backgroundColor: '#f2f5f8', minHeight: '100vh' }
        }
      >
        <Helmet>
          <meta name="description" content="Description of RoboticPage" />
        </Helmet>
        <Header />

        <div style={{ visibility: 'hidden', lineHeight: 0, height: 0 }}>
          <MaterialUiIconPicker onPick={this.showPickedIcon} label="PICK" pickLabel="Pick IT" />
        </div>

        <Tabs
          style={{
            margin: '1vw',
            backgroundColor: '#ffffff',
            minHeight: '30vh',
          }}
          tabItemContainerStyle={{
            backgroundColor: '#0072bc',
            opacity: 0.7,
            padding: 0,
            borderTopLeftRadius: 4,
            borderTopRightRadius: 4,
          }}
          contentContainerStyle={{
            padding: 5,
          }}
        >
          <Tab
            icon={<FontIcon className="material-icons">list</FontIcon>}
            label={<FormattedMessage {...messages.RoboticArmList} />}
          >
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Tooltip id="setting-icon" title={<FormattedMessage {...messages.RoboticArmScriptSetting} />}>
                <RaisedButton
                  style={{ marginRight: 10, marginBottom: 10 }}
                  onClick={evt => {
                    if (selectedRows.length !== 0) {
                      evt.preventDefault();
                      this.setState({
                        RAScriptUpdateDia: true,
                        scriptId: roboticList.mList[selectedRows].scriptId,
                      });
                    } else this.setState({ snackbarRAOpen: true });
                  }}
                >
                  <UpdateIcon />
                </RaisedButton>
              </Tooltip>
              <Tooltip id="history-icon" title={<FormattedMessage {...messages.ExcutionHistory} />}>
                <RaisedButton
                  // label="Execution History"
                  style={{ marginRight: 10, marginBottom: 10 }}
                  onClick={evt => {
                    if (selectedRows.length !== 0) {
                      evt.preventDefault();

                      let today = new Date();
                      let dd = today.getDate();
                      let mm = today.getMonth() + 1;
                      const yyyy = today.getFullYear();

                      if (dd < 10) {
                        dd = '0'.concat(dd);
                      }
                      if (mm < 10) {
                        mm = '0'.concat(mm);
                      }
                      today = yyyy
                        .toString()
                        .concat('-')
                        .concat(mm)
                        .concat('-')
                        .concat(dd);
                      this.props.dispatch(getExecHistory({ qTime: today, skip: pageStart }));
                      this.setState({ RAScriptHistoryDia: true, todayDate: today });
                    } else this.setState({ snackbarRSOpen: true });
                  }}
                >
                  <HistoryIcon />
                </RaisedButton>
              </Tooltip>
              <Tooltip id="refresh-icon" title={<FormattedMessage {...messages.refresh} />}>
                <RaisedButton
                  style={{ marginBottom: 10 }}
                  onClick={evt => {
                    evt.preventDefault();
                    this.props.dispatch(getRoboticList());
                  }}
                >
                  <RefreshIcon />
                </RaisedButton>
              </Tooltip>
            </div>
            <Paper>
              <Table style={{ borderRadius: 10 }}>
                <TableHeader style={{ borderRadius: 10 }} displaySelectAll={false} displayRowCheckbox={false}>
                  <TableRow>{this.renderHeaderData(this.state.showColumn)}</TableRow>
                </TableHeader>
              </Table>
              {roboticList === undefined || waiting || roboticList.mList === undefined ? (
                <CircularProgress
                  size={150}
                  thickness={10}
                  color="#0072bc"
                  style={{
                    margin: 50,
                  }}
                />
              ) : (
                <Table onRowSelection={this.onRowSelection}>
                  <TableBody deselectOnClickaway={false}>
                    {this.renderBodyData(roboticList.mList, this.state.showColumn)}
                  </TableBody>
                </Table>
              )}
            </Paper>
          </Tab>
          <Tab
            label={<FormattedMessage {...messages.RoboticArmScript} />}
            icon={<FontIcon className="material-icons">view_list</FontIcon>}
          >
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Tooltip id="insert-icon" title={<FormattedMessage {...messages.CreateNewScript} />}>
                <RaisedButton
                  style={{ marginRight: 10, marginBottom: 10 }}
                  onClick={evt => {
                    evt.preventDefault();
                    this.setState({ RAScriptAddDia: true });
                  }}
                >
                  <AddIcon />
                </RaisedButton>
              </Tooltip>
              <Tooltip id="update-icon" title={<FormattedMessage {...messages.UpdateScript} />}>
                <RaisedButton
                  style={{ marginRight: 10, marginBottom: 10 }}
                  onClick={evt => {
                    if (selectedRows.length !== 0) {
                      evt.preventDefault();
                      this.setState({
                        RAScriptEditDia: true,
                        textName: scriptList.fList[selectedRows[0]].name,
                        textDesc: scriptList.fList[selectedRows[0]].desc,
                        textVersion: scriptList.fList[selectedRows[0]].version,
                        id: scriptList.fList[selectedRows[0]].id,
                      });
                    } else this.setState({ snackbarRSOpen: true });
                  }}
                >
                  <EditIcon />
                </RaisedButton>
              </Tooltip>
              <Tooltip id="delete-icon" title={<FormattedMessage {...messages.DeleteScript} />}>
                <RaisedButton
                  style={{ marginRight: 10, marginBottom: 10 }}
                  onClick={evt => {
                    if (selectedRows.length !== 0) {
                      evt.preventDefault();
                      this.setState({ RAScriptDeleteDia: true });
                    } else this.setState({ snackbarRSOpen: true });
                  }}
                >
                  <DeleteIcon />
                </RaisedButton>
              </Tooltip>
              <Tooltip id="refresh-icon" title={<FormattedMessage {...messages.refresh} />}>
                <RaisedButton
                  style={{ marginRight: 10, marginBottom: 10 }}
                  onClick={evt => {
                    evt.preventDefault();
                    this.props.dispatch(getScriptList());
                  }}
                >
                  <RefreshIcon />
                </RaisedButton>
              </Tooltip>
            </div>
            <Paper>
              <Table style={{ borderRadius: 10 }}>
                <TableHeader style={{ borderRadius: 10 }} displaySelectAll={false} displayRowCheckbox={false}>
                  <TableRow>{this.renderHeaderData(this.state.showColumnScript)}</TableRow>
                </TableHeader>
              </Table>
              {scriptListRespMsg === 'no exist data' ? (
                <div style={{ display: 'flex', justifyContent: 'center', height: 200, alignItems: 'center' }}>No exist data</div>
              ) : scriptList === undefined || waiting || scriptList.fList === undefined ? (
                <div
                  style={{
                    display: 'flex',
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'center',
                  }}
                >
                  <CircularProgress
                    size={150}
                    thickness={10}
                    color="#0072bc"
                    style={{
                      margin: 50,
                    }}
                  />
                </div>
              ) : (
                <Table onRowSelection={this.onRowSelection}>
                  <TableBody deselectOnClickaway={false}>
                    {this.renderBodyData(scriptList.fList, this.state.showColumnScript)}
                  </TableBody>
                </Table>
              )}
            </Paper>
          </Tab>
        </Tabs>
        {/* All Dialog Here */}
        <Dialog
          title={
            RAScriptUpdateDia
              ? RoboticArmScriptUpdate
              : RAScriptAddDia
                ? AddAnScript
                : RAScriptEditDia
                  ? EditTheScript
                  : RAScriptDeleteDia
                    ? DeleteAScript
                    : RAScriptHistoryDia
                      ? ExecutionHistoryList
                      : ''
          }
          actions={actions}
          contentStyle={{
            display: 'flex',
            justifyContent: 'center',
            borderRadius: 4,
            overflow: 'auto',
          }}
          style={{
            borderRadius: 4,
          }}
          modal={false}
          open={RAScriptUpdateDia || RAScriptAddDia || RAScriptEditDia || RAScriptDeleteDia || RAScriptHistoryDia}
          onRequestClose={this.handleClose}
        >
          {RAScriptUpdateDia ? (
            <SelectField
              floatingLabelText={<FormattedMessage {...messages.RoboticArmScript} />}
              floatingLabelStyle={{ fontFamily: 'Roboto' }}
              value={this.state.scriptId === 'NA' ? 'NA' : this.state.scriptId}
              onChange={(event, index, value) => this.setState({ scriptId: value })}
              dropDownMenuProps={{ anchorOrigin: { vertical: 'center', horizontal: 'left' } }}
            >
              {this.state.scriptId === 'NA' ? (
                <MenuItem key={Math.random()} value="NA" primaryText={<FormattedMessage {...messages.NA} />} />
              ) : (
                ''
              )}
              {scriptList.fList.map(item => <MenuItem key={Math.random()} value={item.id} primaryText={item.name} />)}
            </SelectField>
          ) : (
            ''
          )}
          {RAScriptAddDia ? (
            <Grid container>
              <Grid container alignItems="center" justify="center" direction="row">
                <Grid item xs={10} sm={7} md={5} lg={5} xl={5}>
                  <TextField
                    hintText={<FormattedMessage {...messages.nameHint} />}
                    floatingLabelText={<FormattedMessage {...messages.name} />}
                    floatingLabelFixed
                    floatingLabelStyle={{ fontFamily: 'Roboto' }}
                    value={this.state.textName}
                    onChange={e => {
                      this.setState({ textName: e.target.value });
                    }}
                    errorText={this.state.errMsgName ? <FormattedMessage {...messages.nameHint} /> : ''}
                  />
                </Grid>
                <Grid item xs={10} sm={7} md={5} lg={5} xl={5}>
                  <TextField
                    hintText={<FormattedMessage {...messages.descriptionHint} />}
                    floatingLabelText={<FormattedMessage {...messages.description} />}
                    floatingLabelFixed
                    floatingLabelStyle={{ fontFamily: 'Roboto' }}
                    value={this.state.textDesc}
                    onChange={e => {
                      this.setState({ textDesc: e.target.value });
                    }}
                    errorText={this.state.errMsgDesc ? <FormattedMessage {...messages.descriptionHint} /> : ''}
                  />
                </Grid>
                <Grid item xs={10} sm={7} md={5} lg={5} xl={5}>
                  <TextField
                    hintText={<FormattedMessage {...messages.versionHint} />}
                    floatingLabelText={<FormattedMessage {...messages.version} />}
                    floatingLabelFixed
                    floatingLabelStyle={{ fontFamily: 'Roboto' }}
                    value={this.state.textVersion}
                    onChange={e => {
                      this.setState({ textVersion: e.target.value });
                    }}
                    errorText={this.state.errMsgVersion ? <FormattedMessage {...messages.versionHint} /> : ''}
                  />
                </Grid>
                <Grid item xs={10} sm={7} md={5} lg={5} xl={5}>
                  <div
                    style={{
                      marginTop: 10,
                      marginBottom: 10,
                      fontSize: 12,
                      fontFamily: 'Roboto',
                      color: '#BDBDBD',
                      fontWeight: 500,
                    }}
                  >
                    <FormattedMessage {...messages.uploadScript} />
                  </div>
                  <input name="myFile" id="myFile" type="file" onChange={this.handleFileChange} placeholder="test01" />
                </Grid>
                <Grid item xs={10} sm={7} md={5} lg={5} xl={5} />
              </Grid>
            </Grid>
          ) : (
            ''
          )}
          {RAScriptEditDia ? (
            <Grid container>
              <Grid container alignItems="center" justify="center" direction="row">
                <Grid item xs={10} sm={7} md={5} lg={5} xl={5}>
                  <TextField
                    hintText={<FormattedMessage {...messages.nameHint} />}
                    floatingLabelText={<FormattedMessage {...messages.name} />}
                    floatingLabelFixed
                    floatingLabelStyle={{ fontFamily: 'Roboto' }}
                    value={this.state.textName}
                    onChange={e => {
                      this.setState({ textName: e.target.value });
                    }}
                    errorText={this.state.errMsgName ? <FormattedMessage {...messages.nameHint} /> : ''}
                  />
                </Grid>
                <Grid item xs={10} sm={7} md={5} lg={5} xl={5}>
                  <TextField
                    hintText={<FormattedMessage {...messages.descriptionHint} />}
                    floatingLabelText={<FormattedMessage {...messages.description} />}
                    floatingLabelFixed
                    floatingLabelStyle={{ fontFamily: 'Roboto' }}
                    value={this.state.textDesc}
                    onChange={e => {
                      this.setState({ textDesc: e.target.value });
                    }}
                    errorText={this.state.errMsgDesc ? <FormattedMessage {...messages.descriptionHint} /> : ''}
                  />
                </Grid>
                <Grid item xs={10} sm={7} md={5} lg={5} xl={5}>
                  <TextField
                    hintText={<FormattedMessage {...messages.versionHint} />}
                    floatingLabelText={<FormattedMessage {...messages.version} />}
                    floatingLabelFixed
                    floatingLabelStyle={{ fontFamily: 'Roboto' }}
                    value={this.state.textVersion}
                    onChange={e => {
                      this.setState({ textVersion: e.target.value });
                    }}
                    errorText={this.state.errMsgVersion ? <FormattedMessage {...messages.versionHint} /> : ''}
                  />
                </Grid>
                <Grid item xs={10} sm={7} md={5} lg={5} xl={5}>
                  <div
                    style={{
                      marginTop: 10,
                      marginBottom: 10,
                      fontSize: 12,
                      fontFamily: 'Roboto',
                      color: '#BDBDBD',
                      fontWeight: 500,
                    }}
                  >
                    <FormattedMessage {...messages.uploadScript} />
                  </div>
                  <input name="myFile" id="myFile" type="file" onChange={this.handleFileChange} />
                </Grid>
                <Grid item xs={10} sm={7} md={5} lg={5} xl={5} />
              </Grid>
            </Grid>
          ) : (
            ''
          )}
          {RAScriptDeleteDia ? (
            <div style={{ display: 'inline-flex', margin: 20 }}>
              <FormattedMessage {...messages.deleteScript} /> : &nbsp;
              <div style={{ fontWeight: 800, color: 'red' }}>{scriptList.fList[selectedRows[0]].name}</div>?
            </div>
          ) : (
            ''
          )}
          {RAScriptHistoryDia ? (
            <div>
              <Paper>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginRight: 10 }}>
                  <div>
                    <Tooltip id="refresh-icon" title="Find the Data Before This Date">
                      <div style={{ fontSize: 10 }}>Please Select a Date</div>
                    </Tooltip>
                    <div
                      style={{
                        border: '2px solid #0072bc',
                        borderRadius: 4,
                        width: 180,
                        display: 'flex',
                        justifyContent: 'center',
                      }}
                    >
                      <DatePicker
                        selected={this.state.startDate}
                        onChange={this.handleChange}
                        className="red-border"
                        calendarClassName="rasta-stripes"
                        isClearable
                      />
                    </div>
                  </div>
                </div>
                <Table style={{ borderRadius: 10, zIndex: 2, backgroundColor: '#ffffff' }}>
                  <TableHeader style={{ borderRadius: 10 }} displaySelectAll={false} adjustForCheckbox={false}>
                    <TableRow>{this.renderHeaderData(this.state.showColumnExecHistory)}</TableRow>
                  </TableHeader>
                </Table>
                {waitingS ? (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                    <CircularProgress
                      size={150}
                      thickness={10}
                      color="#0072bc"
                      style={{
                        margin: 50,
                      }}
                    />
                  </div>
                ) : execuHistory.eList === undefined ? (
                  <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
                    No Event Data. Please Reselect a Date !
                  </div>
                ) : (
                  <Table selectable={false}>
                    <TableBody displayRowCheckbox={false}>
                      {this.renderBodyData(execuHistory.eList, this.state.showColumnExecHistory)}
                    </TableBody>
                  </Table>
                )}
              </Paper>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: -30 }}>
                <Pagination
                  activePage={this.state.activePage}
                  itemsCountPerPage={5}
                  totalItemsCount={allNumber}
                  pageRangeDisplayed={5}
                  onChange={this.handlePageChange}
                />
              </div>
              {/* qTime: dateFormat, skip: pageStart */}
            </div>
          ) : (
            ''
          )}
        </Dialog>
        {/* All SnackBar Here */}
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          open={snackbarRSOpen || snackbarRAOpen}
          autoHideDuration={2000}
          onClose={this.handleCloseSnackbar}
          SnackbarContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={
            snackbarRAOpen ? (
              <span>
                <FormattedMessage {...messages.SnackBoxRA} />
              </span>
            ) : snackbarRSOpen ? (
              <span>
                <FormattedMessage {...messages.SnackBoxRAScript} />
              </span>
            ) : (
              ''
            )
          }
          action={[
            <IconButton key="close" aria-label="Close" color="inherit" onClick={this.handleCloseSnackbar}>
              <CloseIcon />
            </IconButton>,
          ]}
        />
      </div>
    );
  }
}

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
});

RoboticPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
  menuOpen: PropTypes.bool,
  waiting: PropTypes.bool,
  roboticList: PropTypes.object,
  scriptList: PropTypes.object,
  intl: intlShape.isRequired,
  execuHistory: PropTypes.object,
  classes: PropTypes.any,
  allNumber: PropTypes.number,
  scriptListRespMsg: PropTypes.string,
};

const mapStateToProps = createStructuredSelector({
  roboticpage: makeSelectRoboticPage(),
  menuOpen: SelectMenuOpened(),
  roboticList: SelectSetRoboticList(),
  scriptList: SelectSetScriptList(),
  waiting: SelectSendingReqM(),
  waitingS: SelectSendingReqS(),
  execuHistory: SelectSetExecHistory(),
  newDate: SelectSetDate(),
  allNumber: SelectSetAll(),
  scriptListRespMsg: SelectSetScriptListRespMsg(),
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
const withReducer = injectReducer({ key: 'roboticPage', reducer });
const withSaga = injectSaga({ key: 'roboticPage', saga });
export default compose(
  withReducer,
  withSaga,
  withConnect,
  injectIntl,
  withStyles(styles)
)(RoboticPage);
