/**
 *
 * AlertPage
 *
 */
/* eslint-disable no-confusing-arrow */
/* eslint-disable no-lonely-if */
/* eslint-disable import/no-named-default */
/* eslint-disable react/no-did-mount-set-state */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { Input, Select, Row, Col, Table, Button, Modal, Popconfirm, Form, Checkbox, Radio, Icon } from 'antd';

// material-ui

// test

// @material-ui
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Paper from '@material-ui/core/Paper';
import Hidden from '@material-ui/core/Hidden';
import withWidth from '@material-ui/core/withWidth';
import CircularProgress from '@material-ui/core/CircularProgress';

// @material-ui icon

import SearchIcon from 'material-ui/svg-icons/action/search';

// material-ui-next

import TextFieldNext from 'material-ui-next/TextField';

// pagination
import Pagination from 'react-js-pagination';

// bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';

// bootstrap table
import 'react-bootstrap-table/dist/react-bootstrap-table.min.css';
import { BootstrapTable, TableHeaderColumn as TableHeaderColumnBoot } from 'react-bootstrap-table';
import 'react-bootstrap-table/dist/react-bootstrap-table.min';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { SelectMenuOpened } from '../App/selectors';
import { makeSelectAlertPage, SelectFportList, SelectAlertList, SelectErrMsg, SelectAlertListByFport } from './selectors';
import { getAlertList, addAlertList, delAlertList, getAlertListWithFport } from './actions';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';

// antd
const Option = Select.Option;

const stwItems = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

// flag

let stdDisplay = 'none';
let stwDisplay = 'none';
let periodCondDisable = 'inline';
let changeFlag;
let periodCondFlag;
let condFlag;
let modalType = 'insert';
let selectRow = {};
let periodCondTypes = [];

