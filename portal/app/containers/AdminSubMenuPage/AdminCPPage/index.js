/**
 *
 * AdminCppage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

// material-ui
// eslint-disable-next-line
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import CircularProgress from 'material-ui/CircularProgress';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
// eslint-disable-next-line
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

// material-ui-next
import Tooltip from 'material-ui-next/Tooltip';
import Grid from 'material-ui-next/Grid';
import Snackbar from 'material-ui-next/Snackbar';
import IconButton from 'material-ui-next/IconButton';
import TextFieldNext from 'material-ui-next/TextField';
import { withStyles } from 'material-ui-next/styles';

// svg-icon
import AddIcon from 'material-ui/svg-icons/content/add';
import EditIcon from 'material-ui/svg-icons/editor/mode-edit';
import CloseIcon from 'material-ui-icons/Close';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import SearchIcon from 'material-ui/svg-icons/action/search';
import RefreshIcon from 'material-ui/svg-icons/navigation/refresh';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { makeSelectAdminCppage, SelectSetCpList, SelectSetGrpList } from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';

import Header from '../../Main/index';
import { SelectMenuOpened, SelectSendingReqM } from '../../App/selectors';
import { getCpList, addCp, deleteCp, editCp, chgSearchText, getGrpList } from './actions';

import { timeFormat } from '../../../utils/timeFormat';

// bootstrap setting
import { styles } from '../../../utils/bootstrap';

export class AdminCPPage extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      selectedRows: [],
      showColumn: ['cpName', 'cpId', 'createTime', 'grps'],
      // dialog
      addCpOpen: false,
      editCpOpen: false,
      deleteCpOpen: false,
      // snackbar
      snackbarOpen: false,
      // TextField
      textCpName: '',
      // SelectField
      grpId: '',
      // ErrorMsg
      addTextCpName: '',
      errMsgGrpId: false,
      // Search bar
      searchText: '',
    };
    this.onRowSelection = this.onRowSelection.bind(this);
  }

  componentDidMount() {
    this.props.dispatch(getCpList());
    this.props.dispatch(getGrpList());
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

  changeSearchText = event => {
    this.setState({
      searchText: event.target.value,
    });
    this.props.dispatch(chgSearchText(event.target.value));
  };

  handleClose = () => {
    this.setState({
      selectedRows: [],
      // dialog
      addCpOpen: false,
      editCpOpen: false,
      deleteCpOpen: false,
      // snackbar
      snackbarOpen: false,
      // TextField
      textCpName: '',
      // SelectField
      grpId: '',
      // ErrorMsg
      addTextCpName: '',
      errMsgCpName: false,
      errMsgGrpId: false,
      errMsgCpNameSame: false,
      // Search bar
      searchText: '',
    });
  };

  handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({ snackbarOpen: false });
  };

  addCpSubmit() {
    const { textCpName, grpId } = this.state;
    if (textCpName === '') {
      this.setState({ errMsgCpName: true });
    } else this.setState({ errMsgCpName: false });
    if (grpId === '') {
      this.setState({ errMsgGrpId: true });
    } else this.setState({ errMsgGrpId: false });
    if (textCpName !== '' && grpId !== '') {
      this.props.dispatch(addCp({ textCpName, grpId }));
      this.handleClose();
    }
  }

  editCpSubmit() {
    const { textCpName, selectedRows, grpId } = this.state;
    const { cpList } = this.props;
    if (textCpName === '') {
      this.setState({ errMsgCpName: true });
    } else this.setState({ errMsgCpName: false });
    if (textCpName === cpList.cps[selectedRows].cpName) {
      this.setState({ errMsgCpNameSame: true });
    } else this.setState({ errMsgCpNameSame: false });
    if (grpId.length === 0) {
      this.setState({ errMsgGrpId: true });
    } else this.setState({ errMsgGrpId: false });
    if (textCpName !== '' && textCpName !== cpList.cps[selectedRows].cpName && grpId !== '') {
      this.props.dispatch(editCp({ textCpName, cpId: cpList.cps[selectedRows[0]].cpId, grpId }));
      this.handleClose();
    }
  }

  deleteCpSubmit() {
    const { selectedRows } = this.state;
    const { cpList } = this.props;
    this.props.dispatch(deleteCp(cpList.cps[selectedRows[0]].cpId));
    this.handleClose();
  }

  grpSting(data) {
    let grpList = '';
    const length = data.length;
    for (let i = 0; i < length; i += 1) {
      grpList = grpList.concat(data[i].grpName).concat(' ');
    }
    return grpList;
  }

  renderHeaderData(column) {
    return column.map((item, index) => (
      <TableHeaderColumn style={{ fontWeight: 800 }} key={index}>
        {<FormattedMessage {...messages[item]} />}
      </TableHeaderColumn>
    ));
  }
  // timeFormat
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
            itemCol === 'grps' ? (
              <TableRowColumn style={{ whiteSpace: 'normal' }} key={indexCol}>
                {this.grpSting(item[itemCol])}
              </TableRowColumn>
            ) : itemCol === 'createTime' ? (
              <TableRowColumn style={{ whiteSpace: 'normal' }} key={indexCol}>
                {timeFormat(item[itemCol])}
              </TableRowColumn>
            ) : (
              <TableRowColumn style={{ whiteSpace: 'normal' }} key={indexCol}>
                {item[itemCol]}
              </TableRowColumn>
            )
        )}
      </TableRow>
    ));
  }

  render() {
    const { menuOpen, cpList, waiting, classes, intl, grpList } = this.props;
    const { selectedRows, addCpOpen, editCpOpen, deleteCpOpen, snackbarOpen } = this.state;
    const actions = [
      <FlatButton label={<FormattedMessage {...messages.cancel} />} primary onClick={this.handleClose} />,
      <FlatButton
        label={<FormattedMessage {...messages.confirm} />}
        primary
        onClick={evt => {
          evt.preventDefault();
          // eslint-disable-next-line
          addCpOpen ? this.addCpSubmit() : editCpOpen ? this.editCpSubmit() : deleteCpOpen ? this.deleteCpSubmit() : '';
        }}
      />,
    ];
    const AddACompany = intl.formatMessage({ id: 'IIoT.containers.AdminCppage.AddACompany' });
    const EditACompany = intl.formatMessage({ id: 'IIoT.containers.AdminCppage.EditACompany' });
    const DeleteACompany = intl.formatMessage({ id: 'IIoT.containers.AdminCppage.DeleteACompany' });
    const search = intl.formatMessage({ id: 'IIoT.containers.UserPage.search' });

    return (
      <div
        style={
          menuOpen
            ? { backgroundColor: '#f2f5f8', minHeight: '100vh', marginLeft: 300 }
            : { backgroundColor: '#f2f5f8', minHeight: '100vh' }
        }
      >
        <Helmet>
          <title>AdminCppage</title>
          <meta name="description" content="Description of AdminCppage" />
        </Helmet>
        <Header />
        <Card style={{ paddingBottom: 5 }}>
          <div style={{ margin: 10 }}>
            <Grid container>
              <Grid item xs={12}>
                <Grid container alignItems="center" justify="flex-end">
                  <Tooltip id="add-icon" title={<FormattedMessage {...messages.AddACompany} />}>
                    <RaisedButton
                      style={{ margin: 5 }}
                      onClick={evt => {
                        evt.preventDefault();
                        this.setState({ addCpOpen: true });
                      }}
                    >
                      <AddIcon />
                    </RaisedButton>
                  </Tooltip>
                  <Tooltip id="edit-icon" title={<FormattedMessage {...messages.EditACompany} />}>
                    <RaisedButton
                      style={{ margin: 5 }}
                      onClick={evt => {
                        if (selectedRows.length !== 0) {
                          evt.preventDefault();
                          const grpIdArr = [];
                          for (let i = 0; i < cpList.cps[selectedRows].grps.length; i += 1) {
                            grpIdArr.push(cpList.cps[selectedRows].grps[i].grpId);
                          }
                          this.setState({ editCpOpen: true, textCpName: cpList.cps[selectedRows[0]].cpName, grpId: grpIdArr });
                        } else this.setState({ snackbarOpen: true });
                      }}
                    >
                      <EditIcon />
                    </RaisedButton>
                  </Tooltip>
                  <Tooltip id="delete-icon" title={<FormattedMessage {...messages.DeleteACompany} />}>
                    <RaisedButton
                      style={{ margin: 5 }}
                      onClick={evt => {
                        if (selectedRows.length !== 0) {
                          evt.preventDefault();
                          this.setState({ deleteCpOpen: true });
                        } else this.setState({ snackbarOpen: true });
                      }}
                    >
                      <DeleteIcon />
                    </RaisedButton>
                  </Tooltip>
                  <Tooltip id="refresh-icon" title={<FormattedMessage {...messages.refresh} />}>
                    <RaisedButton
                      style={{ margin: 5 }}
                      onClick={evt => {
                        evt.preventDefault();
                        this.props.dispatch(getCpList());
                      }}
                    >
                      <RefreshIcon />
                    </RaisedButton>
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
                      placeholder={search.concat(' ...')}
                    />
                  </div>
                </Grid>
              </Grid>
            </Grid>
          </div>
          <div style={{ padding: 5 }}>
            <Paper>
              <Table style={{ borderRadius: 10 }}>
                <TableHeader style={{ borderRadius: 10 }} displaySelectAll={false} displayRowCheckbox={false}>
                  <TableRow>{this.renderHeaderData(this.state.showColumn)}</TableRow>
                </TableHeader>
              </Table>
              {cpList.size === 0 || waiting ? (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <CircularProgress size={150} thickness={10} color="#0072bc" style={{ margin: 50 }} />
                </div>
              ) : (
                <Table onRowSelection={this.onRowSelection}>
                  <TableBody deselectOnClickaway={false}>{this.renderBodyData(cpList.cps, this.state.showColumn)}</TableBody>
                </Table>
              )}
            </Paper>
          </div>
        </Card>

        {/* dialog */}
        {grpList.size === 0 || waiting ? (
          ''
        ) : (
          <Dialog
            title={addCpOpen ? AddACompany : editCpOpen ? EditACompany : deleteCpOpen ? DeleteACompany : ''}
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
            open={addCpOpen || editCpOpen || deleteCpOpen}
            onRequestClose={this.handleClose}
          >
            {addCpOpen ? (
              <div>
                <Grid container>
                  <Grid container alignItems="center" justify="center" direction="row">
                    <Grid item xs={7} sm={7} md={7} lg={7} xl={7}>
                      <TextField
                        floatingLabelFixed
                        floatingLabelStyle={{ fontFamily: 'Roboto' }}
                        hintText={<FormattedMessage {...messages.cpNameHint} />}
                        floatingLabelText={<FormattedMessage {...messages.cpName} />}
                        onChange={e => {
                          this.setState({ textCpName: e.target.value });
                        }}
                        errorText={this.state.errMsgCpName ? <FormattedMessage {...messages.cpNameHint} /> : ''}
                      />
                    </Grid>
                    <Grid item xs={7} sm={7} md={7} lg={7} xl={7}>
                      <SelectField
                        floatingLabelText="Group Name (Multiple Choose)"
                        floatingLabelStyle={{ fontFamily: 'Roboto' }}
                        value={this.state.grpId}
                        hintText={this.state.grpId === '' ? 'Please Select Group Name' : ''}
                        floatingLabelFixed
                        onChange={(event, index, value) => this.setState({ grpId: value })}
                        dropDownMenuProps={{ anchorOrigin: { vertical: 'center', horizontal: 'left' } }}
                        errorText={this.state.errMsgGrpId ? 'Please Select an Group Name' : ''}
                        multiple
                      >
                        {grpList.grps.map(item => (
                          <MenuItem
                            key={Math.random()}
                            checked={this.state.grpId && this.state.grpId.indexOf(item.grpId) > -1}
                            insetChildren
                            value={item.grpId}
                            primaryText={item.grpName}
                          />
                        ))}
                      </SelectField>
                    </Grid>
                  </Grid>
                </Grid>
              </div>
            ) : editCpOpen ? (
              <Grid container>
                <Grid container alignItems="center" justify="center" direction="row">
                  <Grid item xs={7} sm={7} md={7} lg={7} xl={7}>
                    <TextField
                      floatingLabelFixed
                      floatingLabelStyle={{ fontFamily: 'Roboto' }}
                      hintText={<FormattedMessage {...messages.cpNameHint} />}
                      floatingLabelText={<FormattedMessage {...messages.cpName} />}
                      defaultValue={cpList.cps[selectedRows[0]].cpName}
                      onChange={e => {
                        this.setState({ textCpName: e.target.value });
                      }}
                      errorText={
                        this.state.errMsgCpName ? (
                          <FormattedMessage {...messages.cpNameHint} />
                        ) : this.state.errMsgCpNameSame ? (
                          'Please do not have same company name'
                        ) : (
                          ''
                        )
                      }
                    />
                  </Grid>
                  <Grid item xs={7} sm={7} md={7} lg={7} xl={7}>
                    <SelectField
                      floatingLabelText="Group Name (Multiple Choose)"
                      floatingLabelStyle={{ fontFamily: 'Roboto' }}
                      value={this.state.grpId}
                      hintText={this.state.grpId.length === 0 ? 'Please Select Group Name' : ''}
                      floatingLabelFixed
                      onChange={(event, index, value) => this.setState({ grpId: value })}
                      dropDownMenuProps={{ anchorOrigin: { vertical: 'center', horizontal: 'left' } }}
                      errorText={this.state.errMsgGrpId ? 'Please Select an Group Name' : ''}
                      multiple
                    >
                      {grpList.grps.map(item => (
                        <MenuItem
                          key={Math.random()}
                          checked={this.state.grpId && this.state.grpId.indexOf(item.grpId) > -1}
                          insetChildren
                          value={item.grpId}
                          primaryText={item.grpName}
                        />
                      ))}
                    </SelectField>
                  </Grid>
                </Grid>
              </Grid>
            ) : deleteCpOpen ? (
              <div style={{ display: 'inline-flex', margin: 20 }}>
                <FormattedMessage {...messages.deleteCpDesc} /> : &nbsp;
                <div style={{ fontWeight: 800, color: 'red' }}>{cpList.cps[selectedRows[0]].cpName}</div>?
              </div>
            ) : (
              ''
            )}
          </Dialog>
        )}

        {/* snackbar */}
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          open={snackbarOpen}
          autoHideDuration={2000}
          onClose={this.handleCloseSnackbar}
          SnackbarContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={
            snackbarOpen ? (
              <span>
                <FormattedMessage {...messages.snackbarDesc} />
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

AdminCPPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
  menuOpen: PropTypes.bool,
  cpList: PropTypes.object,
  waiting: PropTypes.bool,
  classes: PropTypes.object.isRequired,
  intl: intlShape.isRequired,
  grpList: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  admincppage: makeSelectAdminCppage(),
  menuOpen: SelectMenuOpened(),
  cpList: SelectSetCpList(),
  waiting: SelectSendingReqM(),
  grpList: SelectSetGrpList(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'adminCppage', reducer });
const withSaga = injectSaga({ key: 'adminCppage', saga });

export default compose(withReducer, withSaga, withConnect, withStyles(styles), injectIntl)(AdminCPPage);
