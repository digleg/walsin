/**
 *
 * EventPage
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
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';

// material-ui
import { TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import FontIcon from 'material-ui/FontIcon';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';

// @material-ui
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import Hidden from '@material-ui/core/Hidden';
import withWidth from '@material-ui/core/withWidth';
import CircularProgress from '@material-ui/core/CircularProgress';

// @material-ui icon
import SettingIcon from '@material-ui/icons/Settings';
import ExportIcon from '@material-ui/icons/Undo';
import ClearIcon from '@material-ui/icons/Clear';
import RefreshIcon from '@material-ui/icons/Refresh';

// material-ui-next
import Tooltip from 'material-ui-next/Tooltip';
import Snackbar from 'material-ui-next/Snackbar';
import CloseIcon from 'material-ui-icons/Close';

// pagination
import Pagination from 'react-js-pagination';

// bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';

// bootstrap table
import { BootstrapTable, TableHeaderColumn as TableHeaderColumnBoot } from 'react-bootstrap-table';
import 'react-bootstrap-table/dist/react-bootstrap-table.min.css';
import 'react-bootstrap-table/dist/react-bootstrap-table.min';
import { Cascader, Input, Select, Row, Col, DatePicker, Modal, Button, TimePicker } from 'antd';
import moment from 'moment';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { SelectMenuOpened, SelectSendingReqL } from '../App/selectors';
import { makeSelectEventPage, SelectEventList, SelectSenListByfport, SelectErrMsg, SelectFportList } from './selectors';
import reducer from './reducer';
import saga from './saga';
import { getEventList, getSensorListByfport, getReportList, errMsg as errMsgAction } from './actions';
import messages from './messages';

// antd
const Option = Select.Option;
const Search = Input.Search;
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;

// flag
let chgTab = 0;

export class EventPage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tabValue: 0,
      selectedRows: [],
      pagi: [1],
      selectValue: null,
      // time
      timePickerEnable: false,
      stanToday: '',
      dateFrom: '',
      dateTo: '',
      dateFromD: '',
      dateFromT: '',
      dateToD: '',
      dateToT: '',
      // export
      fileName: '',
      dateFromEx: '',
      dateToEx: '',
      dateFromExD: '',
      dateFromExT: '',
      dateToExD: '',
      dateToExT: '',
      // dialog
      exportDia: false,
      // search field
      selectFieldValue: null,
      selectFieldValueType: null,
      selectFieldTypeRule: null,
      selectSeachValue: '',
      selectSearchMsg: undefined,

      // srhselectfield
      srhKey: null,
      limit: 15,
      autoFocus: false,

      // time-date picker
      date: new Date(),

      // antd modal
      settingVisible: false,
      settingVisibleExport: false,
    };
    this.hdlPageChg = this.hdlPageChg.bind(this);
    this.mounted = false;
    // time picker bind
    this.handleApply = this.handleApply.bind(this);
  }

  componentDidMount() {
    // setInterval(() => {
    const { tabValue } = this.state;
    this.props.dispatch(getEventList({ limit: this.state.limit, tabValue: 0 }));
    this.props.dispatch(getSensorListByfport({ tabValue }));
    // }, 10000);
    // document.addEventListener('keydown', this.onKeyPressed.bind(this));
    this.mounted = true;
    // reset chgTab for dashboard
    chgTab = 0;
  }

  componentWillReceiveProps(e) {
    const { fportList } = this.props;
    const { searchfportFromDb, searchMACFromDb } = this.props.history.location;
    const { pagi, tabValue, selectSearchMsg } = this.state;
    const handleChange = value => {
      if (value === '') {
        this.setState({ srhKey: null, selectSearchMsg, selectValue: '' });
        this.props.dispatch(getEventList({ limit: this.state.limit, macAddr: '', pagi, tabValue, search: selectSearchMsg }));
      } else {
        setTimeout(() => {
          this.setState({ srhKey: value, selectSearchMsg, selectValue: value });
          this.props.dispatch(getEventList({ limit: this.state.limit, macAddr: value, pagi, tabValue, search: selectSearchMsg }));
        }, 100);
      }
    };

    if (fportList !== null && chgTab === 0 && searchfportFromDb !== undefined && searchMACFromDb !== undefined) {
      let indexFlag;
      for (let i = 0; i < fportList.length; i += 1) {
        if (fportList[i] === searchfportFromDb) {
          indexFlag = i;
          break;
        }
      }
      this.hdlTabChg(e, indexFlag);
      handleChange(searchMACFromDb);
      // searchMACFromDb srhKey
      chgTab = 1;
    }
  }

  componentWillUnmount() {
    // document.removeEventListener('keydown', this.onKeyPressed.bind(this));
    this.mounted = false;
  }

  onKeyPressed(e) {
    const { eventList } = this.props;
    const { tabValue } = this.state;
    if (e.keyCode === 37 && tabValue > 0) {
      this.hdlTabChg(e, tabValue - 1);
    } else if (e.keyCode === 39 && tabValue < Object.keys(eventList).length - 1) {
      this.hdlTabChg(e, tabValue + 1);
    }
  }

  getStripedStyle(index) {
    return { backgroundImage: index % 2 ? '#FFFFFF' : 'linear-gradient(#E1F5FE, #E0F7FA)' };
  }

  // time picker
  handleApply(event, picker) {
    this.setState({
      startDate: picker.startDate,
      endDate: picker.endDate,
    });
  }

  tabFunc() {
    const { classes, intl, eventList } = this.props;
    const { tabValue, pagi } = this.state;
    const tabsList = [];
    const tabDataList = [];
    for (let i = 0; i < Object.keys(eventList).length; i += 1) {
      const evtType = Object.keys(eventList)[i];
      const evtResp = Object.values(eventList);
      const bootTableHeadArr = [];
      for (let j = 0; j < evtResp[tabValue].showField.length; j += 1) {
        bootTableHeadArr.push(evtResp[tabValue].showField[j].name);
      }
      const tagTableData = [];
      if (eventList[evtType] !== null) {
        for (let k = 0; k < eventList[evtType].data.length; k += 1) {
          const prodObj = {};
          for (let l = 0; l < bootTableHeadArr.length; l += 1) {
            let itemValue = eventList[evtType].data[k];
            for (let m = 0; m < bootTableHeadArr[l].split('.').length; m += 1) {
              if (itemValue[bootTableHeadArr[l].split('.')[m]] !== undefined) {
                itemValue = itemValue[bootTableHeadArr[l].split('.')[m]];
              } else {
                const formattedMessage = intl.formatMessage({ id: 'MERC.containers.TagPage.NA' });
                itemValue = formattedMessage;
              }
            }
            prodObj[bootTableHeadArr[l]] = itemValue;
          }
          tagTableData.push(prodObj);
        }
      }

      const formattedMessageString = 'MERC.containers.EventPage.'.concat(evtType);
      const formattedMessage = intl.formatMessage({ id: formattedMessageString });

      tabsList.push(
        <Tab
          value={i}
          icon={<FontIcon className="material-icons">{evtResp[i].icon}</FontIcon>}
          label={formattedMessage}
          key={Math.random()}
          classes={{ root: classes.tabRoot }}
        />
      );

      tabDataList.push(
        tabValue === i && (
          <TabContainer style={{ margin: 0, padding: 0 }} key={Math.random()}>
            <Paper style={{ border: '1px solid #ced4da', backgroundColor: '#FAFAFA' }}>
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
                >
                  {''}
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>{this.searchbarFunc()}</div>
              </div>
              <BootstrapTable data={tagTableData} striped hover>
                {this.renderHeaderDataBoot(bootTableHeadArr)}
              </BootstrapTable>
              <Card style={{ display: 'flex', justifyContent: 'center' }}>
                <Pagination
                  activePage={pagi[tabValue]}
                  totalItemsCount={evtResp[tabValue].total}
                  pageRangeDisplayed={5}
                  itemsCountPerPage={15}
                  onChange={this.hdlPageChg}
                />
                <div style={{ display: 'flex', marginTop: 27, marginLeft: 15 }}>
                  {<FormattedMessage {...messages.total} />}
                  &nbsp;
                  {evtResp[tabValue].total}
                  &nbsp;
                  {<FormattedMessage {...messages.count} />}
                </div>
              </Card>
            </Paper>
          </TabContainer>
        )
      );
    }
    return { tabsList, tabDataList };
  }

  hdlTabChg = (e, tabValue) => {
    const { pagi, dateFrom, dateTo } = this.state;
    setTimeout(() => {
      if (!this.mounted) return;
      this.setState(() => ({
        tabValue,
        selectValue: null,
        selectFieldValue: null,
        selectFieldValueType: null,
        selectFieldTypeRule: null,
        selectSeachValue: '',
        selectSearchMsg: undefined,
        srhKey: null,
        autoFocus: false,
      }));
      this.props.dispatch(getSensorListByfport({ tabValue }));
      this.props.dispatch(getEventList({ limit: this.state.limit, macAddr: null, pagi, date: [dateFrom, dateTo], tabValue }));
    }, 100);
  };

  hdlPageChg(pageNumber) {
    const { eventList } = this.props;
    const { tabValue, selectValue, dateFrom, dateTo, selectSearchMsg } = this.state;
    const pagi = [];
    for (let i = 0; i < Object.keys(eventList).length; i += 1) {
      if (i === tabValue) {
        pagi.push(pageNumber);
      } else pagi.push(1);
    }
    this.setState({ pagi });
    this.props.dispatch(
      getEventList({
        limit: this.state.limit,
        macAddr: selectValue,
        pagi,
        date: [dateFrom, dateTo],
        tabValue,
        search: selectSearchMsg,
      })
    );
  }

  searchbarFunc() {
    const { intl, senListByfport, eventList, fportList, classes } = this.props;
    const { selectValue, pagi, timePickerEnable, dateFrom, dateTo, selectSearchMsg, tabValue } = this.state;
    const { selectFieldValue, selectFieldValueType, selectFieldTypeRule, selectSeachValue } = this.state;
    const { srhKey } = this.state;
    const currSrchInIntl = intl.formatMessage({ id: 'MERC.containers.EventPage.currSearchInterval' });
    const toIntl = intl.formatMessage({ id: 'MERC.containers.EventPage.to' });
    // const clrSrhIntervalIntl = intl.formatMessage({ id: 'MERC.containers.EventPage.clrSrhInterval' });
    const setSrhIntervalIntl = intl.formatMessage({ id: 'MERC.containers.EventPage.setSrhInterval' });
    const exportReportIntl = intl.formatMessage({ id: 'MERC.containers.EventPage.exportReport' });
    const srhBySensorIntl = intl.formatMessage({ id: 'MERC.containers.EventPage.srhBySensor' });
    const operatorChooseIntl = intl.formatMessage({ id: 'MERC.containers.EventPage.operatorChoose' });
    const enterValueIntl = intl.formatMessage({ id: 'MERC.containers.EventPage.enterValue' });
    const clearSearchIntl = intl.formatMessage({ id: 'MERC.containers.EventPage.clearSearch' });
    const refreshIntl = intl.formatMessage({ id: 'MERC.containers.EventPage.refresh' });

    const optionsSrhField = [];
    for (let i = 0; i < Object.values(eventList)[tabValue].searchField.length; i += 1) {
      const formattedMessageString = 'MERC.containers.EventPage.'.concat(Object.values(eventList)[tabValue].searchField[i].name);
      const formattedMessage = intl.formatMessage({ id: formattedMessageString });
      const child = [];
      if (Object.values(eventList)[tabValue].searchField[i].type === 'str') {
        child.push(
          {
            value: '=',
            label: intl.formatMessage({ id: 'MERC.containers.EventPage.equal' }),
            type: 'str',
          },
          {
            value: '!=',
            label: intl.formatMessage({ id: 'MERC.containers.EventPage.notEqual' }),
            type: 'str',
          }
        );
      } else if (Object.values(eventList)[tabValue].searchField[i].type === 'int') {
        child.push(
          {
            value: '=',
            label: intl.formatMessage({ id: 'MERC.containers.EventPage.equal' }),
            type: 'int',
          },
          {
            value: '!=',
            label: intl.formatMessage({ id: 'MERC.containers.EventPage.notEqual' }),
            type: 'int',
          },
          {
            value: '>',
            label: intl.formatMessage({ id: 'MERC.containers.EventPage.moreThan' }),
            type: 'int',
          },
          {
            value: '<',
            label: intl.formatMessage({ id: 'MERC.containers.EventPage.lessThan' }),
            type: 'int',
          },
          {
            value: '>=',
            label: intl.formatMessage({ id: 'MERC.containers.EventPage.moreThanEqual' }),
            type: 'int',
          },
          {
            value: '<=',
            label: intl.formatMessage({ id: 'MERC.containers.EventPage.lessThanEqual' }),
            type: 'int',
          }
        );
      }

      optionsSrhField.push({
        value: Object.values(eventList)[tabValue].searchField[i].name,
        label: formattedMessage,
        children: child,
      });
    }

    const hdlChgSrch = value => {
      if (value === '') {
        this.setState({ srhKey: null, selectSearchMsg, selectValue: value });
        this.props.dispatch(getEventList({ limit: this.state.limit, macAddr: '', pagi, tabValue, search: selectSearchMsg }));
      } else {
        this.setState({ srhKey: value, selectSearchMsg, selectValue: value });
        this.props.dispatch(getEventList({ limit: this.state.limit, macAddr: value, pagi, tabValue, search: selectSearchMsg }));
      }
    };

    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {timePickerEnable ? (
          <Tooltip
            id="clrTimePicker"
            title={currSrchInIntl
              .concat(' : ')
              .concat(dateFrom)
              .concat(toIntl)
              .concat(dateTo)
              .replace('T', ' ')
              .replace('T', ' ')}
            placement="bottom"
            classes={{ tooltip: classes.tooltipCus }}
          >
            <IconButton
              color="secondary"
              // className={classes.settingButtonClr}
              onClick={() => {
                this.setState({ timePickerEnable: false });
                this.props.dispatch(
                  getEventList({ limit: this.state.limit, macAddr: selectValue, pagi, tabValue, search: selectSearchMsg })
                );
              }}
            >
              <SettingIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip id="setSrhIntervalIntl" title={setSrhIntervalIntl} placement="bottom" classes={{ tooltip: classes.tooltipCus }}>
            <IconButton
              color="primary"
              onClick={() => {
                this.setState({ settingVisible: true });
              }}
            >
              <SettingIcon />
            </IconButton>
          </Tooltip>
        )}
        <Tooltip id="Export" title={exportReportIntl} placement="bottom" classes={{ tooltip: classes.tooltipCus }}>
          <IconButton
            color="primary"
            // className={classes.settingButton}
            onClick={() => {
              // const today = new Date().toISOString();
              // const tmp = today.split(':')[0];
              // const todayAftAdd8toString = (Number(tmp.split('T')[1]) + 8).toString();
              // const stanToday = tmp
              //   .split('T')[0]
              //   .concat('T')
              //   .concat(todayAftAdd8toString)
              //   .concat(':')
              //   .concat(today.split(':')[1]);
              // this.setState({ exportDia: true, stanToday, dateFromEx: stanToday, dateToEx: stanToday });
              this.setState({ settingVisibleExport: true });
            }}
          >
            <ExportIcon />
          </IconButton>
        </Tooltip>
        <Tooltip id="Refresh" title={refreshIntl} placement="bottom" classes={{ tooltip: classes.tooltipCus }}>
          <IconButton
            color="primary"
            onClick={() => {
              this.props.dispatch(
                getEventList({ limit: this.state.limit, macAddr: selectValue, pagi, date: [dateFrom, dateTo], tabValue })
              );
            }}
          >
            <RefreshIcon />
          </IconButton>
        </Tooltip>
        <Row>
          <Col span={9}>
            <Select
              style={{ width: '13em' }}
              onChange={hdlChgSrch}
              placeholder={srhBySensorIntl}
              value={srhKey === null ? undefined : srhKey}
            >
              {senListByfport.length === 0 && (
                <Option disabled key={Math.random()}>
                  {<FormattedMessage {...messages.findNoEvent} />}
                </Option>
              )}
              {senListByfport.length !== 0 && [
                <Option value="" key={Math.random()}>
                  {<FormattedMessage {...messages.clrSrhCondition} />}
                </Option>,
                senListByfport.map(item => (
                  <Option value={item.device_mac} key={Math.random()}>
                    {item.device_name}
                  </Option>
                )),
              ]}
            </Select>
          </Col>
          {/* search by sensor selectfield end */}
          <Col span={7}>
            <Cascader
              style={{ width: '10em' }}
              options={optionsSrhField}
              value={selectFieldValue === null ? null : [selectFieldValue, selectFieldTypeRule]}
              onChange={(value, options) => {
                this.setState({
                  selectFieldValue: value[0],
                  selectFieldTypeRule: value[1],
                  selectFieldValueType: options[1] !== undefined ? options[1].type : undefined,
                });
              }}
              placeholder={operatorChooseIntl}
              expandTrigger="hover"
            />
          </Col>
          <Col span={8}>
            <Search
              style={{ width: '10em', marginRight: '1em' }}
              autoFocus={this.state.autoFocus}
              placeholder={enterValueIntl}
              value={selectSeachValue}
              onChange={e => {
                this.setState({ selectSeachValue: e.target.value, autoFocus: true });
              }}
              onPressEnter={value => {
                this.hdlPageChg(1);
                let searchInfo;
                if (selectFieldValueType === 'str') {
                  searchInfo = selectFieldValue
                    .concat(':')
                    .concat(selectFieldTypeRule)
                    .concat(':')
                    .concat('"')
                    .concat(value)
                    .concat('"');
                } else if (selectFieldValueType === 'int') {
                  searchInfo = selectFieldValue
                    .concat(':')
                    .concat(selectFieldTypeRule)
                    .concat(':')
                    .concat(value);
                }
                this.setState({ selectSearchMsg: searchInfo, selectSeachValue: value, autoFocus: false });
                this.props.dispatch(
                  getEventList({
                    limit: this.state.limit,
                    macAddr: selectValue,
                    pagi,
                    date: [dateFrom, dateTo],
                    tabValue,
                    search: searchInfo,
                    fport: fportList[tabValue],
                  })
                );
              }}
              onSearch={value => {
                this.hdlPageChg(1);
                let searchInfo;
                if (selectFieldValueType === 'str') {
                  searchInfo = selectFieldValue
                    .concat(':')
                    .concat(selectFieldTypeRule)
                    .concat(':')
                    .concat('"')
                    .concat(value)
                    .concat('"');
                } else if (selectFieldValueType === 'int') {
                  searchInfo = selectFieldValue
                    .concat(':')
                    .concat(selectFieldTypeRule)
                    .concat(':')
                    .concat(value);
                }
                this.setState({ selectSearchMsg: searchInfo, selectSeachValue: value, autoFocus: false });
                this.props.dispatch(
                  getEventList({
                    limit: this.state.limit,
                    macAddr: selectValue,
                    pagi,
                    date: [dateFrom, dateTo],
                    tabValue,
                    search: searchInfo,
                    fport: fportList[tabValue],
                  })
                );
              }}
            />
          </Col>
        </Row>
        <Tooltip id="Clear" title={clearSearchIntl} placement="bottom" classes={{ tooltip: classes.tooltipCus }}>
          <IconButton
            color="primary"
            style={{ marginLeft: '-1em' }}
            onClick={() => {
              this.setState({ selectSeachValue: '', autoFocus: false, selectFieldValue: null, srhKey: null });
              this.setState({ timePickerEnable: false, dateFrom: '', dateTo: '' });
              this.props.dispatch(
                getEventList({
                  limit: this.state.limit,
                  macAddr: '',
                  pagi,
                  // date: [dateFrom, dateTo],
                  tabValue,
                })
              );
            }}
          >
            <ClearIcon />
          </IconButton>
        </Tooltip>
      </div>
    );
  }

  dialogFunc() {
    const { intl } = this.props;
    const { selectValue, pagi, tabValue } = this.state;
    const startDate = intl.formatMessage({ id: 'MERC.containers.EventPage.startDate' });
    const endDate = intl.formatMessage({ id: 'MERC.containers.EventPage.endDate' });
    const startTime = intl.formatMessage({ id: 'MERC.containers.EventPage.startTime' });
    const endTime = intl.formatMessage({ id: 'MERC.containers.EventPage.endTime' });

    const antdTimePickerFunc = () => {
      return (
        <Grid container alignItems="center" justify="center" direction="row">
          <Grid item xs={10} sm={7} md={5} lg={5} xl={5}>
            <DatePicker
              style={{ marginBottom: '0.5em' }}
              placeholder={startDate}
              onChange={(date, dateString) => {
                this.setState({ dateFromD: dateString });
              }}
            />
            <TimePicker
              onChange={(time, timeString) => {
                this.setState({ dateFromT: timeString });
              }}
              placeholder={startTime}
              defaultOpenValue={moment('00:00:00', 'HH:mm:ss')}
            />
          </Grid>
          <Grid item xs={1} sm={1} md={1} lg={1} xl={1}>
            ~
          </Grid>
          <Grid item xs={10} sm={7} md={5} lg={5} xl={5}>
            <DatePicker
              style={{ marginBottom: '0.5em' }}
              placeholder={endDate}
              onChange={(date, dateString) => {
                this.setState({ dateToD: dateString });
              }}
            />
            <TimePicker
              onChange={(time, timeString) => {
                this.setState({ dateToT: timeString });
              }}
              placeholder={endTime}
              defaultOpenValue={moment('00:00:00', 'HH:mm:ss')}
            />
          </Grid>
        </Grid>
      );
    };

    const antdTimePickerExportFunc = () => {
      const reportName = intl.formatMessage({ id: 'MERC.containers.EventPage.reportName' });
      return (
        <Grid container justify="center">
          <Grid item xs={10} sm={7} md={5} lg={5} xl={5}>
            <Input
              style={{ marginBottom: '0.5em', marginLeft: '-1.35em' }}
              placeholder={reportName}
              onChange={e => {
                this.setState({ fileName: e.target.value });
              }}
            />
          </Grid>
          <Grid item xs={10} sm={7} md={5} lg={5} xl={5} />
          <Grid item xs={10} sm={7} md={5} lg={5} xl={5}>
            <DatePicker
              style={{ marginBottom: '0.5em' }}
              placeholder={startDate}
              onChange={(date, dateString) => {
                this.setState({ dateFromExD: dateString });
              }}
            />
            <TimePicker
              onChange={(time, timeString) => {
                this.setState({ dateFromExT: timeString });
              }}
              placeholder={startTime}
              defaultOpenValue={moment('00:00:00', 'HH:mm:ss')}
            />
          </Grid>
          <Grid item xs={1} sm={1} md={1} lg={1} xl={1}>
            ~
          </Grid>
          <Grid item xs={10} sm={7} md={5} lg={5} xl={5}>
            <DatePicker
              style={{ marginBottom: '0.5em' }}
              placeholder={endDate}
              onChange={(date, dateString) => {
                this.setState({ dateToExD: dateString });
              }}
            />
            <TimePicker
              onChange={(time, timeString) => {
                this.setState({ dateToExT: timeString });
              }}
              placeholder={endTime}
              defaultOpenValue={moment('00:00:00', 'HH:mm:ss')}
            />
          </Grid>
        </Grid>
      );
    };

    const exportReportIntl = intl.formatMessage({ id: 'MERC.containers.EventPage.exportReport' });
    const timePickerIntl = intl.formatMessage({ id: 'MERC.containers.EventPage.timePicker' });
    const { settingVisible, settingVisibleExport } = this.state;

    return (
      <Modal
        title={(settingVisible && timePickerIntl) || (settingVisibleExport && exportReportIntl)}
        visible={settingVisible || settingVisibleExport}
        okText={<FormattedMessage {...messages.confirm} />}
        cancelText={<FormattedMessage {...messages.cancel} />}
        onOk={() => {
          if (settingVisible) {
            const { dateFromD, dateFromT, dateToD, dateToT } = this.state;
            this.setState({
              settingVisible: false,
              dateFrom: dateFromD.concat('T', dateFromT),
              dateTo: dateToD.concat('T', dateToT),
            });
            this.props.dispatch(
              getEventList({
                limit: this.state.limit,
                macAddr: selectValue,
                pagi,
                date: [dateFromD.concat('T', dateFromT), dateToD.concat('T', dateToT)],
                tabValue,
              })
            );
          } else if (settingVisibleExport) {
            const { dateFromExD, dateFromExT, dateToExD, dateToExT, fileName } = this.state;
            this.setState({
              settingVisibleExport: false,
              dateFromEx: dateFromExD.concat('T', dateFromExT),
              dateToEx: dateToExD.concat('T', dateToExT),
            });
            this.props.dispatch(
              getReportList({
                macAddr: selectValue,
                date: [dateFromExD.concat('T', dateFromExT), dateToExD.concat('T', dateToExT)],
                fileName,
                tabValue,
              })
            );
          }
        }}
        onCancel={() => {
          this.setState({
            settingVisible: false,
            settingVisibleExport: false,
          });
        }}
      >
        {settingVisible && antdTimePickerFunc()}
        {settingVisibleExport && antdTimePickerExportFunc()}
      </Modal>
    );
  }

  snackBarFunc() {
    const { errMsg } = this.props;
    const hdlClsSnkBar = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
      this.props.dispatch(errMsgAction(''));
    };
    return (
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        open={errMsg !== ''}
        autoHideDuration={2000}
        onClose={hdlClsSnkBar}
        message={
          <span>
            <FormattedMessage {...messages.snackbarDesc} />
          </span>
        }
        action={[
          <IconButton key="close" aria-label="Close" color="inherit" onClick={hdlClsSnkBar}>
            <CloseIcon style={{ color: 'white', width: 15 }} />
          </IconButton>,
        ]}
      />
    );
  }

  // render table start
  renderHeaderData(column) {
    const col = [];
    for (let i = 0; i < column.length; i += 1) {
      col.push(Object.values(column[i])[0]);
    }
    return col.map((item, index) => (
      <TableHeaderColumn style={{ fontWeight: 800 }} key={index}>
        {<FormattedMessage {...messages[item]} />}
      </TableHeaderColumn>
    ));
  }

  renderBodyData(eventList, column) {
    const { data } = eventList;
    let striped = 0;
    const col = [];
    for (let i = 0; i < column.length; i += 1) {
      col.push(Object.values(column[i])[0]);
    }
    return data.map((item, index) => (
      <TableRow
        key={index}
        selected={this.state.selectedRows.indexOf(index) !== -1}
        style={{ ...this.getStripedStyle(striped), fontWeight: 500 }}
      >
        {this.renderRowColumn(item, col)}
        {(striped += 1)}
      </TableRow>
    ));
  }

  renderRowColumn(item, col) {
    const TableRowColumnArray = [];
    for (let i = 0; i < col.length; i += 1) {
      let itemValue = item;
      for (let j = 0; j < col[i].split('.').length; j += 1) {
        itemValue = itemValue[col[i].split('.')[j]];
      }
      TableRowColumnArray.push(<TableRowColumn key={Math.random()}>{itemValue}</TableRowColumn>);
    }
    return TableRowColumnArray;
  }

  renderHeaderDataBoot(column) {
    const TableHeaderColumnArr = [];
    for (let i = 0; i < column.length; i += 1) {
      if (i === 0) {
        TableHeaderColumnArr.push(
          <TableHeaderColumnBoot isKey dataField={column[i]} key={Math.random()}>
            {<FormattedMessage {...messages[column[i]]} />}
          </TableHeaderColumnBoot>
        );
      } else {
        TableHeaderColumnArr.push(
          <TableHeaderColumnBoot dataField={column[i]} key={Math.random()}>
            {<FormattedMessage {...messages[column[i]]} />}
          </TableHeaderColumnBoot>
        );
      }
    }
    return TableHeaderColumnArr;
  }

  render() {
    const { classes, eventList } = this.props;
    const { tabValue } = this.state;
    return (
      <div>
        <Helmet>
          <title>EventPage</title>
          <meta name="description" content="Description of EventPage" />
        </Helmet>
        <Card>
          {eventList.size === 0 && (
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
          {eventList.size !== 0 && (
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
              <div style={{ margin: '-1em' }}>{this.tabFunc().tabDataList}</div>
            </div>
          )}
        </Card>
        {this.dialogFunc()}
        {this.snackBarFunc()}
      </div>
    );
  }
}

EventPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
  // waitingL: PropTypes.bool,
  menuOpen: PropTypes.bool,
  classes: PropTypes.object.isRequired,
  intl: intlShape.isRequired,
  eventList: PropTypes.object,
  senListByfport: PropTypes.array,
  errMsg: PropTypes.string,
  fportList: PropTypes.array,
  history: PropTypes.object,
  location: PropTypes.object,
  searchfportFromDb: PropTypes.string,
  searchMACFromDb: PropTypes.string,
};

const mapStateToProps = createStructuredSelector({
  eventpage: makeSelectEventPage(),
  waitingL: SelectSendingReqL(),
  menuOpen: SelectMenuOpened(),
  eventList: SelectEventList(),
  senListByfport: SelectSenListByfport(),
  errMsg: SelectErrMsg(),
  fportList: SelectFportList(),
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

const withReducer = injectReducer({ key: 'eventPage', reducer });
const withSaga = injectSaga({ key: 'eventPage', saga });

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
)(EventPage);