export class AlertPage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.conditionColumns = [];
    this.periodCondColums = {
      std: [],
      stw: [],
    };
    this.state = {
      selectedRows: [],
      page: 1,
      searchText: '',
      selectValue: null,
      timePickerEnable: false,
      stanToday: '',
      dateFrom: '',
      dateTo: '',
      fileName: '',
      dateFromEx: '',
      dateToEx: '',
      timePickerDia: false,
      exportDia: false,
      selectFieldValue: null,
      selectFieldValueType: null,
      selectFieldTypeRule: null,
      selectSeachValue: '',
      selectSearchMsg: undefined,
      clickRowId: 'none',
      srhKey: null,
      limit: 10,
      autoFocus: false,
      insertModalVisible: false,
      confirmLoading: false,
      indeterminate: true,
      checkAll: false,
    };
    this.hdlPageChg = this.hdlPageChg.bind(this);
    // this.rowClickModal = this.rowClickModal.bind(this);
    this.onRowSelect = this.onRowSelect.bind(this);
    this.mounted = false;
  }

  componentDidMount() {
    this.props.dispatch(getAlertList({}));
    this.mounted = true;
  }

  componentWillReceiveProps(e) {}

  componentWillUnmount() {
    this.mounted = false;
  }

  addAlert = () => {
    this.setState({
      insertModalVisible: true,
    });
  };

  editAlert = () => {
    if (Object.keys(selectRow).length !== 0) {
      changeFlag = false;
      periodCondFlag = true;
      condFlag = true;
      modalType = 'edit';
      this.setState({
        insertModalVisible: true,
      });
    } else {
      Modal.warning({
        title: 'Edit Warning',
        content: 'You must select alert...',
      });
    }
  };

  deleteAlert = () => {
    if (this.state.clickRowId !== 'none') {
      this.props.dispatch(
        delAlertList({
          id: this.state.clickRowId,
        })
      );
      selectRow = {};
      this.setState({
        clickRowId: 'none',
        page: 1,
      });
    } else {
      Modal.warning({
        title: 'Delete Warning',
        content: 'You must select alert...',
      });
    }
  };

  handleCancel = () => {
    const form = this.formRef.props.form;
    form.resetFields();
    stdDisplay = 'none';
    stwDisplay = 'none';
    periodCondFlag = false;
    condFlag = false;
    modalType = 'insert';
    selectRow = {};
    this.refs.table.cleanSelected();
    this.setState({
      insertModalVisible: false,
      stdDataSource: [],
      periodCondCount: 0,
      conditionDataSource: [],
      conditionCount: 0,
    });
  };

  handleCreate = () => {
    const form = this.formRef.props.form;
    const periodCondition = [];
    const condition = [];
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      if (values.periodCondType.includes('std') && periodCondDisable === 'inline') {
        let flag = true;
        let counter = 0;
        while (flag) {
          const stdCond = { type: 'std' };
          if (values[`year_${counter}`] === undefined || values[`year_${counter}`] === '') {
            flag = false;
          }
          if (values[`month_${counter}`] === undefined || values[`month_${counter}`] === '') {
            flag = false;
          }
          if (values[`date_${counter}`] === undefined || values[`date_${counter}`] === '') {
            flag = false;
          }
          if (values[`hour_${counter}`] === undefined || values[`hour_${counter}`] === '') {
            flag = false;
          }
          if (values[`minute_${counter}`] === undefined || values[`minute_${counter}`] === '') {
            flag = false;
          }
          if (flag) {
            stdCond.year = values[`year_${counter}`];
            stdCond.month = values[`month_${counter}`];
            stdCond.date = values[`date_${counter}`];
            stdCond.hour = values[`hour_${counter}`];
            stdCond.minute = values[`minute_${counter}`];
            periodCondition.push(stdCond);
            counter += 1;
          }
        }
      }
      if (values.periodCondType.includes('stw') && periodCondDisable === 'inline') {
        const stwCond = { type: 'stw', sun: '0', mon: '0', tue: '0', wed: '0', thu: '0', fri: '0', sat: '0' };
        for (let i = 0; i < values.check_date.length; i += 1) {
          for (let j = 0; j < stwItems.length; j += 1) {
            if (values.check_date[i] === stwItems[j]) {
              stwCond[values.check_date[i]] = '-1';
            }
          }
        }
        periodCondition.push(stwCond);
      }

      let flag = true;
      let counter = 0;
      while (flag) {
        const cond = {};
        if (values[`condition_field_${counter}`] === undefined || values[`condition_field_${counter}`] === '') {
          flag = false;
        }
        if (values[`condition_op_${counter}`] === undefined || values[`condition_op_${counter}`] === '') {
          flag = false;
        }
        if (values[`condition_value_${counter}`] === undefined || values[`condition_value_${counter}`] === '') {
          flag = false;
        }
        if (flag) {
          cond.field = values[`condition_field_${counter}`];
          cond.op = values[`condition_op_${counter}`];
          cond.val = values[`condition_value_${counter}`];
          cond.combine = values[`condition_combine_${counter}`] !== undefined ? values[`condition_combine_${counter}`] : '';
          condition.push(cond);
          counter += 1;
        }
      }
      this.props.dispatch(
        addAlertList({
          _id: selectRow.id !== undefined && modalType === 'edit' ? selectRow.id : -1,
          fport: values.fport,
          name: values.name,
          macAddr: values.macAddr,
          period: values.period,
          periodCondition,
          condition,
          msg: values.msg,
          activate: values.activate,
        })
      );
      form.resetFields();
      stdDisplay = 'none';
      stwDisplay = 'none';
      modalType = 'insert';
      selectRow = {};
      this.refs.table.cleanSelected();
      this.setState({
        insertModalVisible: false,
        stdDataSource: [],
        periodCondCount: 0,
        conditionDataSource: [],
        conditionCount: 0,
        page: 1,
      });
    });
  };

  saveFormRef = formRef => {
    this.formRef = formRef;
  };

  changeSearchText = event => {
    this.setState(
      {
        searchText: event.target.value,
      },
      () => {
        if (this.state.searchText.length < 3) {
          this.props.dispatch(getAlertList({}));
        }
        if (this.state.searchText.length >= 3) {
          this.props.dispatch(getAlertListWithFport({ fport: this.state.searchText }));
        }
      }
    );
  };

  hdlPageChg(pageNumber) {
    this.setState({ page: pageNumber }, () => {
      this.props.dispatch(getAlertList({ page: this.state.page }));
    });
  }

  onRowSelect(row, isSelected, e) {
    let rowId = this.state.clickRowId;
    let clickRow = selectRow;
    if (isSelected) {
      rowId = row.id;
      clickRow = row;
    } else {
      rowId = 'none';
      clickRow = {};
    }
    selectRow = clickRow;
    this.setState({
      clickRowId: rowId,
    });
  }

  tableFunc() {
    const { classes, alertInfo, alertListByFport } = this.props;
    const tableDataList = [];
    const bootTableHeadArr = [];
    const tableData = [];
    const alertList = alertInfo.alertList;
    const bootstrapTableProp = {
      selectRowProp: {
        mode: 'radio',
        bgColor: 'pink',
        clickToSelect: true,
        onSelect: this.onRowSelect,
      },
      search: true,
      options: {},
    };
    const CollectionCreateForm = Form.create()(
      // eslint-disable-next-line
      class extends React.Component {
        constructor(props) {
          super(props);
          this.conditionColumns = [];
          this.periodCondColums = {
            std: [],
            stw: [],
          };
          this.state = {
            visible: false,
            confirmLoading: false,
            conditionDataSource: [],
            stdDataSource: [],
            stwDataSource: [
              {
                sun: '0',
              },
            ],
            conditionCount: 0,
            periodCondCount: 0,
            // stdDisplay: 'none',
            // stwDisplay: 'none',
            indeterminate: true,
            ModalText: 'Content of the modal',
          };
          this.mounted = false;
        }

        conditionHandleAdd = () => {
          const { conditionCount } = this.state;
          const conditionDataSource = this.state.conditionDataSource.concat({
            key: conditionCount,
            field: '',
            value: '',
          });
          condFlag = true;
          this.setState({
            conditionDataSource,
            conditionCount: conditionCount + 1,
          });
        };

        conditionHandleDelete(idx) {
          const { conditionCount } = this.state;
          const conditionDataSource = this.state.conditionDataSource.concat();
          conditionDataSource.splice(idx, 1);
          if (conditionDataSource.length === 0) {
            condFlag = false;
          }
          this.setState({
            conditionDataSource,
            conditionCount: conditionCount - 1,
          });
        }

        periodCondHandleAdd = () => {
          const { periodCondCount } = this.state;
          let key = 0;
          const keys = [];
          periodCondFlag = true;
          if (this.state.stdDataSource.length !== 0) {
            for (let i = 0; i < this.state.stdDataSource.length; i += 1) {
              keys.push(this.state.stdDataSource[i].key);
            }
            for (let i = 0; i <= periodCondCount; i += 1) {
              if (!keys.includes(i)) {
                key = i;
              }
            }
          }

          const stdDataSource = this.state.stdDataSource.concat({
            key,
            year: '-1',
            month: '-1',
            date: '-1',
            hour: '-1',
            minute: '-1',
          });
          this.setState({
            stdDataSource,
            periodCondCount: periodCondCount + 1,
          });
        };

        periodCondHandleDelete(idx) {
          const { periodCondCount } = this.state;
          const stdDataSource = this.state.stdDataSource.concat();
          stdDataSource.splice(idx, 1);
          const keys = [];
          const index = [];
          if (stdDataSource.length !== 0) {
            for (let i = 0; i < stdDataSource.length; i += 1) {
              keys.push(stdDataSource[i].key);
              index.push(i);
            }
            for (let i = 0; i < stdDataSource.length; i += 1) {
              if (!keys.includes(i)) {
                for (let j = 0; j < stdDataSource.length; j += 1) {
                  if (!index.includes(stdDataSource[j].key)) {
                    stdDataSource[j].key = i;
                  }
                }
              }
            }
          }
          if (stdDataSource.length === 0) {
            periodCondFlag = false;
          }
          this.setState({
            stdDataSource,
            periodCondCount: periodCondCount - 1,
          });
        }

        changePeriodCondType = value => {
          periodCondTypes = value;
          if (value.includes('std')) {
            stdDisplay = 'inline';
          } else {
            stdDisplay = 'none';
          }
          if (value.includes('stw')) {
            stwDisplay = 'inline';
          } else {
            stwDisplay = 'none';
          }

          changeFlag = true;
        };

        changePeriod = e => {
          if (e.target.value === 'N') {
            periodCondDisable = 'none';
            stdDisplay = 'none';
            stwDisplay = 'none';
          } else {
            periodCondDisable = 'inline';
            if (periodCondTypes.includes('std')) {
              stdDisplay = 'inline';
            }
            if (periodCondTypes.includes('stw')) {
              stwDisplay = 'inline';
            }
          }
        };

        renderStdDateItems(item, index) {
          let stdDateDefault = {};
          const current = new Date();
          const year = [];
          const month = [];
          const date = [];
          const hour = [];
          const minute = [];
          for (let i = 0; i < 5; i += 1) {
            year.push(current.getFullYear() + i);
          }
          for (let i = 1; i <= 12; i += 1) {
            month.push(i);
          }
          for (let i = 1; i <= 31; i += 1) {
            date.push(i);
          }
          for (let i = 0; i < 24; i += 1) {
            if (i < 10) {
              hour.push('0' + i.toString());
            } else {
              hour.push(i.toString());
            }
          }
          for (let i = 0; i < 60; i += 15) {
            minute.push(i);
          }
          stdDateDefault = {
            year,
            month,
            date,
            hour,
            minute,
          };
          if (item === 'date') {
            return stdDateDefault[item]
              ? // eslint-disable-next-line
                stdDateDefault[item].map((data, idx) => {
                  let daysInMonth = 31;
                  if (this.state.stdDataSource[index].month === '2') {
                    daysInMonth = new Date(
                      this.state.stdDataSource[index].year,
                      this.state.stdDataSource[index].month,
                      0
                    ).getDate();
                  }
                  if (
                    this.state.stdDataSource[index].month === '4' ||
                    this.state.stdDataSource[index].month === '6' ||
                    this.state.stdDataSource[index].month === '9' ||
                    this.state.stdDataSource[index].month === '11'
                  ) {
                    daysInMonth = new Date(
                      this.state.stdDataSource[index].year,
                      this.state.stdDataSource[index].month,
                      0
                    ).getDate();
                  }
                  let days = parseInt(data);
                  if (days <= daysInMonth) {
                    return (
                      <Option key={idx} value={`${data}`}>
                        {data}
                      </Option>
                    );
                  }
                })
              : null;
          }
          return stdDateDefault[item]
            ? stdDateDefault[item].map((data, idx) => (
                <Option key={idx} value={`${data}`}>
                  {data}
                </Option>
              ))
            : null;
        }
        insertModalContext(modalItems, getFieldDecorator) {
          const activate = {
            on: true,
            off: false,
          };
          const formItemLayout = {
            labelCol: {
              span: 10,
            },
            wrapperCol: {
              span: 14,
            },
            style: { height: '1.5em', width: '28em' },
          };

          const modalContext = [];
          for (let i = 0; i < modalItems.length; i += 1) {
            if (['fport', 'macAddr', 'name', 'msg'].includes(modalItems[i])) {
              modalContext.push(
                <Col span={12}>
                  <Form.Item
                    {...formItemLayout}
                    label={<span style={{ fontSize: '1.2em' }}>{<FormattedMessage {...messages[modalItems[i]]} />}</span>}
                  >
                    {getFieldDecorator(modalItems[i], {
                      rules: [{ required: true, message: 'Please input ' + modalItems[i] }],
                      initialValue: modalType === 'edit' ? selectRow[modalItems[i]] : '',
                    })(<Input />)}
                  </Form.Item>
                </Col>
              );
            }
            if (modalItems[i] === 'activate') {
              modalContext.push(
                <Col span={12}>
                  <Form.Item
                    {...formItemLayout}
                    label={<span style={{ fontSize: '1.2em' }}>{<FormattedMessage {...messages[modalItems[i]]} />}</span>}
                  >
                    {getFieldDecorator(modalItems[i], {
                      initialValue: modalType === 'edit' ? selectRow[modalItems[i]] : true,
                    })(
                      <Radio.Group style={{ display: 'inline-flex' }}>
                        <Radio value={activate.on}>{<FormattedMessage {...messages.on} />}</Radio>
                        <Radio value={activate.off}>{<FormattedMessage {...messages.off} />}</Radio>
                      </Radio.Group>
                    )}
                  </Form.Item>
                </Col>
              );
            }
            if (modalItems[i] === 'period') {
              modalContext.push(
                <Col span={12}>
                  <Form.Item
                    {...formItemLayout}
                    label={<span style={{ fontSize: '1.2em' }}>{<FormattedMessage {...messages[modalItems[i]]} />}</span>}
                  >
                    {getFieldDecorator(modalItems[i], {
                      initialValue: modalType === 'edit' ? selectRow[modalItems[i]] : 'Y',
                    })(
                      <Radio.Group style={{ display: 'inline-flex' }} onChange={this.changePeriod}>
                        <Radio value="Y">{<FormattedMessage {...messages.yes} />}</Radio>
                        <Radio value="N">{<FormattedMessage {...messages.no} />}</Radio>
                      </Radio.Group>
                    )}
                  </Form.Item>
                </Col>
              );
            }
            if (modalItems[i] === 'condition') {
              const { conditionDataSource, conditionCount } = this.state;
              const pagination = false;
              if (
                Object.keys(selectRow).length !== 0 &&
                selectRow[modalItems[i]] !== undefined &&
                selectRow[modalItems[i]].length !== 0 &&
                modalType === 'edit' &&
                conditionDataSource.length === 0 &&
                condFlag === true
              ) {
                for (let j = 0; j < selectRow[modalItems[i]].length; j = j + 1) {
                  const condDataArr = [];
                  let key = conditionCount;
                  for (let k = 0; k < selectRow[modalItems[i]].length; k += 1) {
                    condDataArr.push({
                      key,
                      field: selectRow[modalItems[i]][k].field,
                      op: selectRow[modalItems[i]][k].op,
                      value: selectRow[modalItems[i]][k].val,
                      combine: selectRow[modalItems[i]][k].combine,
                    });
                    key += 1;
                  }
                  const condDatas = conditionDataSource.concat(condDataArr);
                  this.setState({
                    conditionDataSource: condDatas,
                    conditionCount: key,
                  });
                }
              }

              this.conditionColumns = [
                {
                  title: <FormattedMessage {...messages.conditionField} />,
                  width: '8em',
                  align: 'center',
                  dataIndex: 'field',
                  render: (value, row) => {
                    if (
                      conditionDataSource[row.key] !== undefined &&
                      conditionDataSource[row.key].field !== undefined &&
                      modalType === 'edit'
                    ) {
                      return (
                        <Form.Item>
                          {getFieldDecorator(`condition_field_${row.key}`, {
                            initialValue: conditionDataSource[row.key].field,
                          })(<Input />)}
                        </Form.Item>
                      );
                    }
                    return <Form.Item>{getFieldDecorator(`condition_field_${row.key}`, {})(<Input />)}</Form.Item>;
                  },
                },
                {
                  title: <FormattedMessage {...messages.conditionOp} />,
                  width: '4em',
                  align: 'center',
                  dataIndex: 'op',
                  render: (value, row) => {
                    if (
                      conditionDataSource[row.key] !== undefined &&
                      conditionDataSource[row.key].op !== undefined &&
                      modalType === 'edit'
                    ) {
                      return (
                        <Form.Item>
                          {getFieldDecorator(`condition_op_${row.key}`, {
                            initialValue: conditionDataSource[row.key].op,
                          })(
                            <Select style={{ width: '4em' }}>
                              <Option value=">">&#62;</Option>
                              <Option value="<">&#60;</Option>
                              <Option value="=">&#61;</Option>
                              <Option value="!=">&#33;&#61;</Option>
                              <Option value=">=">&#62;&#61;</Option>
                              <Option value="<=">&#60;&#61;</Option>
                            </Select>
                          )}
                        </Form.Item>
                      );
                    }
                    return (
                      <Form.Item>
                        {getFieldDecorator(`condition_op_${row.key}`, {})(
                          <Select style={{ width: '4em' }}>
                            <Option value=">">&#62;</Option>
                            <Option value="<">&#60;</Option>
                            <Option value="=">&#61;</Option>
                            <Option value="!=">&#33;&#61;</Option>
                            <Option value=">=">&#62;&#61;</Option>
                            <Option value="<=">&#60;&#61;</Option>
                          </Select>
                        )}
                      </Form.Item>
                    );
                  },
                },
                {
                  title: <FormattedMessage {...messages.conditionValue} />,
                  width: '8em',
                  align: 'center',
                  dataIndex: 'value',
                  render: (value, row) => {
                    if (
                      conditionDataSource[row.key] !== undefined &&
                      conditionDataSource[row.key].value !== undefined &&
                      modalType === 'edit'
                    ) {
                      return (
                        <Form.Item>
                          {getFieldDecorator(`condition_value_${row.key}`, {
                            initialValue: conditionDataSource[row.key].value,
                          })(<Input />)}
                        </Form.Item>
                      );
                    }
                    return <Form.Item>{getFieldDecorator(`condition_value_${row.key}`, {})(<Input />)}</Form.Item>;
                  },
                },
                {
                  title: <FormattedMessage {...messages.conditionCombined} />,
                  width: '8em',
                  align: 'center',
                  dataIndex: 'combine',
                  render: (value, row) => {
                    if (
                      conditionDataSource[row.key] !== undefined &&
                      conditionDataSource[row.key].combine !== undefined &&
                      modalType === 'edit'
                    ) {
                      return (
                        <Form.Item>
                          {getFieldDecorator(`condition_combine_${row.key}`, {
                            initialValue: conditionDataSource[row.key].combine,
                          })(
                            <Select style={{ width: '6em' }}>
                              <Option value="AND">AND</Option>
                              <Option value="OR">OR</Option>
                            </Select>
                          )}
                        </Form.Item>
                      );
                    }
                    return (
                      <Form.Item>
                        {getFieldDecorator(`condition_combine_${row.key}`, {})(
                          <Select style={{ width: '6em' }}>
                            <Option value="AND">AND</Option>
                            <Option value="OR">OR</Option>
                          </Select>
                        )}
                      </Form.Item>
                    );
                  },
                },
                {
                  title: (
                    <a onClick={this.conditionHandleAdd}>
                      <Icon type="plus" />
                    </a>
                  ),
                  key: 'action',
                  width: '1em',
                  align: 'center',
                  render: (value, item, idx) => (
                    <Popconfirm title="Sure to delete?" onConfirm={() => this.conditionHandleDelete(idx)}>
                      <a>
                        <Icon type="delete" />
                      </a>
                    </Popconfirm>
                  ),
                },
              ];
              modalContext.push(
                <Col span={24}>
                  <Form.Item
                    label={<span style={{ fontSize: '1.2em' }}>{<FormattedMessage {...messages[modalItems[i]]} />}</span>}
                  >
                    <Table bordered dataSource={conditionDataSource} columns={this.conditionColumns} pagination={pagination} />
                  </Form.Item>
                </Col>
              );
            }
            if (modalItems[i] === 'periodCondition') {
              const { stdDataSource, periodCondCount } = this.state;
              const pagination = false;
              const typeArr = [];
              const stwWeekDays = [];

              if (
                Object.keys(selectRow).length !== 0 &&
                selectRow[modalItems[i]] !== undefined &&
                selectRow[modalItems[i]].length !== 0 &&
                modalType === 'edit' &&
                changeFlag === false &&
                stdDataSource.length === 0 &&
                periodCondFlag === true
              ) {
                for (let j = 0; j < selectRow[modalItems[i]].length; j += 1) {
                  if (selectRow[modalItems[i]][j].type.includes('std')) {
                    stdDisplay = 'inline';
                    const stdDataArr = [];
                    let key = periodCondCount;
                    for (let k = 0; k < selectRow[modalItems[i]].length; k += 1) {
                      if (selectRow[modalItems[i]][k].type === 'std') {
                        stdDataArr.push({
                          key,
                          year: selectRow[modalItems[i]][k].year,
                          month: selectRow[modalItems[i]][k].month,
                          date: selectRow[modalItems[i]][k].date,
                          hour: selectRow[modalItems[i]][k].hour,
                          minute: selectRow[modalItems[i]][k].minute,
                        });
                        key += 1;
                      }
                    }
                    const stdDatas = stdDataSource.concat(stdDataArr);
                    this.setState({
                      stdDataSource: stdDatas,
                      periodCondCount: key,
                    });
                  }
                  if (selectRow[modalItems[i]][j].type === 'stw') {
                    stwDisplay = 'inline';
                  }
                }
              }
              if (stdDisplay === 'inline') {
                typeArr.push('std');
              }
              if (stwDisplay === 'inline') {
                typeArr.push('stw');
                if (selectRow.periodCondition !== undefined) {
                  for (let k = 0; k < selectRow.periodCondition.length; k += 1) {
                    if (selectRow.periodCondition[k].type === 'stw') {
                      for (const items in selectRow.periodCondition[k]) {
                        if (selectRow.periodCondition[k][items] === '-1') {
                          stwWeekDays.push(items);
                        }
                      }
                    }
                  }
                }
              }

              modalContext.push(
                <div style={{ display: periodCondDisable, width: '100%', margin: '4px' }}>
                  <Col span={24}>
                    <Form.Item
                      label={<span style={{ fontSize: '1.2em' }}>{<FormattedMessage {...messages[modalItems[i]]} />}</span>}
                    >
                      {getFieldDecorator('periodCondType', {
                        rules: [{ required: periodCondDisable === 'inline' ? true : false, message: 'Please select your type!' }],
                        initialValue: modalType === 'edit' ? typeArr : [],
                      })(
                        <Checkbox.Group
                          style={{ width: '100%', display: 'inline-flex', marginLeft: '2em' }}
                          onChange={this.changePeriodCondType}
                        >
                          <Checkbox style={{ display: 'inline-flex' }} value="std">
                            <span style={{ fontSize: '1.2em' }}>{<FormattedMessage {...messages.periodConditionStd} />}</span>
                          </Checkbox>
                          <Checkbox style={{ display: 'inline-flex' }} value="stw">
                            <span style={{ fontSize: '1.2em' }}>{<FormattedMessage {...messages.periodConditionStw} />}</span>
                          </Checkbox>
                        </Checkbox.Group>
                      )}
                    </Form.Item>
                  </Col>
                </div>
              );

              this.periodCondColums.std = [
                {
                  title: <FormattedMessage {...messages.periodConditionStdYear} />,
                  align: 'center',
                  dataIndex: 'year',
                  render: (text, row, index) => {
                    if (stdDataSource[row.key] !== undefined && stdDataSource[row.key].year !== undefined) {
                      return (
                        <Form.Item>
                          {getFieldDecorator(`year_${row.key}`, {
                            initialValue: stdDataSource[row.key].year,
                          })(
                            <Select
                              // style={{ width: '6em' }}
                              onChange={value => {
                                const dataSource = [...this.state.stdDataSource];
                                dataSource[index].year = value;
                                this.setState({ stdDataSource: dataSource });
                              }}
                            >
                              <Option value="-1">Every Year</Option>
                              {this.renderStdDateItems('year', index)}
                            </Select>
                          )}
                        </Form.Item>
                      );
                    }
                  },
                },
                {
                  title: <FormattedMessage {...messages.periodConditionStdMonth} />,
                  align: 'center',
                  dataIndex: 'month',
                  render: (text, row, index) => {
                    if (stdDataSource[row.key] !== undefined && stdDataSource[row.key].month !== undefined) {
                      return (
                        <Form.Item>
                          {getFieldDecorator(`month_${row.key}`, {
                            initialValue: stdDataSource[row.key].month,
                          })(
                            <Select
                              // style={{ width: '6em' }}
                              onChange={value => {
                                const dataSource = [...this.state.stdDataSource];
                                dataSource[index].month = value;
                                this.setState({ stdDataSource: dataSource });
                              }}
                            >
                              <Option value="-1">Every Month</Option>
                              {this.renderStdDateItems('month', index)}
                            </Select>
                          )}
                        </Form.Item>
                      );
                    }
                  },
                },
                {
                  title: <FormattedMessage {...messages.periodConditionStdDate} />,
                  align: 'center',
                  dataIndex: 'date',
                  render: (text, row, index) => {
                    if (stdDataSource[row.key] !== undefined && stdDataSource[row.key].date !== undefined) {
                      return (
                        <Form.Item>
                          {getFieldDecorator(`date_${row.key}`, {
                            initialValue: stdDataSource[row.key].date,
                          })(
                            <Select
                              // style={{ width: '6em' }}
                              onChange={value => {
                                const dataSource = [...this.state.stdDataSource];
                                dataSource[index].date = value;
                                this.setState({ stdDataSource: dataSource });
                              }}
                            >
                              <Option value="-1">Every Date</Option>
                              {this.renderStdDateItems('date', index)}
                            </Select>
                          )}
                        </Form.Item>
                      );
                    }
                  },
                },
                {
                  title: <FormattedMessage {...messages.periodConditionStdHour} />,
                  align: 'center',
                  dataIndex: 'hour',
                  render: (text, row, index) => {
                    if (stdDataSource[row.key] !== undefined && stdDataSource[row.key].hour !== undefined) {
                      return (
                        <Form.Item>
                          {getFieldDecorator(`hour_${row.key}`, {
                            initialValue: stdDataSource[row.key].hour,
                          })(
                            <Select
                            // style={{ width: '6em' }}
                            >
                              <Option value="-1">Every Hour</Option>
                              {this.renderStdDateItems('hour', index)}
                            </Select>
                          )}
                        </Form.Item>
                      );
                    }
                  },
                },
                {
                  title: <FormattedMessage {...messages.periodConditionStdMinute} />,
                  align: 'center',
                  dataIndex: 'minute',
                  render: (text, row, index) => {
                    if (stdDataSource[row.key] !== undefined && stdDataSource[row.key].minute !== undefined) {
                      return (
                        <Form.Item>
                          {getFieldDecorator(`minute_${row.key}`, {
                            initialValue: stdDataSource[row.key].minute,
                          })(
                            <Select
                            //style={{ width: '6em' }}
                            >
                              <Option value="-1">Every Minute</Option>
                              {this.renderStdDateItems('minute', index)}
                            </Select>
                          )}
                        </Form.Item>
                      );
                    }
                  },
                },
                {
                  title: (
                    <a onClick={this.periodCondHandleAdd}>
                      <Icon type="plus" />
                    </a>
                  ),
                  align: 'center',
                  key: 'action',
                  render: (value, item, idx) => (
                    <Popconfirm title="Sure to delete?" onConfirm={() => this.periodCondHandleDelete(idx)}>
                      <a>
                        <Icon type="delete" />
                      </a>
                    </Popconfirm>
                  ),
                },
              ];

              modalContext.push(
                <div style={{ display: stdDisplay }}>
                  <Form.Item>
                    <Table pagination={pagination} dataSource={stdDataSource} bordered columns={this.periodCondColums.std} />
                  </Form.Item>
                </div>
              );

              modalContext.push(
                <div style={{ display: stwDisplay, width: '100%', margin: '4px' }}>
                  <Form.Item>
                    {getFieldDecorator('check_date', {
                      initialValue: modalType === 'edit' ? stwWeekDays : [],
                    })(
                      <Checkbox.Group style={{ width: '100%' }}>
                        <Row>
                          <Col span={5}>
                            <Checkbox value="sun">{<FormattedMessage {...messages.periodConditionStwSun} />}</Checkbox>
                          </Col>
                          <Col span={5}>
                            <Checkbox value="mon">{<FormattedMessage {...messages.periodConditionStwMon} />}</Checkbox>
                          </Col>
                          <Col span={5}>
                            <Checkbox value="tue">{<FormattedMessage {...messages.periodConditionStwTue} />}</Checkbox>
                          </Col>
                          <Col span={5}>
                            <Checkbox value="wed">{<FormattedMessage {...messages.periodConditionStwWed} />}</Checkbox>
                          </Col>
                          <Col span={5}>
                            <Checkbox value="thu">{<FormattedMessage {...messages.periodConditionStwThu} />}</Checkbox>
                          </Col>
                          <Col span={5}>
                            <Checkbox value="fri">{<FormattedMessage {...messages.periodConditionStwFri} />}</Checkbox>
                          </Col>
                          <Col span={5}>
                            <Checkbox value="sat">{<FormattedMessage {...messages.periodConditionStwSat} />}</Checkbox>
                          </Col>
                        </Row>
                      </Checkbox.Group>
                    )}
                  </Form.Item>
                </div>
              );
            }
          }
          return (
            <Form layout="vertical">
              <Row gutter={16}>{modalContext}</Row>
            </Form>
          );
        }

        render() {
          const { visible, onCancel, onCreate, form, modalItems } = this.props;
          const { getFieldDecorator } = form;
          return (
            <Modal
              visible={visible}
              // contentStyle={{
              //   borderRadius: '10px',
              //   overflow: 'auto',
              //   textAlign: 'left',
              // }}
              width={1000}
              // style={{ zIndex: '1500', position: 'relative', margin: '0px auto', marginTop: '-1em' }}
              title={
                modalType === 'insert' ? (
                  <span style={{ fontSize: '2em' }}>
                    <FormattedMessage {...messages.addAlertRule} />
                  </span>
                ) : (
                  <span style={{ fontSize: '2em' }}>
                    <FormattedMessage {...messages.editAlertRule} />
                  </span>
                )
              }
              okText={<FormattedMessage {...messages.confirm} />}
              cancelText={<FormattedMessage {...messages.cancel} />}
              onCancel={onCancel}
              onOk={onCreate}
            >
              {this.insertModalContext(modalItems, getFieldDecorator)}
            </Modal>
          );
        }
      }
    );

    for (let i = 0; i < Object.keys(alertList).length; i += 1) {
      tableData[i] = {
        id: alertList[i]._id,
        macAddr: alertList[i].macAddr,
        fport: alertList[i].fport,
        name: alertList[i].name,
        activate: alertList[i].activate,
        msg: alertList[i].msg,
        period: alertList[i].period,
        periodCondition: alertList[i].periodCondition,
        createTime: alertList[i].createTime,
        updateTime: alertList[i].updateTime === undefined ? 'NA' : alertList[i].updateTime,
        condition: alertList[i].condition,
      };
      const alertItems = Object.keys(tableData[i]);
      for (let j = 0; j < alertItems.length; j += 1) {
        if (!bootTableHeadArr.includes(alertItems[j])) {
          bootTableHeadArr.push(alertItems[j]);
        }
      }
    }

    tableDataList.push(
      <Paper style={{ border: '1px solid #ced4da', backgroundColor: '#FAFAFA' }}>
        <div style={{ padding: '0' }}>
          <CollectionCreateForm
            wrappedComponentRef={this.saveFormRef}
            visible={this.state.insertModalVisible}
            onCancel={this.handleCancel}
            onCreate={this.handleCreate}
            modalItems={bootTableHeadArr}
            selectRow={selectRow}
            modalType={modalType}
          />
        </div>
        <div style={{ padding: '0' }}>
          <Button
            type="primary"
            icon="plus"
            style={{ margin: '4px', color: '#fff', backgroundColor: '#31b0d5', borderColor: '#1b6d85', borderRadius: '8px' }}
            onClick={this.addAlert}
          >
            {<FormattedMessage {...messages.addAlertButton} />}
          </Button>
          <Button
            type="primary"
            icon="edit"
            style={{ margin: '4px', color: '#fff', backgroundColor: '#5cb85c', borderColor: '#4cae4c', borderRadius: '8px' }}
            onClick={this.editAlert}
          >
            {<FormattedMessage {...messages.editAlertButton} />}
          </Button>
          <Button
            type="primary"
            icon="delete"
            style={{ margin: '4px', color: '#fff', backgroundColor: '#f0ad4e', borderColor: '#eea236', borderRadius: '8px' }}
            onClick={this.deleteAlert}
          >
            {<FormattedMessage {...messages.delAlertButton} />}
          </Button>
          <div
            style={{
              margin: '4px',
              width: '240px',
              // height: ''
              borderRadius: '8px',
              marginRight: '0%',
              display: 'inline',
              borderStyle: 'solid',
              float: 'right',
              borderWidth: '4px',
              borderColor: '#DDDDDD',
            }}
          >
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
              // style={{ fontSize: '20px', padding: '0' }}
              value={this.state.searchText}
              onChange={this.changeSearchText}
              // placeholder={placeholder.concat(' ...')}
            />
          </div>
        </div>
        <BootstrapTable
          data={tableData}
          selectRow={bootstrapTableProp.selectRowProp}
          options={bootstrapTableProp.options}
          ref="table"
          striped
          hover
          condensed
        >
          {this.renderHeaderDataBoot(bootTableHeadArr)}
        </BootstrapTable>
        <Card style={{ display: 'flex', justifyContent: 'center' }}>
          <Pagination
            activePage={this.state.page}
            totalItemsCount={alertInfo.alertListTotal}
            pageRangeDisplayed={5}
            itemsCountPerPage={10}
            onChange={this.hdlPageChg}
          />
          <div style={{ display: 'flex', marginTop: 27, marginLeft: 15 }}>
            {<FormattedMessage {...messages.total} />}
            &nbsp;
            {alertInfo.alertListTotal}
            &nbsp;
            {<FormattedMessage {...messages.count} />}
          </div>
        </Card>
      </Paper>
    );
    return { tableDataList };
  }

  renderHeaderDataBoot(column) {
    const TableHeaderColumnArr = [];
    if (column.length === 0) {
      column = [
        'id',
        'macAddr',
        'fport',
        'name',
        'activate',
        'msg',
        'period',
        'periodCondition',
        'createTime',
        'updateTime',
        'condition',
      ];
    }
    for (let i = 0; i < column.length; i += 1) {
      if (i === 0) {
        TableHeaderColumnArr.push(
          <TableHeaderColumnBoot isKey hidden hiddenOnInsert dataField={column[i]} searchable={false} key={Math.random()}>
            {<FormattedMessage {...messages[column[i]]} />}
          </TableHeaderColumnBoot>
        );
      } else {
        let searchable = false;
        let hidden = false;
        if (column[i] === 'fport') {
          searchable = true;
        }
        if (['condition', 'msg', 'periodCondition'].includes(column[i])) {
          hidden = true;
        }
        TableHeaderColumnArr.push(
          <TableHeaderColumnBoot dataField={column[i]} searchable={searchable} hidden={hidden} key={Math.random()}>
            {<FormattedMessage {...messages[column[i]]} />}
          </TableHeaderColumnBoot>
        );
      }
    }
    return TableHeaderColumnArr;
  }

  render() {
    const { classes, menuOpen, fportList, alertInfo } = this.props;
    const { insertModalVisible, page } = this.state;
    const alertList = alertInfo.alertList;

    return (
      <div>
        <Helmet>
          <title>AlertPage</title>
          <meta name="description" content="Description of AlertPage" />
        </Helmet>
        <Card>
          {alertInfo.size === 0 && (
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
          )}
          {alertInfo.size !== 0 && (
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Hidden smDown>
                  <div
                    style={{
                      color: 'black',
                      fontSize: '2em',
                      fontWeight: 800,
                      margin: '0.5em',
                    }}
                  >
                    {/* {formattedMessage}
                    资料清单 */}
                  </div>
                </Hidden>
                <div
                  style={{
                    color: 'black',
                    fontSize: '2em',
                    fontWeight: 800,
                    margin: '1em',
                  }}
                />
              </div>
              {this.tableFunc().tableDataList}
            </div>
          )}
        </Card>
      </div>
    );
  }
}

AlertPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
  menuOpen: PropTypes.bool,
  classes: PropTypes.object.isRequired,
  // intl: intlShape.isRequired,
  alertList: PropTypes.object,
  fportList: PropTypes.array,
  history: PropTypes.object,
  location: PropTypes.object,
  searchfportFromDb: PropTypes.string,
  searchMACFromDb: PropTypes.string,
};

const mapStateToProps = createStructuredSelector({
  alertpage: makeSelectAlertPage(),
  menuOpen: SelectMenuOpened(),
  fportList: SelectFportList(),
  alertInfo: SelectAlertList(),
  alertListByFport: SelectAlertListByFport(),
  errMsg: SelectErrMsg(),
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

const withReducer = injectReducer({ key: 'alertPage', reducer });
const withSaga = injectSaga({ key: 'alertPage', saga });

const styles = theme => ({
  textField: {
    marginTop: '0.5em',
    width: 250,
    fontWeight: 800,
    fontSize: 50,
  },
  inputProp: {
    fontSize: 50,
  },
  resize: {
    fontSize: 18,
  },
  settingButton: {
    marginTop: 10,
    marginBottom: -10,
    marginRight: 20,
    backgroundColor: '#00BCD4',
    '&:hover': {
      backgroundColor: '#B2EBF2',
    },
  },
  settingButtonClr: {
    marginTop: 10,
    marginBottom: -10,
    marginRight: 20,
  },
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
  tabsIndicator: {
    backgroundColor: '#1890ff',
    height: 5,
  },
  tabRoot: {
    textTransform: 'initial',
    // minWidth: 72,
    fontWeight: theme.typography.fontWeightRegular,
    // marginRight: theme.spacing.unit * 4,
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:hover': {
      color: '#40a9ff',
      opacity: 1,
    },
    // '&$tabSelected': {
    //   color: '#1890ff',
    //   fontWeight: theme.typography.fontWeightMedium,
    // },
    '&:focus': {
      color: '#40a9ff',
    },
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
)(AlertPage);
