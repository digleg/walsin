/**
 *
 * PersonnelPage
 *
 */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-lonely-if */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';

// material-ui
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Checkbox from 'material-ui/Checkbox';

// @material-ui
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';

// material-ui-next
import Tooltip from 'material-ui-next/Tooltip';

// svg-icon
import SearchIcon from 'material-ui/svg-icons/action/search';
import HistoryIcon from 'material-ui/svg-icons/action/history';
import EditIcon from 'material-ui/svg-icons/image/edit';
import InfoIcon from '@material-ui/icons/FormatListBulleted';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import ColumnIcon from 'material-ui/svg-icons/toggle/check-box';
import ArrowDownIcon from 'material-ui/svg-icons/navigation/arrow-drop-down';

import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import 'react-bootstrap-table/dist/react-bootstrap-table.min.css';
import 'react-bootstrap-table/dist/react-bootstrap-table.min';

// pagination
import Pagination from 'react-js-pagination';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';
import { SelectMenuOpened, SelectSendingReqM } from '../App/selectors';

import {
  makeSelectPersonnelPage,
  SelectSearchFilter,
  SelectTrackCntList,
  SelectTagTypeList,
  SelectTagList,
  SelectTrackList,
  SelectTrackByIdList,
  SelectTagListSize,
  SelectDevMetaList,
  SelectTagByMetaList,
  SelectTrackByMacList,
  SelectShowFieldList,
  SelectFieldInTrackEditF,
  SelectFieldInTrackEditZ,
  SelectFieldInTrackEditS,
  SelectTagByMetaCnt,
} from './selectors';
import {
  getSearchFilter,
  getSearchFilterParentVal,
  getTagType,
  getTrackList,
  getTagList,
  getTrackbyIdList,
  setTrackByIdList,
  updateTag,
  getDeviceMeta,
  getTagByMeta,
  getTrackbyMac,
  setTrackByMac,
  getShowField,
  getFilterInTrackEditF,
  getFilterInTrackEditZ,
  getFilterInTrackEditS,
  updateMeta,
  insertTag,
} from './actions';

import SecurityBarChart from '../../components/Chartjs/SecurityBarChart';
import BarHoriChart from '../../components/Chartjs/BarHoriChart';
import BarTagChart from '../../components/Chartjs/BarTagChart';
import './styles.css';

