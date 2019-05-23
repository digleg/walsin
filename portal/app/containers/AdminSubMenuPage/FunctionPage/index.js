/**
 *
 * FunctionPage
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
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

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
import AddIcon from 'material-ui/svg-icons/content/add';
import RefreshIcon from 'material-ui/svg-icons/navigation/refresh';

// antd
import { Form, Modal, Row, Col, Select, Icon, Input } from 'antd';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { makeSelectFunctionPage, SelectSetFunctionList, SelectSetGrpList } from './selectors';
import reducer from './reducer';
import saga from './saga';
import { getFunctionList, getGrpList, addFunc, updateFunc, delFunc, chgSearchText } from './actions';

import { SelectSendingReqM, SelectMenuOpened } from '../../App/selectors';

import { styles } from '../../../utils/bootstrap';

// i18l
import messages from './messages';

const FormItem = Form.Item;
const Option = Select.Option;

export class FunctionPage extends React.PureComponent {
  // eslint-disable-line react/prefer-stateless-function

  constructor() {
    super();
    this.state = {
      showColumn: ['functionName', 'functionUrl', 'hiddenFlg'],
      selectedRows: [],
      addDiaOpen: false,
      editDiaOpen: false,
      delDiaOpen: false,

      textFuncName: '',
      textFuncUrl: '/',
      selHidFlg: 'N',
      selParentId: -1,

      // empty flag
      addFuncNameEmpty: false,
      addFuncUrlEmpty: false,
      addGrpNameEmpty: false,

      editFuncNameEmpty: false,
      editFuncUrlEmpty: false,
      editGrpNameEmpty: false,

      // snackbar
      snackbarOpen: false,

      // modal
      addTabOpen: false,
      editTabOpen: false,
      delTabOpen: false,
    };
    this.onRowSelection = this.onRowSelection.bind(this);
  }

  componentWillMount() {
    this.props.dispatch(getFunctionList());
    this.props.dispatch(getGrpList());
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

  changeSearchText = event => {
    this.setState({
      searchText: event.target.value,
    });
    this.props.dispatch(chgSearchText(event.target.value));
  };

  handleClose = () => {
    this.setState({
      editDiaOpen: false,
      addDiaOpen: false,

      // edit close
      textFuncName: '',
      textFuncUrl: '/',
      selGrpId: undefined,
      selHidFlg: 'N',
      selParentId: undefined,

      addFuncNameEmpty: false,
      addFuncUrlEmpty: false,
      addGrpNameEmpty: false,

      // dialog close
      delDiaOpen: false,
    });
  };
  handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({ snackbarOpen: false });
  };

  btnFunc() {
    const { classes, intl, funcList } = this.props;
    const search = intl.formatMessage({ id: 'IIoT.containers.FunctionPage.search' });

    return (
      <Grid container>
        <Grid item xs={12}>
          <Grid container alignItems="center" justify="flex-end">
            <RaisedButton
              labelPosition="after"
              icon={<AddIcon />}
              style={{ margin: 5 }}
              onClick={evt => {
                evt.preventDefault();
                this.setState({ addTabOpen: true });
              }}
            />
            <RaisedButton
              labelPosition="after"
              icon={<EditIcon />}
              style={{ margin: 5 }}
              onClick={evt => {
                evt.preventDefault();
                if (this.state.selectedRows.length !== 0) {
                  evt.preventDefault();
                  this.setState({
                    editTabOpen: true,
                    textFuncName: funcList.funcs[this.state.selectedRows].functionName,
                    textFuncUrl: funcList.funcs[this.state.selectedRows].functionUrl,
                    selHidFlg: funcList.funcs[this.state.selectedRows].hiddenFlg,
                    selParentId: funcList.funcs[this.state.selectedRows].parentId,
                    selGrpId: funcList.funcs[this.state.selectedRows].grpId,
                  });
                } else this.setState({ snackbarOpen: true });
              }}
            />
            <RaisedButton
              labelPosition="after"
              icon={<DeleteIcon />}
              style={{ margin: 5 }}
              onClick={() => {
                if (this.state.selectedRows.length !== 0) {
                  this.setState({
                    // delDiaOpen: true,
                    delTabOpen: true,
                    functionId: funcList.funcs[this.state.selectedRows].functionId,
                    functionName: funcList.funcs[this.state.selectedRows].functionName,
                  });
                } else this.setState({ snackbarOpen: true });
              }}
            />
            <RaisedButton
              labelPosition="after"
              icon={<RefreshIcon />}
              style={{ margin: 5 }}
              onClick={evt => {
                evt.preventDefault();
                this.props.dispatch(getFunctionList());
              }}
            />
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
    );
  }

  tblFunc() {
    const { funcList } = this.props;
    return (
      <div style={{ margin: '2vh', borderStyle: 'solid', borderWidth: '1px', borderColor: '#E0E0E0' }}>
        <Paper zDepth={1}>
          <Table onRowSelection={this.onRowSelection}>
            <TableHeader displaySelectAll={false}>
              <TableRow>{this.renderHeaderData()}</TableRow>
            </TableHeader>
            <TableBody deselectOnClickaway={false}>{this.renderBodyData(funcList)}</TableBody>
          </Table>
        </Paper>
      </div>
    );
  }

  dialogFunc() {
    const { intl, grpList, funcList } = this.props;
    const addFunction = intl.formatMessage({ id: 'IIoT.containers.FunctionPage.addFunction' });
    const editFunction = intl.formatMessage({ id: 'IIoT.containers.FunctionPage.editFunction' });
    const deleteFunction = intl.formatMessage({ id: 'IIoT.containers.FunctionPage.deleteFunction' });
    const messageWalsin = intl.formatMessage({ id: 'MERC.containers.Main.walsinDept' });
    const addActions = [
      <FlatButton label={<FormattedMessage {...messages.cancel} />} primary onClick={this.handleClose} />,
      <FlatButton
        label={<FormattedMessage {...messages.confirm} />}
        primary
        onClick={evt => {
          evt.preventDefault();
          const { textFuncName, textFuncUrl, selGrpId, selHidFlg, selParentId } = this.state;
          if (textFuncName === '') {
            this.setState({ addFuncNameEmpty: true });
          }
          if (textFuncUrl === '/') {
            this.setState({ addFuncUrlEmpty: true });
          }
          if (selGrpId === undefined) {
            this.setState({ addGrpNameEmpty: true });
          }
          if (textFuncName !== '' && textFuncUrl !== '/' && selGrpId !== undefined) {
            this.props.dispatch(addFunc({ textFuncName, textFuncUrl, selGrpId, selHidFlg, selParentId }));
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
          const { textFuncName, textFuncUrl, selGrpId, selHidFlg, selParentId } = this.state;
          const funcId = funcList.funcs[this.state.selectedRows[0]].functionId;
          if (textFuncName === '') {
            this.setState({ addFuncNameEmpty: true });
          }
          if (textFuncUrl === '/') {
            this.setState({ addFuncUrlEmpty: true });
          }
          if (selGrpId === undefined) {
            this.setState({ addGrpNameEmpty: true });
          }
          if (textFuncName !== '' && textFuncUrl !== '/' && selGrpId !== undefined) {
            this.props.dispatch(updateFunc({ textFuncName, textFuncUrl, selGrpId, selHidFlg, funcId, selParentId }));
            this.handleClose();
          }
        }}
      />,
    ];

    const delActions = [
      <FlatButton label={<FormattedMessage {...messages.cancel} />} primary onClick={this.handleClose} />,
      <FlatButton
        label={<FormattedMessage {...messages.confirm} />}
        primary
        onClick={evt => {
          evt.preventDefault();
          const { functionId } = this.state;
          this.props.dispatch(delFunc({ functionId }));
          this.handleClose();
          this.setState({ selectedRows: [] });
          setTimeout(() => {
            this.props.dispatch(getFunctionList());
          }, 100);
        }}
      />,
    ];

    return (
      <Grid>
        <Dialog
          title={addFunction}
          actions={addActions}
          modal={false}
          open={this.state.addDiaOpen}
          onRequestClose={this.handleClose}
          contentStyle={{
            borderRadius: '10px',
            overflow: 'auto',
            width: 700,
          }}
          autoScrollBodyContent
        >
          <Grid container>
            <Grid container alignItems="center" justify="center" direction="row">
              <Grid item xs={10} sm={7} md={5} lg={5} xl={5}>
                <TextField
                  style={{ marginRight: 10, marginTop: 10 }}
                  hintText={<FormattedMessage {...messages.addFunctionNameHint} />}
                  floatingLabelText={<FormattedMessage {...messages.addFunctionName} />}
                  floatingLabelFixed
                  floatingLabelStyle={{ fontFamily: 'Roboto' }}
                  value={this.state.textFuncName}
                  onChange={e => {
                    this.setState({ textFuncName: e.target.value });
                    this.setState({ textFuncUrl: '/'.concat(e.target.value) });
                  }}
                  errorText={this.state.addFuncNameEmpty ? <FormattedMessage {...messages.addFunctionNameHint} /> : ''}
                />
              </Grid>
              <Grid item xs={10} sm={7} md={5} lg={5} xl={5}>
                <TextField
                  style={{ marginRight: 10, marginTop: 10 }}
                  hintText={<FormattedMessage {...messages.addFunctionUrlHint} />}
                  floatingLabelText={<FormattedMessage {...messages.addFunctionUrl} />}
                  floatingLabelFixed
                  floatingLabelStyle={{ fontFamily: 'Roboto' }}
                  value={this.state.textFuncUrl}
                  onChange={e => {
                    this.setState({ textFuncUrl: e.target.value });
                  }}
                  errorText={this.state.addFuncUrlEmpty ? <FormattedMessage {...messages.addFunctionUrlHint} /> : ''}
                />
              </Grid>
              <br />
              <Grid item xs={10} sm={7} md={5} lg={5} xl={5}>
                <SelectField
                  style={{ marginRight: 10, marginTop: 10 }}
                  floatingLabelText={<FormattedMessage {...messages.addFunctionGrpName} />}
                  value={this.state.selGrpId}
                  onChange={(event, index, value) => {
                    this.setState({ selGrpId: value });
                  }}
                  hintText={<FormattedMessage {...messages.addFunctionGrpNameHint} />}
                  floatingLabelStyle={{ fontFamily: 'Roboto' }}
                  floatingLabelFixed
                  dropDownMenuProps={{ anchorOrigin: { vertical: 'center', horizontal: 'left' } }}
                  errorText={this.state.addGrpNameEmpty ? <FormattedMessage {...messages.addFunctionGrpNameHint} /> : ''}
                >
                  {grpList.map(item => (
                    <MenuItem value={item.grpId} primaryText={item.grpName} key={Math.random()} />
                  ))}
                </SelectField>
              </Grid>
              <Grid item xs={10} sm={7} md={5} lg={5} xl={5}>
                <SelectField
                  style={{ marginRight: 10, marginTop: 10 }}
                  floatingLabelText={<FormattedMessage {...messages.addFunctionParentId} />}
                  value={this.state.selParentId}
                  onChange={(event, index, value) => {
                    this.setState({ selParentId: value });
                  }}
                  floatingLabelStyle={{ fontFamily: 'Roboto' }}
                  floatingLabelFixed
                  dropDownMenuProps={{ anchorOrigin: { vertical: 'center', horizontal: 'left' } }}
                >
                  <MenuItem value={-1} primaryText={<FormattedMessage {...messages.addFunctionParentRoot} />} />
                  {funcList.funcs.map(item => (
                    <MenuItem key={Math.random()} value={item.functionId} primaryText={item.functionName} />
                  ))}
                  <MenuItem key={Math.random()} value={-2} primaryText={messageWalsin} />
                </SelectField>
              </Grid>
              <Grid item xs={10} sm={7} md={5} lg={5} xl={5}>
                <SelectField
                  style={{ marginRight: 10, marginTop: 10 }}
                  floatingLabelText={<FormattedMessage {...messages.addFunctionHiddenFlg} />}
                  value={this.state.selHidFlg}
                  onChange={(event, index, value) => {
                    this.setState({ selHidFlg: value });
                  }}
                  floatingLabelStyle={{ fontFamily: 'Roboto' }}
                  floatingLabelFixed
                  dropDownMenuProps={{ anchorOrigin: { vertical: 'center', horizontal: 'left' } }}
                >
                  <MenuItem value={'N'} primaryText={<FormattedMessage {...messages.addFunctionHiddenFlgN} />} />
                  <MenuItem value={'Y'} primaryText={<FormattedMessage {...messages.addFunctionHiddenFlgY} />} />
                </SelectField>
              </Grid>
              <Grid item xs={10} sm={7} md={5} lg={5} xl={5} />
            </Grid>
          </Grid>
        </Dialog>
        <Dialog
          title={editFunction}
          actions={editActions}
          modal={false}
          open={this.state.editDiaOpen}
          onRequestClose={this.handleClose}
          contentStyle={{
            borderRadius: '10px',
            overflow: 'auto',
            width: 700,
          }}
          autoScrollBodyContent
        >
          <Grid container>
            <Grid container alignItems="center" justify="center" direction="row">
              <Grid item xs={10} sm={7} md={5} lg={5} xl={5}>
                <TextField
                  style={{ marginRight: 10, marginTop: 10 }}
                  hintText={<FormattedMessage {...messages.editFunctionNameHint} />}
                  floatingLabelText={<FormattedMessage {...messages.editFunction} />}
                  floatingLabelFixed
                  floatingLabelStyle={{ fontFamily: 'Roboto' }}
                  value={this.state.textFuncName}
                  onChange={e => {
                    this.setState({ textFuncName: e.target.value });
                    this.setState({ textFuncUrl: '/'.concat(e.target.value) });
                  }}
                  errorText={this.state.addFuncNameEmpty ? <FormattedMessage {...messages.editFunctionNameHint} /> : ''}
                />
              </Grid>
              <Grid item xs={10} sm={7} md={5} lg={5} xl={5}>
                <TextField
                  style={{ marginRight: 10, marginTop: 10 }}
                  hintText={<FormattedMessage {...messages.editFunctionUrlHint} />}
                  floatingLabelText={<FormattedMessage {...messages.editFunctionUrl} />}
                  floatingLabelFixed
                  floatingLabelStyle={{ fontFamily: 'Roboto' }}
                  value={this.state.textFuncUrl}
                  onChange={e => {
                    this.setState({ textFuncUrl: e.target.value });
                  }}
                  errorText={this.state.addFuncUrlEmpty ? <FormattedMessage {...messages.editFunctionUrlHint} /> : ''}
                />
              </Grid>
              <br />
              <Grid item xs={10} sm={7} md={5} lg={5} xl={5}>
                <SelectField
                  style={{ marginRight: 10, marginTop: 10 }}
                  floatingLabelText={<FormattedMessage {...messages.addFunctionParentId} />}
                  value={this.state.selParentId}
                  onChange={(event, index, value) => {
                    this.setState({ selParentId: value });
                  }}
                  floatingLabelStyle={{ fontFamily: 'Roboto' }}
                  floatingLabelFixed
                  dropDownMenuProps={{ anchorOrigin: { vertical: 'center', horizontal: 'left' } }}
                >
                  <MenuItem value={-1} primaryText={<FormattedMessage {...messages.addFunctionParentRoot} />} />
                  {funcList.funcs.map(item => (
                    <MenuItem key={Math.random()} value={item.functionId} primaryText={item.functionName} />
                  ))}
                  <MenuItem key={Math.random()} value={-2} primaryText={messageWalsin} />
                </SelectField>
              </Grid>
              <Grid item xs={10} sm={7} md={5} lg={5} xl={5}>
                <SelectField
                  style={{ marginRight: 10, marginTop: 10 }}
                  floatingLabelText={<FormattedMessage {...messages.editFunctionGrpName} />}
                  value={this.state.selGrpId}
                  onChange={(event, index, value) => {
                    this.setState({ selGrpId: value });
                  }}
                  hintText={<FormattedMessage {...messages.editFunctionGrpNameHint} />}
                  floatingLabelStyle={{ fontFamily: 'Roboto' }}
                  floatingLabelFixed
                  dropDownMenuProps={{ anchorOrigin: { vertical: 'center', horizontal: 'left' } }}
                  errorText={this.state.addGrpNameEmpty ? <FormattedMessage {...messages.editFunctionGrpNameHint} /> : ''}
                >
                  {grpList.map(item => (
                    <MenuItem value={item.grpId} primaryText={item.grpName} key={Math.random()} />
                  ))}
                </SelectField>
              </Grid>
              <Grid item xs={10} sm={7} md={5} lg={5} xl={5}>
                <SelectField
                  style={{ marginRight: 10, marginTop: 10 }}
                  floatingLabelText={<FormattedMessage {...messages.addFunctionHiddenFlg} />}
                  value={this.state.selHidFlg}
                  onChange={(event, index, value) => {
                    this.setState({ selHidFlg: value });
                  }}
                  floatingLabelStyle={{ fontFamily: 'Roboto' }}
                  floatingLabelFixed
                  dropDownMenuProps={{ anchorOrigin: { vertical: 'center', horizontal: 'left' } }}
                >
                  <MenuItem value={'N'} primaryText={<FormattedMessage {...messages.addFunctionHiddenFlgN} />} />
                  <MenuItem value={'Y'} primaryText={<FormattedMessage {...messages.addFunctionHiddenFlgY} />} />
                </SelectField>
              </Grid>
            </Grid>
          </Grid>
        </Dialog>
        {/* delete function dialog */}
        <Dialog
          title={deleteFunction}
          actions={delActions}
          modal={false}
          open={this.state.delDiaOpen}
          onRequestClose={this.handleClose}
          contentStyle={{
            borderRadius: '10px',
            overflow: 'auto',
            width: 400,
          }}
          autoScrollBodyContent
        >
          <div style={{ display: 'inline-flex', margin: 20 }}>
            <FormattedMessage {...messages.deleteFunctionDesc} /> : &nbsp;
            <div style={{ fontWeight: 800, color: 'red' }}>{this.state.functionName}</div> ?
          </div>
        </Dialog>
      </Grid>
    );
  }

  modalFunc() {
    const { intl } = this.props;
    const { addTabOpen, editTabOpen, delTabOpen } = this.state;

    const formItemLayout = {
      labelCol: {
        span: 8,
      },
      wrapperCol: {
        span: 16,
      },
      style: { height: '1.5em' },
    };

    const formItemLayoutUrl = {
      labelCol: {
        span: 4,
      },
      wrapperCol: {
        span: 20,
      },
      style: { height: '1.5em' },
    };

    const saveFormRef = formRef => {
      this.formRef = formRef;
    };

    const addTabTitle = intl.formatMessage({ id: 'MERC.containers.FunctionPage.AddService' });
    const editTabTitle = intl.formatMessage({ id: 'MERC.containers.FunctionPage.EditService' });
    const delTabTitle = intl.formatMessage({ id: 'MERC.containers.FunctionPage.DelService' });

    const addTabFunc = form => {
      const { grpList, funcList } = this.props;
      const { getFieldDecorator } = form;
      const messageWalsin = intl.formatMessage({ id: 'MERC.containers.Main.walsinDept' });

      return (
        <Form layout="vertical">
          <Row gutter={8}>
            <Col span={24}>
              <Form.Item label={<FormattedMessage {...messages.addFunctionName} />} {...formItemLayoutUrl}>
                {getFieldDecorator('name', { rules: [{ required: true, message: '必填欄位' }] })(<Input type="textarea" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col span={24}>
              <Form.Item label={<FormattedMessage {...messages.addFunctionUrl} />} {...formItemLayoutUrl}>
                {getFieldDecorator('url', { rules: [{ required: true, message: '必填欄位' }] })(<Input type="textarea" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <FormItem {...formItemLayout} label={<FormattedMessage {...messages.addFunctionGrpName} />}>
                {getFieldDecorator('grpId', {
                  rules: [{ required: true, message: '必填欄位' }],
                })(
                  <Select placeholder={<FormattedMessage {...messages.addFunctionGrpNameHint} />}>
                    {grpList.map(item => (
                      <Option key={item.grpId}>{item.grpName}</Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label={<FormattedMessage {...messages.addFunctionParentId} />}>
                {getFieldDecorator('parentId', {
                  rules: [{ required: true, message: '必填欄位' }],
                })(
                  <Select placeholder={<FormattedMessage {...messages.addFunctionParentIdHint} />}>
                    <Option key={-1}>{<FormattedMessage {...messages.addFunctionParentRoot} />}</Option>
                    <Option key={-2}>{messageWalsin}</Option>
                    {funcList.funcs.map(item => (
                      <Option key={item.functionId}>{item.functionName}</Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <FormItem {...formItemLayout} label={<FormattedMessage {...messages.addFunctionHiddenFlg} />}>
                {getFieldDecorator('hidFlg', {
                  rules: [{ required: true, message: '必填欄位' }],
                })(
                  <Select placeholder={<FormattedMessage {...messages.addFunctionHiddenFlg} />}>
                    <Option key="N">{<FormattedMessage {...messages.addFunctionHiddenFlgN} />}</Option>
                    <Option key="Y">{<FormattedMessage {...messages.addFunctionHiddenFlgY} />}</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={12} />
          </Row>
        </Form>
      );
    };

    const editTabFunc = form => {
      const { grpList, funcList } = this.props;
      const { textFuncName, textFuncUrl, selHidFlg, selParentId, selGrpId } = this.state;
      const { getFieldDecorator } = form;
      const messageWalsin = intl.formatMessage({ id: 'MERC.containers.Main.walsinDept' });

      return (
        <Form layout="vertical">
          <Row>
            <Col span={24}>
              <Form.Item label={<FormattedMessage {...messages.addFunctionName} />} {...formItemLayoutUrl}>
                {getFieldDecorator('name', { initialValue: textFuncName, rules: [{ required: true, message: '必填欄位' }] })(
                  <Input type="textarea" />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item label={<FormattedMessage {...messages.addFunctionUrl} />} {...formItemLayoutUrl}>
                {getFieldDecorator('url', { initialValue: textFuncUrl, rules: [{ required: true, message: '必填欄位' }] })(
                  <Input type="textarea" />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <FormItem {...formItemLayout} label={<FormattedMessage {...messages.addFunctionGrpName} />}>
                {getFieldDecorator('grpId', {
                  initialValue: selGrpId.toString(),
                  rules: [{ required: true, message: '必填欄位' }],
                })(
                  <Select placeholder={<FormattedMessage {...messages.addFunctionGrpNameHint} />}>
                    {grpList.map(item => (
                      <Option key={item.grpId.toString()}>{item.grpName}</Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label={<FormattedMessage {...messages.addFunctionParentId} />}>
                {getFieldDecorator('parentId', {
                  initialValue: selParentId.toString(),
                  rules: [{ required: true, message: '必填欄位' }],
                })(
                  <Select placeholder={<FormattedMessage {...messages.addFunctionParentIdHint} />}>
                    <Option key="-1">{<FormattedMessage {...messages.addFunctionParentRoot} />}</Option>
                    <Option key="-2">{messageWalsin}</Option>
                    {funcList.funcs.map(item => (
                      <Option key={item.functionId.toString()}>{item.functionName}</Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <FormItem {...formItemLayout} label={<FormattedMessage {...messages.addFunctionHiddenFlg} />}>
                {getFieldDecorator('hidFlg', {
                  initialValue: selHidFlg,
                  rules: [{ required: true, message: '必填欄位' }],
                })(
                  <Select placeholder={<FormattedMessage {...messages.addFunctionHiddenFlg} />}>
                    <Option key="N">{<FormattedMessage {...messages.addFunctionHiddenFlgN} />}</Option>
                    <Option key="Y">{<FormattedMessage {...messages.addFunctionHiddenFlgY} />}</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={12} />
          </Row>
        </Form>
      );
    };

    const delTabFunc = () => {
      const { functionName } = this.state;
      return (
        <div style={{ display: 'inline-flex', margin: 20 }}>
          <FormattedMessage {...messages.deleteFunctionDesc} /> : &nbsp;
          <div style={{ fontWeight: 800, color: 'red' }}>{functionName}</div> ?
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
              title={(addTabOpen && addTabTitle) || (editTabOpen && editTabTitle) || (delTabOpen && delTabTitle)}
              visible={visible}
              okText={<FormattedMessage {...messages.confirm} />}
              cancelText={<FormattedMessage {...messages.cancel} />}
              onCancel={onCancel}
              onOk={onCreate}
            >
              {addTabOpen && addTabFunc(form)}
              {editTabOpen && editTabFunc(form)}
              {delTabOpen && delTabFunc()}
            </Modal>
          );
        }
      }
    );

    return (
      <CollectionCreateForm
        wrappedComponentRef={saveFormRef}
        visible={addTabOpen || editTabOpen || delTabOpen}
        onCancel={() => {
          this.setState({ addTabOpen: false, editTabOpen: false, delTabOpen: false });
        }}
        onCreate={() => {
          const form = this.formRef.props.form;
          form.validateFields((err, values) => {
            if (err) return;
            if (addTabOpen) {
              const { name, url, grpId, parentId, hidFlg } = values;
              this.props.dispatch(
                addFunc({ textFuncName: name, textFuncUrl: url, selGrpId: Number(grpId), selHidFlg: hidFlg, selParentId: Number(parentId) })
              );
            } else if (editTabOpen) {
              const { funcList } = this.props;
              const funcId = funcList.funcs[this.state.selectedRows[0]].functionId;
              const { name, url, grpId, parentId, hidFlg } = values;
              this.props.dispatch(
                updateFunc({
                  textFuncName: name,
                  textFuncUrl: url,
                  selGrpId: Number(grpId),
                  selHidFlg: hidFlg,
                  funcId,
                  selParentId: Number(parentId),
                })
              );
            } else if (delTabOpen) {
              const { functionId } = this.state;
              this.props.dispatch(delFunc({ functionId }));
              this.handleClose();
              this.setState({ selectedRows: [] });
              setTimeout(() => {
                this.props.dispatch(getFunctionList());
              }, 100);
            }
            form.resetFields();
            this.setState({ visible: false });
            this.setState({ addTabOpen: false, editTabOpen: false, delTabOpen: false });
          });
        }}
      />
    );
  }

  snackbarFunc() {
    return (
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
    );
  }

  // render table start
  renderHeaderData() {
    return this.state.showColumn.map(
      // eslint-disable-next-line
      item => <TableHeaderColumn key={Math.random()}>{<FormattedMessage {...messages[item]} />}</TableHeaderColumn>
    );
  }

  renderBodyData(funcList) {
    const { funcs } = funcList;
    // eslint-disable-next-line
    return funcs.map((item, index) => (
      <TableRow
        key={Math.random()}
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
      itemCol =>
        itemCol === 'hiddenFlg' ? (
          <TableRowColumn key={Math.random()}>{<FormattedMessage {...messages[item[itemCol]]} />}</TableRowColumn>
        ) : (
          <TableRowColumn key={Math.random()}>{item[itemCol]}</TableRowColumn>
        )
    );
  }
  // render table end

  render() {
    const { waiting, funcList, grpList } = this.props;
    return (
      <div>
        <Helmet>
          <title>FunctionPage</title>
          <meta name="description" content="Description of FunctionPage" />
        </Helmet>
        <div style={{ margin: 10, paddingBottom: 5 }}>
          {this.btnFunc()}
          {waiting === true || funcList.size === 0 || grpList.length === 'undefined' ? (
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
            this.tblFunc()
          )}
          {waiting !== true && funcList.size !== 0 && (grpList.length !== 'undefined' && this.dialogFunc())}
          {waiting !== true && funcList.size !== 0 && (grpList.length !== 'undefined' && this.modalFunc())}
        </div>
        {this.snackbarFunc()}
      </div>
    );
  }
}

FunctionPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
  waiting: PropTypes.bool,
  funcList: PropTypes.object,
  classes: PropTypes.object.isRequired,
  grpList: PropTypes.any,
  intl: intlShape.isRequired,
};

const mapStateToProps = createStructuredSelector({
  functionpage: makeSelectFunctionPage(),
  waiting: SelectSendingReqM(),
  funcList: SelectSetFunctionList(),
  menuOpen: SelectMenuOpened(),
  grpList: SelectSetGrpList(),
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

const withReducer = injectReducer({ key: 'functionPage', reducer });
const withSaga = injectSaga({ key: 'functionPage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
  withStyles(styles),
  injectIntl
)(FunctionPage);
