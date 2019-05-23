/**
 *
 * RolePage
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
import { Card } from 'material-ui/Card';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';

// material-ui-next
import Grid from 'material-ui-next/Grid';
import { withStyles } from 'material-ui-next/styles';
import TextFieldNext from 'material-ui-next/TextField';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Snackbar from 'material-ui-next/Snackbar';
import IconButton from 'material-ui-next/IconButton';
import CloseIcon from 'material-ui-icons/Close';

// antd
import { Modal, Input, Select, Row, Col, Tabs, Icon, Spin, Collapse } from 'antd';

import FilteredMultiSelect from 'react-filtered-multiselect';

// svg-icon
import SearchIcon from 'material-ui/svg-icons/action/search';
import EditIcon from 'material-ui/svg-icons/editor/mode-edit';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import AddIcon from 'material-ui/svg-icons/content/add';
import RefreshIcon from 'material-ui/svg-icons/navigation/refresh';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import {
  makeSelectRolePage,
  SelectSetRoleList,
  SelectSetFunctionList,
  SelectSetSrvList,
  SelectSetGrpList,
  SelectFuncListWSearch,
  SelectRefresh,
} from './selectors';
import reducer from './reducer';
import saga from './saga';

import { SelectLoginCurrentlySending, SelectMenuOpened, SelectSendingReqS } from '../../App/selectors';
import {
  getRoleList,
  getFunctionList,
  chgSearchText,
  getSrvList,
  addRole,
  getGrpList,
  updateRoleByGrp,
  deleteRole,
  getFuncListWSearch,
  updateRoleByFunc,
  refresh,
  updateFunc,
} from './actions';

import { SelectMenuList } from '../../Main/selectors';
import { styles, BOOTSTRAP_CLASSES } from '../../../utils/bootstrap';

import ListSort from './ListSort';

// i18l
import messages from './messages';
import messagesMain from '../../Main/messages';

// role : oaSuperViewer, oaViewer, oaEditor
// antd
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const Panel = Collapse.Panel;
let tmpArr = [];

export class RolePage extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      showColumn: ['roleName', 'roleId', 'dataset', 'grps'],
      showColumnWidth: ['1', '1'],
      roleDtlOpen: false,
      roleDtlOpenIndex: 0,
      funcNameList: [],
      funcNameListRole: [],
      funcNameListNonChoose: [],
      selectedRows: [],
      selectedOptions: [],
      idNamePair: [],
      idNamePairAll: [],
      idNamePairWOSel: [],
      selectedOptionsFuncs: [],
      funcIdNamePairAll: [],
      funcIdNamePairAllWSel: [],
      funcIdNamePairWOSel: [],

      // dialog
      addDiaOpen: false,
      editDiaOpen: false,
      textRoleName: '',
      deleteDiaOpen: false,

      // SelectField
      grpId: undefined,
      selDataLevel: undefined,

      // empty
      addRoleName: false,
      addDataLvlCtl: false,

      delRoleId: undefined,
      delRoleName: '',

      // snackbar
      snackbarOpen: false,

      // errMsg
      errMsgGrpId: false,
      tabIndex: '1',

      sortListGrp: [],
      sortListGrp1: [],
      sortListFunc: [],
    };
    this.onRowSelection = this.onRowSelection.bind(this);
  }

  componentDidMount() {
    this.props.dispatch(getRoleList());
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

  roleDtlShow() {
    // process out non-selected functions
  }

  handleDeselect = deselectedOptions => {
    const selectedOptions = this.state.selectedOptions.slice();
    deselectedOptions.forEach(option => {
      let flag = 0;
      for (let i = 0; i < this.state.idNamePairWOSel.length; i += 1) {
        if (this.state.idNamePairWOSel[i].id === option.id) flag = 1;
      }
      // no duplicate
      if (flag === 0) {
        const arrayvar = this.state.idNamePairWOSel.slice();
        arrayvar.push(option);
        this.setState({ idNamePairWOSel: arrayvar });
      }

      selectedOptions.splice(selectedOptions.indexOf(option), 1);
    });
    this.setState({ selectedOptions });
  };

  handleDeselectFunc = deselectedOptions => {
    const selectedOptions = this.state.funcIdNamePairAllWSel.slice();
    deselectedOptions.forEach(option => {
      let flag = 0;
      for (let i = 0; i < this.state.funcIdNamePairWOSel.length; i += 1) {
        if (this.state.funcIdNamePairWOSel[i].id === option.id) flag = 1;
      }
      // no duplicate
      if (flag === 0) {
        const arrayvar = this.state.funcIdNamePairWOSel.slice();
        arrayvar.push(option);
        this.setState({ funcIdNamePairWOSel: arrayvar });
      }

      selectedOptions.splice(selectedOptions.indexOf(option), 1);
    });
    this.setState({ funcIdNamePairAllWSel: selectedOptions });
  };

  handleSelect = selectedOptions => {
    selectedOptions.sort((a, b) => a.id - b.id);
    this.setState({ selectedOptions });
  };

  handleSelectFunc = funcIdNamePairAllWSel => {
    funcIdNamePairAllWSel.sort((a, b) => a.id - b.id);
    this.setState({ funcIdNamePairAllWSel });
  };

  handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({ snackbarOpen: false });
  };

  changeSearchText = event => {
    this.setState({
      searchText: event.target.value,
    });
    this.props.dispatch(chgSearchText(event.target.value));
  };

  handleClose = () => {
    this.setState({
      editDiaOpen: false,
      deleteDiaOpen: false,
      addDiaOpen: false,

      // empty
      addRoleName: false,
      addDataLvlCtl: false,
      delRoleId: undefined,
      delRoleName: '',

      // SelectField
      grpId: '',

      // errMsg
      errMsgGrpId: false,
    });
  };

  comparer(otherArray) {
    // eslint-disable-next-line
    return function(current) {
      return (
        // eslint-disable-next-line
        otherArray.filter(function(other) {
          return other.id === current.id && other.name === current.name;
        }).length === 0
      );
    };
  }

  grpSting(data) {
    let grpList = '';
    const length = data.length;
    for (let i = 0; i < length; i += 1) {
      grpList = grpList.concat(data[i].grpName).concat(' ');
    }
    return grpList;
  }

  showRoletbl = () => {
    const { classes, waiting, intl, roleList, funcList, funcListWSearch } = this.props;
    // const { funcIdNamePairAll, funcIdNamePairAllWSel, funcIdNamePairWOSel } = this.state;
    const search = intl.formatMessage({ id: 'IIoT.containers.UserPage.search' });
    return (
      <Card style={{ paddingBottom: 5 }}>
        <div style={{ margin: 10 }}>
          <Grid container>
            <Grid item xs={12}>
              <Grid container alignItems="center" justify="flex-end">
                <RaisedButton
                  labelPosition="after"
                  icon={<AddIcon />}
                  style={{ margin: 5 }}
                  onClick={evt => {
                    evt.preventDefault();
                    this.setState({ addDiaOpen: true });
                    this.props.dispatch(getSrvList());
                  }}
                />
                <RaisedButton
                  labelPosition="after"
                  icon={<EditIcon />}
                  style={{ margin: 5 }}
                  onClick={evt => {
                    evt.preventDefault();
                    // grp tab
                    if (this.state.selectedRows.length !== 0) {
                      this.setState({ idNamePair: [], idNamePairAll: [], idNamePairWOSel: [] });
                      // const idNamePair = [];
                      const { roles } = this.props.roleList;
                      // getFuncList with search
                      // dispatch
                      this.props.dispatch(getFuncListWSearch({ roleId: roles[this.state.selectedRows[0]].roleId, funcList }));
                      const arrayvar = [];
                      for (let i = 0; i < roles[this.state.selectedRows[0]].grps.length; i += 1) {
                        arrayvar.push({
                          id: roles[this.state.selectedRows[0]].grps[i].grpId,
                          name: roles[this.state.selectedRows[0]].grps[i].grpName,
                        });
                      }
                      this.setState({ idNamePair: arrayvar });
                      // idNamePairAll
                      const arrayvarAll = [];
                      for (let i = 0; i < this.props.grpList.length; i += 1) {
                        arrayvarAll.push({
                          id: this.props.grpList[i].grpId,
                          name: this.props.grpList[i].grpName,
                        });
                      }
                      this.setState({ idNamePairAll: arrayvarAll });
                      // idNamePairWOSel
                      const onlyInA = arrayvarAll.filter(this.comparer(arrayvar));
                      const onlyInB = arrayvar.filter(this.comparer(arrayvarAll));
                      this.setState({ idNamePairWOSel: onlyInA.concat(onlyInB) });

                      // func tab
                      // selectedOptionsFuncs
                      if (funcListWSearch !== null) {
                        const funcIdNamePairAllArr = [];
                        const funcIdNamePairAllWSelArr = [];
                        const funcIdNamePairWOSelArr = [];
                        for (let i = 0; i < funcList.length; i += 1) {
                          funcIdNamePairAllArr.push({ id: funcList[i].functionId, name: funcList[i].functionName });
                          if (i < funcListWSearch.funcListWSearch.length) {
                            funcIdNamePairAllWSelArr.push({
                              id: funcListWSearch.funcListWSearch[i].functionId,
                              name: funcListWSearch.funcListWSearch[i].functionName,
                            });
                          }
                          if (i < funcListWSearch.funcListWOSearch.length) {
                            funcIdNamePairWOSelArr.push({
                              id: funcListWSearch.funcListWOSearch[i].functionId,
                              name: funcListWSearch.funcListWOSearch[i].functionName,
                            });
                          }
                        }
                        this.setState({
                          funcIdNamePairAll: funcIdNamePairAllArr,
                          funcIdNamePairAllWSel: funcIdNamePairAllWSelArr,
                          funcIdNamePairWOSel: funcIdNamePairWOSelArr,
                        });
                      }
                      this.setState({
                        editDiaOpen: true,
                        selectedOptions: arrayvar,
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
                        deleteDiaOpen: true,
                        delRoleId: this.props.roleList.roles[this.state.selectedRows[0]].roleId,
                        delRoleName: this.props.roleList.roles[this.state.selectedRows[0]].roleName,
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
                    this.props.dispatch(getRoleList());
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
          {waiting || roleList.size === 0 ? (
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
              <div style={{ margin: '2vh', borderStyle: 'solid', borderWidth: '1px', borderColor: '#E0E0E0' }}>
                <Paper zDepth={1}>
                  <Table onRowSelection={this.onRowSelection}>
                    <TableHeader displaySelectAll={false}>
                      <TableRow>{this.renderHeaderData()}</TableRow>
                    </TableHeader>
                    <TableBody deselectOnClickaway={false}>{this.renderBodyData(roleList)}</TableBody>
                  </Table>
                </Paper>
              </div>
            </div>
          )}
        </div>
      </Card>
    );
  };

  dialogFunc() {
    const { intl, grpList, menuList } = this.props;
    const { addDiaOpen, editDiaOpen, selDataLevel, grpId } = this.state;
    // const startDate = intl.formatMessage({ id: 'MERC.containers.EventPage.startDate' });
    // add
    const messageAddRole = intl.formatMessage({ id: 'IIoT.containers.RolePage.addRole' });
    const addRoleDataLevelControl = intl.formatMessage({ id: 'IIoT.containers.RolePage.addRoleDataLevelControl' });
    const addRoleGrp = intl.formatMessage({ id: 'IIoT.containers.RolePage.addRoleGrp' });
    // edit
    const editRoleTitle = intl.formatMessage({ id: 'IIoT.containers.RolePage.editRole' });

    const addDiaFunc = () => {
      const messageAddRoleName = intl.formatMessage({ id: 'IIoT.containers.RolePage.addRoleName' });
      return (
        <Row gutter={24}>
          <Col span={12}>
            <Input
              style={{ width: '100%', marginBottom: '1em' }}
              placeholder={messageAddRoleName}
              onChange={e => {
                this.setState({ textRoleName: e.target.value });
              }}
            />
          </Col>
          <Col span={12}>
            <Select
              style={{ width: '100%' }}
              onChange={value => {
                this.setState({ selDataLevel: value });
              }}
              placeholder={addRoleDataLevelControl}
              value={selDataLevel}
            >
              <Option value={'0'} key={Math.random()} disabled>
                {<FormattedMessage {...messages.addRoleDataLevelControlAll} />}
              </Option>
              <Option value={'1'} key={Math.random()}>
                {<FormattedMessage {...messages.addRoleDataLevelControlCompany} />}
              </Option>
              <Option value={'2'} key={Math.random()}>
                {<FormattedMessage {...messages.addRoleDataLevelControlUser} />}
              </Option>
            </Select>
          </Col>
          <Col span={24}>
            <Select
              style={{ width: '100%' }}
              onChange={value => {
                this.setState({ grpId: value });
              }}
              placeholder={addRoleGrp}
              mode="multiple"
            >
              {grpList.map(item => (
                <Option value={item.grpId} key={Math.random()}>
                  {item.grpName}
                </Option>
              ))}
            </Select>
          </Col>
        </Row>
      );
    };

    const editDiaFunc = () => {
      const { waitingS, funcListWSearch, roleList, classes, funcList } = this.props;
      const { selectedOptions, idNamePairWOSel, funcIdNamePairAllWSel, funcIdNamePairWOSel } = this.state;
      const menuIconList = {
        Dashboard: 'dashboard',
        DEVICE: 'laptop',
        ADMIN: 'user',
        Tag: 'idcard',
        Event: 'profile',
        walsinDept: 'bar-chart',
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
      const dataArrayGrp = [];

      const pattern = new RegExp('[\u4E00-\u9FA5]+');
      console.log('roleList:', roleList);
      // grp
      for (let i = 0; i < roleList.roles[this.state.selectedRows[0]].grps.length; i += 1) {
        if (roleList.roles[this.state.selectedRows[0]].grps[i].grpName !== 'walsinDept') {
          let title;
          let icon;
          if (pattern.test(roleList.roles[this.state.selectedRows[0]].grps[i].grpName.toUpperCase()) === true) {
            title = roleList.roles[this.state.selectedRows[0]].grps[i].grpName;
            icon = 'bar-chart';
          } else {
            const messagei18l = 'IIoT.containers.Main.'.concat(roleList.roles[this.state.selectedRows[0]].grps[i].grpName.toUpperCase());
            title = intl.formatMessage({
              id: messagei18l,
            });
            icon = menuIconList[roleList.roles[this.state.selectedRows[0]].grps[i].grpName];
          }

          dataArrayGrp.push({
            icon,
            title,
            grpIdItem: roleList.roles[this.state.selectedRows[0]].grps[i].grpId,
          });
        } else {
          dataArrayGrp.push({
            icon: 'bar-chart',
            title: 'walsinDept',
            grpIdItem: roleList.roles[this.state.selectedRows[0]].grps[i].grpId,
          });
        }
      }
      const childrenToRender = dataArrayGrp.map((item, i) => {
        const { icon, color, title, grpIdItem } = item;
        return (
          <div key={i} className={classes['list-sort-demo-list']}>
            <div className={classes['list-sort-demo-icon']} style={{ display: 'flex', alignSelf: 'center', justifyContent: 'center' }}>
              <Icon type={icon} style={{ color }} />
            </div>
            {title}
            <div style={{ visibility: 'hidden' }}>{grpIdItem}</div>
          </div>
        );
      });

      // function
      const dataArrayFunc = [];
      for (let i = 0; i < menuList.length; i += 1) {
        dataArrayFunc.push([]);
      }
      for (let i = 0; i < menuList.length; i += 1) {
        if (menuList[i][2] === 0) {
          for (let j = 0; j < menuList[i][1].length; j += 1) {
            dataArrayFunc[i].push({
              icon: menuIconList[menuList[i][1][j][0]],
              title: menuList[i][1][j][0],
            });
          }
        } else if (menuList[i][2] === -2) {
          for (let j = 0; j < menuList[i][1].length; j += 1) {
            dataArrayFunc[i].push({
              icon: 'solution',
              title: menuList[i][1][j][0],
            });
          }
        }
      }
      const buttonTextAdd = intl.formatMessage({ id: 'IIoT.containers.RolePage.editRoleAdd' });
      const buttonTextRemove = intl.formatMessage({ id: 'IIoT.containers.RolePage.editRoleRemove' });
      const tabPaneFunc = () => {
        return [
          <TabPane
            tab={
              <span>
                <Icon type="down" />
                {<FormattedMessage {...messages.editRoleDesc} />}
              </span>
            }
            key="1"
          >
            <FilteredMultiSelect
              buttonText={buttonTextAdd}
              classNames={BOOTSTRAP_CLASSES}
              onChange={this.handleSelect}
              options={idNamePairWOSel}
              selectedOptions={selectedOptions}
              textProp="name"
              valueProp="id"
            />
            <div style={{ display: 'flex', justifyContent: 'center', margin: '0.5em' }}>
              <Icon type="caret-up" style={{ fontSize: '16px', color: '#08c' }} theme="outlined" />
              <Icon type="caret-down" style={{ fontSize: '16px', color: '#08c' }} theme="outlined" />
            </div>
            <FilteredMultiSelect
              buttonText={buttonTextRemove}
              classNames={{
                filter: 'form-control',
                select: 'form-control',
                button: 'btn btn btn-block btn-default',
                buttonActive: 'btn btn btn-block btn-danger',
              }}
              onChange={this.handleDeselect}
              options={selectedOptions}
              textProp="name"
              valueProp="id"
            />
          </TabPane>,
          <TabPane
            tab={
              <span>
                <Icon type="down" />
                {<FormattedMessage {...messages.editRoleChooseFunc} />}
              </span>
            }
            key="2"
          >
            {waitingS || funcListWSearch === null ? (
              <Spin tip="Loading..." />
            ) : (
              <div>
                <FilteredMultiSelect
                  buttonText={buttonTextAdd}
                  classNames={BOOTSTRAP_CLASSES}
                  onChange={this.handleSelectFunc}
                  options={funcIdNamePairWOSel}
                  selectedOptions={funcIdNamePairAllWSel}
                  textProp="name"
                  valueProp="id"
                />
                <div style={{ display: 'flex', justifyContent: 'center', margin: '0.5em' }}>
                  <Icon type="caret-up" style={{ fontSize: '16px', color: '#08c' }} theme="outlined" />
                  <Icon type="caret-down" style={{ fontSize: '16px', color: '#08c' }} theme="outlined" />
                </div>
                <FilteredMultiSelect
                  buttonText={buttonTextRemove}
                  classNames={{
                    filter: 'form-control',
                    select: 'form-control',
                    button: 'btn btn btn-block btn-default',
                    buttonActive: 'btn btn btn-block btn-danger',
                  }}
                  onChange={this.handleDeselectFunc}
                  options={funcIdNamePairAllWSel}
                  textProp="name"
                  valueProp="id"
                />
              </div>
            )}
          </TabPane>,
          <TabPane
            tab={
              <span>
                <Icon type="down" />
                {<FormattedMessage {...messages.editGrpOrder} />}
              </span>
            }
            key="3"
          >
            <div style={{ fontWeight: 500, margin: '0.5em' }}>拖動以更改群組顯示順序</div>
            <div className={classes['list-sort-demo-wrapper']}>
              <div className={this.props.className}>
                <ListSort
                  dragClassName={classes['list-sort-demo-list.list-drag-selected']}
                  appearAnim={{ animConfig: { marginTop: [5, 30], opacity: [1, 0] } }}
                  onChange={e => {
                    // e.preventDefault();
                    const { sortListGrp } = this.state;
                    this.setState({ sortListGrp: [] });
                    for (let i = 0; i < e.length; i += 1) {
                      sortListGrp.push({
                        id: e[i].props.children[2].props.children,
                        sortId: i + 1,
                        createFlg: 1,
                        updateFlg: 1,
                        deleteFlg: 1,
                      });
                    }
                    this.setState({ sortListGrp1: sortListGrp });
                  }}
                >
                  {childrenToRender}
                </ListSort>
              </div>
            </div>
          </TabPane>,
          <TabPane
            tab={
              <span>
                <Icon type="down" />
                {<FormattedMessage {...messages.editFuncOrder} />}
              </span>
            }
            key="4"
          >
            <div style={{ fontWeight: 500, margin: '0.5em' }}>拖動以更改服務顯示順序</div>
            <Collapse>
              {menuList.map(
                (item, index) =>
                  item[2] !== -1 && (
                    <Panel
                      header={
                        <div style={{ display: 'flex', alignContent: 'center' }}>
                          <Icon
                            type={item[2] !== -2 ? menuIconList[item[0]] : 'bar-chart'}
                            style={{ marginRight: '1em', marginTop: '0.3em' }}
                          />
                          {item[2] !== -2 ? <FormattedMessage {...messagesMain[item[0].toUpperCase()]} /> : item[0]}
                        </div>
                      }
                      key={index}
                    >
                      <div className={classes['list-sort-demo-wrapper']}>
                        <div className={this.props.className}>
                          <ListSort
                            dragClassName={classes['list-sort-demo-list.list-drag-selected']}
                            appearAnim={{ animConfig: { marginTop: [5, 30], opacity: [1, 0] } }}
                            onChange={e => {
                              if (tmpArr.length === 0) {
                                tmpArr = [];
                                for (let i = 0; i < menuList.length; i += 1) {
                                  tmpArr.push([]);
                                }
                              }
                              let sortCnt = 0;
                              for (let i = 0; i < e.length; i += 1) {
                                for (let j = 0; j < funcList.length; j += 1) {
                                  if (e[i].props.children[2].props.children === 0) {
                                    if (funcList[j].functionName === e[i].props.children[1].props.defaultMessage) {
                                      tmpArr[e[i].props.children[3].props.children].push({
                                        funcId: funcList[j].functionId,
                                        funcName: funcList[j].functionName,
                                        funcUrl: funcList[j].functionUrl,
                                        parentId: funcList[j].parentId,
                                        sortId: sortCnt,
                                        grpId: funcList[j].grpId,
                                        hiddenFlg: funcList[j].hiddenFlg,
                                      });
                                      sortCnt += 1;
                                    }
                                  } else if (e[i].props.children[2].props.children === -2) {
                                    if (funcList[j].functionName === e[i].props.children[1]) {
                                      tmpArr[e[i].props.children[3].props.children].push({
                                        funcId: funcList[j].functionId,
                                        funcName: funcList[j].functionName,
                                        funcUrl: funcList[j].functionUrl,
                                        parentId: funcList[j].parentId,
                                        sortId: sortCnt,
                                        grpId: funcList[j].grpId,
                                        hiddenFlg: funcList[j].hiddenFlg,
                                      });
                                      sortCnt += 1;
                                    }
                                  }
                                }
                              }
                            }}
                          >
                            {dataArrayFunc[index].map((subItem, i) => {
                              const { icon, color, title } = subItem;
                              return (
                                <div key={i} className={classes['list-sort-demo-list']}>
                                  <div
                                    className={classes['list-sort-demo-icon']}
                                    style={{ display: 'flex', alignSelf: 'center', justifyContent: 'center' }}
                                  >
                                    <Icon type={icon} style={{ color }} />
                                  </div>
                                  {menuList[index][2] !== -2 ? <FormattedMessage {...messagesMain[title.toUpperCase()]} /> : title}
                                  <div style={{ visibility: 'hidden' }}>{menuList[index][2]}</div>
                                  <div style={{ visibility: 'hidden' }}>{index}</div>
                                </div>
                              );
                            })}
                          </ListSort>
                        </div>
                      </div>
                    </Panel>
                  )
              )}
            </Collapse>
          </TabPane>,
        ];
      };

      return (
        <div>
          <Tabs
            defaultActiveKey="1"
            type="card"
            onChange={key => {
              this.setState({ tabIndex: key });
              const funcIdNamePairAllArr = [];
              const funcIdNamePairAllWSelArr = [];
              const funcIdNamePairWOSelArr = [];
              for (let i = 0; i < funcList.length; i += 1) {
                funcIdNamePairAllArr.push({ id: funcList[i].functionId, name: funcList[i].functionName });
                if (i < funcListWSearch.funcListWSearch.length) {
                  funcIdNamePairAllWSelArr.push({
                    id: funcListWSearch.funcListWSearch[i].functionId,
                    name: funcListWSearch.funcListWSearch[i].functionName,
                  });
                }
                if (i < funcListWSearch.funcListWOSearch.length) {
                  funcIdNamePairWOSelArr.push({
                    id: funcListWSearch.funcListWOSearch[i].functionId,
                    name: funcListWSearch.funcListWOSearch[i].functionName,
                  });
                }
              }
              this.setState({
                funcIdNamePairAll: funcIdNamePairAllArr,
                funcIdNamePairAllWSel: funcIdNamePairAllWSelArr,
                funcIdNamePairWOSel: funcIdNamePairWOSelArr,
              });
            }}
            style={{ marginTop: '-1em' }}
          >
            {tabPaneFunc()}
          </Tabs>
        </div>
      );
    };

    const handleClose = () => {
      this.setState({
        editDiaOpen: false,
        deleteDiaOpen: false,
        addDiaOpen: false,

        // empty
        addRoleName: false,
        addDataLvlCtl: false,
        delRoleId: undefined,
        delRoleName: '',

        // SelectField
        grpId: '',

        // errMsg
        errMsgGrpId: false,
      });
    };

    return (
      <Modal
        title={(addDiaOpen && messageAddRole) || (editDiaOpen && editRoleTitle)}
        visible={addDiaOpen || editDiaOpen}
        okText={<FormattedMessage {...messages.confirm} />}
        cancelText={<FormattedMessage {...messages.cancel} />}
        onOk={evt => {
          const { roleList } = this.props;
          if (addDiaOpen) {
            evt.preventDefault();
            const { textRoleName } = this.state;
            if (textRoleName === '') {
              this.setState({ addRoleName: true });
            }
            if (selDataLevel === undefined) {
              this.setState({ addDataLvlCtl: true });
            }
            if (textRoleName !== '' && selDataLevel !== undefined) {
              this.props.dispatch(addRole({ textRoleName, selDataLevel, grpId }));
              this.handleClose();
            }
          } else if (editDiaOpen && this.state.tabIndex === '1') {
            evt.preventDefault();
            const { selectedOptions, selectedRows } = this.state;
            for (let i = 0; i < selectedOptions.length; i += 1) {
              delete selectedOptions[i].name;
              if (i < roleList.roles[this.state.selectedRows[0]].grps.length) {
                selectedOptions[i].sortId = roleList.roles[this.state.selectedRows[0]].grps[i].sortId;
              } else {
                selectedOptions[i].sortId = i + 1;
              }
              selectedOptions[i].createFlg = 1;
              selectedOptions[i].updateFlg = 1;
              selectedOptions[i].deleteFlg = 1;
            }
            delete selectedOptions[0].name;
            const id = roleList.roles[selectedRows].roleId;
            this.props.dispatch(updateRoleByGrp({ grps: selectedOptions, catId: id, type: 'GRole' }));
          } else if (editDiaOpen && this.state.tabIndex === '2') {
            const { funcIdNamePairAllWSel, selectedRows } = this.state;
            for (let i = 0; i < funcIdNamePairAllWSel.length; i += 1) {
              delete funcIdNamePairAllWSel[i].name;
            }
            delete funcIdNamePairAllWSel[0].name;
            const id = roleList.roles[selectedRows].roleId;
            this.props.dispatch(updateRoleByFunc({ func: funcIdNamePairAllWSel, catId: id, type: 'Func' }));
          } else if (editDiaOpen && this.state.tabIndex === '3') {
            const { selectedRows, sortListGrp1 } = this.state;
            const id = roleList.roles[selectedRows].roleId;
            this.props.dispatch(updateRoleByGrp({ grps: sortListGrp1, catId: id, type: 'GRole' }));
          } else if (editDiaOpen && this.state.tabIndex === '4') {
            for (let i = 0; i < tmpArr.length; i += 1) {
              if (tmpArr[i].length !== 0) {
                for (let j = 0; j < tmpArr[i].length; j += 1) {
                  this.props.dispatch(updateFunc(tmpArr[i][j]));
                }
              }
            }
          }
          handleClose();
        }}
        onCancel={() => {
          handleClose();
        }}
      >
        {addDiaOpen && addDiaFunc()}
        {editDiaOpen && editDiaFunc()}
      </Modal>
    );
  }

  // render table start
  renderHeaderData() {
    return this.state.showColumn.map(
      // eslint-disable-next-line
      (item, index) => (
        // eslint-disable-next-line
        <TableHeaderColumn key={index}>{<FormattedMessage {...messages[item]} />}</TableHeaderColumn>
      )
    );
  }

  renderBodyData(roleList) {
    const { roles } = roleList;
    return roles.map((item, index) => (
      <TableRow
        rowNumber={1}
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
        itemCol === 'dataset' ? (
          <TableRowColumn key={Math.random()}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              {<FormattedMessage {...messages[item[itemCol]]} />}
            </div>
          </TableRowColumn>
        ) : itemCol === 'grps' ? (
          <TableRowColumn style={{ whiteSpace: 'normal' }} key={Math.random()}>
            {this.grpSting(item[itemCol])}
          </TableRowColumn>
        ) : (
          <TableRowColumn key={Math.random()}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              {item[itemCol]}
            </div>
          </TableRowColumn>
        )
    );
  }

  render() {
    const { roleList, intl, grpList, pageRefresh } = this.props;
    const deleteRoleTitle = intl.formatMessage({ id: 'IIoT.containers.RolePage.deleteRole' });

    const deleteActions = [
      <FlatButton label={<FormattedMessage {...messages.cancel} />} primary onClick={this.handleClose} />,
      <FlatButton
        label={<FormattedMessage {...messages.confirm} />}
        primary
        onClick={evt => {
          evt.preventDefault();
          const { delRoleId } = this.state;
          this.props.dispatch(deleteRole({ delRoleId }));
          this.setState({ selectedRows: [] });
          this.handleClose();
        }}
      />,
    ];

    if (pageRefresh === true) {
      this.props.dispatch(refresh(false));
    }

    return (
      <div>
        <Helmet>
          <title>RolePage</title>
          <meta name="description" content="Description of RolePage" />
        </Helmet>
        {this.showRoletbl()}
        {roleList.size !== 0 && grpList.size !== 0 && this.dialogFunc()}
        {roleList.size !== 0 && grpList.size !== 0 ? (
          <Grid>
            <Dialog
              title={deleteRoleTitle}
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
                <FormattedMessage {...messages.deleteRoleDesc} /> : &nbsp;
                <div style={{ fontWeight: 800, color: 'red' }}>{this.state.delRoleName}</div> ?
              </div>
            </Dialog>
          </Grid>
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

RolePage.propTypes = {
  dispatch: PropTypes.func.isRequired,
  waiting: PropTypes.bool,
  waitingS: PropTypes.bool,
  roleList: PropTypes.object,
  funcList: PropTypes.object,
  classes: PropTypes.object.isRequired,
  grpList: PropTypes.any,
  intl: intlShape.isRequired,
  funcListWSearch: PropTypes.object,
  pageRefresh: PropTypes.bool,
  className: PropTypes.object,
  menuList: PropTypes.any,
};

const mapStateToProps = createStructuredSelector({
  rolepage: makeSelectRolePage(),
  waiting: SelectLoginCurrentlySending(),
  waitingS: SelectSendingReqS(),
  roleList: SelectSetRoleList(),
  funcList: SelectSetFunctionList(),
  menuOpen: SelectMenuOpened(),
  srvList: SelectSetSrvList(),
  grpList: SelectSetGrpList(),
  funcListWSearch: SelectFuncListWSearch(),
  pageRefresh: SelectRefresh(),
  menuList: SelectMenuList(),
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

const withReducer = injectReducer({ key: 'rolePage', reducer });
const withSaga = injectSaga({ key: 'rolePage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
  withStyles(styles),
  injectIntl
)(RolePage);