export class PersonnelPage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      SFLength: 1,
      tabValue: 0,
      selectedRows: [],

      // tag
      tagType: '',
      searchIdTextField: '',
      tagEditTextMac: '',
      tagEditTextName: '',
      // time
      stanToday: '',
      dateFrom: '',
      dateTo: '',
      dateFromTrack: '',
      dateToTrack: '',
      dateFromTag: '',
      dateToTag: '',

      macAddrChartFlag: false,

      // dialog
      macAddrChartFlagclean: false,
      macAddrChartFlagpolish: false,
      tagHisDia: false,
      tagHisDiaInfo: null,
      tagEditDia: false,
      tagEditDiaInfo: null,
      trackHisDia: false,
      trackHisDiaInfo: null,
      trackEditDia: false,
      trackEditDiaInfo: null,
      tagInfoDia: false,
      tagInfoDiaInfo: null,

      // paginate
      limit: 5,
      tagListPage: 1,
      mtagListPage: 1,

      // selecField
      chosenShowField: '',
      showFieldArr: '',
      tolFieldArr: '',
      showFieldArrBool: [true, true, true, true, true],
      trackEditDiaInfoMac: '',

      // chart
      chartIndex: '',
    };
    this.onRowSelection = this.onRowSelection.bind(this);
    this.hdlPageChg = this.hdlPageChg.bind(this);
    this.hdlMPageChg = this.hdlMPageChg.bind(this);
    this.updateCheck = this.updateCheck.bind(this);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    // this.refresh = setInterval(() => {
    // 區域資料
    dispatch(getSearchFilter());
    dispatch(getShowField());
    // 人員資料
    dispatch(getTagType());
    // }, 10000);
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  onRowSelection(value) {
    const { tagType } = this.state;
    if (value['loc.name'] !== 'NA') {
      this.props.dispatch(getTrackList({ id: value['information.id'], type: tagType === '' ? '2' : tagType }));
    }
  }

  getStripedStyle(index) {
    return { backgroundColor: index % 2 ? '#FFFFFF' : '#EEEEEE' };
  }

  getTagByMetaFunc() {
    const { intl, tagByMetaList, tagByMetaCnt } = this.props;
    const { mtagListPage } = this.state;
    const showFieldArr = ['id', 'in', 'out'];
    const tagTableData = [];
    if (tagByMetaList !== null) {
      for (let i = 0; i < tagByMetaList.length; i += 1) {
        const prodObj = {};
        for (let j = 0; j < showFieldArr.length; j += 1) {
          let itemValue = tagByMetaList[i];
          for (let k = 0; k < showFieldArr[j].split('.').length; k += 1) {
            if (itemValue[showFieldArr[j].split('.')[k]] !== 'NA') {
              itemValue = itemValue[showFieldArr[j].split('.')[k]];
            } else {
              const formattedMessage = intl.formatMessage({ id: 'MERC.containers.PersonnelPage.NA' });
              itemValue = formattedMessage;
              // itemValue = 'formattedMessage';
            }
          }
          prodObj[showFieldArr[j]] = itemValue;
        }
        tagTableData.push(prodObj);
      }
    }
    return (
      tagTableData.length !== 0 && (
        <Paper style={{ border: '1px solid #ced4da', marginTop: '0.5em', backgroundColor: '#FAFAFA' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              margin: '0.5em',
              fontSize: 20,
              fontWeight: 800,
            }}
          >
            <FormattedMessage {...messages.userListDataList} />
          </div>
          <BootstrapTable data={tagTableData} striped hover condensed>
            {this.renderHeaderData(showFieldArr)}
          </BootstrapTable>
          <Card style={{ display: 'flex', justifyContent: 'center', margin: 0 }}>
            <Pagination
              activePage={mtagListPage}
              totalItemsCount={tagByMetaCnt}
              itemsCountPerPage={10}
              pageRangeDisplayed={5}
              onChange={this.hdlMPageChg}
            />
            <div style={{ display: 'flex', marginTop: 27, marginLeft: 15 }}>
              {<FormattedMessage {...messages.total} />}
              &nbsp;
              {tagByMetaCnt}
              &nbsp;
              {<FormattedMessage {...messages.count} />}
            </div>
          </Card>
        </Paper>
      )
    );
  }

  filterFunc() {
    const { classes, searchFilter } = this.props;
    const { mtagListPage } = this.state;
    const selectFieldArr = [];
    for (let i = 0; i < searchFilter.filter.length; i += 1) {
      selectFieldArr.push(
        <Grid key={Math.random()} item xs={12} sm={6} md={3}>
          <Grid
            container
            justify="center"
            style={{
              backgroundColor: '#FAFAFA',
              border: '1px solid #ced4da',
              borderRadius: 5,
              paddingLeft: '1em',
              paddingRight: '1em',
            }}
          >
            <SelectField
              floatingLabelText={<FormattedMessage {...messages[searchFilter.filter[i].name]} />}
              value={this.state['SFValue'.concat(i)] === undefined ? 'all' : this.state['SFValue'.concat(i)]}
              floatingLabelFixed={this.state['SFValue'.concat[i]] === undefined && true}
              style={{ fontSize: 18, width: '100%', marginTop: '-0.2em', marginBottom: '-0.2em' }}
              onChange={(event, index, value) => {
                event.preventDefault();
                let valLocal;
                if (value !== this.state['SFValue'.concat(i)]) {
                  const { dispatch } = this.props;
                  this.setState({
                    ['SFValue'.concat(i)]: value,
                    ['SFField'.concat(i)]: searchFilter.filter[i].val,
                    SFLength: (this.state.SFLength += 1),
                  });
                  if (value !== 'all') {
                    this.setState({ ['SFValue'.concat(i)]: value });
                    valLocal = value;
                    dispatch(
                      getSearchFilterParentVal({
                        searchField: searchFilter.filter[i].val,
                        val: valLocal,
                        child: searchFilter.filter[i].child,
                        fport: searchFilter.filter[i].fport,
                        currOption: searchFilter.option,
                        index: i,
                        all: false,
                        index1: index - 1,
                      })
                    );
                  } else {
                    valLocal = this.state['SFValue'.concat(i - 1)];
                    if (i === 0) {
                      dispatch(getSearchFilter());
                    } else {
                      dispatch(
                        getSearchFilterParentVal({
                          searchField: this.state['SFField'.concat(i - 1)],
                          val: valLocal,
                          all: true,
                          child: this.state['SFField'.concat(i)],
                          fport: searchFilter.filter[i].fport,
                          currOption: searchFilter.option,
                          index: i,
                        })
                      );
                    }
                  }
                  for (let j = i + 1; j < this.state.SFLength; j += 1) {
                    this.setState({ ['SFField'.concat(j)]: 'all' });
                    this.setState({ ['SFValue'.concat(j)]: 'all' });
                  }
                }
                // meta
                if (value !== 'all') {
                  this.props.dispatch(
                    getDeviceMeta({ fport: searchFilter.filter[i].fport, meta: searchFilter.filter[i].val, val: valLocal })
                  );
                  this.setState({ getTagByMetaType: searchFilter.filter[i].val, getTagByMetaMeta: valLocal });
                  this.props.dispatch(getTagByMeta({ type: searchFilter.filter[i].val, meta: valLocal, page: mtagListPage }));
                } else {
                  this.props.dispatch(
                    getDeviceMeta({
                      fport: searchFilter.filter[i].fport,
                      meta: this.state['SFField'.concat(i - 1)],
                      val: valLocal,
                    })
                  );
                  this.setState({ getTagByMetaType: this.state['SFField'.concat(i - 1)], getTagByMetaMeta: valLocal });
                  this.props.dispatch(getTagByMeta({ type: this.state['SFField'.concat(i - 1)], meta: valLocal, page: mtagListPage }));
                }
              }}
              floatingLabelStyle={{ fontFamily: 'Roboto' }}
              dropDownMenuProps={{ anchorOrigin: { vertical: 'center', horizontal: 'left' } }}
              disabled={searchFilter.option.length <= i}
            >
              <MenuItem
                value="all"
                primaryText={<FormattedMessage {...messages['all'.concat(searchFilter.filter[i].name)]} />}
                key={Math.random()}
              />
              {searchFilter.option.length > i &&
                typeof searchFilter.option[i][0]._id === 'object' &&
                searchFilter.option[i].map(item => <MenuItem value={item._id.val} primaryText={item._id.name} key={Math.random()} />)}
              {searchFilter.option.length > i &&
                typeof searchFilter.option[i][0]._id === 'string' &&
                searchFilter.option[i].map(item => <MenuItem value={item.macAddr} primaryText={item.name} key={Math.random()} />)}
            </SelectField>
          </Grid>
        </Grid>
      );
    }
    return (
      <Grid container className={classes.root} justify="center" spacing={8} style={{ marginTop: 5, marginBottom: 5 }}>
        {selectFieldArr}
      </Grid>
    );
  }

  barChartFunc() {
    const { trackCntList } = this.props;
    return (
      trackCntList !== null && (
        <div style={{ backgroundColor: '#F5F5F5', justifyContent: 'center' }}>
          <SecurityBarChart dataInput={trackCntList} />
        </div>
      )
    );
  }

  devMetaListFunc() {
    const { classes, intl, devMetaList, showfieldList } = this.props;
    const { showFieldArrBool } = this.state;
    const showFieldArr = [];
    const tolFieldArr = [];
    const formattedMechineHisInfo = intl.formatMessage({ id: 'MERC.containers.PersonnelPage.machineHisInfo' });
    const formattedEditMechineInfo = intl.formatMessage({ id: 'MERC.containers.PersonnelPage.editMachineInfo' });

    for (let l = 0; l < showfieldList.length; l += 1) {
      if (showFieldArrBool[l] === true) {
        showFieldArr.push(showfieldList[l].name);
      }
      tolFieldArr.push(showfieldList[l].name);
    }
    const tagTableData = [];
    if (devMetaList !== null) {
      for (let i = 0; i < devMetaList.length; i += 1) {
        const prodObj = {};
        for (let j = 0; j < showFieldArr.length; j += 1) {
          let itemValue = devMetaList[i];
          for (let k = 0; k < showFieldArr[j].split('.').length; k += 1) {
            if (itemValue[showFieldArr[j].split('.')[k]] !== undefined) {
              itemValue = itemValue[showFieldArr[j].split('.')[k]];
            } else {
              const formattedMessage = intl.formatMessage({ id: 'MERC.containers.PersonnelPage.NA' });
              itemValue = formattedMessage;
            }
          }
          prodObj[showFieldArr[j]] = itemValue;
        }
        tagTableData.push(prodObj);
      }
    }
    const buttonFormatter = (cell, row) => {
      return (
        <Tooltip title={formattedMechineHisInfo} placement="left" classes={{ tooltip: classes.tooltipCus }}>
          <IconButton
            className={classes.button}
            aria-label="hisotry"
            onClick={() => {
              this.setState({ trackHisDia: true, trackHisDiaInfo: row });
              this.props.dispatch(getTrackbyMac({ type: 'macAddr', typeId: row.macAddr }));
            }}
          >
            <HistoryIcon />
          </IconButton>
        </Tooltip>
      );
    };

    const buttonEditFormatter = (cell, row, enumObject, index) => {
      // const { devMetaList } = this.props;
      // devMetaList
      return (
        <Tooltip title={formattedEditMechineInfo} placement="left" classes={{ tooltip: classes.tooltipCus }}>
          <IconButton
            className={classes.button}
            aria-label="Edit"
            onClick={() => {
              const { dispatch } = this.props;
              const meta = devMetaList[index].meta;
              // get field in dia
              dispatch(getFilterInTrackEditF({ factory_s: { fport: 165 } }));
              dispatch(getFilterInTrackEditZ({ searchField: 'factory_s', val: meta.factory_s.val, child: 'zone_s', fport: '165' }));
              dispatch(getFilterInTrackEditS({ searchField: 'zone_s', val: meta.zone_s.val, child: 'station', fport: '165' }));

              this.setState({
                trackEditDia: true,
                trackEditDiaInfo: devMetaList[index].meta,
                trackEditDiaInfoMac: devMetaList[index].macAddr,
              });
            }}
          >
            <EditIcon />
          </IconButton>
        </Tooltip>
      );
    };

    return (
      <Paper style={{ border: '1px solid #ced4da', marginTop: '0.5em', backgroundColor: '#FAFAFA' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div
            style={{
              // alignSelf: 'center',
              margin: '0.5em',
              fontSize: 20,
              fontWeight: 800,
            }}
          >
            <FormattedMessage {...messages.zoneDataList} />
          </div>
          <div style={{ position: 'absolute', right: '1em' }}>
            <IconButton
              key={Math.random()}
              onClick={evt => {
                evt.preventDefault();
                this.setState({ columnOpenDia: true });
                this.setState({ showFieldArr });
                this.setState({ tolFieldArr });
              }}
            >
              <ColumnIcon />
              <ArrowDownIcon style={{ marginLeft: '-0.3em' }} />
            </IconButton>
          </div>
        </div>
        <BootstrapTable data={tagTableData} striped hover condensed>
          {this.renderHeaderData(showFieldArr)}
          <TableHeaderColumn dataField="icon" dataFormat={buttonFormatter} width="40" keys={Math.random()} />
          <TableHeaderColumn dataField="icon" dataFormat={buttonEditFormatter} width="40" keys={Math.random()} />
        </BootstrapTable>
      </Paper>
    );
  }

  filterSearchFunc() {
    const { classes, intl, tagTypeList } = this.props;
    const { searchIdTextField, dateFrom, dateTo } = this.state;
    const formattedEndTime = intl.formatMessage({ id: 'MERC.containers.PersonnelPage.endTime' });
    const formattedStartTime = intl.formatMessage({ id: 'MERC.containers.PersonnelPage.startTime' });
    const formattedSearch = intl.formatMessage({ id: 'MERC.containers.PersonnelPage.search' });
    const formattedClearSearch = intl.formatMessage({ id: 'MERC.containers.PersonnelPage.clearSearch' });
    // const formattedWorkListType = intl.formatMessage({ id: 'MERC.containers.PersonnelPage.userType' });
    const formattedSrhByWorkListID = intl.formatMessage({ id: 'MERC.containers.PersonnelPage.srhByUserID' });
    const formattedWorkListID = intl.formatMessage({ id: 'MERC.containers.PersonnelPage.userID' });
    return (
      <Grid container className={classes.root} justify="center" spacing={8} style={{ marginTop: 5, marginBottom: 5 }}>
        {/* <Grid key={Math.random()} item xs={12} sm={12} md={6} lg={3}>
          <Grid
            container
            justify="center"
            style={{
              backgroundColor: '#FAFAFA',
              border: '1px solid #ced4da',
              borderRadius: 5,
              paddingLeft: '1em',
              paddingRight: '1em',
            }}
          >
            <SelectField
              floatingLabelText={formattedWorkListType}
              value={this.state.tagType === '' ? tagTypeList.tags[0].val : this.state.tagType}
              floatingLabelFixed={this.state.tagType !== '' && true}
              onChange={(event, index, value) => {
                event.preventDefault();
                this.setState({ tagType: value });
              }}
              floatingLabelStyle={{ fontFamily: 'Roboto' }}
              dropDownMenuProps={{ anchorOrigin: { vertical: 'center', horizontal: 'left' } }}
              style={{ width: '100%', marginTop: '-0.2em', marginBottom: '-0.2em' }}
            >
              {tagTypeList.tags.map(item => <MenuItem value={item.val} primaryText={item.name} key={Math.random()} />)}
            </SelectField>
          </Grid>
        </Grid> */}
        <Grid item xs={12} sm={12} md={6} lg={6}>
          <Grid
            container
            justify="center"
            style={{
              backgroundColor: '#FAFAFA',
              border: '1px solid #ced4da',
              borderRadius: 5,
              paddingLeft: '1em',
              paddingRight: '1em',
              // marginTop: '-0.5em',
              // marginBottom: '-0.5em',
            }}
          >
            <TextField
              id="searchIdTextField"
              label={formattedSrhByWorkListID.concat(' ...')}
              className={classes.textField}
              InputLabelProps={{
                shrink: true,
                className: classes.resize,
              }}
              InputProps={{
                classes: {
                  input: classes.resize,
                },
                // endAdornment: (
                //   <InputAdornment position="start">
                //     <SearchIcon />
                //   </InputAdornment>
                // ),
              }}
              style={{
                width: '100%',
                height: '0.85em',
              }}
              value={searchIdTextField}
              onChange={e => {
                this.setState({ searchIdTextField: e.target.value });
                this.props.dispatch(getTagList({ id: e.target.value, tagType: tagTypeList.tags[0].val }));
              }}
              margin="normal"
              placeholder={formattedWorkListID}
            />
          </Grid>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={6}>
          <Grid
            container
            justify="space-around"
            alignItems="center"
            style={{
              backgroundColor: '#FAFAFA',
              border: '1px solid #ced4da',
              borderRadius: 5,
              height: '5em',
              width: '100%',
              // marginTop: '-0.2em',
              // marginBottom: '-0.2em',
            }}
          >
            <form noValidate style={{ width: '40%' }}>
              <TextField
                id="datetime-local"
                label={formattedStartTime}
                type="datetime-local"
                // defaultValue={stanToday}
                value={dateFrom}
                onChange={event => this.setState({ dateFrom: event.target.value })}
                style={{ width: '100%' }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </form>
            <div style={{ marginRight: '1em' }} />
            <form noValidate style={{ width: '40%', marginLeft: '-3em' }}>
              <TextField
                id="datetime-local"
                label={formattedEndTime}
                type="datetime-local"
                // defaultValue={stanToday}
                value={dateTo}
                onChange={event => this.setState({ dateTo: event.target.value })}
                style={{ width: '100%' }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </form>
            <Tooltip title={formattedSearch} placement="bottom" classes={{ tooltip: classes.tooltipCus }}>
              <IconButton
                className={classes.buttonSearch}
                aria-label="StartToSearch"
                onClick={() => {
                  this.props.dispatch(getTagList({ id: searchIdTextField, tagType: tagTypeList.tags[0].val, date: [dateFrom, dateTo] }));
                }}
              >
                <SearchIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title={formattedClearSearch} placement="bottom" classes={{ tooltip: classes.tooltipCus }}>
              <IconButton
                className={classes.buttonSearch}
                aria-label="DeleteSearchResult"
                onClick={() => {
                  this.setState({
                    searchIdTextField: '',
                    dateFrom: '',
                    dateTo: '',
                  });
                  this.props.dispatch(getTagList({ tagType: tagTypeList.tags[0].val }));
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
      </Grid>
    );
  }

  hdlPageChg(pageNumber) {
    const { tagTypeList } = this.props;
    const { searchIdTextField, dateFrom, dateTo } = this.state;
    // const { eventList } = this.props;
    // const { tabValue, selectValue, dateFrom, dateTo, selectSeachMsg } = this.state;
    // const pagi = [];
    // for (let i = 0; i < Object.keys(eventList).length; i += 1) {
    //   if (i === tabValue) {
    //     pagi.push(pageNumber);
    //   } else pagi.push(1);
    // }
    // this.refs.table.setState({
    //   selectedRowKeys: [],
    // });
    this.setState({ tagListPage: pageNumber });
    this.props.dispatch(
      getTagList({ id: searchIdTextField, tagType: tagTypeList.tags[0].val, date: [dateFrom, dateTo], page: pageNumber })
    );
  }

  hdlMPageChg(pageNumber) {
    const { getTagByMetaType, getTagByMetaMeta } = this.state;
    this.setState({ mtagListPage: pageNumber });
    // this.setState({ getTagByMetaType: this.state['SFField'.concat(i - 1)], getTagByMetaMeta: valLocal });
    this.props.dispatch(getTagByMeta({ type: getTagByMetaType, meta: getTagByMetaMeta, page: pageNumber }));
  }

  tagListFunc() {
    const { classes, intl, waitingM, tagList, tagTypeList, tagListSize } = this.props;
    const { tagListPage } = this.state;
    const showField = [];

    const formattedWorkListHisInfo = intl.formatMessage({ id: 'MERC.containers.PersonnelPage.userHisInfo' });
    const formattedEditWorkListInfo = intl.formatMessage({ id: 'MERC.containers.PersonnelPage.editUserInfo' });
    for (let i = 0; i < tagTypeList.tags[0].showField.length; i += 1) {
      showField.push(Object.values(tagTypeList.tags[0].showField[i])[0]);
    }
    const tagTableData = [];
    for (let i = 0; i < tagList.length; i += 1) {
      const prodObj = {};
      for (let j = 0; j < showField.length; j += 1) {
        let itemValue = tagList[i];
        for (let k = 0; k < showField[j].split('.').length; k += 1) {
          if (itemValue !== undefined) {
            itemValue = itemValue[showField[j].split('.')[k]];
          } else {
            const formattedMessage = intl.formatMessage({ id: 'MERC.containers.PersonnelPage.NA' });
            itemValue = formattedMessage;
          }
        }
        prodObj[showField[j]] = itemValue;
      }
      tagTableData.push(prodObj);
    }

    const buttonInfoFormatter = (cell, row) => {
      return (
        <Tooltip title="人員資訊" placement="left" classes={{ tooltip: classes.tooltipCus }}>
          <IconButton
            className={classes.button}
            aria-label="Info"
            onClick={() => {
              this.setState({
                tagInfoDia: true,
                tagInfoDiaInfo: row,
              });
              const { tagType } = this.state;
              if (row['loc.name'] !== 'NA') {
                this.props.dispatch(getTrackList({ id: row['information.id'], type: tagType === '' ? '2' : tagType }));
              }
            }}
          >
            <InfoIcon />
          </IconButton>
        </Tooltip>
      );
    };

    const buttonFormatter = (cell, row) => {
      return (
        <Tooltip title={formattedWorkListHisInfo} placement="left" classes={{ tooltip: classes.tooltipCus }}>
          <IconButton
            className={classes.button}
            aria-label="History"
            onClick={() => {
              this.setState({ tagHisDia: true, tagHisDiaInfo: row });
              this.props.dispatch(getTrackbyIdList({ type: 2, typeId: row['information.id'] }));
            }}
          >
            <HistoryIcon />
          </IconButton>
        </Tooltip>
      );
    };

    const buttonEditFormatter = (cell, row) => {
      return (
        <Tooltip title={formattedEditWorkListInfo} placement="left" classes={{ tooltip: classes.tooltipCus }}>
          <IconButton
            className={classes.button}
            aria-label="Edit"
            onClick={() => {
              this.setState({
                tagEditDia: true,
                tagEditDiaInfo: row,
                tagEditTextDesc: row['info.desc'],
                tagEditTextPri: row['info.priority'],
                tagEditTextMac: row['loc.macAddr'],
                tagEditTextName: row['loc.name'],
              });
            }}
          >
            <EditIcon />
          </IconButton>
        </Tooltip>
      );
    };

    const unselectableIndex = [];
    for (let i = 0; i < tagTableData.length; i += 1) {
      if (tagTableData[i]['info.desc'] === 'NA') {
        unselectableIndex.push(i);
      }
    }

    const options = {
      noDataText: (
        <RaisedButton
          label={<FormattedMessage {...messages.newUser} />}
          primary
          onClick={() => {
            // insertTag
            let tagSting = '02';
            const { searchIdTextField } = this.state;
            let hexString = searchIdTextField.length.toString(16);
            if (hexString.length % 2) {
              hexString = '0'.concat(hexString);
            }
            tagSting += hexString;

            for (let i = 0; i < searchIdTextField.length; i += 1) {
              tagSting += searchIdTextField.charCodeAt(i).toString(16);
            }
            this.props.dispatch(
              insertTag({
                id: tagSting,
              })
            );
            this.setState({ searchIdTextField: '' });
          }}
        />
      ),
    };

    return (
      <Paper style={{ border: '1px solid #ced4da', marginTop: '0.5em', backgroundColor: '#FAFAFA' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            margin: '0.5em',
            fontSize: 20,
            fontWeight: 800,
          }}
        >
          <FormattedMessage {...messages.userListDataList} />
        </div>
        {waitingM ? (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress
              size={30}
              thickness={3}
              style={{
                margin: 50,
              }}
            />
          </div>
        ) : (
          <BootstrapTable data={tagTableData} options={options} striped hover condensed>
            {this.renderHeaderData(showField)}
            <TableHeaderColumn dataField="icon" dataFormat={buttonInfoFormatter} width="40" keys={Math.random()} />
            <TableHeaderColumn dataField="icon" dataFormat={buttonFormatter} width="40" keys={Math.random()} />
            <TableHeaderColumn dataField="icon" dataFormat={buttonEditFormatter} width="40" keys={Math.random()} />
          </BootstrapTable>
        )}
        <Card style={{ display: 'flex', justifyContent: 'center', margin: 0 }}>
          <Pagination
            activePage={tagListPage}
            totalItemsCount={tagListSize}
            itemsCountPerPage={5}
            pageRangeDisplayed={5}
            onChange={this.hdlPageChg}
          />
          <div style={{ display: 'flex', marginTop: 27, marginLeft: 15 }}>
            {<FormattedMessage {...messages.total} />}
            &nbsp;
            {tagListSize}
            &nbsp;
            {<FormattedMessage {...messages.count} />}
          </div>
        </Card>
      </Paper>
    );
  }

  showProcTime() {
    const { intl, trackList } = this.props;
    const dataInput = [];
    const titles = [];
    for (let i = 0; i < Object.keys(trackList).length - 1; i += 1) {
      dataInput.push([]);
    }
    for (let i = 0; i < Object.keys(trackList).length - 1; i += 1) {
      titles.push(Object.keys(trackList)[i]);
      for (let j = 0; j < Object.values(trackList)[i].length; j += 1) {
        dataInput[i].push(Object.values(trackList)[i][j].time);
      }
    }
    const BarHoriChartArr = [];
    for (let i = 0; i < Object.keys(trackList).length - 1; i += 1) {
      BarHoriChartArr.push(
        <div style={{ margin: '-0.5em' }} key={Math.random()}>
          <BarHoriChart
            titles={titles[i]}
            labels={trackList[Object.keys(trackList)[i]]}
            dataInput={dataInput[i]}
            max={dataInput[0]}
            trackList={trackList}
          />
        </div>
      );
    }

    // const formattedWorkListProcessTime = intl.formatMessage({ id: 'MERC.containers.PersonnelPage.workListProcessTime' });
    const formattedShowWorkListDtl = intl.formatMessage({ id: 'MERC.containers.PersonnelPage.showUserDtl' });

    return (
      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            margin: '0.5em',
            fontSize: 20,
            fontWeight: 800,
          }}
          key={Math.random()}
        />
        {BarHoriChartArr}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
          }}
          key={Math.random()}
        >
          {trackList.station.map(item => (
            <RaisedButton
              label={formattedShowWorkListDtl.concat(' - ', item.name)}
              style={{
                margin: '0.5em',
              }}
              key={Math.random()}
              onClick={() => {
                this.setState({ macAddrChartFlag: true, chartIndex: item.val });
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  updateCheck(oldState, index) {
    const { showFieldArrBool } = this.state;
    const showFieldArrBoolTmp = [...showFieldArrBool];
    showFieldArrBoolTmp[index] = !showFieldArrBool[index];
    this.setState({ showFieldArrBool: showFieldArrBoolTmp });
  }

  dialogFunc() {
    const {
      macAddrChartFlag,
      tagHisDia,
      tagHisDiaInfo,
      tagEditDia,
      tagEditDiaInfo,
      dateFrom,
      dateTo,
      trackHisDia,
      trackHisDiaInfo,
      columnOpenDia,
      showFieldArrBool,
      trackEditDia,
      trackEditDiaInfo,
      tagInfoDia,
    } = this.state;
    const hdlDiaClose = () => {
      // props reset
      if (tagHisDia) {
        this.props.dispatch(setTrackByIdList(null));
      }
      if (trackHisDia) {
        this.props.dispatch(setTrackByMac(null));
      }
      if (trackEditDia) {
        this.setState({ trackEditDiaInfo: null });
        setTimeout(() => {
          // this.componentWillMount();
        }, 1000);
      }
      if (!macAddrChartFlag) {
        this.setState({ tagInfoDia: false });
      }
      // states reset
      this.setState({
        macAddrChartFlag: false,
        tagHisDia: false,
        tagHisDiaInfo: null,
        tagEditDia: false,
        trackHisDia: false,
        columnOpenDia: false,
        trackEditDia: false,
      });
    };
    const hldDiaConfirm = () => {
      if (tagEditDia) {
        const { tagEditTextDesc, tagEditTextPri, searchIdTextField, tagEditTextMac, tagEditTextName } = this.state;
        this.props.dispatch(
          updateTag({
            type: 2,
            id: tagEditDiaInfo['information.id'],
            desc: tagEditTextDesc,
            priority: tagEditTextPri,
            date: [dateFrom, dateTo],
            searchId: searchIdTextField,
            macAddr: tagEditTextMac,
            name: tagEditTextName,
          })
        );
      } else if (columnOpenDia) {
        const { showFieldArr } = this.state;
        this.setState({ showShelfColumnShow: [] });
        for (let i = 0; i < showFieldArrBool.length; i += 1) {
          if (showFieldArrBool[i] === true) {
            this.setState(prevState => ({
              showFieldArr: [...prevState.showShelfColumnShow, showFieldArr[i]],
            }));
          }
        }
        this.setState({ columnOpenDia: false });
      } else if (trackEditDia) {
        const { editZList, editSList } = this.props;
        const { trackEditDiaInfoMac } = this.state;
        const editZListObj = {};
        const editSListObj = {};
        for (let i = 0; i < editZList.length; i += 1) {
          editZListObj[editZList[i]._id.val] = editZList[i]._id.name;
        }
        for (let i = 0; i < editSList.length; i += 1) {
          editSListObj[editSList[i]._id.val] = editSList[i]._id.name;
        }
        const editObj = {};
        for (let i = 0; i < Object.keys(trackEditDiaInfo).length; i += 1) {
          const key = Object.keys(trackEditDiaInfo)[i];
          const value = Object.values(trackEditDiaInfo)[i];
          const editValue = key.concat('Edit');
          if (this.state[editValue] === undefined) {
            editObj[key] = value;
          } else {
            if (key === 'zone_s') {
              editObj[key] = { val: this.state[editValue], name: editZListObj[this.state[editValue]] };
            } else if (key === 'station') {
              editObj[key] = { val: this.state[editValue], name: editSListObj[this.state[editValue]] };
            } else {
              editObj[key] = this.state[editValue];
            }
          }
        }
        editObj.macAddr = trackEditDiaInfoMac;
        this.props.dispatch(updateMeta(editObj));
      }

      hdlDiaClose();
    };
    const actions = [
      <FlatButton label={<FormattedMessage {...messages.cancel} />} primary onClick={hdlDiaClose} />,
      tagEditDia && <FlatButton label={<FormattedMessage {...messages.confirm} />} primary onClick={hldDiaConfirm} />,
      columnOpenDia && <FlatButton label={<FormattedMessage {...messages.confirm} />} primary onClick={hldDiaConfirm} />,
      trackEditDia && <FlatButton label={<FormattedMessage {...messages.confirm} />} primary onClick={hldDiaConfirm} />,
    ];

    const chartFunc = () => {
      const { trackList } = this.props;
      const { chartIndex } = this.state;
      const trackListArr = [];
      const trackListExtraArr = [];
      for (let i = 0; i < trackList.macAddr.length; i += 1) {
        if (trackList.macAddr[i].parent === chartIndex) {
          trackListArr.push(trackList.macAddr[i]);
          trackListExtraArr.push(trackList.macAddr[i].extra);
        }
        // if (trackList.macAddr[i].extra !== undefined) {
        //   trackListExtraArr.push(trackList.macAddr[i].extra);
        // } else {
        //   trackListExtraArr.push(undefined);
        // }
      }
      return (
        <Card style={{ border: '1px solid #ced4da', marginTop: 20, padding: 10, backgroundColor: '#FAFAFA' }}>
          <BarTagChart dataTag={trackListArr} dataExtra={trackListExtraArr} />
        </Card>
      );
    };

    const tagHisFunc = () => {
      const { classes, intl, trackByIdList } = this.props;
      const { dateFromTrack, dateToTrack } = this.state;
      const showFieldArr = [
        'loc.name',
        'loc.meta.id',
        'loc.meta.factory_s.name',
        'loc.meta.station_s.name',
        'in',
        'out',
        'extra.NW',
        'extra.eid',
      ];
      const tagTableData = [];
      if (trackByIdList !== null) {
        for (let i = 0; i < trackByIdList.length; i += 1) {
          const prodObj = {};
          for (let j = 0; j < showFieldArr.length; j += 1) {
            let itemValue = trackByIdList[i];
            for (let k = 0; k < showFieldArr[j].split('.').length; k += 1) {
              if (itemValue[showFieldArr[j].split('.')[k]] !== undefined) {
                itemValue = itemValue[showFieldArr[j].split('.')[k]];
              } else {
                const formattedMessage = intl.formatMessage({ id: 'MERC.containers.PersonnelPage.NA' });
                itemValue = formattedMessage;
              }
            }
            prodObj[showFieldArr[j]] = itemValue;
          }
          tagTableData.push(prodObj);
        }
      }
      const formattedEndTime = intl.formatMessage({ id: 'MERC.containers.PersonnelPage.endTime' });
      const formattedStartTime = intl.formatMessage({ id: 'MERC.containers.PersonnelPage.startTime' });
      const formattedSearch = intl.formatMessage({ id: 'MERC.containers.PersonnelPage.search' });
      const formattedClearSearch = intl.formatMessage({ id: 'MERC.containers.PersonnelPage.clearSearch' });

      return (
        <Paper style={{ border: '1px solid #ced4da', marginTop: 20, backgroundColor: '#FAFAFA' }}>
          <Grid container className={classes.root} justify="center" style={{ marginBottom: 5 }}>
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <Grid
                container
                justify="space-around"
                alignItems="center"
                style={{
                  backgroundColor: '#FAFAFA',
                  border: '1px solid #ced4da',
                  borderRadius: 5,
                  height: '5.2em',
                  width: '100%',
                }}
              >
                <form noValidate style={{ width: '40%' }}>
                  <TextField
                    id="datetime-local"
                    label={formattedStartTime}
                    type="datetime-local"
                    value={dateFromTrack}
                    onChange={event => this.setState({ dateFromTrack: event.target.value })}
                    style={{ width: '100%' }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </form>
                <div style={{ marginRight: '1em' }} />
                <form noValidate style={{ width: '40%', marginLeft: '-3em' }}>
                  <TextField
                    id="datetime-local"
                    label={formattedEndTime}
                    type="datetime-local"
                    value={dateToTrack}
                    onChange={event => this.setState({ dateToTrack: event.target.value })}
                    style={{ width: '100%' }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </form>
                <Tooltip title={formattedSearch} placement="bottom" classes={{ tooltip: classes.tooltipCus }}>
                  <IconButton
                    className={classes.buttonSearch}
                    aria-label="StartToSearch"
                    onClick={() => {
                      this.props.dispatch(
                        getTrackbyIdList({ type: 2, typeId: tagHisDiaInfo['information.id'], date: [dateFromTrack, dateToTrack] })
                      );
                    }}
                  >
                    <SearchIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title={formattedClearSearch} placement="bottom" classes={{ tooltip: classes.tooltipCus }}>
                  <IconButton
                    className={classes.buttonSearch}
                    aria-label="DeleteSearchResult"
                    onClick={() => {
                      this.setState({
                        dateFromTrack: '',
                        dateToTrack: '',
                      });
                      this.props.dispatch(getTrackbyIdList({ type: 2, typeId: tagHisDiaInfo['information.id'] }));
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid>
          </Grid>
          <BootstrapTable
            data={tagTableData}
            selectRow={{
              bgColor: '#E8EAF6',
            }}
            striped
            hover
            condensed
          >
            {this.renderHeaderData(showFieldArr)}
          </BootstrapTable>
        </Paper>
      );
    };

    const tagEditFunc = () => {
      const { classes } = this.props;
      const { tagEditTextDesc, tagEditTextPri } = this.state;
      return (
        <Grid container className={classes.root} justify="center" spacing={8} style={{ marginTop: 5, marginBottom: 5 }}>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <Grid
              container
              justify="center"
              style={{
                backgroundColor: '#FAFAFA',
                border: '0.5px solid #ced4da',
                borderRadius: 5,
                paddingLeft: '1em',
                paddingRight: '1em',
              }}
            >
              <TextField
                id="decs"
                label="decs"
                className={classes.textField}
                InputLabelProps={{
                  shrink: true,
                  className: classes.resize,
                }}
                InputProps={{
                  classes: {
                    input: classes.resize,
                  },
                }}
                style={{ width: '100%' }}
                value={tagEditTextDesc}
                onChange={e => {
                  this.setState({ tagEditTextDesc: e.target.value });
                }}
                margin="normal"
                placeholder="人员识别码"
              />
            </Grid>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <Grid
              container
              justify="center"
              style={{
                backgroundColor: '#FAFAFA',
                border: '0.5px solid #ced4da',
                borderRadius: 5,
                paddingLeft: '1em',
                paddingRight: '1em',
              }}
            >
              <TextField
                id="priority"
                label="priority"
                className={classes.textField}
                InputLabelProps={{
                  shrink: true,
                  className: classes.resize,
                }}
                InputProps={{
                  classes: {
                    input: classes.resize,
                  },
                }}
                style={{ width: '100%' }}
                value={tagEditTextPri}
                onChange={e => {
                  this.setState({ tagEditTextPri: e.target.value });
                }}
                margin="normal"
                placeholder="工单识别码"
              />
            </Grid>
          </Grid>
        </Grid>
      );
    };

    const trackHisFunc = () => {
      const { classes, intl, trackByMacList } = this.props;
      const { dateFromTag, dateToTag } = this.state;
      const showFieldArr = ['id', 'in', 'out'];
      const tagTableData = [];
      if (trackByMacList !== null) {
        for (let i = 0; i < trackByMacList.length; i += 1) {
          const prodObj = {};
          for (let j = 0; j < showFieldArr.length; j += 1) {
            let itemValue = trackByMacList[i];
            for (let k = 0; k < showFieldArr[j].split('.').length; k += 1) {
              if (itemValue !== undefined) {
                itemValue = itemValue[showFieldArr[j].split('.')[k]];
              } else {
                const formattedMessage = intl.formatMessage({ id: 'MERC.containers.PersonnelPage.NA' });
                itemValue = formattedMessage;
              }
            }
            prodObj[showFieldArr[j]] = itemValue;
          }
          tagTableData.push(prodObj);
        }
      }

      const formattedEndTime = intl.formatMessage({ id: 'MERC.containers.PersonnelPage.endTime' });
      const formattedStartTime = intl.formatMessage({ id: 'MERC.containers.PersonnelPage.startTime' });
      const formattedSearch = intl.formatMessage({ id: 'MERC.containers.PersonnelPage.search' });
      const formattedClearSearch = intl.formatMessage({ id: 'MERC.containers.PersonnelPage.clearSearch' });
      return (
        <Paper style={{ border: '1px solid #ced4da', marginTop: '0.5em', backgroundColor: '#FAFAFA' }}>
          <Grid container className={classes.root} justify="center" style={{ marginBottom: 5 }}>
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <Grid
                container
                justify="space-around"
                alignItems="center"
                style={{
                  backgroundColor: '#FAFAFA',
                  border: '1px solid #ced4da',
                  borderRadius: 5,
                  height: '5.2em',
                  width: '100%',
                }}
              >
                <form noValidate style={{ width: '40%' }}>
                  <TextField
                    id="datetime-local"
                    label={formattedStartTime}
                    type="datetime-local"
                    value={dateFromTag}
                    onChange={event => this.setState({ dateFromTag: event.target.value })}
                    style={{ width: '100%' }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </form>
                <div style={{ marginRight: '1em' }} />
                <form noValidate style={{ width: '40%', marginLeft: '-3em' }}>
                  <TextField
                    id="datetime-local"
                    label={formattedEndTime}
                    type="datetime-local"
                    value={dateToTag}
                    onChange={event => this.setState({ dateToTag: event.target.value })}
                    style={{ width: '100%' }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </form>
                <Tooltip title={formattedSearch} placement="bottom" classes={{ tooltip: classes.tooltipCus }}>
                  <IconButton
                    className={classes.buttonSearch}
                    aria-label="StartToSearch"
                    onClick={() => {
                      this.props.dispatch(
                        getTrackbyMac({ type: 'macAddr', typeId: trackHisDiaInfo.macAddr, date: [dateFromTag, dateToTag] })
                      );
                    }}
                  >
                    <SearchIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title={formattedClearSearch} placement="bottom" classes={{ tooltip: classes.tooltipCus }}>
                  <IconButton
                    className={classes.buttonSearch}
                    aria-label="DeleteSearchResult"
                    onClick={() => {
                      // this.setState({
                      //   dateFromTrack: '',
                      //   dateToTrack: '',
                      // });
                      // this.props.dispatch(getTrackbyIdList({ type: 1, typeId: tagHisDiaInfo['information.id'] }));
                      this.props.dispatch(getTrackbyMac({ type: 'macAddr', typeId: trackHisDiaInfo.macAddr }));
                      this.setState({ dateFromTag: '', dateToTag: '' });
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid>
          </Grid>
          <BootstrapTable data={tagTableData} striped hover condensed style={{ fontSize: 10 }}>
            {this.renderHeaderData(showFieldArr)}
          </BootstrapTable>
        </Paper>
      );
    };

    const selectColFunc = () => {
      const { tolFieldArr } = this.state;
      return (
        <div style={{ marginTop: 20, marginLeft: 20 }}>
          <Grid container>
            <Grid container alignItems="center" justify="center" direction="row">
              {tolFieldArr.map((item, index) => (
                <Grid item xs={3} sm={3} md={3} lg={3} xl={3} key={Math.random()}>
                  <Checkbox
                    key={Math.random()}
                    label={<FormattedMessage {...messages[item]} />}
                    checked={showFieldArrBool[index]}
                    onCheck={oldState => this.updateCheck(oldState, index)}
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>
        </div>
      );
    };

    const trackEditFunc = () => {
      const { classes, editFList, editZList, editSList } = this.props;
      const mustField = [];
      const notMustField = [];
      let editList;

      if (editFList !== null && editZList !== null && editSList !== null) {
        for (let i = 0; i < Object.keys(trackEditDiaInfo).length; i += 1) {
          const key = Object.keys(trackEditDiaInfo)[i];
          const value = Object.values(trackEditDiaInfo)[i];
          const editValue = key.concat('Edit');
          const formattedMessageString = 'MERC.containers.PersonnelPage.'.concat(key);
          const formattedMessage = intl.formatMessage({ id: formattedMessageString });

          if (key === 'factory_s') {
            editList = editFList;
          }
          if (key === 'zone_s') {
            editList = editZList;
          }
          if (key === 'station') {
            editList = editSList;
          }
          if (key === 'factory_s' || key === 'station' || key === 'zone_s') {
            mustField.push(
              <Grid item xs={12} sm={6} md={4} lg={4}>
                <Grid
                  container
                  justify="center"
                  style={{
                    backgroundColor: '#FAFAFA',
                    border: '0.5px solid #ced4da',
                    borderRadius: 5,
                    paddingLeft: '1em',
                    paddingRight: '1em',
                  }}
                >
                  <SelectField
                    floatingLabelText={<FormattedMessage {...messages[key]} />}
                    hintText="请选择"
                    value={this.state[editValue] === undefined ? value.val : this.state[editValue]}
                    floatingLabelFixed={this.state[editValue] === undefined && true}
                    style={{ fontSize: 18, width: '100%', marginTop: '-0.2em', marginBottom: '-0.2em' }}
                    onChange={(event, index, valueSelect) => {
                      event.preventDefault();
                      this.setState({ [editValue]: valueSelect });
                      if (editValue === 'zoneEdit') {
                        this.props.dispatch(
                          getFilterInTrackEditS({ searchField: 'zone_s', val: valueSelect, child: 'station', fport: '165' })
                        );
                        this.setState({ stationEdit: undefined });
                      }
                    }}
                    floatingLabelStyle={{ fontFamily: 'Roboto' }}
                    dropDownMenuProps={{ anchorOrigin: { vertical: 'center', horizontal: 'left' } }}
                  >
                    {editList.map(item => (
                      <MenuItem value={item._id.val} primaryText={item._id.name} key={Math.random()} />
                    ))}
                  </SelectField>
                </Grid>
              </Grid>
            );
          } else {
            notMustField.push(
              <Grid item xs={12} sm={6} md={4} lg={4}>
                <Grid
                  container
                  justify="center"
                  style={{
                    backgroundColor: '#FAFAFA',
                    // border: '0.5px solid #ced4da',
                    borderRadius: 5,
                    paddingLeft: '1em',
                    paddingRight: '1em',
                  }}
                >
                  <TextField
                    id={key}
                    label={<FormattedMessage {...messages[key]} />}
                    // label={key}
                    className={classes.textField}
                    InputLabelProps={{
                      shrink: true,
                      className: classes.resize,
                    }}
                    InputProps={{
                      classes: {
                        input: classes.resize,
                      },
                    }}
                    style={{ width: '100%' }}
                    value={this.state[editValue] === undefined ? value : this.state[editValue]}
                    onChange={e => {
                      this.setState({ [editValue]: e.target.value });
                    }}
                    margin="normal"
                    placeholder={formattedMessage}
                  />
                </Grid>
              </Grid>
            );
          }
        }
      }
      return (
        <Grid container className={classes.root} justify="center" spacing={8} style={{ marginTop: 5, marginBottom: 5 }}>
          {mustField}
          {notMustField}
        </Grid>
      );
    };

    const tagInfoDiaFunc = () => {
      const { trackList } = this.props;
      return (
        trackList.size !== 0 && Object.keys(trackList).length !== 0 && Object.values(trackList.factory_s).length !== 0 && this.showProcTime()
      );
    };

    const contentStyleWidthNormal = {
      borderRadius: 4,
    };

    const contentStyleWidthMax = {
      borderRadius: 4,
      width: '100%',
      maxWidth: 'none',
    };

    const { intl } = this.props;
    const formatMessageHisInfo = intl.formatMessage({ id: 'MERC.containers.PersonnelPage.hisInfo' });
    const formatMessageEdit = intl.formatMessage({ id: 'MERC.containers.PersonnelPage.edit' });
    const formatMessageInfo = intl.formatMessage({ id: 'MERC.containers.PersonnelPage.info' });
    const formatMessageChooseShowField = intl.formatMessage({ id: 'MERC.containers.PersonnelPage.chooseShowField' });
    const formattedWorkListProcessTime = intl.formatMessage({ id: 'MERC.containers.PersonnelPage.userProcessTime' });
    return (
      <div>
        <Dialog
          title={tagInfoDia && formattedWorkListProcessTime}
          actions={actions}
          modal={false}
          open={tagInfoDia}
          onRequestClose={hdlDiaClose}
          contentStyle={tagHisDia ? contentStyleWidthMax : contentStyleWidthNormal}
          titleStyle={{ fontWeight: 800 }}
          autoScrollBodyContent
        >
          {tagInfoDia && tagInfoDiaFunc()}
        </Dialog>
        <Dialog
          title={
            (tagHisDia && tagHisDiaInfo['information.id'].concat(formatMessageHisInfo)) ||
            (tagEditDia && formatMessageEdit.concat(tagEditDiaInfo['information.id'], formatMessageInfo)) ||
            (trackHisDia && trackHisDiaInfo.name.concat(' ', formatMessageHisInfo)) ||
            (columnOpenDia && formatMessageChooseShowField) ||
            (trackEditDia && formatMessageEdit.concat(trackEditDiaInfo.desc, formatMessageInfo))
          }
          actions={actions}
          modal={false}
          open={macAddrChartFlag || tagHisDia || tagEditDia || trackHisDia || columnOpenDia || trackEditDia}
          onRequestClose={hdlDiaClose}
          contentStyle={tagHisDia ? contentStyleWidthMax : contentStyleWidthNormal}
          titleStyle={{ fontWeight: 800 }}
          autoScrollBodyContent
        >
          {/* track: 機台 tag: 工單 */}
          {macAddrChartFlag && chartFunc()}
          {tagHisDia && tagHisFunc()}
          {tagEditDia && tagEditFunc()}
          {trackHisDia && trackHisFunc()}
          {columnOpenDia && selectColFunc()}
          {trackEditDia && trackEditFunc()}
        </Dialog>
      </div>
    );
  }

  renderHeaderData(column) {
    const { intl } = this.props;
    const TableHeaderColumnArr = [];
    let formattedShowFieldString;
    let formattedShowField;

    for (let i = 0; i < column.length; i += 1) {
      if (column[i] === 'macAddr') {
        formattedShowFieldString = 'app.containers.PersonnelPage.'.concat(column[i]);
        formattedShowField = intl.formatMessage({ id: formattedShowFieldString });
      } else {
        formattedShowFieldString = 'MERC.containers.PersonnelPage.'.concat(column[i]);
        formattedShowField = intl.formatMessage({ id: formattedShowFieldString });
      }
      if (i === 0) {
        TableHeaderColumnArr.push(
          <TableHeaderColumn isKey dataField={column[i]} key={Math.random()}>
            {formattedShowField}
          </TableHeaderColumn>
        );
      } else {
        TableHeaderColumnArr.push(
          <TableHeaderColumn dataField={column[i]} key={Math.random()}>
            {formattedShowField}
          </TableHeaderColumn>
        );
      }
    }
    return TableHeaderColumnArr;
  }

  render() {
    const { menuOpen, classes, intl, searchFilter, tagList } = this.props;
    const { tabValue } = this.state;
    const formattedMessageMechine = intl.formatMessage({ id: 'MERC.containers.PersonnelPage.zoneData' });
    const formattedMessageWorkList = intl.formatMessage({ id: 'MERC.containers.PersonnelPage.userListData' });
    return (
      <div>
        <Helmet>
          <title>PersonnelPage</title>
          <meta name="description" content="Description of PersonnelPage" />
        </Helmet>
        {searchFilter.size === 0 ? (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress
              size={30}
              thickness={3}
              style={{
                margin: 50,
              }}
            />
          </div>
        ) : (
          <Card>
            <div>
              <AppBar position="static">
                <Tabs
                  value={tabValue}
                  onChange={(event, value) => {
                    this.setState({ tabValue: value });
                  }}
                  variant="fullWidth"
                  classes={{ indicator: classes.indicator }}
                >
                  <Tab classes={{ root: classes.tabRoot, label: classes.tabLabel }} label={formattedMessageMechine} />
                  <Tab classes={{ root: classes.tabRoot, label: classes.tabLabel }} label={formattedMessageWorkList} />
                </Tabs>
              </AppBar>
              {/* 區域資料Start */}
              {tabValue === 0 && (
                <div>
                  {this.filterFunc()}
                  {this.barChartFunc()}
                  {this.devMetaListFunc()}
                  {this.getTagByMetaFunc()}
                </div>
              )}
              {/* 區域資料End */}
              {/* 人員資料Start */}
              {tabValue === 1 && (
                <div>
                  {this.filterSearchFunc()}
                  {this.tagListFunc()}
                </div>
              )}
              {/* 人員資料End */}
            </div>
          </Card>
        )}
        {tagList !== null && this.dialogFunc()}
      </div>
    );
  }
}

PersonnelPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
  menuOpen: PropTypes.bool,
  classes: PropTypes.object.isRequired,
  intl: intlShape.isRequired,
  waitingM: PropTypes.bool,
  searchFilter: PropTypes.object,
  trackCntList: PropTypes.array,
  tagTypeList: PropTypes.object,
  tagList: PropTypes.array,
  trackList: PropTypes.object,
  trackByIdList: PropTypes.array,
  tagListSize: PropTypes.number,
  devMetaList: PropTypes.array,
  tagByMetaList: PropTypes.array,
  trackByMacList: PropTypes.array,
  showfieldList: PropTypes.array,
  editFList: PropTypes.array,
  editZList: PropTypes.array,
  editSList: PropTypes.array,
  tagByMetaCnt: PropTypes.number,
};

const mapStateToProps = createStructuredSelector({
  waitingM: SelectSendingReqM(),
  personnelpage: makeSelectPersonnelPage(),
  menuOpen: SelectMenuOpened(),
  searchFilter: SelectSearchFilter(),
  trackCntList: SelectTrackCntList(),
  tagTypeList: SelectTagTypeList(),
  tagList: SelectTagList(),
  trackList: SelectTrackList(),
  trackByIdList: SelectTrackByIdList(),
  tagListSize: SelectTagListSize(),
  devMetaList: SelectDevMetaList(),
  tagByMetaList: SelectTagByMetaList(),
  trackByMacList: SelectTrackByMacList(),
  showfieldList: SelectShowFieldList(),
  editFList: SelectFieldInTrackEditF(),
  editZList: SelectFieldInTrackEditZ(),
  editSList: SelectFieldInTrackEditS(),
  tagByMetaCnt: SelectTagByMetaCnt(),
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

const styles = theme => ({
  tabRoot: {
    maxWidth: '100%',
    height: '4em',
    fontWeight: theme.typography.fontWeightMedium,
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
    backgroundColor: '#0D47A1',
    color: 'white',
    '&:hover': {
      opacity: 1,
    },
    '&:focus': {
      fontWeight: theme.typography.fontWeightMedium,
    },
  },
  tabLabel: {
    fontSize: 20,
  },
  indicator: {
    height: 5,
  },
  resize: {
    fontSize: 16,
  },
  resizeTime: {
    fontSize: 16,
  },
  textField: {
    fontWeight: 800,
    fontSize: 50,
  },
  root: {
    flexGrow: 1,
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  button: {
    margin: -12,
    borderRadius: 5,
    width: 50,
  },
  buttonSearch: {
    width: '2em',
    height: '2em',
    border: '2px solid #E0E0E0',
    backgroundColor: '#EEEEEE',
    marginLeft: 0,
    marginRight: 0,
  },
  tooltipCus: {
    fontSize: 20,
  },
});

const withReducer = injectReducer({ key: 'personnelPage', reducer });
const withSaga = injectSaga({ key: 'personnelPage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
  injectIntl,
  withStyles(styles)
)(PersonnelPage);
