/**
 *
 * AdminGrpPage
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

import { Form, Modal, Row, Col, Select, Icon, Input } from 'antd';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { makeSelectAdminGrpPage, SelectSetGrpList } from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';
import { SelectSendingReqM } from '../../App/selectors';

import { getGrpList, addGrp, editGrp, deleteGrp, chgSearchText } from './actions';

import { timeFormat } from '../../../utils/timeFormat';

// bootstrap setting
import { styles } from '../../../utils/bootstrap';

export class AdminGrpPage extends React.PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  constructor() {
    super();
    this.state = {
      selectedRows: [],
      showColumn: ['grpName', 'grpId', 'createTime'],
      // dialog
      addGrpOpen: false,
      editGrpOpen: false,
      deleteGrpOpen: false,
      // snackbar
      snackbarOpen: false,
      // TextField
      textGrpName: '',
      // ErrorMsg
      errMsgGrpName: false,
      // Search bar
      searchText: '',
    };
    this.onRowSelection = this.onRowSelection.bind(this);
  }

  componentDidMount() {
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
      addGrpOpen: false,
      editGrpOpen: false,
      deleteGrpOpen: false,
      // snackbar
      snackbarOpen: false,
      // TextField
      textGrpName: '',
      // ErrorMsg
      errMsgGrpName: false,
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

  addGrpSubmit() {
    const { textGrpName } = this.state;
    this.props.dispatch(addGrp({ textGrpName }));
    this.handleClose();
  }

  editGrpSubmit() {
    const { textGrpName, selectedRows } = this.state;
    const { grpList } = this.props;
    this.props.dispatch(editGrp({ textGrpName, grpId: grpList.grps[selectedRows[0]].grpId }));
    this.handleClose();
  }

  deleteGrpSubmit() {
    const { selectedRows } = this.state;
    const { grpList } = this.props;
    this.props.dispatch(deleteGrp({ grpId: grpList.grps[selectedRows[0]].grpId }));
    this.handleClose();
  }

  btnFunc() {
    const { grpList, intl, classes } = this.props;
    const { selectedRows } = this.state;
    const search = intl.formatMessage({ id: 'IIoT.containers.UserPage.search' });
    return (
      <div style={{ margin: 10 }}>
        <Grid container>
          <Grid item xs={12}>
            <Grid container alignItems="center" justify="flex-end">
              {/* <Tooltip id="add-icon" title={<FormattedMessage {...messages.AddACompany} />}> */}
              <Tooltip id="add-icon" title={<FormattedMessage {...messages.AddAGroup} />}>
                <RaisedButton
                  style={{ margin: 5 }}
                  onClick={evt => {
                    evt.preventDefault();
                    this.setState({ addGrpOpen: true });
                  }}
                >
                  <AddIcon />
                </RaisedButton>
              </Tooltip>
              {/* <Tooltip id="edit-icon" title={<FormattedMessage {...messages.EditACompany} />}> */}
              <Tooltip id="edit-icon" title={<FormattedMessage {...messages.EditAGroup} />}>
                <RaisedButton
                  style={{ margin: 5 }}
                  onClick={evt => {
                    if (selectedRows.length !== 0) {
                      evt.preventDefault();
                      this.setState({ editGrpOpen: true, textGrpName: grpList.grps[selectedRows[0]].grpName });
                    } else this.setState({ snackbarOpen: true });
                  }}
                >
                  <EditIcon />
                </RaisedButton>
              </Tooltip>
              {/* <Tooltip id="delete-icon" title={<FormattedMessage {...messages.DeleteACompany} />}> */}
              <Tooltip id="delete-icon" title={<FormattedMessage {...messages.DeleteAGroup} />}>
                <RaisedButton
                  style={{ margin: 5 }}
                  onClick={evt => {
                    if (selectedRows.length !== 0) {
                      evt.preventDefault();
                      this.setState({ delGrpOpen: true });
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
                    this.props.dispatch(getGrpList());
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
    );
  }

  tblFunc() {
    const { grpList, waiting } = this.props;
    return (
      <Paper>
        <Table style={{ borderRadius: 10 }}>
          <TableHeader style={{ borderRadius: 10 }} displaySelectAll={false} displayRowCheckbox={false}>
            <TableRow>{this.renderHeaderData(this.state.showColumn)}</TableRow>
          </TableHeader>
        </Table>
        {grpList.size === 0 || waiting ? (
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
            <TableBody deselectOnClickaway={false}>{this.renderBodyData(grpList.grps, this.state.showColumn)}</TableBody>
          </Table>
        )}
      </Paper>
    );
  }

  dialogFunc() {
    const { grpList, intl } = this.props;
    const { selectedRows, addGrpOpen, editGrpOpen, deleteGrpOpen, textGrpName } = this.state;
    const actions = [
      <FlatButton label={<FormattedMessage {...messages.cancel} />} primary onClick={this.handleClose} />,
      <FlatButton
        label={<FormattedMessage {...messages.confirm} />}
        primary
        onClick={evt => {
          evt.preventDefault();
          // eslint-disable-next-line
          addGrpOpen ? this.addGrpSubmit() : editGrpOpen ? this.editGrpSubmit() : deleteGrpOpen ? this.deleteGrpSubmit() : '';
        }}
      />,
    ];

    const AddAGroup = intl.formatMessage({ id: 'IIoT.containers.AdminGrpPage.AddAGroup' });
    const EditAGroup = intl.formatMessage({ id: 'IIoT.containers.AdminGrpPage.EditAGroup' });
    const DeleteAGroup = intl.formatMessage({ id: 'IIoT.containers.AdminGrpPage.DeleteAGroup' });
    return (
      <Dialog
        title={addGrpOpen ? AddAGroup : editGrpOpen ? EditAGroup : deleteGrpOpen ? DeleteAGroup : ''}
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
        // open={addGrpOpen || editGrpOpen || deleteGrpOpen}
        // open={deleteGrpOpen}
        onRequestClose={this.handleClose}
      >
        {addGrpOpen ? (
          <TextField
            style={{ marginLeft: 30 }}
            floatingLabelFixed
            floatingLabelStyle={{ fontFamily: 'Roboto' }}
            hintText={<FormattedMessage {...messages.nameHint} />}
            floatingLabelText={<FormattedMessage {...messages.name} />}
            onChange={e => {
              this.setState({ textGrpName: e.target.value });
            }}
            errorText={this.state.errMsgGrpName ? <FormattedMessage {...messages.nameHint} /> : ''}
          />
        ) : editGrpOpen ? (
          <TextField
            style={{ marginLeft: 30 }}
            floatingLabelFixed
            floatingLabelStyle={{ fontFamily: 'Roboto' }}
            hintText={<FormattedMessage {...messages.nameHint} />}
            floatingLabelText={<FormattedMessage {...messages.name} />}
            defaultValue={textGrpName}
            onChange={e => {
              this.setState({ textGrpName: e.target.value });
            }}
            errorText={this.state.errMsgGrpName ? <FormattedMessage {...messages.nameHint} /> : ''}
          />
        ) : deleteGrpOpen ? (
          <div style={{ display: 'inline-flex', margin: 20 }}>
            <FormattedMessage {...messages.deleteGrpDesc} /> : &nbsp;
            <div style={{ fontWeight: 800, color: 'red' }}>{grpList.grps[selectedRows[0]].grpName}</div>?
          </div>
        ) : (
          ''
        )}
      </Dialog>
    );
  }

  modalFunc() {
    const { intl, grpList } = this.props;
    const { addGrpOpen, editGrpOpen, delGrpOpen, selectedRows } = this.state;

    const formItemLayoutAdd = {
      style: { display: 'inline-flex', height: '2em' },
    };

    const saveFormRef = formRef => {
      this.formRef = formRef;
    };

    const AddAGroup = intl.formatMessage({ id: 'IIoT.containers.AdminGrpPage.grpName' });
    const EditAGroup = intl.formatMessage({ id: 'IIoT.containers.AdminGrpPage.EditAGroup' });
    const DeleteAGroup = intl.formatMessage({ id: 'IIoT.containers.AdminGrpPage.DeleteAGroup' });

    const addGrpFunc = form => {
      const { getFieldDecorator } = form;
      return (
        <Form style={{ display: 'flex', justifyContent: 'center' }}>
          <Form.Item label={<FormattedMessage {...messages.grpName} />} {...formItemLayoutAdd}>
            {getFieldDecorator('name', { rules: [{ required: true, message: '必填欄位' }] })(<Input type="textarea" />)}
          </Form.Item>
        </Form>
      );
    };

    const editGrpFunc = form => {
      const { getFieldDecorator } = form;
      const { textGrpName } = this.state;
      return (
        <Form style={{ display: 'flex', justifyContent: 'center' }}>
          <Form.Item label={<FormattedMessage {...messages.grpName} />} {...formItemLayoutAdd}>
            {getFieldDecorator('name', { initialValue: textGrpName, rules: [{ required: true, message: '必填欄位' }] })(
              <Input type="textarea" />
            )}
          </Form.Item>
        </Form>
      );
    };

    const delGrpFunc = () => {
      // const { functionName } = this.state;
      return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ display: 'inline-flex', margin: 20 }}>
            <FormattedMessage {...messages.deleteGrpDesc} /> : &nbsp;
            <div style={{ fontWeight: 800, color: 'red' }}>{grpList.grps[selectedRows[0]].grpName}</div>?
          </div>
        </div>
      );
    };

    const CollectionCreateForm = Form.create({ name: 'form_in_modal' })(
      // eslint-disable-next-line
      class CollectionCreateFormE extends React.Component {
        render() {
          // eslint-disable-next-line
          const { visible, onCancel, onCreate, form } = this.props;
          return (
            <Modal
              title={(addGrpOpen && AddAGroup) || (editGrpOpen && EditAGroup) || (delGrpOpen && DeleteAGroup)}
              visible={visible}
              okText={<FormattedMessage {...messages.confirm} />}
              cancelText={<FormattedMessage {...messages.cancel} />}
              onCancel={onCancel}
              onOk={onCreate}
            >
              {addGrpOpen && addGrpFunc(form)}
              {editGrpOpen && editGrpFunc(form)}
              {delGrpOpen && delGrpFunc()}
            </Modal>
          );
        }
      }
    );

    return (
      <CollectionCreateForm
        wrappedComponentRef={saveFormRef}
        visible={addGrpOpen || editGrpOpen || delGrpOpen}
        onCancel={() => {
          this.setState({ addGrpOpen: false, editGrpOpen: false, delGrpOpen: false });
        }}
        onCreate={() => {
          const form = this.formRef.props.form;
          form.validateFields((err, values) => {
            if (err) return;
            if (addGrpOpen) {
              this.props.dispatch(addGrp({ textGrpName: values.name }));
            } else if (editGrpOpen) {
              const { selectedRows } = this.state;
              const { grpList } = this.props;
              this.props.dispatch(editGrp({ textGrpName: values.name, grpId: grpList.grps[selectedRows[0]].grpId }));
            } else if (delGrpOpen) {
              this.props.dispatch(deleteGrp({ grpId: grpList.grps[selectedRows[0]].grpId }));
            }
            form.resetFields();
            this.setState({ visible: false });
            this.setState({ addGrpOpen: false, editGrpOpen: false, delGrpOpen: false });
          });
        }}
      />
    );
  }

  snackbarFunc() {
    const { snackbarOpen } = this.state;
    return (
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
    );
  }

  renderHeaderData(column) {
    return column.map((item, index) => (
      <TableHeaderColumn style={{ fontWeight: 800 }} key={index}>
        {/* {<FormattedMessage {...messages[item]} />} */}
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
    return (
      <div>
        <Helmet>
          <title>AdminGrpPage</title>
          <meta name="description" content="Description of AdminGrpPage" />
        </Helmet>
        <Card style={{ paddingBottom: 5 }}>
          {this.btnFunc()}
          <div style={{ padding: 5 }}>{this.tblFunc()}</div>
        </Card>
        {/* dialog */}
        {/* {this.dialogFunc()} */}
        {this.modalFunc()}
        {this.snackbarFunc()}
      </div>
    );
  }
}

AdminGrpPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
  grpList: PropTypes.object,
  waiting: PropTypes.bool,
  intl: intlShape.isRequired,
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  admingrppage: makeSelectAdminGrpPage(),
  grpList: SelectSetGrpList(),
  waiting: SelectSendingReqM(),
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

const withReducer = injectReducer({ key: 'adminGrpPage', reducer });
const withSaga = injectSaga({ key: 'adminGrpPage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
  withStyles(styles),
  injectIntl
)(AdminGrpPage);
