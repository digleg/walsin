/**
 *
 * ExpenseGrpPage
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
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';

// material-ui-next
import Grid from 'material-ui-next/Grid';
import { withStyles } from 'material-ui-next/styles';
import TextFieldNext from 'material-ui-next/TextField';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import Snackbar from 'material-ui-next/Snackbar';
import IconButton from 'material-ui-next/IconButton';
import CloseIcon from 'material-ui-icons/Close';

// svg-icon
import SearchIcon from 'material-ui/svg-icons/action/search';
import EditIcon from 'material-ui/svg-icons/editor/mode-edit';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import AddIcon from 'material-ui/svg-icons/content/add-box';
import RefreshIcon from 'material-ui/svg-icons/navigation/refresh';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { makeSelectExpenseGrpPage, SelectSetExpGrpList } from './selectors';
import reducer from './reducer';
import saga from './saga';
import { SelectSendingReqM, SelectMenuOpened } from '../../App/selectors';

import { getExpGrpList, addExpGrp, updateExpGrp, deleteExpGrp } from './actions';

import Header from '../../Main/index';

import { styles } from '../../../utils/bootstrap';

// i18l
import messages from './messages';

export class ExpenseGrpPage extends React.PureComponent {
  // eslint-disable-line react/prefer-stateless-function

  constructor() {
    super();
    this.state = {
      showColumn: ['grpName', 'expenseGrpId', 'createTime'],
      selectedRows: [],
      addDiaOpen: false,
      editDiaOpen: false,
      deleteDiaOpen: false,
      textExpGrpName: '',

      // empty
      addExpGrpNameEmpty: false,
      editExpGrpNameEmpty: false,

      // snackbar
      snackbarOpen: false,
    };
    this.onRowSelection = this.onRowSelection.bind(this);
  }

  componentDidMount() {
    this.props.dispatch(getExpGrpList());
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

  handleClose = () => {
    this.setState({
      addDiaOpen: false,
      editDiaOpen: false,
      deleteDiaOpen: false,

      // empty
      addExpGrpNameEmpty: false,
      editExpGrpNameEmpty: false,
    });
  };

  handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({ snackbarOpen: false });
  };

  // render table start
  renderHeaderData() {
    return this.state.showColumn.map(
      // eslint-disable-next-line
      (item, index) => <TableHeaderColumn key={Math.random()}>{<FormattedMessage {...messages[item]} />}</TableHeaderColumn>
    );
  }

  renderBodyData(expGrpList) {
    const { grps } = expGrpList;
    // eslint-disable-next-line
    return grps.map((item, index) => (
      <TableRow
        key={index}
        style={{ ...this.getStripedStyle(index), fontWeight: 500 }}
        selected={this.state.selectedRows.indexOf(index) !== -1}
      >
        {this.renderRowColumn(item, index)}
      </TableRow>
    ));
  }

  renderRowColumn(item) {
    return this.state.showColumn.map(
      // eslint-disable-next-line
      (itemCol, index) => <TableRowColumn key={index}>{item[itemCol]}</TableRowColumn>
    );
  }
  // render table end

  render() {
    const { waiting, expGrpList, menuOpen, classes, intl } = this.props;
    const expGrp = intl.formatMessage({ id: 'IIoT.containers.ExpenseGrpPage.AddExpGrp' });
    const expGrpEdit = intl.formatMessage({ id: 'IIoT.containers.ExpenseGrpPage.editExpGrp' });
    const expGrpdelete = intl.formatMessage({ id: 'IIoT.containers.ExpenseGrpPage.deleteExpGrp' });
    const search = intl.formatMessage({ id: 'IIoT.containers.UserPage.search' });

    const addActions = [
      <FlatButton label={<FormattedMessage {...messages.cancel} />} primary onClick={this.handleClose} />,
      <FlatButton
        label={<FormattedMessage {...messages.confirm} />}
        primary
        onClick={evt => {
          evt.preventDefault();
          const { textExpGrpName } = this.state;
          if (textExpGrpName === '') {
            this.setState({ addExpGrpNameEmpty: true });
          }

          if (textExpGrpName !== '') {
            this.props.dispatch(addExpGrp({ textExpGrpName }));
            this.handleClose();
          }
        }}
      />,
    ];

    const editActions = [
      <FlatButton label={<FormattedMessage {...messages.cancel} />} primary onClick={this.handleClose} />,
      <FlatButton
        label={<FormattedMessage {...messages.confirm} />}
        primary
        onClick={evt => {
          evt.preventDefault();
          const { textExpGrpName, textExpGrpId } = this.state;

          // editExpGrpNameEmpty
          if (textExpGrpName === '') {
            this.setState({ editExpGrpNameEmpty: true });
          }
          if (textExpGrpName !== '') {
            this.props.dispatch(updateExpGrp({ textExpGrpName, textExpGrpId }));
            this.handleClose();
          }
        }}
      />,
    ];

    const deleteActions = [
      <FlatButton label={<FormattedMessage {...messages.cancel} />} primary onClick={this.handleClose} />,
      <FlatButton
        label={<FormattedMessage {...messages.confirm} />}
        primary
        onClick={evt => {
          evt.preventDefault();
          const { textExpGrpId } = this.state;
          this.props.dispatch(deleteExpGrp({ textExpGrpId }));
          this.setState({ selectedRows: [] });
          this.handleClose();
        }}
      />,
    ];

    return (
      <div
        style={
          menuOpen
            ? { backgroundColor: '#f2f5f8', minHeight: '100vh', marginLeft: 300 }
            : { backgroundColor: '#f2f5f8', minHeight: '100vh' }
        }
      >
        <Helmet>
          <title>ExpenseGrpPage</title>
          <meta name="description" content="Description of ExpenseGrpPage" />
        </Helmet>
        <Header />
        {/* <FormattedMessage {...messages.header} /> */}

        <div>
          <Card style={{ paddingBottom: 5 }}>
            <div className={classes.root}>
              <Grid container>
                <Grid item xs={12}>
                  <Grid container alignItems="center" justify="center">
                    <RaisedButton
                      labelPosition="after"
                      primary
                      icon={<AddIcon />}
                      style={{ margin: 10 }}
                      onClick={evt => {
                        evt.preventDefault();
                        this.setState({ addDiaOpen: true });
                      }}
                    />
                    <RaisedButton
                      labelPosition="after"
                      primary
                      icon={<EditIcon />}
                      style={{ margin: 10 }}
                      onClick={evt => {
                        evt.preventDefault();
                        if (this.state.selectedRows.length !== 0) {
                          evt.preventDefault();
                          this.setState({
                            editDiaOpen: true,
                            textExpGrpName: expGrpList.grps[this.state.selectedRows].grpName,
                            textExpGrpId: expGrpList.grps[this.state.selectedRows].expenseGrpId,
                          });
                        } else this.setState({ snackbarOpen: true });
                      }}
                    />
                    <RaisedButton
                      labelPosition="after"
                      primary
                      icon={<RefreshIcon />}
                      style={{ margin: 10 }}
                      onClick={evt => {
                        evt.preventDefault();
                        this.props.dispatch(getExpGrpList());
                      }}
                    />
                    <RaisedButton
                      labelPosition="after"
                      secondary
                      icon={<DeleteIcon />}
                      style={{ margin: 10, marginRight: 10 }}
                      onClick={() => {
                        if (this.state.selectedRows.length !== 0) {
                          this.setState({
                            deleteDiaOpen: true,
                            textExpGrpName: expGrpList.grps[this.state.selectedRows].grpName,
                            textExpGrpId: expGrpList.grps[this.state.selectedRows].expenseGrpId,
                          });
                        } else this.setState({ snackbarOpen: true });
                      }}
                    />
                    <div style={{ display: 'inline-flex', alignItems: 'center', marginBottom: 5 }}>
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
              {waiting || expGrpList === undefined ? (
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
                <div style={{ margin: '2vh', borderStyle: 'solid', borderWidth: '1px', borderColor: '#E0E0E0' }}>
                  <Paper zDepth={1}>
                    <Table onRowSelection={this.onRowSelection}>
                      <TableHeader displaySelectAll={false}>
                        <TableRow>{this.renderHeaderData()}</TableRow>
                      </TableHeader>
                      <TableBody deselectOnClickaway={false}>{this.renderBodyData(expGrpList)}</TableBody>
                    </Table>
                  </Paper>
                  <Grid>
                    <Dialog
                      title={expGrp}
                      actions={addActions}
                      modal={false}
                      open={this.state.addDiaOpen}
                      onRequestClose={this.handleClose}
                      contentStyle={{
                        borderRadius: '10px',
                        overflow: 'auto',
                        width: 600,
                      }}
                      autoScrollBodyContent
                    >
                      <Grid container>
                        <Grid container alignItems="center" justify="center">
                          <Grid item xs={10} sm={7} md={5} lg={5} xl={5}>
                            <TextField
                              style={{ marginRight: 10, marginTop: 10 }}
                              hintText={<FormattedMessage {...messages.AddExpGrpNameHint} />}
                              floatingLabelText={<FormattedMessage {...messages.AddExpGrpName} />}
                              floatingLabelFixed
                              floatingLabelStyle={{ fontFamily: 'Roboto' }}
                              value={this.state.textExpGrpName}
                              onChange={e => {
                                this.setState({ textExpGrpName: e.target.value });
                              }}
                              errorText={
                                this.state.addExpGrpNameEmpty ? <FormattedMessage {...messages.AddExpGrpNameHint} /> : ''
                              }
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                    </Dialog>
                    <Dialog
                      title={expGrpEdit}
                      actions={editActions}
                      modal={false}
                      open={this.state.editDiaOpen}
                      onRequestClose={this.handleClose}
                      contentStyle={{
                        borderRadius: '10px',
                        overflow: 'auto',
                        width: 600,
                      }}
                      autoScrollBodyContent
                    >
                      <Grid container>
                        <Grid container alignItems="center" justify="center">
                          <Grid item xs={10} sm={7} md={5} lg={5} xl={5}>
                            <TextField
                              style={{ marginRight: 10, marginTop: 10 }}
                              hintText={<FormattedMessage {...messages.editExpGrpNameHint} />}
                              floatingLabelText={<FormattedMessage {...messages.editExpGrpName} />}
                              floatingLabelFixed
                              floatingLabelStyle={{ fontFamily: 'Roboto' }}
                              value={this.state.textExpGrpName}
                              onChange={e => {
                                this.setState({ textExpGrpName: e.target.value });
                              }}
                              errorText={
                                this.state.editExpGrpNameEmpty ? <FormattedMessage {...messages.editExpGrpNameHint} /> : ''
                              }
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                    </Dialog>
                    <Dialog
                      title={expGrpdelete}
                      actions={deleteActions}
                      modal={false}
                      open={this.state.deleteDiaOpen}
                      onRequestClose={this.handleClose}
                      contentStyle={{
                        borderRadius: '10px',
                        overflow: 'auto',
                        width: 600,
                      }}
                      autoScrollBodyContent
                    >
                      <div style={{ display: 'inline-flex', margin: 20 }}>
                        <FormattedMessage {...messages.deleteExpGrpDesc} /> : &nbsp;
                        <div style={{ fontWeight: 800, color: 'red' }}>{this.state.textExpGrpName}</div> ?
                      </div>
                    </Dialog>
                  </Grid>
                </div>
              )}
            </div>
          </Card>
        </div>
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

ExpenseGrpPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
  waiting: PropTypes.bool,
  expGrpList: PropTypes.object,
  menuOpen: PropTypes.bool,
  classes: PropTypes.object.isRequired,
  intl: intlShape.isRequired,
};

const mapStateToProps = createStructuredSelector({
  expensegrppage: makeSelectExpenseGrpPage(),
  waiting: SelectSendingReqM(),
  expGrpList: SelectSetExpGrpList(),
  menuOpen: SelectMenuOpened(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'expenseGrpPage', reducer });
const withSaga = injectSaga({ key: 'expenseGrpPage', saga });

export default compose(withReducer, withSaga, withConnect, withStyles(styles), injectIntl)(ExpenseGrpPage);
