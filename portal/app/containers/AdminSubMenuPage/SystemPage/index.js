/**
 *
 * SystemPage
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
import { makeSelectSystemPage, SelectSetSysList, SelectErrorMsg } from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';
import Header from '../../Main/index';
import { SelectMenuOpened, SelectSendingReqM } from '../../App/selectors';

import { getSysList, addSys, errorMsg, editSys, deleteSys, chgSearchText } from './actions';

import { timeFormat } from '../../../utils/timeFormat';

// bootstrap setting
import { styles } from '../../../utils/bootstrap';

export class SystemPage extends React.PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  constructor() {
    super();
    this.state = {
      selectedRows: [],
      showColumn: ['p_name', 'p_desc', 'p_type', 'p_value', 'createTime'],
      // dialog
      addSysOpen: false,
      editSysOpen: false,
      deleteSysOpen: false,
      // snackbar
      snackbarOpen: false,
      // TextField
      textSysName: '',
      textSysDesc: '',
      textSysValue: '',
      textSysType: '',
      // ErrorMsg
      errMsgSysName: false,
      errMsgSysValue: false,
      errMsgSysDesc: false,
      errMsgSysType: false,
      // Search bar
      searchText: '',
    };
    this.onRowSelection = this.onRowSelection.bind(this);
  }

  componentDidMount() {
    this.props.dispatch(getSysList());
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
      addSysOpen: false,
      editSysOpen: false,
      deleteSysOpen: false,
      // snackbar
      snackbarOpen: false,
      // TextField
      textSysName: '',
      textSysDesc: '',
      textSysValue: '',
      textSysType: '',
      // ErrorMsg
      errMsgSysName: false,
      errMsgSysValue: false,
      errMsgSysDesc: false,
      errMsgSysType: false,
      // Search bar
      searchText: '',
    });
  };

  handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({ snackbarOpen: false });
    this.props.dispatch(errorMsg(''));
  };

  addSysSubmit() {
    const { textSysName, textSysDesc, textSysValue, textSysType } = this.state;
    if (textSysName === '') {
      this.setState({ errMsgSysName: true });
    } else this.setState({ errMsgSysName: false });
    if (textSysDesc === '') {
      this.setState({ errMsgSysDesc: true });
    } else this.setState({ errMsgSysDesc: false });
    if (textSysValue === '') {
      this.setState({ errMsgSysValue: true });
    } else this.setState({ errMsgSysValue: false });
    if (textSysType === '') {
      this.setState({ errMsgSysType: true });
    } else this.setState({ errMsgSysType: false });

    if (textSysName !== '' && textSysDesc !== '' && textSysValue !== '' && textSysType !== '') {
      this.props.dispatch(addSys({ textSysName, textSysDesc, textSysValue, textSysType }));
      this.handleClose();
    }
  }

  editSysSubmit() {
    const { textSysName, textSysDesc, textSysValue, textSysType } = this.state;
    if (textSysName === '') {
      this.setState({ errMsgSysName: true });
    } else this.setState({ errMsgSysName: false });
    if (textSysDesc === '') {
      this.setState({ errMsgSysDesc: true });
    } else this.setState({ errMsgSysDesc: false });
    if (textSysValue === '') {
      this.setState({ errMsgSysValue: true });
    } else this.setState({ errMsgSysValue: false });
    if (textSysType === '') {
      this.setState({ errMsgSysType: true });
    } else this.setState({ errMsgSysType: false });

    if (textSysName !== '' && textSysDesc !== '' && textSysValue !== '' && textSysType !== '') {
      this.props.dispatch(editSys({ textSysName, textSysDesc, textSysValue, textSysType }));
      this.handleClose();
    }
  }

  deleteSysSubmit() {
    const { selectedRows } = this.state;
    const { sysList } = this.props;
    this.props.dispatch(deleteSys(sysList.props[selectedRows[0]].p_name));
    this.handleClose();
  }

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
            itemCol === 'createTime' ? (
              <TableRowColumn style={{ wordWrap: 'break-word', whiteSpace: 'normal' }} key={indexCol}>
                {timeFormat(item[itemCol])}
              </TableRowColumn>
            ) : (
              <TableRowColumn key={indexCol}>{item[itemCol]}</TableRowColumn>
            )
        )}
      </TableRow>
    ));
  }

  render() {
    const { menuOpen, sysList, waiting, intl, classes, errorMsgText } = this.props;
    const {
      selectedRows,
      addSysOpen,
      editSysOpen,
      deleteSysOpen,
      textSysName,
      textSysDesc,
      textSysValue,
      textSysType,
      snackbarOpen,
    } = this.state;
    const actions = [
      <FlatButton label={<FormattedMessage {...messages.cancel} />} primary onClick={this.handleClose} />,
      <FlatButton
        label={<FormattedMessage {...messages.confirm} />}
        primary
        onClick={evt => {
          evt.preventDefault();
          // eslint-disable-next-line
          addSysOpen ? this.addSysSubmit() : editSysOpen ? this.editSysSubmit() : deleteSysOpen ? this.deleteSysSubmit() : '';
        }}
      />,
    ];
    const search = intl.formatMessage({ id: 'IIoT.containers.UserPage.search' });
    const SystemAddASystem = intl.formatMessage({ id: 'IIoT.containers.SystemPage.addASystem' });
    const SystemEditASystem = intl.formatMessage({ id: 'IIoT.containers.SystemPage.editASystem' });
    const SystemDeleteASystem = intl.formatMessage({ id: 'IIoT.containers.SystemPage.deleteASystem' });

    return (
      <div
        style={
          menuOpen
            ? { backgroundColor: '#f2f5f8', minHeight: '100vh', marginLeft: 300 }
            : { backgroundColor: '#f2f5f8', minHeight: '100vh' }
        }
      >
        <Helmet>
          <title>SystemPage</title>
          <meta name="description" content="Description of SystemPage" />
        </Helmet>
        <Header />

        <Card style={{ paddingBottom: 5 }}>
          <div style={{ margin: 10 }}>
            <Grid container>
              <Grid item xs={12}>
                <Grid container alignItems="center" justify="flex-end">
                  <Tooltip id="add-icon" title={<FormattedMessage {...messages.addASystem} />}>
                    <RaisedButton
                      style={{ margin: 5 }}
                      onClick={evt => {
                        evt.preventDefault();
                        this.setState({ addSysOpen: true });
                      }}
                    >
                      <AddIcon />
                    </RaisedButton>
                  </Tooltip>
                  <Tooltip id="edit-icon" title={<FormattedMessage {...messages.editASystem} />}>
                    <RaisedButton
                      style={{ margin: 5 }}
                      onClick={evt => {
                        if (selectedRows.length !== 0) {
                          evt.preventDefault();
                          this.setState({
                            editSysOpen: true,
                            textSysName: sysList.props[selectedRows[0]].p_name,
                            textSysDesc: sysList.props[selectedRows[0]].p_desc,
                            textSysValue: sysList.props[selectedRows[0]].p_value,
                            textSysType: sysList.props[selectedRows[0]].p_type,
                          });
                        } else this.setState({ snackbarOpen: true });
                      }}
                    >
                      <EditIcon />
                    </RaisedButton>
                  </Tooltip>
                  <Tooltip id="delete-icon" title={<FormattedMessage {...messages.deleteASystem} />}>
                    <RaisedButton
                      style={{ margin: 5 }}
                      onClick={evt => {
                        if (selectedRows.length !== 0) {
                          evt.preventDefault();
                          this.setState({ deleteSysOpen: true });
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
                        this.props.dispatch(getSysList());
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
              {sysList.size === 0 || waiting ? (
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
                  <TableBody deselectOnClickaway={false}>{this.renderBodyData(sysList.props, this.state.showColumn)}</TableBody>
                </Table>
              )}
            </Paper>
          </div>
        </Card>

        {/* dialog */}
        <Dialog
          title={addSysOpen ? SystemAddASystem : editSysOpen ? SystemEditASystem : deleteSysOpen ? SystemDeleteASystem : ''}
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
          open={addSysOpen || editSysOpen || deleteSysOpen}
          onRequestClose={this.handleClose}
        >
          {addSysOpen ? (
            <Grid container>
              <Grid container alignItems="center" justify="center" direction="row">
                <Grid item xs={10} sm={7} md={5} lg={5} xl={5}>
                  <TextField
                    floatingLabelFixed
                    floatingLabelStyle={{ fontFamily: 'Roboto' }}
                    hintText={<FormattedMessage {...messages.nameHint} />}
                    floatingLabelText={<FormattedMessage {...messages.name} />}
                    onChange={e => {
                      this.setState({ textSysName: e.target.value });
                    }}
                    errorText={this.state.errMsgSysName ? <FormattedMessage {...messages.nameHint} /> : ''}
                  />
                </Grid>
                <Grid item xs={10} sm={7} md={5} lg={5} xl={5}>
                  <TextField
                    floatingLabelFixed
                    floatingLabelStyle={{ fontFamily: 'Roboto' }}
                    hintText={<FormattedMessage {...messages.valueHint} />}
                    floatingLabelText={<FormattedMessage {...messages.value} />}
                    onChange={e => {
                      this.setState({ textSysValue: e.target.value });
                    }}
                    errorText={this.state.errMsgSysValue ? <FormattedMessage {...messages.valueHint} /> : ''}
                  />
                </Grid>
                <Grid item xs={10} sm={7} md={5} lg={5} xl={5}>
                  <TextField
                    floatingLabelFixed
                    floatingLabelStyle={{ fontFamily: 'Roboto' }}
                    hintText={<FormattedMessage {...messages.descHint} />}
                    floatingLabelText={<FormattedMessage {...messages.desc} />}
                    onChange={e => {
                      this.setState({ textSysDesc: e.target.value });
                    }}
                    errorText={this.state.errMsgSysDesc ? <FormattedMessage {...messages.descHint} /> : ''}
                  />
                </Grid>
                <Grid item xs={10} sm={7} md={5} lg={5} xl={5}>
                  <TextField
                    floatingLabelFixed
                    floatingLabelStyle={{ fontFamily: 'Roboto' }}
                    hintText={<FormattedMessage {...messages.typeHint} />}
                    floatingLabelText={<FormattedMessage {...messages.type} />}
                    onChange={e => {
                      this.setState({ textSysType: e.target.value });
                    }}
                    errorText={this.state.errMsgSysType ? <FormattedMessage {...messages.typeHint} /> : ''}
                  />
                </Grid>
              </Grid>
            </Grid>
          ) : editSysOpen ? (
            <Grid container>
              <Grid container alignItems="center" justify="center" direction="row">
                <Grid item xs={10} sm={7} md={5} lg={5} xl={5}>
                  <TextField
                    floatingLabelFixed
                    floatingLabelStyle={{ fontFamily: 'Roboto' }}
                    hintText={<FormattedMessage {...messages.nameHint} />}
                    floatingLabelText={<FormattedMessage {...messages.name} />}
                    value={textSysName}
                    onChange={e => {
                      this.setState({ textSysName: e.target.value });
                    }}
                    errorText={this.state.errMsgSysName ? <FormattedMessage {...messages.nameHint} /> : ''}
                  />
                </Grid>

                <Grid item xs={10} sm={7} md={5} lg={5} xl={5}>
                  <TextField
                    floatingLabelFixed
                    floatingLabelStyle={{ fontFamily: 'Roboto' }}
                    hintText={<FormattedMessage {...messages.valueHint} />}
                    floatingLabelText={<FormattedMessage {...messages.value} />}
                    value={textSysValue}
                    onChange={e => {
                      this.setState({ textSysValue: e.target.value });
                    }}
                    errorText={this.state.errMsgSysValue ? <FormattedMessage {...messages.valueHint} /> : ''}
                  />
                </Grid>
                <Grid item xs={10} sm={7} md={5} lg={5} xl={5}>
                  <TextField
                    floatingLabelFixed
                    floatingLabelStyle={{ fontFamily: 'Roboto' }}
                    hintText={<FormattedMessage {...messages.descHint} />}
                    floatingLabelText={<FormattedMessage {...messages.desc} />}
                    value={textSysDesc}
                    onChange={e => {
                      this.setState({ textSysDesc: e.target.value });
                    }}
                    errorText={this.state.errMsgSysDesc ? <FormattedMessage {...messages.descHint} /> : ''}
                  />
                </Grid>
                <Grid item xs={10} sm={7} md={5} lg={5} xl={5}>
                  <TextField
                    floatingLabelFixed
                    floatingLabelStyle={{ fontFamily: 'Roboto' }}
                    hintText={<FormattedMessage {...messages.typeHint} />}
                    floatingLabelText={<FormattedMessage {...messages.type} />}
                    value={textSysType}
                    onChange={e => {
                      this.setState({ textSysType: e.target.value });
                    }}
                    errorText={this.state.errMsgSysType ? <FormattedMessage {...messages.typeHint} /> : ''}
                  />
                </Grid>
              </Grid>
            </Grid>
          ) : deleteSysOpen ? (
            <div style={{ display: 'inline-flex', margin: 20 }}>
              <FormattedMessage {...messages.deleteSysDesc} /> : &nbsp;
              <div style={{ fontWeight: 800, color: 'red' }}>{sysList.props[selectedRows[0]].p_name}</div>?
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
          open={errorMsgText !== '' || snackbarOpen === true}
          autoHideDuration={2000}
          onClose={this.handleCloseSnackbar}
          SnackbarContentProps={{
            'aria-describedby': 'message-id',
          }}
          // errorMsg: delete fail
          message={
            errorMsgText !== '' ? (
              <span>{errorMsgText}</span>
            ) : snackbarOpen === true ? (
              <span>
                <FormattedMessage {...messages.snackbarErrMsg} />
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

SystemPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
  menuOpen: PropTypes.bool,
  sysList: PropTypes.object,
  waiting: PropTypes.bool,
  intl: intlShape.isRequired,
  classes: PropTypes.object.isRequired,
  errorMsgText: PropTypes.string,
};

const mapStateToProps = createStructuredSelector({
  systempage: makeSelectSystemPage(),
  menuOpen: SelectMenuOpened(),
  sysList: SelectSetSysList(),
  waiting: SelectSendingReqM(),
  errorMsgText: SelectErrorMsg(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'systemPage', reducer });
const withSaga = injectSaga({ key: 'systemPage', saga });

export default compose(withReducer, withSaga, withConnect, withStyles(styles), injectIntl)(SystemPage);
