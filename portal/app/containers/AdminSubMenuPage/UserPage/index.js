/**
 *
 * UserPage
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
import CircularProgress from 'material-ui/CircularProgress';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
// eslint-disable-next-line
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper';

// material-ui-next
import Grid from 'material-ui-next/Grid';
import { withStyles } from 'material-ui-next/styles';
import TextFieldNext from 'material-ui-next/TextField';
import Snackbar from 'material-ui-next/Snackbar';
import IconButton from 'material-ui-next/IconButton';
import CloseIcon from 'material-ui-icons/Close';
import Tooltip from 'material-ui-next/Tooltip';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

// svg-icon
import SearchIcon from 'material-ui/svg-icons/action/search';
import EditIcon from 'material-ui/svg-icons/editor/mode-edit';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import AddIcon from 'material-ui/svg-icons/content/add';
import RefreshIcon from 'material-ui/svg-icons/navigation/refresh';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { makeSelectUserPage, SelectSetUserList, SelectSendingSearchReq, SelectErrorMsg, SelectAddSuccessResp } from './selectors';
import reducer from './reducer';
import saga from './saga';

import { SelectLoginCurrentlySending, SelectMenuOpened, SelectSetGrpsList, SelectSetRoleList, SelectSetCpList } from '../../App/selectors';

import { getUserList, chgSearchText, updateUserStatus, addUsr, getUserListFetch, delUsr, setErrorMsg } from './actions';
import { getRoleList, getCpList } from '../../App/actions';

import { styles } from '../../../utils/bootstrap';

// i18l
import messages from './messages';

export class UserPage extends React.PureComponent {
  // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props);

    this.state = {
      showColumn: ['userName', 'roleName', 'cpId', 'blockDesc'],
      searchCate: 'userName',
      searchText: '',
      selectedRows: [],

      editDiaOpen: false,
      deleteDiaOpen: false,
      addDiaOpen: false,

      userId: '',
      userName: '',
      expGrpId: '',
      roleId: '',
      userBlockFlag: '',
      // cpId: '',

      // add user
      textName: '',
      textEmail: '',
      textPw: '',
      textPwComfirm: '',
      roleNameList: [],
      order: 'desc',
      selGender: 'M',
      selCp: null,
      selBlock: null,

      selItem: {},

      // empty flag

      addTextName: false,
      addTextEmail: false,
      addTextPw: false,
      addTextPwComfirm: false,
      addPwNotEql: false,
      addSelCp: false,
      addRoleId: false,
      addSelBlock: false,

      // snackbar
      snackbarOpen: false,

      checkedResetPassword: false,
    };
    this.onRowSelection = this.onRowSelection.bind(this);
  }

  componentDidMount() {
    this.props.dispatch(getUserList());
    // this.props.dispatch(getGrpsList());
    this.props.dispatch(getRoleList());
    this.props.dispatch(getCpList());
  }

  componentWillReceiveProps() {
    if (this.props.errorMsg === '' && this.props.addSuccessResp === true) {
      this.handleClose();
    }
  }

  onRowSelection(selectedRows) {
    if (selectedRows.length === 0) {
      // due to a bug in material-ui
      setTimeout(() => {
        this.setState({ selectedRows: this.state.selectedRows });
      }, 100);
      return;
    }
    this.setState({ selectedRows });
  }

  getStripedStyle(index) {
    return { backgroundImage: index % 2 ? '#FFFFFF' : 'linear-gradient(#E1F5FE, #E0F7FA)' };
  }

  changeSearchCate = (event, index, values) => {
    this.setState({ searchCate: values });
  };

  // eslint-disable-next-line
  changeSearchText = event => {
    this.setState({
      searchText: event.target.value,
    });
    this.props.dispatch(chgSearchText(event.target.value));
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    const { addDiaOpen, editDiaOpen } = this.state;
    this.setState({
      editDiaOpen: false,
      deleteDiaOpen: false,
      addDiaOpen: false,
      addTextName: false,
      addTextEmail: false,
      addTextPw: false,
      addTextPwComfirm: false,
      addPwNotEql: false,
      addSelCp: false,
      addRoleId: false,
      addSelBlock: false,
    });
    if (addDiaOpen || editDiaOpen) {
      this.setState({
        textName: '',
        textEmail: '',
        textPw: '',
        textPwComfirm: '',
        roleNameList: [],
        order: 'desc',
        selGender: 'M',
        selCp: null,
        selBlock: null,
        addDiaOpen: false,
      });
    }
    this.props.dispatch(setErrorMsg(''));
  };

  handleChgUserName = evt => {
    this.setState({ userName: evt.target.value });
  };

  selectFieldChgGrpName = (event, index, value) => {
    this.setState({ expGrpId: value });
  };

  selectFieldRoleName = (event, index, value) => {
    this.setState({ roleId: value });
  };

  selectFieldUserBlockFlag = (event, index, value) => {
    this.setState({ userBlockFlag: value });
  };

  chgGender = (event, index, value) => {
    this.setState({ selGender: value });
  };

  chgCp = (event, index, value) => {
    this.setState({ selCp: value });
  };

  chgBlock = (event, index, value) => {
    this.setState({ selBlock: value });
  };

  editUserSubmit() {
    const { checkedResetPassword } = this.state;
    // const { userId, expGrpId, roleId, userBlockFlag } = this.state;
    // this.props.dispatch(updateUserStatus({ userId, expGrpId, roleId, userBlockFlag }));
    const { userId, cpId, roleId, userBlockFlag, textPw, textPwComfirm } = this.state;

    this.setState({ addPwNotEql: false });
    if (textPw !== textPwComfirm) {
      this.setState({ addPwNotEql: true });
    }

    if (textPw === textPwComfirm) {
      if (checkedResetPassword) {
        this.props.dispatch(updateUserStatus({ userId, cpId, roleId, userBlockFlag, textPw }));
      } else {
        this.props.dispatch(updateUserStatus({ userId, cpId, roleId, userBlockFlag }));
      }
      this.handleClose();
    }
  }

  deleteUserSubmit() {
    this.props.dispatch(delUsr(this.state.userId));
    this.handleClose();
  }

  addUserSubmit() {
    const { textName, textEmail, textPw, textPwComfirm, selGender, selCp, roleId, selBlock } = this.state;
    this.setState({
      addTextName: false,
      addTextEmail: false,
      addTextPw: false,
      addTextPwComfirm: false,
      addPwNotEql: false,
      addSelCp: false,
      addRoleId: false,
      addSelBlock: false,
    });

    if (textName === '') {
      this.setState({ addTextName: true });
    }
    if (textEmail === '') {
      this.setState({ addTextEmail: true });
    }
    if (textPw === '') {
      this.setState({ addTextPw: true });
    }
    if (textPwComfirm === '') {
      this.setState({ addTextPwComfirm: true });
    }
    if (textPw !== textPwComfirm) {
      this.setState({ addPwNotEql: true });
    }
    if (selCp === null) {
      this.setState({ addSelCp: true });
    }
    if (roleId === '') {
      this.setState({ addRoleId: true });
    }
    if (selBlock === null) {
      this.setState({ addSelBlock: true });
    }

    if (
      textName !== '' &&
      textEmail !== '' &&
      textPw !== '' &&
      textPwComfirm !== '' &&
      textPw === textPwComfirm &&
      selCp !== null &&
      roleId !== '' &&
      selBlock !== null
    ) {
      this.props.dispatch(addUsr({ textName, textEmail, textPw, selGender, selCp, roleId, selBlock }));
      this.setState({
        textName: '',
        textEmail: '',
        textPw: '',
        textPwComfirm: '',
        roleNameList: [],
        order: 'desc',
        selGender: 'M',
        selCp: null,
        selBlock: null,
      });
    }
  }

  handleBtnClick = () => {
    if (this.state.order === 'desc') {
      // eslint-disable-next-line
      this.refs.table.handleSort('asc', 'name');
      this.setState = { order: 'asc' };
    } else {
      // eslint-disable-next-line
      this.refs.table.handleSort('desc', 'name');
      this.setState = { order: 'desc' };
    }
  };

  handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({ snackbarOpen: false });
  };

  // eslint-disable-next-line
  buttonFormatter(cell, row) {
    return '<BootstrapButton type="submit"></BootstrapButton>';
  }

  // render table start
  renderHeaderData() {
    return this.state.showColumn.map(
      // eslint-disable-next-line
      (item, index) => (
        // eslint-disable-next-line
        <TableHeaderColumn style={{ fontWeight: 800 }} key={index}>
          {<FormattedMessage {...messages[item]} />}
        </TableHeaderColumn>
      )
    );
  }

  renderBodyData(userList) {
    const { users } = userList;
    return users.map((item, index) => (
      // eslint-disable-next-line
      <TableRow
        key={index}
        selected={this.state.selectedRows.indexOf(index) !== -1}
        style={{ ...this.getStripedStyle(index), fontWeight: 500 }}
      >
        {this.renderRowColumn(item, index)}
      </TableRow>
    ));
  }

  renderRowColumn(item) {
    return this.state.showColumn.map(
      // eslint-disable-next-line
      (itemCol, index) =>
        itemCol === 'blockDesc' ? (
          <TableRowColumn key={index}>{<FormattedMessage {...messages[item[itemCol]]} />}</TableRowColumn>
        ) : itemCol === 'cpId' ? (
          <TableRowColumn key={index}>{<FormattedMessage {...messages[`cpName_${item[itemCol].toString()}`]} />}</TableRowColumn>
        ) : (
          <TableRowColumn key={index}>{item[itemCol]}</TableRowColumn>
        )
    );
  }

  render() {
    const { waiting, waitingSearch, userList, menuOpen, grpsList, roleList, classes, cpList, errorMsg, intl } = this.props;
    const { checkedResetPassword } = this.state;
    const placeholder = intl.formatMessage({ id: 'IIoT.containers.UserPage.search' });
    const editActions = [
      <FlatButton label={<FormattedMessage {...messages.cancel} />} primary onClick={this.handleClose} />,
      <FlatButton label={<FormattedMessage {...messages.confirm} />} primary onClick={() => this.editUserSubmit()} />,
    ];
    const deleteActions = [
      <FlatButton label={<FormattedMessage {...messages.cancel} />} primary onClick={this.handleClose} />,
      <FlatButton label={<FormattedMessage {...messages.confirm} />} primary onClick={() => this.deleteUserSubmit()} />,
    ];
    const addActions = [
      <FlatButton label={<FormattedMessage {...messages.cancel} />} primary onClick={this.handleClose} />,
      <FlatButton label={<FormattedMessage {...messages.confirm} />} primary onClick={() => this.addUserSubmit()} />,
    ];

    return (
      <div>
        <Helmet>
          <title>UserPage</title>
          <meta name="description" content="Description of UserPage" />
        </Helmet>
        <div>
          <Card style={{ paddingBottom: 5 }}>
            <div style={{ margin: 10 }}>
              <Grid container>
                <Grid item xs={12}>
                  <Grid container alignItems="center" justify="flex-end">
                    <Tooltip id="add-icon" title="Add User">
                      <RaisedButton
                        labelPosition="after"
                        icon={<AddIcon />}
                        style={{ margin: 5 }}
                        onClick={() => this.setState({ addDiaOpen: true })}
                      />
                    </Tooltip>
                    <Tooltip id="add-icon" title="Edit User">
                      <RaisedButton
                        labelPosition="after"
                        icon={<EditIcon />}
                        style={{ margin: 5 }}
                        onClick={evt => {
                          if (this.state.selectedRows.length !== 0) {
                            evt.preventDefault();
                            this.setState({
                              editDiaOpen: true,
                              userId: userList.users[this.state.selectedRows[0]].userId,
                              userName: userList.users[this.state.selectedRows[0]].userName,
                              // expGrpId: userList.users[this.state.selectedRows[0]].expenseGrpId,
                              cpId: userList.users[this.state.selectedRows[0]].cpId,
                              roleId: userList.users[this.state.selectedRows[0]].roleId,
                              userBlockFlag: userList.users[this.state.selectedRows[0]].userBlock,
                            });
                          } else this.setState({ snackbarOpen: true });
                        }}
                      />
                    </Tooltip>
                    <Tooltip id="add-icon" title="Delete User">
                      <RaisedButton
                        labelPosition="after"
                        icon={<DeleteIcon />}
                        style={{ margin: 5 }}
                        onClick={() => {
                          if (this.state.selectedRows.length !== 0) {
                            this.setState({
                              deleteDiaOpen: true,
                              userId: userList.users[this.state.selectedRows[0]].userId,
                              userName: userList.users[this.state.selectedRows[0]].userName,
                              expGrpId: userList.users[this.state.selectedRows[0]].expenseGrpId,
                              roleId: userList.users[this.state.selectedRows[0]].roleId,
                              userBlockFlag: userList.users[this.state.selectedRows[0]].userBlock,
                            });
                          } else this.setState({ snackbarOpen: true });
                        }}
                      />
                    </Tooltip>
                    <Tooltip id="add-icon" title="Reload Data">
                      <RaisedButton
                        labelPosition="after"
                        icon={<RefreshIcon />}
                        style={{ margin: 5 }}
                        onClick={evt => {
                          evt.preventDefault();
                          this.props.dispatch(getUserListFetch());
                        }}
                      />
                    </Tooltip>
                    <div style={{ display: 'inline-flex', alignItems: 'center', marginBottom: 5, marginRight: 10, marginTop: 5 }}>
                      <SearchIcon style={{ marginRight: 5 }} />
                      <TextFieldNext
                        InputProps={{
                          disableUnderline: true,
                          classes: {
                            root: classes.textFieldRoot,
                            input: classes.textFieldInput,
                          },
                        }}
                        InputLabelProps={{
                          shrink: true,
                          className: classes.textFieldFormLabel,
                        }}
                        value={this.state.searchText}
                        onChange={this.changeSearchText}
                        placeholder={placeholder.concat(' ...')}
                      />
                    </div>
                  </Grid>
                </Grid>
              </Grid>
            </div>

            {waiting ? (
              <div
                style={{
                  display: 'flex',
                  flex: 1,
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
              <div>
                {userList.size === 0 ? (
                  <div>
                    <Table>
                      <TableHeader displaySelectAll={false} adjustForCheckbox>
                        <TableRow>{this.renderHeaderData()}</TableRow>
                      </TableHeader>
                    </Table>
                    {waitingSearch ? (
                      <div
                        style={{
                          display: 'flex',
                          flex: 1,
                          justifyContent: 'center',
                        }}
                      >
                        <CircularProgress
                          size={50}
                          thickness={10}
                          color="#0072bc"
                          style={{
                            margin: 50,
                          }}
                        />
                      </div>
                    ) : (
                      <Table>
                        <TableBody
                          style={{
                            display: 'flex',
                            flex: 1,
                            justifyContent: 'center',
                            // fontSize: 20,
                          }}
                          displayRowCheckbox={false}
                        >
                          <TableRow>
                            <TableRowColumn style>Oops! No Data</TableRowColumn>
                          </TableRow>
                        </TableBody>
                      </Table>
                    )}
                  </div>
                ) : (
                  <div
                    style={{
                      margin: 10,
                      borderTopLeftRadius: 10,
                      borderTopRightRadius: 10,
                      borderStyle: 'solid',
                      borderWidth: '1px',
                      borderColor: '#E0E0E0',
                    }}
                  >
                    <Paper zDepth={1} style={{ borderRadius: 10 }}>
                      <Table style={{ borderRadius: 10 }}>
                        <TableHeader style={{ borderRadius: 10 }} displaySelectAll={false} displayRowCheckbox={false}>
                          <TableRow>{this.renderHeaderData()}</TableRow>
                        </TableHeader>
                      </Table>
                      {waitingSearch ? (
                        <div
                          style={{
                            display: 'flex',
                            flex: 1,
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
                          <TableBody deselectOnClickaway={false}>{this.renderBodyData(userList)}</TableBody>
                        </Table>
                      )}
                    </Paper>
                  </div>
                )}
                {Object.keys(this.state.selItem).length !== 0 ? (
                  // show detail
                  <Card style={{ margin: 10, paddingLeft: 50, paddingTop: 20, paddingBottom: 20 }}>
                    {Object.keys(this.state.selItem).map(item => (
                      <TextField
                        style={{ marginLeft: 30 }}
                        floatingLabelFixed
                        floatingLabelStyle={{ fontFamily: 'Roboto' }}
                        hintText={this.state.selItem[item]}
                        floatingLabelText={item}
                      />
                    ))}
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <RaisedButton style={{ marginRight: 20 }} primary>
                        Confirm
                      </RaisedButton>
                      <RaisedButton>Cancel</RaisedButton>
                    </div>
                  </Card>
                ) : (
                  <div> </div>
                )}
              </div>
            )}
          </Card>
        </div>
        <Dialog
          // title={<FormattedMessage {...messages.EditUserTitle} />.concat(' - ').concat(this.state.userName)}
          actions={editActions}
          contentStyle={{
            borderRadius: '10px',
            overflow: 'auto',
          }}
          modal={false}
          open={this.state.editDiaOpen}
          onRequestClose={this.handleClose}
        >
          {userList.size !== 0 && this.state.selectedRows.length !== 0 && Object.keys(grpsList).length !== 0 ? (
            <div>
              <div style={{ margin: 20, fontSize: 24, fontWeight: 800 }}>
                <FormattedMessage {...messages.EditUserTitle} /> - {this.state.userName}
              </div>
              <Grid container>
                <Grid container alignItems="center" justify="center" direction="row">
                  {/* Office Automation */}
                  {/* <Grid item xs={10} sm={7} md={5} lg={5} xl={5}>
                  <SelectField
                    floatingLabelText="Group Name"
                    floatingLabelStyle={{ fontFamily: 'Roboto' }}
                    value={this.state.expGrpId}
                    onChange={this.selectFieldChgGrpName}
                    dropDownMenuProps={{ anchorOrigin: { vertical: 'center', horizontal: 'left' } }}
                  >
                    {grpsList.grps.map(item => (
                      <MenuItem key={Math.random()} value={item.expenseGrpId} primaryText={item.grpName} />
                    ))}
                  </SelectField>
                </Grid> */}
                  <Grid item xs={10} sm={7} md={5} lg={5} xl={5}>
                    <SelectField
                      floatingLabelText="Company Name"
                      floatingLabelStyle={{ fontFamily: 'Roboto' }}
                      value={this.state.cpId}
                      onChange={(event, index, value) => {
                        this.setState({ cpId: value });
                      }}
                      dropDownMenuProps={{ anchorOrigin: { vertical: 'center', horizontal: 'left' } }}
                    >
                      {cpList.cps.map(item => (
                        <MenuItem
                          key={Math.random()}
                          value={item.cpId}
                          primaryText={<FormattedMessage {...messages[`cpName_${item.cpId.toString()}`]} />}
                        />
                      ))}
                    </SelectField>
                  </Grid>
                  <Grid item xs={10} sm={7} md={5} lg={5} xl={5}>
                    <SelectField
                      floatingLabelText={<FormattedMessage {...messages.EditUserRoleName} />}
                      floatingLabelStyle={{ fontFamily: 'Roboto' }}
                      value={this.state.roleId}
                      onChange={this.selectFieldRoleName}
                      dropDownMenuProps={{ anchorOrigin: { vertical: 'center', horizontal: 'left' } }}
                    >
                      {roleList.roles.map(item => (
                        <MenuItem key={Math.random()} value={item.roleId} primaryText={item.roleName} />
                      ))}
                    </SelectField>
                  </Grid>
                  <Grid item xs={10} sm={7} md={5} lg={5} xl={5}>
                    <SelectField
                      floatingLabelText={<FormattedMessage {...messages.EditUserStatus} />}
                      floatingLabelStyle={{ fontFamily: 'Roboto' }}
                      value={this.state.userBlockFlag}
                      onChange={this.selectFieldUserBlockFlag}
                      dropDownMenuProps={{ anchorOrigin: { vertical: 'center', horizontal: 'left' } }}
                    >
                      <MenuItem value={0} primaryText={<FormattedMessage {...messages.EditUserBlockFalse} />} />
                      <MenuItem value={1} primaryText={<FormattedMessage {...messages.EditUserBlockTrue} />} />
                    </SelectField>
                  </Grid>
                  <Grid item xs={10} sm={7} md={5} lg={5} xl={5} />
                  <Grid item xs={10} sm={7} md={5} lg={5} xl={5}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={this.state.checkedResetPassword}
                          onChange={event => {
                            this.setState({ checkedResetPassword: event.target.checked });
                          }}
                          value="checkedResetPassword"
                          color="primary"
                        />
                      }
                      label={<FormattedMessage {...messages.resetPassword} />}
                    />
                  </Grid>
                  <Grid item xs={10} sm={7} md={5} lg={5} xl={5} />
                  {checkedResetPassword && (
                    <Grid item xs={10} sm={7} md={5} lg={5} xl={5}>
                      <TextField
                        style={{ marginRight: 10, marginTop: '-1em' }}
                        type="password"
                        hintText={<FormattedMessage {...messages.AddUserPasswordHint} />}
                        floatingLabelText={<FormattedMessage {...messages.AddUserPassword} />}
                        floatingLabelFixed
                        floatingLabelStyle={{ fontFamily: 'Roboto' }}
                        value={this.state.textPw}
                        onChange={e => {
                          this.setState({ textPw: e.target.value });
                        }}
                        errorText={
                          this.state.addTextPwComfirm ? (
                            <FormattedMessage {...messages.AddUserPasswordConfirmHint} />
                          ) : this.state.addPwNotEql ? (
                            <FormattedMessage {...messages.AddUserPasswordErrorMsgNotIdenticalPassword} />
                          ) : errorMsg === 'PWD_FORMAT error' ? (
                            <FormattedMessage {...messages.AddUserPasswordErrorMsg} />
                          ) : (
                            ''
                          )
                        }
                        // addPwNotEql
                      />
                    </Grid>
                  )}

                  {checkedResetPassword && (
                    <Grid item xs={10} sm={7} md={5} lg={5} xl={5}>
                      <TextField
                        style={{ marginRight: 10, marginTop: '-1em' }}
                        type="password"
                        hintText={<FormattedMessage {...messages.AddUserPasswordConfirmHint} />}
                        floatingLabelText={<FormattedMessage {...messages.AddUserPasswordConfirm} />}
                        floatingLabelFixed
                        floatingLabelStyle={{ fontFamily: 'Roboto' }}
                        value={this.state.textPwComfirm}
                        onChange={e => {
                          this.setState({ textPwComfirm: e.target.value });
                        }}
                        errorText={
                          this.state.addTextPwComfirm ? (
                            <FormattedMessage {...messages.AddUserPasswordConfirmHint} />
                          ) : this.state.addPwNotEql ? (
                            <FormattedMessage {...messages.AddUserPasswordErrorMsgNotIdenticalPassword} />
                          ) : errorMsg === 'PWD_FORMAT error' ? (
                            <FormattedMessage {...messages.AddUserPasswordErrorMsg} />
                          ) : (
                            ''
                          )
                        }
                      />
                    </Grid>
                  )}
                </Grid>
              </Grid>
            </div>
          ) : (
            ''
          )}
        </Dialog>
        <Dialog
          actions={deleteActions}
          modal={false}
          open={this.state.deleteDiaOpen}
          contentStyle={{
            borderRadius: '10px',
            overflow: 'auto',
            width: 400,
          }}
          onRequestClose={this.handleClose}
        >
          <div>
            <div style={{ margin: 20, fontSize: 24, fontWeight: 800 }}>
              <FormattedMessage {...messages.DeleteUser} /> - {this.state.userName}
            </div>
            <div style={{ display: 'inline-flex', margin: 20 }}>
              <FormattedMessage {...messages.DeleteUserInformation} /> : &nbsp;
              <div style={{ fontWeight: 800, color: 'red' }}>{this.state.userName}</div> ?
            </div>
          </div>
        </Dialog>
        {cpList.size !== 0 && roleList.size !== 0 ? (
          <Dialog
            // title={'Add User'}
            actions={addActions}
            modal={false}
            open={this.state.addDiaOpen}
            contentStyle={{
              borderRadius: '10px',
              overflow: 'auto',
            }}
            autoScrollBodyContent
            onRequestClose={this.handleClose}
          >
            <div>
              <div style={{ margin: 20, fontSize: 24, fontWeight: 800 }}>
                <FormattedMessage {...messages.AddUser} />
              </div>
              <Grid container>
                <Grid container alignItems="center" justify="center" direction="row">
                  <Grid item xs={10} sm={7} md={5} lg={5} xl={5}>
                    <TextField
                      style={{ marginRight: 10, marginTop: 10 }}
                      hintText={<FormattedMessage {...messages.AddUserNameHint} />}
                      floatingLabelText={<FormattedMessage {...messages.AddUserName} />}
                      floatingLabelFixed
                      floatingLabelStyle={{ fontFamily: 'Roboto' }}
                      value={this.state.textName}
                      onChange={e => {
                        this.setState({ textName: e.target.value });
                      }}
                      errorText={this.state.addTextName ? <FormattedMessage {...messages.AddUserNameHint} /> : ''}
                    />
                  </Grid>
                  <Grid item xs={10} sm={7} md={5} lg={5} xl={5}>
                    <TextField
                      style={{ marginRight: 10, marginTop: 10 }}
                      hintText={<FormattedMessage {...messages.AddUserEmailHint} />}
                      floatingLabelText={<FormattedMessage {...messages.AddUserEmail} />}
                      floatingLabelFixed
                      floatingLabelStyle={{ fontFamily: 'Roboto' }}
                      value={this.state.textEmail}
                      onChange={e => {
                        this.setState({ textEmail: e.target.value });
                      }}
                      errorText={
                        this.state.addTextEmail ? (
                          <FormattedMessage {...messages.AddUserEmailHint} />
                        ) : errorMsg === 'EMAIL_FORMAT error' ? (
                          <FormattedMessage {...messages.AddUserEmailErrorMsg} />
                        ) : (
                          ''
                        )
                      }
                    />
                  </Grid>
                  <br />
                  <Grid item xs={10} sm={7} md={5} lg={5} xl={5}>
                    <TextField
                      style={{ marginRight: 10 }}
                      type="password"
                      hintText={<FormattedMessage {...messages.AddUserPasswordHint} />}
                      floatingLabelText={<FormattedMessage {...messages.AddUserPassword} />}
                      floatingLabelFixed
                      floatingLabelStyle={{ fontFamily: 'Roboto' }}
                      value={this.state.textPw}
                      onChange={e => {
                        this.setState({ textPw: e.target.value });
                      }}
                      errorText={
                        this.state.addTextPw ? (
                          <FormattedMessage {...messages.AddUserPasswordHint} />
                        ) : this.state.addPwNotEql ? (
                          <FormattedMessage {...messages.AddUserPasswordErrorMsgNotIdenticalPassword} />
                        ) : errorMsg === 'PWD_FORMAT error' ? (
                          <FormattedMessage {...messages.AddUserPasswordErrorMsg} />
                        ) : (
                          ''
                        )
                      }
                      // addPwNotEql
                    />
                  </Grid>
                  <Grid item xs={10} sm={7} md={5} lg={5} xl={5}>
                    <TextField
                      style={{ marginRight: 10 }}
                      type="password"
                      hintText={<FormattedMessage {...messages.AddUserPasswordConfirmHint} />}
                      floatingLabelText={<FormattedMessage {...messages.AddUserPasswordConfirm} />}
                      floatingLabelFixed
                      floatingLabelStyle={{ fontFamily: 'Roboto' }}
                      value={this.state.textPwComfirm}
                      onChange={e => {
                        this.setState({ textPwComfirm: e.target.value });
                      }}
                      errorText={
                        this.state.addTextPwComfirm ? (
                          <FormattedMessage {...messages.AddUserPasswordConfirmHint} />
                        ) : this.state.addPwNotEql ? (
                          <FormattedMessage {...messages.AddUserPasswordErrorMsgNotIdenticalPassword} />
                        ) : errorMsg === 'PWD_FORMAT error' ? (
                          <FormattedMessage {...messages.AddUserPasswordErrorMsg} />
                        ) : (
                          ''
                        )
                      }
                    />
                  </Grid>
                  <br />
                  <Grid item xs={10} sm={7} md={5} lg={5} xl={5}>
                    <SelectField
                      floatingLabelText={<FormattedMessage {...messages.AddUserGender} />}
                      value={this.state.selGender}
                      onChange={this.chgGender}
                      floatingLabelStyle={{ fontFamily: 'Roboto' }}
                      floatingLabelFixed
                    >
                      <MenuItem value={'M'} primaryText={<FormattedMessage {...messages.AddUserGenderMale} />} />
                      <MenuItem value={'F'} primaryText={<FormattedMessage {...messages.AddUserGenderFemale} />} />
                    </SelectField>
                  </Grid>
                  <Grid item xs={10} sm={7} md={5} lg={5} xl={5}>
                    <SelectField
                      floatingLabelText={<FormattedMessage {...messages.AddUserCompany} />}
                      value={this.state.selCp}
                      onChange={this.chgCp}
                      floatingLabelStyle={{ fontFamily: 'Roboto' }}
                      floatingLabelFixed
                      hintText={<FormattedMessage {...messages.AddUserCompanyHint} />}
                      errorText={this.state.addSelCp ? <FormattedMessage {...messages.AddUserCompanyHint} /> : ''}
                    >
                      {cpList.cps.map(item => (
                        <MenuItem
                          key={Math.random()}
                          value={item.cpId}
                          primaryText={<FormattedMessage {...messages[`cpName_${item.cpId.toString()}`]} />}
                        />
                      ))}
                    </SelectField>
                  </Grid>
                  <br />
                  <Grid item xs={10} sm={7} md={5} lg={5} xl={5}>
                    <SelectField
                      style={{ margin: '0.5vw' }}
                      floatingLabelText={<FormattedMessage {...messages.AddUserRoleName} />}
                      hintText={<FormattedMessage {...messages.AddUserRoleNameHint} />}
                      floatingLabelStyle={{ fontFamily: 'Roboto' }}
                      floatingLabelFixed
                      value={this.state.roleId}
                      onChange={this.selectFieldRoleName}
                      dropDownMenuProps={{ anchorOrigin: { vertical: 'center', horizontal: 'left' } }}
                      errorText={this.state.addRoleId ? <FormattedMessage {...messages.AddUserRoleNameHint} /> : ''}
                    >
                      {roleList.roles.map(item => (
                        <MenuItem key={Math.random()} value={item.roleId} primaryText={item.roleName} />
                      ))}
                    </SelectField>
                  </Grid>
                  <Grid item xs={10} sm={7} md={5} lg={5} xl={5}>
                    <SelectField
                      floatingLabelText={<FormattedMessage {...messages.AddUserBlock} />}
                      value={this.state.selBlock}
                      onChange={this.chgBlock}
                      floatingLabelStyle={{ fontFamily: 'Roboto' }}
                      floatingLabelFixed
                      hintText={<FormattedMessage {...messages.AddUserBlockHint} />}
                      errorText={this.state.addSelBlock ? <FormattedMessage {...messages.AddUserBlockHint} /> : ''}
                    >
                      <MenuItem value={'0'} primaryText={<FormattedMessage {...messages.AddUserBlockFalse} />} />
                      <MenuItem value={'1'} primaryText={<FormattedMessage {...messages.AddUserBlockTrue} />} />
                    </SelectField>
                  </Grid>
                </Grid>
              </Grid>
            </div>
          </Dialog>
        ) : (
          ''
        )}
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          open={this.state.snackbarOpen}
          autoHideDuration={2000}
          onClose={this.handleCloseSnackbar}
          SnackbarContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={
            <span>
              <FormattedMessage {...messages.snackbox} />
            </span>
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

UserPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
  waiting: PropTypes.bool,
  waitingSearch: PropTypes.bool,
  userList: PropTypes.object,
  menuOpen: PropTypes.bool,
  grpsList: PropTypes.object,
  roleList: PropTypes.object,
  classes: PropTypes.object.isRequired,
  cpList: PropTypes.object,
  errorMsg: PropTypes.string,
  addSuccessResp: PropTypes.bool,
  intl: intlShape.isRequired,
};

const mapStateToProps = createStructuredSelector({
  userpage: makeSelectUserPage(),
  waiting: SelectLoginCurrentlySending(),
  waitingSearch: SelectSendingSearchReq(),
  userList: SelectSetUserList(),
  menuOpen: SelectMenuOpened(),
  grpsList: SelectSetGrpsList(),
  roleList: SelectSetRoleList(),
  cpList: SelectSetCpList(),
  errorMsg: SelectErrorMsg(),
  addSuccessResp: SelectAddSuccessResp(),
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
const withReducer = injectReducer({ key: 'userPage', reducer });
const withSaga = injectSaga({ key: 'userPage', saga });
export default compose(
  withReducer,
  withSaga,
  withConnect,
  withStyles(styles),
  injectIntl
)(UserPage);
