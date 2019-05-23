/**
 *
 * DashboardIioT
 *
 */

/* eslint-disable global-require */
/* eslint-disable prefer-template */
/* eslint-disable no-lone-blocks */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-loop-func */
/* eslint-disable no-mixed-operators */
/* eslint-disable one-var */
/* eslint-disable no-multi-assign */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable react/jsx-indent */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unneeded-ternary */
/* eslint-disable import/no-named-default */
/* eslint-disable no-confusing-arrow */

// core import
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { push } from 'react-router-redux';

// interactjs
import interact from 'interactjs';
// chartjs
import { Line } from 'react-chartjs-2';
// react-speed-dial
import { SpeedDial, BubbleList, BubbleListItem } from 'react-speed-dial';
// cloneDeep to substitute object.assign
import cloneDeep from 'lodash.clonedeep';
// UI Icon Picker
import MaterialUiIconPicker from 'react-material-ui-icon-picker';
// IFrame
import Iframe from 'react-iframe';

// material-ui
import Toggle from 'material-ui/Toggle';
import MenuItem from 'material-ui/MenuItem';
import Avatar from 'material-ui/Avatar';
import { blue500, red500 } from 'material-ui/styles/colors';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';

// material-ui/svg-icons
import AddWidget from 'material-ui/svg-icons/device/widgets';
import AddCircle from 'material-ui/svg-icons/content/add-circle';
import Add from 'material-ui/svg-icons/content/add';
import RemoveIcon from 'material-ui/svg-icons/content/remove';
import ModeEdit from 'material-ui/svg-icons/editor/mode-edit';
import UploadIcon from 'material-ui/svg-icons/file/cloud-upload';
import SaveIcon from 'material-ui/svg-icons/content/save';
import EditIcon from 'material-ui/svg-icons/image/edit';
import DeleteSweep from 'material-ui/svg-icons/content/delete-sweep';
import TouchIcon from 'material-ui/svg-icons/action/touch-app';
import LineChartIcon from 'material-ui/svg-icons/editor/show-chart';
import SwitchChartIcon from 'material-ui/svg-icons/toggle/radio-button-checked';
import ArrowLeftIcon from 'material-ui/svg-icons/hardware/keyboard-arrow-left';
import ArrowRightIcon from 'material-ui/svg-icons/hardware/keyboard-arrow-right';
import CheckIcon from 'material-ui/svg-icons/navigation/check';
import RefreshIcon from 'material-ui/svg-icons/navigation/refresh';
import CheckBlankIcon from 'material-ui/svg-icons/toggle/check-box-outline-blank';

// material-ui-next
import Tooltip from 'material-ui-next/Tooltip';

// @material-ui
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import Typography from '@material-ui/core/Typography';
// import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import Badge from '@material-ui/core/Badge';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import { default as AvatarNew } from '@material-ui/core/Avatar';
import { default as IconButtonNew } from '@material-ui/core/IconButton';
import Checkbox from '@material-ui/core/Checkbox';
import Icon from '@material-ui/core/Icon';

// @icon
import { default as CheckIconNew } from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import CheckBoxIcon from '@material-ui/icons/CheckBox';

import { TableHeaderColumn } from 'react-bootstrap-table';
import 'react-bootstrap-table/dist/react-bootstrap-table.min.css';
import 'react-bootstrap-table/dist/react-bootstrap-table.min';

// antd
import {
  Table,
  Form,
  InputNumber,
  Popover,
  Input,
  Button,
  DatePicker,
  TimePicker,
  Modal,
  Row,
  Col,
  Select,
  Icon as IconA,
  Spin,
  Popconfirm,
  Tooltip as TooltipA,
  // message as messageA,
} from 'antd';
import moment from 'moment';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import {
  getLayoutList,
  getLayoutDataList,
  setMqttCtl,
  setLayoutListIndex,
  setUploadPlan,
  getUploadPlanList,
  getEventType,
  getSensorListByfport,
  getDataField,
  getPreviewGraph,
  setDashboardDL,
  getLayoutDataListWSearch,
} from './actions';
import {
  makeSelectDashboardIioT,
  SelectSetLayoutList,
  SelectSetLayoutDataList,
  SelectUploadPlanList,
  SelectEventType,
  SelectSensorListByPort,
  SelectDataField,
  SelectPrevData,
  SelectLayoutDataWSearch,
  SelectLoginSuccess,
} from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';

import { SelectMenuOpened, SelectSendingReqS, SelectSendingReqM, SelectRefreshPlan } from '../App/selectors';
import { getFocusMenu, planRefresh } from '../App/actions';
import { getAuthToken, getIPort, getFormState } from '../../utils/storageUtility';

// import dataLine from './chartjs/dataLine';
import dataLineTemp from './chartjs/dataLineTemp';
import dataLineHumi from './chartjs/dataLineHumi';
import lineOptions from './chartjs/lineOptions';
import lineOptionsHumi from './chartjs/lineOptionsHumi';

// data process
import tempDataProcess from './dataProcess/tempDataProcess';
// import humiDataProcess from './dataProcess/humiDataProcess';

// import dnd css
import './css/styles-dnd.css';
import './css/material-ui.css';

import './styles.css';

import { iconList } from './iconList';

const { Column, ColumnGroup } = Table;
const FormItem = Form.Item;
const Option = Select.Option;

// current
let currXY = [];
let dropList = [];

// flag
let getSensorListByfportFlag = 0;
const dataArr = [];

let message = '00';
let dateFromD = '';
let dateFromT = '';
let dateToD = '';
let dateToT = '';

// upload
let fileUpload = null;

// icon picker
let iconPicker = null;

export class DashboardIioT extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tabValue: 0,
      headerNum: 6,

      // real time width and height of img
      widthImg: 0,
      heightImg: 0,

      // speedDial
      isSpeedDialOpen: false,

      // dialog
      addTabDia: false,
      editTabDia: false,
      addWidgetDia: false,
      uploadPlanDia: false,
      editPlanDia: false,
      choosePlanDia: false,
      delConfDia: false,
      // addTabDia
      tabContentType: '',
      pickIcon: false,
      addTabName: '',
      // editTabDia
      layoutListState: undefined,
      // uploadPlanDia
      planName: '',
      planDesc: '',
      planVers: '',
      planVeri: '',
      file: null,
      // choosePlanDia
      chosenPlan: 0,
      // delConfDia
      delIdx: null,
      // addWidgetDia
      activeStep: 0,
      selValFPort: null,
      selMacAddr: null,
      selMacAddrName: [],
      selChart: null,
      addWidgetChartTitle: '',
      addWidgetXAxisTitle: '',
      addWidgetXAxisDataLimit: '',
      addWidgetYAxisTitle: '',
      addWidgetYAxisLegendTitle: [''],
      addWidgetYAxisDataLimit: '',
      yAxisField: [],
      selXAxisData: '',
      selYAxisData: [''],
      // img loading
      imageLoading: true,
      number: {
        value: 30,
      },
      loading: false,

      // rightDrawer
      rDrawerOpen: false,

      // modal
      addTabOpen: false,
      editTabOpen: false,
      count: 2,
      popVisible: false,
    };
    // function binding
    this.onImgLoad = this.onImgLoad.bind(this);
    this.mounted = false;
  }

  componentDidMount() {
    const { tabValue } = this.state;
    this.props.dispatch(getLayoutList());
    this.props.dispatch(getLayoutDataList({ tabValue }));
    // document.addEventListener('keydown', this.onKeyPressed.bind(this));
    // Add Widget
    this.props.dispatch(getEventType());
    this.mounted = true;
  }

  componentWillReceiveProps(nextProps) {
    interact('.draggable').draggable({
      inertia: true,
      restrict: {
        restriction: 'parent',
        endOnly: true,
        elementRect: { top: 0, left: 0, bottom: 1, right: 1 },
      },
      autoScroll: true,
      onmove: evt => this.dragMoveListener(evt),
      onend: evt => this.dragEndListener(evt),
    });
    interact('.dropzone').dropzone({
      accept: dropList,
      overlap: 0.1,
      ondropactivate: event => {
        event.target.classList.add('drop-active');
      },
      ondragenter: event => {
        const draggableElement = event.relatedTarget,
          dropzoneElement = event.target;
        dropzoneElement.classList.add('drop-target');
        draggableElement.classList.add('can-drop');
      },
      ondragleave: event => {
        event.target.classList.remove('drop-target');
        event.relatedTarget.classList.remove('can-drop');
      },
      ondrop: event => {
        const dropRect = interact.getElementRect(event.target);
        const dropRelatedRect = interact.getElementRect(event.relatedTarget);
        const xRelated = dropRelatedRect.left - dropRect.left;
        const yRelated = dropRelatedRect.top - dropRect.top;
        event.target.setAttribute('data-x', xRelated);
        event.target.setAttribute('data-y', yRelated);
      },
      ondropdeactivate: event => {
        event.target.classList.remove('drop-active');
        event.target.classList.remove('drop-target');
      },
    });
    if (nextProps.refreshPlan === true) {
      const { tabValue } = this.state;
      this.props.dispatch(getLayoutDataList({ tabValue }));
      this.props.dispatch(planRefresh(false));
    }
  }

  componentDidUpdate() {}

  componentWillUnmount() {
    // document.removeEventListener('keydown', this.onKeyPressed);
    this.mounted = false;
  }

  // onKeyPressed(e) {
  //   const { layoutList } = this.props;
  //   const { tabValue } = this.state;
  //   if (e.keyCode === 37 && tabValue > 0) {
  //     setTimeout(() => {
  //       if (!this.mounted) return;
  //       this.setState({ tabValue: tabValue - 1, imageLoading: true });
  //     }, 100);
  //   } else if (e.keyCode === 39 && tabValue < layoutList.length - 1) {
  //     setTimeout(() => {
  //       if (!this.mounted) return;
  //       this.setState({ tabValue: tabValue + 1, imageLoading: true });
  //     }, 100);
  //   }
  //   currXY = [];
  // }

  onImgLoad({ target: img }) {
    this.setState({
      widthImg: img.offsetWidth,
      heightImg: img.offsetHeight,
      imageLoading: false,
    });
    currXY = [];
  }

  dragMoveListener = evt => {
    const { tabValue, widthImg, heightImg } = this.state;
    const { layoutList } = this.props;
    const widgetNo = evt.currentTarget.id.split('-')[2];
    const widgetCoorX = layoutList[tabValue].planInfo.widgetInfo[widgetNo]['widgetCoor-X'];
    const widgetCoorY = layoutList[tabValue].planInfo.widgetInfo[widgetNo]['widgetCoor-Y'];
    const defaultWidthImg = layoutList[tabValue].planInfo.defaultWindowWidth;
    const defaultHeightImg = layoutList[tabValue].planInfo.defaultWindowHeight;
    const target = evt.target,
      x = (parseFloat(target.getAttribute('data-x')) || (widgetCoorX * widthImg) / defaultWidthImg) + evt.dx,
      y = (parseFloat(target.getAttribute('data-y')) || (widgetCoorY * heightImg) / defaultHeightImg) + evt.dy;
    // translate the element
    target.style.webkitTransform = target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
    // currXY
    if (currXY.length !== layoutList[tabValue].planInfo.widgetInfo.length) {
      for (let i = 0; i < layoutList[tabValue].planInfo.widgetInfo.length; i += 1) {
        currXY.push([
          (layoutList[tabValue].planInfo.widgetInfo[i]['widgetCoor-X'] * widthImg) / defaultWidthImg,
          (layoutList[tabValue].planInfo.widgetInfo[i]['widgetCoor-Y'] * heightImg) / defaultHeightImg,
        ]);
      }
    }
    currXY[widgetNo] = [(x * widthImg) / defaultWidthImg, (y * heightImg) / defaultHeightImg];
  };

  dragEndListener = evt => {
    const target = evt.target,
      x = evt.dx,
      y = evt.dy;
    if (evt.currentTarget.getAttribute('class').includes('can-drop') === false) {
      target.style.webkitTransform = target.style.transform = 'translate(' + 0 + 'px, ' + 0 + 'px)';
      target.setAttribute('data-x', x);
      target.setAttribute('data-y', y);
    }
  };

  switchChart(index) {
    const { layoutDataList, layoutList } = this.props;
    const { tabValue } = this.state;
    const swiItem = layoutDataList[tabValue][index];
    const switchChartArr = [];
    for (let i = 0; i < swiItem.length; i += 1) {
      switchChartArr.push(
        <MenuItem style={{ marginLeft: '1em', marginRight: '1em' }} key={Math.random()}>
          <Toggle
            label={layoutList[tabValue].chartInfo[index].chartData.switchTitle[i]}
            toggled={Boolean(swiItem[i])}
            onToggle={() => {
              let switchChg = !swiItem[i];
              if (switchChg) {
                switchChg = 1;
              } else switchChg = 0;
              let currChkTol;
              const mqttType = layoutList[tabValue].chartInfo[index].chartData.mqttType;
              const mqttHeaderNum = Number(layoutList[tabValue].chartInfo[index].chartData.mqttHeaderNum);
              switch (i) {
                case 0: {
                  currChkTol = mqttHeaderNum + switchChg + swiItem[1] + swiItem[2] + swiItem[3];
                  const currChkTolHU = currChkTol.toString(16).toUpperCase();
                  this.props.dispatch(
                    setMqttCtl(['060', switchChg, '0', swiItem[1], '0', swiItem[2], '0', swiItem[3], '0', currChkTolHU, mqttType])
                  );
                  break;
                }
                case 1: {
                  currChkTol = mqttHeaderNum + swiItem[0] + switchChg + swiItem[2] + swiItem[3];
                  const currChkTolHU = currChkTol.toString(16).toUpperCase();
                  this.props.dispatch(
                    setMqttCtl(['060', swiItem[0], '0', switchChg, '0', swiItem[2], '0', swiItem[3], '0', currChkTolHU, mqttType])
                  );
                  break;
                }
                case 2: {
                  currChkTol = mqttHeaderNum + swiItem[0] + swiItem[1] + switchChg + swiItem[3];
                  const currChkTolHU = currChkTol.toString(16).toUpperCase();
                  this.props.dispatch(
                    setMqttCtl(['060', swiItem[0], '0', swiItem[1], '0', switchChg, '0', swiItem[3], '0', currChkTolHU, mqttType])
                  );
                  break;
                }
                case 3: {
                  currChkTol = mqttHeaderNum + swiItem[0] + swiItem[1] + swiItem[2] + switchChg;
                  const currChkTolHU = currChkTol.toString(16).toUpperCase();
                  this.props.dispatch(
                    setMqttCtl(['060', swiItem[0], '0', swiItem[1], '0', swiItem[2], '0', switchChg, '0', currChkTolHU, mqttType])
                  );
                  break;
                }
                default:
                  null;
              }
            }}
          />
        </MenuItem>
      );
    }
    return switchChartArr;
  }

  showChartLayout() {
    const { layoutList, layoutDataList, classes, waitingM } = this.props;
    const { tabValue } = this.state;
    const showChartLayout = [];
    for (let i = 0; i < layoutDataList[tabValue].length; i += 1) {
      if (layoutList[tabValue].tabType === 'Chart') {
        if (layoutList[tabValue].chartInfo[i].chartType === 'lineChart') {
          if (layoutList[tabValue].chartInfo[i].chartData.vals[0].mainVal === 'information.temperature') {
            showChartLayout.push(
              <Grid item xs={12} sm={12} md={6} lg={6} xl={6} key={Math.random()}>
                <Card className={classes.chartCard}>
                  <Line
                    data={dataLineTemp(layoutDataList[tabValue][i], 0, 1)}
                    options={lineOptions(layoutList[tabValue].chartInfo[i].chartLayout.title)}
                  />
                </Card>
              </Grid>
            );
          } else if (layoutList[tabValue].chartInfo[i].chartData.vals[0].mainVal === 'information.humidity') {
            showChartLayout.push(
              <Grid item xs={12} sm={12} md={6} lg={6} xl={6} key={Math.random()}>
                <Card className={classes.chartCard}>
                  <Line
                    data={dataLineHumi(layoutDataList[tabValue][i], 0, 1)}
                    options={lineOptionsHumi(layoutList[tabValue].chartInfo[i].chartLayout.title)}
                  />
                </Card>
              </Grid>
            );
          }
        } else if (layoutList[tabValue].chartInfo[i].chartType === 'switchChart') {
          showChartLayout.push(
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6} key={Math.random()}>
              <Card className={classes.chartCard}>
                <div style={{ display: 'flex', justifyContent: 'center', margin: 20, fontWeight: 900, fontSize: 20 }}>
                  {layoutList[tabValue].chartInfo[i].chartLayout.title}
                </div>
                {layoutList[tabValue].chartInfo[i].chartData.switchType === 'switch' && <div>{this.switchChart(i)}</div>}
                {layoutList[tabValue].chartInfo[i].chartData.switchType === 'status' && (
                  <MenuItem style={{ justifyContent: 'center', alignContent: 'center' }} disabled key={Math.random()}>
                    <Toggle
                      toggled={!layoutDataList[tabValue][i][0]}
                      disabled
                      label={layoutList[tabValue].chartInfo[i].chartData.switchTitle[0]}
                      defaultToggled
                      style={styles.toggle}
                    />
                  </MenuItem>
                )}
              </Card>
            </Grid>
          );
        } else if (layoutList[tabValue].chartInfo[i].chartType === 'esdChart') {
          showChartLayout.push(
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} key={Math.random()}>
              <div style={{ display: 'flex', justifyContent: 'center' }} key={Math.random()}>
                <Card className={classes.chartCard} style={{ width: '50em' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', margin: 20, fontWeight: 900, fontSize: 20 }} key={Math.random()}>
                    {layoutList[tabValue].chartInfo[i].chartLayout.title}
                  </div>
                  <CardActions className={classes.actions} disableActionSpacing>
                    <Tooltip
                      id="selectAllOpen"
                      title={<FormattedMessage {...messages.selectAllOpen} />}
                      placement="bottom"
                      classes={{ tooltip: classes.tooltipCus }}
                    >
                      <div key={Math.random()}>
                        <IconButtonNew
                          aria-label="selectAllOpen"
                          style={{ color: '#64DD17', backgroundColor: '#F5F5F5', width: '2em', height: '2em', margin: '0.3em' }}
                        >
                          <CheckBoxIcon
                            onClick={() => {
                              for (let j = 0; j < layoutList[tabValue].chartInfo.length; j += 1) {
                                for (let k = 0; k < layoutList[tabValue].chartInfo[j].chartData.mac.length; k += 1) {
                                  if (layoutDataList[tabValue][j][k] === 2 || layoutDataList[tabValue][j][k] === 3) {
                                    this.setState({ [layoutList[tabValue].chartInfo[j].chartData.mac[k]]: true });
                                  } else {
                                    this.setState({ [layoutList[tabValue].chartInfo[j].chartData.mac[k]]: false });
                                  }
                                }
                              }
                            }}
                          />
                        </IconButtonNew>
                      </div>
                    </Tooltip>
                    <Tooltip
                      id="selectAllClose"
                      title={<FormattedMessage {...messages.selectAllClose} />}
                      placement="bottom"
                      classes={{ tooltip: classes.tooltipCus }}
                    >
                      <div key={Math.random()}>
                        <IconButtonNew
                          aria-label="disable-icon"
                          style={{ color: '#F44336', backgroundColor: '#F5F5F5', width: '2em', height: '2em', margin: '0.3em' }}
                        >
                          <CheckBoxIcon
                            onClick={() => {
                              for (let j = 0; j < layoutList[tabValue].chartInfo.length; j += 1) {
                                for (let k = 0; k < layoutList[tabValue].chartInfo[j].chartData.mac.length; k += 1) {
                                  if (layoutDataList[tabValue][j][k] === 0 || layoutDataList[tabValue][j][k] === null) {
                                    this.setState({ [layoutList[tabValue].chartInfo[j].chartData.mac[k]]: true });
                                  } else {
                                    this.setState({ [layoutList[tabValue].chartInfo[j].chartData.mac[k]]: false });
                                  }
                                }
                              }
                            }}
                          />
                        </IconButtonNew>
                      </div>
                    </Tooltip>
                    <Tooltip
                      id="deSelectAll"
                      title={<FormattedMessage {...messages.clearAllSelect} />}
                      placement="bottom"
                      classes={{ tooltip: classes.tooltipCus }}
                    >
                      <div key={Math.random()}>
                        <IconButtonNew
                          aria-label="disable-icon"
                          style={{ color: '#F44336', backgroundColor: '#F5F5F5', width: '2em', height: '2em', margin: '0.3em' }}
                        >
                          <CheckBlankIcon
                            onClick={() => {
                              for (let j = 0; j < layoutList[tabValue].chartInfo.length; j += 1) {
                                for (let k = 0; k < layoutList[tabValue].chartInfo[j].chartData.mac.length; k += 1) {
                                  this.setState({ [layoutList[tabValue].chartInfo[j].chartData.mac[k]]: false });
                                }
                              }
                            }}
                          />
                        </IconButtonNew>
                      </div>
                    </Tooltip>
                    <Tooltip
                      id="enable-icon"
                      title={<FormattedMessage {...messages.openAllSelectedDevice} />}
                      placement="bottom"
                      classes={{ tooltip: classes.tooltipCus }}
                    >
                      <div key={Math.random()}>
                        <IconButtonNew
                          aria-label="enable-icon"
                          color="primary"
                          style={{ backgroundColor: '#F5F5F5', width: '2em', height: '2em', margin: '0.3em' }}
                          disabled={this.state.closeFlg}
                        >
                          <CheckIconNew
                            onClick={() => {
                              for (let j = 0; j < layoutList[tabValue].chartInfo.length; j += 1) {
                                for (let k = 0; k < layoutList[tabValue].chartInfo[j].chartData.mac.length; k += 1) {
                                  if (this.state[layoutList[tabValue].chartInfo[j].chartData.mac[k]] === true) {
                                    const layoutDataListTmp = [...layoutDataList];
                                    layoutDataListTmp[tabValue][j][k] = 2;
                                    setTimeout(() => {
                                      this.setState({ ['togDisable'.concat(k)]: true, closeFlg: true });
                                    }, 500);
                                    setTimeout(() => {
                                      this.setState({ ['togDisable'.concat(k)]: false, closeFlg: false });
                                    }, 3000);
                                    this.setState({ [layoutList[tabValue].chartInfo[j].chartData.mac[k]]: false });
                                  }
                                }
                              }
                              const messArr = [];
                              const macArr = [];
                              for (let j = 0; j < layoutList[tabValue].chartInfo.length; j += 1) {
                                for (let k = 0; k < layoutList[tabValue].chartInfo[j].chartData.mac.length; k += 1) {
                                  if (this.state[layoutList[tabValue].chartInfo[j].chartData.mac[k]] === true) {
                                    messArr.push(1);
                                    macArr.push(layoutList[tabValue].chartInfo[j].chartData.mac[k]);
                                  }
                                }
                              }
                              this.props.dispatch(
                                setDashboardDL({
                                  fport: layoutList[tabValue].chartInfo[0].chartData.fport,
                                  message: messArr,
                                  mac: macArr,
                                })
                              );
                            }}
                          />
                        </IconButtonNew>
                      </div>
                    </Tooltip>
                    <Tooltip
                      id="disable-icon"
                      title={<FormattedMessage {...messages.closeAllSelectedDevice} />}
                      placement="bottom"
                      classes={{ tooltip: classes.tooltipCus }}
                    >
                      <div key={Math.random()}>
                        <IconButtonNew
                          aria-label="disable-icon"
                          color="secondary"
                          style={{ backgroundColor: '#F5F5F5', width: '2em', height: '2em', margin: '0.3em' }}
                        >
                          <CloseIcon
                            onClick={() => {
                              for (let j = 0; j < layoutList[tabValue].chartInfo.length; j += 1) {
                                for (let k = 0; k < layoutList[tabValue].chartInfo[j].chartData.mac.length; k += 1) {
                                  if (this.state[layoutList[tabValue].chartInfo[j].chartData.mac[k]] === true) {
                                    const layoutDataListTmp = [...layoutDataList];
                                    layoutDataListTmp[tabValue][j][k] = 0;
                                    setTimeout(() => {
                                      this.setState({ ['togDisable'.concat(k)]: true });
                                    }, 500);
                                    setTimeout(() => {
                                      this.setState({ ['togDisable'.concat(k)]: false });
                                    }, 3000);
                                    this.setState({ [layoutList[tabValue].chartInfo[j].chartData.mac[k]]: false });
                                  }
                                }
                              }
                              const messArr = [];
                              const macArr = [];
                              for (let j = 0; j < layoutList[tabValue].chartInfo.length; j += 1) {
                                for (let k = 0; k < layoutList[tabValue].chartInfo[j].chartData.mac.length; k += 1) {
                                  if (this.state[layoutList[tabValue].chartInfo[j].chartData.mac[k]] === true) {
                                    messArr.push(0);
                                    macArr.push(layoutList[tabValue].chartInfo[j].chartData.mac[k]);
                                  }
                                }
                              }
                              this.props.dispatch(
                                setDashboardDL({
                                  fport: layoutList[tabValue].chartInfo[0].chartData.fport,
                                  message: messArr,
                                  mac: macArr,
                                })
                              );
                            }}
                          />
                        </IconButtonNew>
                      </div>
                    </Tooltip>
                  </CardActions>
                  {layoutList[tabValue].chartInfo[i].chartLayout.switchTitle.map((item, index) => (
                    <div style={{ display: 'flex', width: '100%' }} key={Math.random()}>
                      <div style={{ display: 'inline-flex', justifyContent: 'center', width: '100%' }} key={Math.random()}>
                        <Checkbox
                          disabled={this.state['togDisable'.concat(index)] === true}
                          checked={this.state[layoutList[tabValue].chartInfo[i].chartData.mac[index]]}
                          onChange={event => {
                            this.setState({ [layoutList[tabValue].chartInfo[i].chartData.mac[index]]: event.target.checked });
                          }}
                          value="checkedA"
                          color="primary"
                        />
                        <MenuItem
                          primaryText={item}
                          disabled={this.state['togDisable'.concat(index)] === true}
                          rightIcon={
                            <FontIcon
                              className="material-icons"
                              style={{
                                textAlign: 'center',
                                lineHeight: '24px',
                                color:
                                  layoutDataList[tabValue][i][index] === 0
                                    ? '#bbb'
                                    : layoutDataList[tabValue][i][index] === 2
                                    ? '#64DD17'
                                    : layoutDataList[tabValue][i][index] === 3
                                    ? '#F44336'
                                    : layoutDataList[tabValue][i][index] === null
                                    ? '#FFCDD2'
                                    : '',
                              }}
                            >
                              {layoutDataList[tabValue][i][index] === 0
                                ? 'offline_bolt'
                                : layoutDataList[tabValue][i][index] === 2
                                ? 'offline_bolt'
                                : layoutDataList[tabValue][i][index] === 3
                                ? 'error'
                                : layoutDataList[tabValue][i][index] === null
                                ? 'not_interested'
                                : ''}
                            </FontIcon>
                          }
                          key={Math.random()}
                        />
                      </div>
                    </div>
                  ))}
                </Card>
              </div>
            </Grid>
          );
        } else if (layoutList[tabValue].chartInfo[i].chartType === 'ACChart') {
          // *** ACChart START *** //
          showChartLayout.push(
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} key={Math.random()}>
              <div style={{ display: 'flex', justifyContent: 'center' }} key={Math.random()}>
                <Card className={classes.chartCard} style={{ width: '50em' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', margin: 20, fontWeight: 900, fontSize: 20 }} key={Math.random()}>
                    {layoutList[tabValue].chartInfo[i].chartLayout.title}
                  </div>
                  {waitingM ? (
                    <div
                      style={{
                        display: 'flex',
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'center',
                      }}
                    >
                      {/* <CircularProgress size={20} thickness={10} style={{ color: '#0277BD' }} /> */}
                      <Spin tip="Loading..." />
                    </div>
                  ) : (
                    <CardActions className={classes.actions} disableActionSpacing>
                      <Tooltip
                        id="selectAllOpen"
                        title={<FormattedMessage {...messages.selectAllOpen} />}
                        placement="bottom"
                        classes={{ tooltip: classes.tooltipCus }}
                      >
                        <div key={Math.random()}>
                          <IconButtonNew
                            aria-label="selectAllOpen"
                            style={{ color: '#64DD17', backgroundColor: '#F5F5F5', width: '2em', height: '2em', margin: '0.3em' }}
                          >
                            <CheckBoxIcon
                              onClick={() => {
                                for (let j = 0; j < layoutList[tabValue].chartInfo.length; j += 1) {
                                  for (let k = 0; k < layoutList[tabValue].chartInfo[j].chartData.mac.length; k += 1) {
                                    if (layoutDataList[tabValue][j][k][2] === 1) {
                                      this.setState({ [layoutList[tabValue].chartInfo[j].chartData.mac[k]]: true });
                                    } else {
                                      this.setState({ [layoutList[tabValue].chartInfo[j].chartData.mac[k]]: undefined });
                                    }
                                  }
                                }
                              }}
                            />
                          </IconButtonNew>
                        </div>
                      </Tooltip>
                      <Tooltip
                        id="selectAllClose"
                        title={<FormattedMessage {...messages.selectAllClose} />}
                        placement="bottom"
                        classes={{ tooltip: classes.tooltipCus }}
                      >
                        <div key={Math.random()}>
                          <IconButtonNew
                            aria-label="disable-icon"
                            style={{ color: '#F44336', backgroundColor: '#F5F5F5', width: '2em', height: '2em', margin: '0.3em' }}
                          >
                            <CheckBoxIcon
                              onClick={() => {
                                for (let j = 0; j < layoutList[tabValue].chartInfo.length; j += 1) {
                                  for (let k = 0; k < layoutList[tabValue].chartInfo[j].chartData.mac.length; k += 1) {
                                    if (layoutDataList[tabValue][j][k][2] === 0) {
                                      this.setState({ [layoutList[tabValue].chartInfo[j].chartData.mac[k]]: true });
                                    } else {
                                      this.setState({ [layoutList[tabValue].chartInfo[j].chartData.mac[k]]: undefined });
                                    }
                                  }
                                }
                              }}
                            />
                          </IconButtonNew>
                        </div>
                      </Tooltip>
                      <Tooltip
                        id="deSelectAll"
                        title={<FormattedMessage {...messages.clearAllSelect} />}
                        placement="bottom"
                        classes={{ tooltip: classes.tooltipCus }}
                      >
                        <div key={Math.random()}>
                          <IconButtonNew
                            aria-label="disable-icon"
                            style={{ color: '#F44336', backgroundColor: '#F5F5F5', width: '2em', height: '2em', margin: '0.3em' }}
                          >
                            <CheckBlankIcon
                              onClick={() => {
                                for (let j = 0; j < layoutList[tabValue].chartInfo.length; j += 1) {
                                  for (let k = 0; k < layoutList[tabValue].chartInfo[j].chartData.mac.length; k += 1) {
                                    this.setState({ [layoutList[tabValue].chartInfo[j].chartData.mac[k]]: undefined });
                                  }
                                }
                              }}
                            />
                          </IconButtonNew>
                        </div>
                      </Tooltip>
                      <Tooltip
                        id="enable-icon"
                        title={<FormattedMessage {...messages.openAllSelectedDevice} />}
                        placement="bottom"
                        classes={{ tooltip: classes.tooltipCus }}
                      >
                        <div key={Math.random()}>
                          <IconButtonNew
                            aria-label="enable-icon"
                            color="primary"
                            style={{ backgroundColor: '#F5F5F5', width: '2em', height: '2em', margin: '0.3em' }}
                            disabled={this.state.closeFlg}
                          >
                            <Icon
                              style={{ color: '#64DD17' }}
                              onClick={() => {
                                const messArr = [];
                                const macArr = [];
                                for (let j = 0; j < layoutList[tabValue].chartInfo.length; j += 1) {
                                  for (let k = 0; k < layoutList[tabValue].chartInfo[j].chartData.mac.length; k += 1) {
                                    if (this.state[layoutList[tabValue].chartInfo[j].chartData.mac[k]] === true) {
                                      macArr.push(layoutList[tabValue].chartInfo[j].chartData.mac[k]);
                                      messArr.push(1);
                                    }
                                  }
                                }
                                this.props.dispatch(
                                  setDashboardDL({
                                    fport: layoutList[tabValue].chartInfo[0].chartData.fport,
                                    message: messArr,
                                    mac: macArr,
                                  })
                                );
                                for (let j = 0; j < layoutList[tabValue].chartInfo.length; j += 1) {
                                  for (let k = 0; k < layoutList[tabValue].chartInfo[j].chartData.mac.length; k += 1) {
                                    this.setState({ [layoutList[tabValue].chartInfo[j].chartData.mac[k]]: undefined });
                                  }
                                }
                                this.props.dispatch(getLayoutList());
                                this.props.dispatch(getLayoutDataList());
                                this.forceUpdate();
                              }}
                            >
                              offline_bolt
                            </Icon>
                          </IconButtonNew>
                        </div>
                      </Tooltip>
                      <Tooltip
                        id="disable-icon"
                        title={<FormattedMessage {...messages.closeAllSelectedDevice} />}
                        placement="bottom"
                        classes={{ tooltip: classes.tooltipCus }}
                      >
                        <div key={Math.random()}>
                          <IconButtonNew
                            aria-label="disable-icon"
                            color="secondary"
                            style={{ backgroundColor: '#F5F5F5', width: '2em', height: '2em', margin: '0.3em' }}
                          >
                            <Icon
                              style={{ color: '#bbb' }}
                              onClick={() => {
                                const messArr = [];
                                const macArr = [];
                                for (let j = 0; j < layoutList[tabValue].chartInfo.length; j += 1) {
                                  for (let k = 0; k < layoutList[tabValue].chartInfo[j].chartData.mac.length; k += 1) {
                                    if (this.state[layoutList[tabValue].chartInfo[j].chartData.mac[k]] === true) {
                                      macArr.push(layoutList[tabValue].chartInfo[j].chartData.mac[k]);
                                      messArr.push(0);
                                    }
                                  }
                                }
                                this.props.dispatch(
                                  setDashboardDL({
                                    fport: layoutList[tabValue].chartInfo[0].chartData.fport,
                                    message: messArr,
                                    mac: macArr,
                                  })
                                );
                                for (let j = 0; j < layoutList[tabValue].chartInfo.length; j += 1) {
                                  for (let k = 0; k < layoutList[tabValue].chartInfo[j].chartData.mac.length; k += 1) {
                                    this.setState({ [layoutList[tabValue].chartInfo[j].chartData.mac[k]]: undefined });
                                  }
                                }
                                this.props.dispatch(getLayoutList());
                                this.props.dispatch(getLayoutDataList());
                                this.forceUpdate();
                              }}
                            >
                              offline_bolt
                            </Icon>
                          </IconButtonNew>
                        </div>
                      </Tooltip>
                    </CardActions>
                  )}
                  {layoutList[tabValue].chartInfo[i].chartData.mac.map((item, index) => (
                    <div style={{ display: 'flex', width: '100%' }} key={Math.random()}>
                      <div style={{ display: 'inline-flex', justifyContent: 'center', width: '100%' }} key={Math.random()}>
                        <Checkbox
                          disabled={this.state['ACtogDisable'.concat(index)] === true}
                          checked={this.state[layoutList[tabValue].chartInfo[i].chartData.mac[index]]}
                          onChange={event => {
                            this.setState({ [layoutList[tabValue].chartInfo[i].chartData.mac[index]]: event.target.checked });
                          }}
                          value="checkedA"
                          color="primary"
                        />
                        <MenuItem
                          primaryText={item}
                          disabled
                          rightIcon={
                            <div style={{ display: 'flex', alignItems: 'center', marginLeft: '-2em' }}>
                              <FontIcon
                                className="material-icons"
                                style={{
                                  color:
                                    layoutDataList[tabValue][i][index][1] === 0
                                      ? '#64DD17'
                                      : layoutDataList[tabValue][i][index][1] === 1
                                      ? '#F44336'
                                      : '',
                                }}
                              >
                                {layoutDataList[tabValue][i][index][1] === 0
                                  ? 'check_circle'
                                  : layoutDataList[tabValue][i][index][1] === 1
                                  ? 'error'
                                  : ''}
                              </FontIcon>
                              <FontIcon
                                className="material-icons"
                                style={{
                                  marginLeft: '0.5em',
                                  color:
                                    layoutDataList[tabValue][i][index][2] === 0
                                      ? '#bbb'
                                      : layoutDataList[tabValue][i][index][2] === 1
                                      ? '#64DD17'
                                      : '',
                                }}
                              >
                                {layoutDataList[tabValue][i][index][2] === 0
                                  ? 'offline_bolt'
                                  : layoutDataList[tabValue][i][index][2] === 1
                                  ? 'offline_bolt'
                                  : ''}
                              </FontIcon>
                            </div>
                          }
                          key={Math.random()}
                        />
                      </div>
                    </div>
                  ))}
                  <div style={{ display: 'flex', marginTop: '1em', right: 0, justifyContent: 'flex-end' }}>
                    <div style={{ display: 'inline-flex' }}>
                      <div style={{ marginRight: '1em', display: 'flex', alignItems: 'center' }}>
                        正常
                        <FontIcon
                          className="material-icons"
                          style={{
                            textAlign: 'center',
                            lineHeight: '24px',
                            color: '#64DD17',
                            marginLeft: '0.3em',
                          }}
                        >
                          check_circle
                        </FontIcon>
                      </div>
                      <div style={{ marginRight: '1em', display: 'flex', alignItems: 'center' }}>
                        故障
                        <FontIcon
                          className="material-icons"
                          style={{
                            textAlign: 'center',
                            lineHeight: '24px',
                            color: '#F44336',
                            marginLeft: '0.3em',
                          }}
                        >
                          error
                        </FontIcon>
                      </div>
                      <div style={{ marginRight: '1em', display: 'flex', alignItems: 'center' }}>
                        开启
                        <FontIcon
                          className="material-icons"
                          style={{
                            textAlign: 'center',
                            lineHeight: '24px',
                            color: '#64DD17',
                            marginLeft: '0.3em',
                          }}
                        >
                          offline_bolt
                        </FontIcon>
                      </div>
                      <div style={{ marginRight: '1em', display: 'flex', alignItems: 'center' }}>
                        关闭
                        <FontIcon
                          className="material-icons"
                          style={{
                            textAlign: 'center',
                            lineHeight: '24px',
                            color: '#bbb',
                            marginLeft: '0.3em',
                          }}
                        >
                          offline_bolt
                        </FontIcon>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </Grid>
          );
          // *** ACChart END *** //
        }
      } else if (layoutList[tabValue].tabType === 'Plan') {
        null;
      }
    }
    return showChartLayout;
  }

  tabsFunc() {
    const { classes, intl, waitingS, layoutList, layoutDataList } = this.props;
    const { tabValue, imageLoading } = this.state;
    const tabsList = [];
    const tabList = [];
    const token = getAuthToken();
    const IP = getIPort();
    const minIntl = intl.formatMessage({ id: 'MERC.containers.Dashboard.min' });
    const formItemLayout = {
      labelCol: {
        xs: { span: 12 },
        sm: { span: 6 },
        md: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 12 },
        sm: { span: 3 },
        md: { span: 3 },
      },
    };
    for (let i = 0; i < layoutList.length; i += 1) {
      if (layoutDataList !== null && layoutList[i].tabType === 'Warning') {
        if (dataArr.length === 0) {
          for (let k = 0; k < layoutDataList[i].length; k += 1) {
            dataArr.push({
              key: layoutDataList[i][k].device_mac,
              device_mac: layoutDataList[i][k].device_mac,
              device_name: layoutDataList[i][k].device_name,
              type00: [layoutDataList[i][k].meta.type00.val1 * 30, layoutDataList[i][k].meta.type00.val2],
              type01: [layoutDataList[i][k].meta.type01.val1, layoutDataList[i][k].meta.type01.val2],
              type02: [layoutDataList[i][k].meta.type02.val1, layoutDataList[i][k].meta.type02.val2],
              status: [null, null, null],
            });
          }
        }
      }
      tabsList.push(
        <Tab
          icon={
            // <FontIcon style={{ width: '1em' }} className="material-icons">
            //   {layoutList[i].tabIcon}
            // </FontIcon>
            <IconA type={layoutList[i].tabIcon} style={{ fontSize: 24 }} />
          }
          label={<div style={{ display: 'inline-flex', alignItems: 'center' }}>{layoutList[i].tab}</div>}
          key={Math.random()}
          classes={{ root: classes.tabRoot, selected: classes.tabSelected, label: classes.font, labelIcon: classes.labelIcon }}
        />
      );
      tabList.push(
        tabValue === i && (
          <TabContainer key={Math.random()}>
            <div style={{ margin: '-1.5em' }}>
              <Grid>
                <Card>
                  {layoutList === null || layoutDataList === null ? (
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                      }}
                    >
                      {/* <CircularProgress className={classes.progress} size={50} /> */}
                      <Spin style={{ marginTop: '3em', marginBottom: '3em' }} tip="Loading..." />
                    </div>
                  ) : (
                    // Chart Tab Start
                    (layoutList[i].tabType === 'Chart' && (
                      <Grid container style={{ margin: 10 }}>
                        <Grid container alignItems="center" justify="center" direction="row">
                          {layoutList[i].chartInfo.length !== 0 && this.showChartLayout()}
                          {layoutList[i].chartInfo.length !== 0 && <Grid item xs={12} sm={12} md={6} lg={6} xl={6} key={Math.random()} />}
                          {layoutList[i].chartInfo.length === 0 && (
                            <div>
                              <RaisedButton
                                label="Add Widget"
                                style={{ margin: 20 }}
                                containerElement="label"
                                primary
                                icon={<AddWidget />}
                                onClick={() => {
                                  this.setState({ isSpeedDialOpen: false, addWidgetDia: true });
                                }}
                              />
                            </div>
                          )}
                        </Grid>
                      </Grid>
                      // Chart Tab End
                    )) ||
                    (layoutList[i].tabType === 'Plan' &&
                      (layoutList[i].planInfo.planSrc === '' ? (
                        <Grid container style={{ margin: 10 }}>
                          <Grid container alignItems="center" justify="center" direction="row">
                            <RaisedButton
                              label="Choose Plan"
                              style={{ margin: 20 }}
                              containerElement="label"
                              icon={<TouchIcon />}
                              primary
                              onClick={() => {
                                this.props.dispatch(getUploadPlanList());
                                this.setState({ choosePlanDia: true, planName: layoutList[tabValue].tab });
                              }}
                            />
                            <RaisedButton
                              label="Plan Upload"
                              style={{ margin: 20 }}
                              containerElement="label"
                              secondary
                              icon={<UploadIcon />}
                              onClick={() => {
                                this.setState({ uploadPlanDia: true, planName: layoutList[tabValue].tab });
                              }}
                            />
                          </Grid>
                        </Grid>
                      ) : (
                        <div id="plan-dropzone" className="dropzone" key={Math.random()}>
                          {waitingS || imageLoading ? '' : this.widgets()}
                          <img
                            alt={layoutList[i].tab}
                            src={IP.concat('1882/img?id=')
                              .concat(layoutList[i].planInfo.planSrc)
                              .concat('&token=')
                              .concat(encodeURIComponent(token))}
                            onLoad={this.onImgLoad}
                            width="100%"
                          />
                        </div>
                        // Plan Tab End
                      ))) ||
                    // Tableau Tab Start
                    (layoutList[i].tabType === 'Tableau' && (
                      <div style={{ justifyContent: 'center', width: '50%' }}>
                        <Iframe url={layoutDataList[i]} id="myId" allowFullScreen />
                      </div>
                      // Tableau Tab End
                    )) ||
                    (layoutList[i].tabType === 'Warning' && layoutDataList !== null && (
                      <Table pagination={false} dataSource={dataArr} bordered>
                        <Column
                          style={{ marginTop: '-2em' }}
                          title={<FormattedMessage {...messages.device_name} />}
                          dataIndex="device_name"
                          key="device_name"
                        />
                        <Column
                          style={{ marginTop: '-2em' }}
                          title={<FormattedMessage {...messages.device_mac} />}
                          dataIndex="device_mac"
                          key="device_mac"
                        />
                        <ColumnGroup title={<FormattedMessage {...messages.meta} />}>
                          <Column
                            title={
                              <div style={{ display: 'flex', justifyContent: 'center', margin: '-0.5em' }}>
                                <AvatarNew className={classes.avatarF}>{<FormattedMessage {...messages.frequency} />}</AvatarNew>
                              </div>
                            }
                            align="center"
                            dataIndex="type00"
                            key="type00"
                            render={(type00, data, rowIndex) => (
                              <Form layout="inline">
                                {type00.map((item, index) =>
                                  index === 0 ? (
                                    <FormItem
                                      label="一般:"
                                      {...formItemLayout}
                                      validateStatus={this.state.number.validateStatus}
                                      help={this.state.number.errorMsg}
                                      key={Math.random()}
                                    >
                                      <InputNumber
                                        min={30}
                                        max={360}
                                        step={30}
                                        defaultValue={item}
                                        disabled={dataArr[rowIndex].status[0]}
                                        formatter={value => `${value} `.concat(minIntl)}
                                        size="small"
                                        onKeyDown={e => {
                                          e.preventDefault();
                                        }}
                                        style={{
                                          backgroundColor: '#e6f7ff',
                                          borderColor: '#ffffff',
                                          color: '#1890ff',
                                        }}
                                        onChange={value => {
                                          if (value >= 30 && value <= 360) {
                                            dataArr[rowIndex].type00[index] = value;
                                            for (let j = 0; j < dataArr[rowIndex].status.length; j += 1) {
                                              if (j !== 0) {
                                                dataArr[rowIndex].status[j] = true;
                                              } else {
                                                dataArr[rowIndex].status[j] = false;
                                              }
                                            }
                                            this.forceUpdate();
                                          }
                                        }}
                                        key={Math.random()}
                                      />
                                    </FormItem>
                                  ) : (
                                    <FormItem
                                      label="紧急:"
                                      {...formItemLayout}
                                      validateStatus={this.state.number.validateStatus}
                                      help={this.state.number.errorMsg}
                                      key={Math.random()}
                                    >
                                      <InputNumber
                                        min={5}
                                        max={59}
                                        defaultValue={item}
                                        disabled={dataArr[rowIndex].status[0]}
                                        formatter={value => `${value} `.concat(minIntl)}
                                        size="small"
                                        onKeyDown={e => {
                                          e.preventDefault();
                                        }}
                                        style={{
                                          backgroundColor: '#fff1f0',
                                          borderColor: '#ffffff',
                                          color: '#f5222d',
                                        }}
                                        onChange={value => {
                                          if (value >= 5 && value <= 59) {
                                            dataArr[rowIndex].type00[index] = value;
                                            for (let j = 0; j < dataArr[rowIndex].status.length; j += 1) {
                                              if (j !== 0) {
                                                dataArr[rowIndex].status[j] = true;
                                              } else {
                                                dataArr[rowIndex].status[j] = false;
                                              }
                                            }
                                            this.forceUpdate();
                                          }
                                        }}
                                      />
                                    </FormItem>
                                  )
                                )}
                              </Form>
                            )}
                          />
                          <Column
                            title={
                              <div style={{ display: 'flex', justifyContent: 'center', margin: '-0.5em' }}>
                                <AvatarNew className={classes.avatarH}>{<FormattedMessage {...messages.humidity} />}</AvatarNew>
                              </div>
                            }
                            dataIndex="type01"
                            align="center"
                            key="type01"
                            render={(type01, data, rowIndex) => (
                              <Form layout="inline">
                                {type01.map((item, index) => (
                                  <FormItem
                                    label={index === 0 ? '上界:' : '下界:'}
                                    {...formItemLayout}
                                    validateStatus={this.state.number.validateStatus}
                                    help={this.state.number.errorMsg}
                                    key={Math.random()}
                                  >
                                    <InputNumber
                                      min={index === 1 ? 0 : dataArr[rowIndex].type01[1]}
                                      max={index === 0 ? 100 : dataArr[rowIndex].type01[0]}
                                      step={1}
                                      defaultValue={item}
                                      disabled={dataArr[rowIndex].status[1]}
                                      formatter={value => `${value} `.concat('%')}
                                      size="small"
                                      onKeyDown={e => {
                                        e.preventDefault();
                                      }}
                                      style={{
                                        backgroundColor: '#fff1f0',
                                        borderColor: '#ffffff',
                                        color: '#f5222d',
                                      }}
                                      onChange={value => {
                                        if (value >= 0 && value <= 100) {
                                          dataArr[rowIndex].type01[index] = value;
                                          for (let j = 0; j < dataArr[rowIndex].status.length; j += 1) {
                                            if (j !== 1) {
                                              dataArr[rowIndex].status[j] = true;
                                            } else {
                                              dataArr[rowIndex].status[j] = false;
                                            }
                                          }
                                          this.forceUpdate();
                                        }
                                      }}
                                    />
                                  </FormItem>
                                ))}
                              </Form>
                            )}
                          />
                          <Column
                            title={
                              <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <AvatarNew className={classes.avatarT}>{<FormattedMessage {...messages.temperature} />}</AvatarNew>
                              </div>
                            }
                            dataIndex="type02"
                            align="center"
                            key="type02"
                            render={(type02, data, rowIndex) => (
                              <Form layout="inline">
                                {type02.map((item, index) => (
                                  <FormItem
                                    label={index === 0 ? '上界:' : '下界:'}
                                    {...formItemLayout}
                                    validateStatus={this.state.number.validateStatus}
                                    help={this.state.number.errorMsg}
                                    key={Math.random()}
                                  >
                                    <InputNumber
                                      min={index === 1 ? 0 : dataArr[rowIndex].type02[1]}
                                      max={index === 0 ? 100 : dataArr[rowIndex].type02[0]}
                                      step={1}
                                      defaultValue={item}
                                      disabled={dataArr[rowIndex].status[2]}
                                      formatter={value => `${value} `.concat('°C')}
                                      size="small"
                                      onKeyDown={e => {
                                        e.preventDefault();
                                      }}
                                      style={{
                                        backgroundColor: '#fff1f0',
                                        borderColor: '#ffffff',
                                        color: '#f5222d',
                                      }}
                                      onChange={value => {
                                        if (value >= 0 && value <= 100) {
                                          dataArr[rowIndex].type02[index] = value;
                                          for (let j = 0; j < dataArr[rowIndex].status.length; j += 1) {
                                            if (j !== 2) {
                                              dataArr[rowIndex].status[j] = true;
                                            } else {
                                              dataArr[rowIndex].status[j] = false;
                                            }
                                          }
                                          this.forceUpdate();
                                        }
                                      }}
                                    />
                                  </FormItem>
                                ))}
                              </Form>
                            )}
                          />
                        </ColumnGroup>
                      </Table>
                    ))
                  )}
                </Card>
              </Grid>
            </div>
          </TabContainer>
        )
      );
    }
    return { tabsList, tabList };
  }

  widgets() {
    const { layoutList, layoutDataList, classes, intl } = this.props;
    const { tabValue, widthImg, popVisible } = this.state;
    const widgetInfo = layoutList[tabValue].planInfo.widgetInfo;
    const widgetData = layoutDataList[tabValue];
    const widgets = [];
    dropList = [];
    const startDate = intl.formatMessage({ id: 'MERC.containers.EventPage.startDate' });
    const endDate = intl.formatMessage({ id: 'MERC.containers.EventPage.endDate' });
    const startTime = intl.formatMessage({ id: 'MERC.containers.EventPage.startTime' });
    const endTime = intl.formatMessage({ id: 'MERC.containers.EventPage.endTime' });

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      },
      margin: 0,
    };

    const formState = getFormState();

    for (let i = 0; i < widgetInfo.length; i += 1) {
      const widgetCoorX = widgetInfo[i]['widgetCoor-X'];
      const widgetCoorY = widgetInfo[i]['widgetCoor-Y'];
      const defaultWidthImg = layoutList[tabValue].planInfo.defaultWindowWidth;
      const defaultHeightImg = layoutList[tabValue].planInfo.defaultWindowHeight;
      const xGen = (widgetCoorX * this.state.widthImg) / defaultWidthImg;
      const yGen = (widgetCoorY * this.state.heightImg) / defaultHeightImg;
      const transCo = 'translate(' + xGen + 'px, ' + yGen + 'px)';

      // shoe taglist in widget
      // const showFieldArr = ['id', 'in', 'out'];
      const showFieldArr = ['id', 'in'];
      const showFieldObj = [
        { title: 'id', dataIndex: 'id', key: 'id' },
        { title: 'in', dataIndex: 'in', key: 'in' },
        // { title: 'out', dataIndex: 'out', key: 'out' },
      ];
      const tagTableData = [];
      if (widgetInfo[i].widgetType === 'M') {
        if (widgetData[i][1].length !== 0) {
          for (let l = 0; l < widgetData[i][1].length; l += 1) {
            const prodObj = {};
            for (let j = 0; j < showFieldArr.length; j += 1) {
              let itemValue = widgetData[i][1][l];
              for (let k = 0; k < showFieldArr[j].split('.').length; k += 1) {
                if (itemValue !== undefined) {
                  itemValue = itemValue[showFieldArr[j].split('.')[k]];
                } else {
                  itemValue = 'NA';
                }
              }
              prodObj[showFieldArr[j]] = itemValue;
            }
            tagTableData.push(prodObj);
          }
        }
      }
      switch (widgetInfo[i].widgetType) {
        // Tag: 舊料架機台, T: 溫濕度計, M: 新料架機台
        case 'Tag': {
          widgets.push(
            <div id={'yes-drop-'.concat(i)} className="draggable dragdropCSS" style={{ transform: transCo }} key={Math.random()}>
              {/* <Tooltip id="tooltip-icon" title={widgetData[i][1]} placement="right"> */}
              <Badge
                style={{ display: 'flex', justifyContent: 'end', top: '1em' }}
                badgeContent={widgetData[i][0]}
                color="secondary"
                onClick={this.popHandleClick}
              >
                .
              </Badge>
              <Tooltip
                id="tooltip-icon"
                title={
                  <div>
                    <div>Hover with a Popover.</div>
                    {widgetData[i][1]}
                  </div>
                }
                classes={{ tooltip: classes.lightTooltip }}
                placement="right"
              >
                <div
                  onDoubleClick={() => {
                    this.props.dispatch(
                      push({
                        pathname: '/event',
                        searchfportFromDb: widgetInfo[i].fport,
                        searchMACFromDb: widgetInfo[i].widgetData.mac,
                      })
                    );
                    this.props.dispatch(getFocusMenu('EVENT'));
                  }}
                >
                  <div style={{ display: 'flex', alignContent: 'center', justifyContent: 'center' }}>
                    <img
                      alt={i}
                      src={require('./img/shelfIcon.png')}
                      width={widthImg * 0.04}
                      height={widthImg * 0.04}
                      style={{ opacity: '0.8' }}
                    />
                    <div style={{ position: 'absolute', bottom: -15, fontWeight: 800, fontSize: widthImg * 0.001 }}>
                      {widgetInfo[i].shelfName}
                    </div>
                  </div>
                </div>
              </Tooltip>
            </div>
          );
          break;
        }
        case 'T': {
          widgets.push(
            <div id={'yes-drop-'.concat(i)} className="draggable dragdropCSS" style={{ transform: transCo }} key={Math.random()}>
              <div
                style={{ display: 'flex', alignContent: 'center', justifyContent: 'center' }}
                onDoubleClick={() => {
                  this.props.dispatch(
                    push({
                      pathname: '/event',
                      searchfportFromDb: widgetInfo[i].fport,
                      searchMACFromDb: widgetInfo[i].mac,
                    })
                  );
                  this.props.dispatch(getFocusMenu('EVENT'));
                }}
              >
                <img
                  alt="HTGraph"
                  src={require('./img/24.3.png')}
                  width={widthImg * 0.05}
                  height={widthImg * 0.05}
                  style={{ opacity: '0.5' }}
                />
                <div
                  id={i}
                  className="widgetTempCSS"
                  style={{ color: widgetData[i][2][0].split(':')[1], fontWeight: 800, fontSize: '1.5em' }}
                >
                  {widgetData[i][0]}
                </div>
                <div
                  id={i}
                  className="widgetHumCSS"
                  style={{ color: widgetData[i][2][1].split(':')[1], fontWeight: 800, fontSize: '1.5em' }}
                >
                  {widgetData[i][1]}
                </div>
                <div style={{ display: 'inline', position: 'absolute', bottom: -15, fontWeight: 800 }}>{widgetInfo[i].sensorName}</div>
              </div>
            </div>
          );
          break;
        }
        case 'M': {
          widgets.push(
            <div
              id={'yes-drop-'.concat(i)}
              className={formState.role === 'superAdmin' ? 'draggable dragdropCSS' : 'dragdropCSS'}
              style={{ transform: transCo }}
              key={Math.random()}
            >
              <Popover
                style={{ margin: '-1em' }}
                trigger={formState.role !== 'superAdmin' ? 'hover' : popVisible ? 'hover' : 'contextMenu'}
                content={
                  <Form style={{ marginTop: '-1em' }}>
                    <div style={{ display: 'inline-flex' }}>
                      <div>
                        {widgetData[i][0].map((item, index) => (
                          <FormItem
                            {...formItemLayout}
                            label={<FormattedMessage {...messages[Object.keys(item)[0]]} />}
                            style={{ height: '1.5em' }}
                            key={Math.random()}
                          >
                            <Input value={Object.values(item)} id={index} style={{ height: '100%' }} />
                          </FormItem>
                        ))}
                      </div>
                      <div>
                        <div style={{ height: '100%', marginLeft: '-1em' }}>
                          <div style={{ fontWeight: 800, margin: '0.5em' }}>
                            工单资料清单
                            <Popover
                              content={
                                <div style={{ marginLeft: '2em' }}>
                                  <Grid container alignItems="center" justify="center" direction="row">
                                    <Grid item xs={10} sm={7} md={5} lg={5} xl={5}>
                                      <DatePicker
                                        style={{ marginBottom: '0.5em' }}
                                        placeholder={startDate}
                                        onChange={(date, dateString) => {
                                          dateFromD = dateString;
                                        }}
                                      />
                                      <TimePicker
                                        onChange={(time, timeString) => {
                                          dateFromT = timeString;
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
                                          dateToD = dateString;
                                        }}
                                      />
                                      <TimePicker
                                        onChange={(time, timeString) => {
                                          dateToT = timeString;
                                        }}
                                        placeholder={endTime}
                                        defaultOpenValue={moment('00:00:00', 'HH:mm:ss')}
                                      />
                                    </Grid>
                                  </Grid>
                                  <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '0.5em' }}>
                                    <Button
                                      onClick={e => {
                                        this.props.dispatch(
                                          getLayoutDataListWSearch({
                                            tabValue,
                                            date: '&from=2018-10-12T01%3A00&to=2018-10-14T01%3A00',
                                            type: 'macAddr',
                                            meta: widgetData[i][0][1].device_mac,
                                            showFlg: 1,
                                          })
                                        );
                                        e.preventDefault();
                                      }}
                                    >
                                      confrim
                                    </Button>
                                  </div>
                                </div>
                              }
                              title="请选择时间区间"
                              placement="rightTop"
                            >
                              <Button style={{ marginLeft: '0.5em' }} shape="circle" icon="search" />
                            </Popover>
                          </div>
                          <Table
                            style={{ minWidth: '30em', width: '100%' }}
                            dataSource={tagTableData}
                            columns={showFieldObj}
                            bordered
                            scroll
                          />
                        </div>
                      </div>
                    </div>
                  </Form>
                }
                title="设备状态内容"
                // onVisibleChange={visible => {
                //   this.setState({
                //     clicked: visible,
                //     hovered: false,
                //   });
                // }}
                // placement="right"
              >
                {/* <Badge count={tagTableData.length === 0 ? 0 : tagTableData.length} showZero> */}
                <Badge showZero badgeContent={tagTableData.length === 0 ? 0 : tagTableData.length} color="secondary">
                  <div
                    onDoubleClick={() => {
                      this.props.dispatch(
                        push({
                          // pathname: '/event',
                          // searchfportFromDb: widgetInfo[i].fport,
                          // searchMACFromDb: widgetInfo[i].widgetData.mac,
                        })
                      );
                      this.props.dispatch(getFocusMenu('EVENT'));
                    }}
                  >
                    <div style={{ display: 'flex', alignContent: 'center', justifyContent: 'center', zIndex: '-1' }}>
                      <img
                        alt={i}
                        src={
                          widgetData[i][2] === 'M'
                            ? require('./img/shelfIcon.png')
                            : widgetData[i][2] === 'Device'
                            ? tagTableData.length === 0
                              ? require('./img/shelfIconY.png')
                              : require('./img/shelfIconLG.png')
                            : ''
                        }
                        width={widgetData[i][2] === 'M' ? widthImg * 0.04 : widthImg * 0.04}
                        height={widgetData[i][2] === 'M' ? widthImg * 0.04 : widthImg * 0.02}
                        style={{ opacity: '0.8', zIndex: '-1' }}
                      />
                      <div style={{ position: 'absolute', bottom: -15, fontWeight: 800, fontSize: widthImg * 0.001, zIndex: '-1' }}>
                        {widgetInfo[i].shelfName}
                      </div>
                    </div>
                  </div>
                </Badge>
              </Popover>
            </div>
          );
          break;
        }
        default:
          break;
      }
      dropList.push('#yes-drop-'.concat(i));
    }
    return widgets;
  }

  speedDialFunc() {
    const { layoutList, intl } = this.props;
    const { tabValue } = this.state;

    const messageAddTab = intl.formatMessage({ id: 'MERC.containers.Dashboard.messageAddTab' });
    const messageEditTab = intl.formatMessage({ id: 'MERC.containers.Dashboard.messageEditTab' });
    const messageAddWidget = intl.formatMessage({ id: 'MERC.containers.Dashboard.messageAddWidget' });
    const messagePlanUpdate = intl.formatMessage({ id: 'MERC.containers.Dashboard.messagePlanUpdate' });

    return (
      <SpeedDial
        icon={<EditIcon />}
        isOpen={this.state.isSpeedDialOpen}
        onChange={isOpen => {
          this.setState({
            isSpeedDialOpen: !isOpen,
          });
        }}
        style={{ display: 'flex', justifyContent: 'center' }}
        floatingActionButtonProps={{ backgroundColor: blue500 }}
      >
        <BubbleList>
          <BubbleListItem
            primaryText={messageAddTab}
            rightAvatar={<Avatar backgroundColor={blue500} icon={<AddCircle />} />}
            onClick={() => {
              this.setState({ isSpeedDialOpen: false, addTabOpen: true });
            }}
          />
          <BubbleListItem
            primaryText={messageEditTab}
            rightAvatar={<Avatar backgroundColor={blue500} icon={<ModeEdit />} />}
            onClick={() => {
              const layoutListState = cloneDeep(layoutList);
              this.setState({ editTabOpen: true, layoutListState, isSpeedDialOpen: false });
            }}
          />
          <BubbleListItem
            primaryText={messageAddWidget}
            rightAvatar={<Avatar backgroundColor={blue500} icon={<AddWidget />} />}
            onClick={() => {
              this.setState({ isSpeedDialOpen: false, addWidgetDia: true });
            }}
          />
          {layoutList[tabValue].tabType === 'Plan' && (
            <BubbleListItem
              primaryText={messagePlanUpdate}
              rightAvatar={<Avatar backgroundColor={red500} icon={<UploadIcon />} />}
              onClick={() => {
                this.setState({ isSpeedDialOpen: false, uploadPlanDia: true, planName: layoutList[tabValue].planInfo.planName });
              }}
            />
          )}
        </BubbleList>
      </SpeedDial>
    );
  }

  contBtnFunc() {
    const { intl, layoutList } = this.props;
    const { tabValue, popVisible } = this.state;
    const formState = getFormState();

    const messageAddTab = intl.formatMessage({ id: 'MERC.containers.Dashboard.messageAddTab' });
    const messageEditTab = intl.formatMessage({ id: 'MERC.containers.Dashboard.messageEditTab' });
    const messageAddWidget = intl.formatMessage({ id: 'MERC.containers.Dashboard.messageAddWidget' });
    const messagePlanUpdate = intl.formatMessage({ id: 'MERC.containers.Dashboard.messagePlanUpdate' });
    const messageRefresh = intl.formatMessage({ id: 'MERC.containers.Dashboard.refreshTheWidget' });
    const messageSave = intl.formatMessage({ id: 'MERC.containers.Dashboard.saveTheWidget' });
    const messagePopSelect = intl.formatMessage({ id: 'MERC.containers.Dashboard.popSelect' });
    const messagePopDeselect = intl.formatMessage({ id: 'MERC.containers.Dashboard.popDeselect' });

    return (
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div
          style={{
            position: 'fixed',
            bottom: '0.5em',
            border: '1px solid #2196F3',
            borderRadius: 50,
            backgroundColor: '#90CAF9',
            paddingLeft: '1em',
            paddingRight: '1em',
            display: 'inline-flex',
          }}
        >
          {formState.role === 'superAdmin' && (
            <TooltipA placement="top" title={messageAddTab}>
              <Button
                style={{ margin: '0.2em', display: 'flex', justifyContent: 'center' }}
                type="primary"
                shape="circle"
                icon="plus"
                onClick={() => {
                  this.setState({ addTabOpen: true });
                }}
              />
            </TooltipA>
          )}
          {formState.role === 'superAdmin' && (
            <TooltipA placement="top" title={messageEditTab}>
              <Button
                style={{ margin: '0.2em', display: 'flex', justifyContent: 'center' }}
                type="primary"
                shape="circle"
                icon="edit"
                onClick={() => {
                  const layoutListState = cloneDeep(layoutList);
                  this.setState({ editTabOpen: true, layoutListState });
                }}
              />
            </TooltipA>
          )}
          {formState.role === 'superAdmin' && (
            <TooltipA placement="top" title={messageAddWidget}>
              <Button
                style={{ margin: '0.2em', display: 'flex', justifyContent: 'center' }}
                type="primary"
                shape="circle"
                icon="appstore"
                onClick={() => {
                  this.setState({ addWidgetDia: true });
                }}
              />
            </TooltipA>
          )}
          <TooltipA placement="top" title={messageRefresh}>
            <Button
              style={{ margin: '0.2em', display: 'flex', justifyContent: 'center' }}
              type="primary"
              shape="circle"
              icon="reload"
              onClick={evt => {
                evt.preventDefault();
                this.props.dispatch(getLayoutDataList({ tabValue }));
              }}
            />
          </TooltipA>
          {layoutList[tabValue].tabType === 'Plan' && formState.role === 'superAdmin' && (
            <div style={{ display: 'inline-flex' }}>
              <TooltipA placement="top" title={popVisible ? messagePopDeselect : messagePopSelect}>
                <Button
                  style={{ margin: '0.2em', display: 'flex', justifyContent: 'center' }}
                  // type="danger"
                  type={popVisible ? 'danger' : 'primary'}
                  shape="circle"
                  icon="select"
                  onClick={() => {
                    // this.setState({ uploadPlanDia: true, planName: layoutList[tabValue].planInfo.planName });
                    if (popVisible === false) {
                      this.setState({ popVisible: true });
                    } else {
                      this.setState({ popVisible: false });
                    }
                  }}
                />
              </TooltipA>
              {formState.role === 'superAdmin' && (
                <TooltipA placement="top" title={messagePlanUpdate}>
                  <Button
                    style={{ margin: '0.2em', display: 'flex', justifyContent: 'center' }}
                    type="danger"
                    shape="circle"
                    icon="upload"
                    onClick={() => {
                      this.setState({ uploadPlanDia: true, planName: layoutList[tabValue].planInfo.planName });
                    }}
                  />
                </TooltipA>
              )}
            </div>
          )}
          {formState.role === 'superAdmin' && (
            <TooltipA placement="top" title={messageSave}>
              <Button
                style={{ margin: '0.2em', display: 'flex', justifyContent: 'center' }}
                type="danger"
                shape="circle"
                icon="save"
                onClick={evt => {
                  const { widthImg, heightImg } = this.state;
                  const defaultWidthImg = layoutList[tabValue].planInfo.defaultWindowWidth;
                  const defaultHeightImg = layoutList[tabValue].planInfo.defaultWindowHeight;

                  if (layoutList[tabValue].tabType === 'Plan') {
                    evt.preventDefault();
                    // first in dashboard
                    if (currXY.length === 0) {
                      for (let i = 0; i < layoutList[tabValue].planInfo.widgetInfo.length; i += 1) {
                        currXY.push([
                          (layoutList[tabValue].planInfo.widgetInfo[i]['widgetCoor-X'] * widthImg) / defaultWidthImg,
                          (layoutList[tabValue].planInfo.widgetInfo[i]['widgetCoor-Y'] * heightImg) / defaultHeightImg,
                        ]);
                      }
                    }
                    const layoutListEdit = cloneDeep(layoutList);
                    for (let i = 0; i < layoutList[tabValue].planInfo.widgetInfo.length; i += 1) {
                      layoutListEdit[tabValue].planInfo.defaultWindowWidth = widthImg;
                      layoutListEdit[tabValue].planInfo.defaultWindowHeight = heightImg;
                      layoutListEdit[tabValue].planInfo.widgetInfo[i]['widgetCoor-X'] = currXY[i][0]; // updating value
                      layoutListEdit[tabValue].planInfo.widgetInfo[i]['widgetCoor-Y'] = currXY[i][1]; // updating value
                    }
                    this.props.dispatch(setLayoutListIndex(layoutListEdit));
                  } else if (layoutList[tabValue].tabType === 'Warning') {
                    evt.preventDefault();
                    for (let i = 0; i < dataArr.length; i += 1) {
                      if (dataArr[i].status[0] === false && dataArr[i].status[0] !== null) {
                        message = '00';
                        for (let j = 0; j < dataArr[i].type00.length; j += 1) {
                          if (dataArr[i].type00[j] < 10) {
                            message = message.concat('0').concat(dataArr[i].type00[j]);
                          } else {
                            message = message.concat('0').concat(dataArr[i].type00[j] / 30);
                          }
                        }
                        this.props.dispatch(
                          setDashboardDL({
                            fport: 161,
                            message,
                            mac: dataArr[i].device_mac,
                          })
                        );
                      }

                      if (dataArr[i].status[1] === false && dataArr[i].status[1] !== null) {
                        message = '01';
                        for (let j = 0; j < dataArr[i].type01.length; j += 1) {
                          if (dataArr[i].type01[j] < 10) {
                            message = message.concat('0').concat(dataArr[i].type01[j]);
                          } else {
                            message = message.concat(dataArr[i].type01[j]);
                          }
                        }
                        this.props.dispatch(
                          setDashboardDL({
                            fport: 161,
                            message,
                            mac: dataArr[i].device_mac,
                          })
                        );
                      }

                      if (dataArr[i].status[2] === false && dataArr[i].status[2] !== null) {
                        message = '02';
                        for (let j = 0; j < dataArr[i].type02.length; j += 1) {
                          if (dataArr[i].type02[j] < 10) {
                            message = message.concat('0').concat(dataArr[i].type02[j]);
                          } else {
                            message = message.concat(dataArr[i].type02[j]);
                          }
                        }
                        this.props.dispatch(
                          setDashboardDL({
                            fport: 161,
                            message,
                            mac: dataArr[i].device_mac,
                          })
                        );
                      }
                    }
                    // dataArr = [];
                    setTimeout(() => {
                      if (dataArr.length !== 0) {
                        for (let k = 0; k < dataArr.length; k += 1) {
                          dataArr[k].status = [null, null, null];
                        }
                      }
                      this.forceUpdate();
                    }, 4000);
                  }
                }}
              />
            </TooltipA>
          )}
        </div>
      </div>
    );
  }

  saveBtnFunc() {
    const { layoutList, waitingS, waitingM, classes } = this.props;
    const { tabValue, widthImg, heightImg } = this.state;
    if (layoutList[tabValue].tabType === 'Plan') {
      if (layoutList[tabValue].planInfo.widgetInfo.length === 0) {
        return null;
      }
      const defaultWidthImg = layoutList[tabValue].planInfo.defaultWindowWidth;
      const defaultHeightImg = layoutList[tabValue].planInfo.defaultWindowHeight;
      return (
        <Tooltip
          id="tooltip-icon"
          title={<FormattedMessage {...messages.saveTheWidget} />}
          placement="left"
          classes={{ tooltip: classes.tooltipCus }}
        >
          <FlatButton
            style={{
              // position: 'fixed',
              minWidth: 60,
              width: 60,
              height: 60,
              // right: 17,
              // bottom: 80,
              borderRadius: 100,
            }}
            // icon={waitingS || waitingM ? <CircularProgress color="secondary" size={50} /> : <SaveIcon />}
            icon={waitingS || waitingM ? <Spin tip="Loading..." /> : <SaveIcon />}
            backgroundColor="#EF5350"
            color="primary"
            onClick={evt => {
              evt.preventDefault();
              // first in dashboard
              if (currXY.length === 0) {
                for (let i = 0; i < layoutList[tabValue].planInfo.widgetInfo.length; i += 1) {
                  currXY.push([
                    (layoutList[tabValue].planInfo.widgetInfo[i]['widgetCoor-X'] * widthImg) / defaultWidthImg,
                    (layoutList[tabValue].planInfo.widgetInfo[i]['widgetCoor-Y'] * heightImg) / defaultHeightImg,
                  ]);
                }
              }
              const layoutListEdit = cloneDeep(layoutList);
              for (let i = 0; i < layoutList[tabValue].planInfo.widgetInfo.length; i += 1) {
                layoutListEdit[tabValue].planInfo.defaultWindowWidth = widthImg;
                layoutListEdit[tabValue].planInfo.defaultWindowHeight = heightImg;
                layoutListEdit[tabValue].planInfo.widgetInfo[i]['widgetCoor-X'] = currXY[i][0]; // updating value
                layoutListEdit[tabValue].planInfo.widgetInfo[i]['widgetCoor-Y'] = currXY[i][1]; // updating value
              }
              this.props.dispatch(setLayoutListIndex(layoutListEdit));
            }}
          />
        </Tooltip>
      );
    } else if (layoutList[tabValue].tabType === 'Warning') {
      return (
        <Tooltip
          id="tooltip-icon"
          title={<FormattedMessage {...messages.saveTheWarningValue} />}
          placement="left"
          classes={{ tooltip: classes.tooltipCus }}
        >
          <FlatButton
            style={{
              // position: 'fixed',
              minWidth: 60,
              width: 60,
              height: 60,
              // right: 17,
              // bottom: 80,
              borderRadius: 100,
            }}
            // icon={waitingS ? <CircularProgress color="secondary" size={50} /> : <SaveIcon />}
            icon={waitingS ? <Spin tip="Loading..." /> : <SaveIcon />}
            backgroundColor="#EF5350"
            color="primary"
            onClick={evt => {
              evt.preventDefault();
              for (let i = 0; i < dataArr.length; i += 1) {
                if (dataArr[i].status[0] === false && dataArr[i].status[0] !== null) {
                  message = '00';
                  for (let j = 0; j < dataArr[i].type00.length; j += 1) {
                    if (dataArr[i].type00[j] < 10) {
                      message = message.concat('0').concat(dataArr[i].type00[j]);
                    } else {
                      message = message.concat('0').concat(dataArr[i].type00[j] / 30);
                    }
                  }
                  this.props.dispatch(
                    setDashboardDL({
                      fport: 161,
                      message,
                      mac: dataArr[i].device_mac,
                    })
                  );
                }

                if (dataArr[i].status[1] === false && dataArr[i].status[1] !== null) {
                  message = '01';
                  for (let j = 0; j < dataArr[i].type01.length; j += 1) {
                    if (dataArr[i].type01[j] < 10) {
                      message = message.concat('0').concat(dataArr[i].type01[j]);
                    } else {
                      message = message.concat(dataArr[i].type01[j]);
                    }
                  }
                  this.props.dispatch(
                    setDashboardDL({
                      fport: 161,
                      message,
                      mac: dataArr[i].device_mac,
                    })
                  );
                }

                if (dataArr[i].status[2] === false && dataArr[i].status[2] !== null) {
                  message = '02';
                  for (let j = 0; j < dataArr[i].type02.length; j += 1) {
                    if (dataArr[i].type02[j] < 10) {
                      message = message.concat('0').concat(dataArr[i].type02[j]);
                    } else {
                      message = message.concat(dataArr[i].type02[j]);
                    }
                  }
                  this.props.dispatch(
                    setDashboardDL({
                      fport: 161,
                      message,
                      mac: dataArr[i].device_mac,
                    })
                  );
                }
              }
              // dataArr = [];
              setTimeout(() => {
                if (dataArr.length !== 0) {
                  for (let k = 0; k < dataArr.length; k += 1) {
                    dataArr[k].status = [null, null, null];
                  }
                }
                this.forceUpdate();
              }, 4000);
            }}
          />
        </Tooltip>
      );
    }
    return null;
  }

  refreshFunc() {
    const { classes, waitingS, waitingM } = this.props;
    const { tabValue } = this.state;
    return (
      <Tooltip
        id="tooltip-icon"
        title={<FormattedMessage {...messages.refreshTheWidget} />}
        placement="left"
        classes={{ tooltip: classes.tooltipCus }}
      >
        <FlatButton
          style={{
            // position: 'fixed',
            minWidth: 60,
            width: 60,
            height: 60,
            // right: '6em',
            // bottom: '1em',
            borderRadius: 100,
          }}
          icon={waitingS || waitingM ? <Spin tip="Loading..." /> : <RefreshIcon />}
          // icon={waitingS || waitingM ? <CircularProgress color="secondary" size={50} /> : <RefreshIcon />}
          backgroundColor={blue500}
          // color="primary"
          onClick={evt => {
            evt.preventDefault();
            this.props.dispatch(getLayoutDataList({ tabValue }));
          }}
        />
      </Tooltip>
    );
  }

  dialogFunc() {
    const { intl, layoutList } = this.props;
    const { addWidgetDia, addTabDia, editTabDia, uploadPlanDia, editPlanDia, choosePlanDia, delConfDia } = this.state;
    const addTabTitle = intl.formatMessage({ id: 'IIoT.containers.Dashboard.AddTab' });
    const editTabTitle = intl.formatMessage({ id: 'IIoT.containers.Dashboard.EditTab' });
    const addWidgetTitle = intl.formatMessage({ id: 'IIoT.containers.Dashboard.AddWidget' });

    const hdlDiaClose = () => {
      const subDia = delConfDia;
      if (subDia !== true) {
        this.setState({
          // dia control
          addTabDia: false,
          editTabDia: false,
          addWidgetDia: false,
          uploadPlanDia: false,
          editPlanDia: false,
          choosePlanDia: false,
          delConfDia: false,

          // addTabDia
          pickIcon: false,
          addTabName: '',
          tabContentType: '',
          // uploadPlanDia
          planName: '',
          planDesc: '',
          planVers: '',
          planVeri: '',
          file: null,
          // choosePlanDia
          chosenPlan: 0,

          // add chart
          selValFPort: null,
          selMacAddr: null,
          selMacAddrName: [],
          selChart: null,
          addWidgetChartTitle: '',
          addWidgetXAxisTitle: '',
          addWidgetXAxisDataLimit: '',
          addWidgetYAxisTitle: '',
          addWidgetYAxisLegendTitle: [''],
          addWidgetYAxisDataLimit: '',
          yAxisField: [],
          selXAxisData: '',
          selYAxisData: [''],
        });
      } else {
        this.setState({
          // dia control
          delConfDia: false,
          // delConfDia
          delIdx: null,
        });
      }
    };

    const hldDiaConfirm = () => {
      const { uploadPlanList } = this.props;
      const {
        // addTabDia
        addTabName,
        pickIcon,
        tabContentType,
        layoutListState,
        // uploadPlanDia
        planName,
        planDesc,
        planVers,
        planVeri,
        file,
        // choosePlanDia
        tabValue,
        chosenPlan,
        // delConfDia
        delIdx,
      } = this.state;
      if (addTabDia === true) {
        const layoutListEdit = cloneDeep(layoutList);
        if (tabContentType === 'Chart') {
          layoutListEdit.push({ tab: addTabName, tabIcon: pickIcon, tabType: tabContentType, chartInfo: [] });
        } else if (tabContentType === 'Plan') {
          layoutListEdit.push({
            tab: addTabName,
            tabIcon: pickIcon,
            tabType: tabContentType,
            planInfo: { widgetInfo: [], planSrc: '' },
          });
        }
        this.props.dispatch(setLayoutListIndex(layoutListEdit));
      } else if (editTabDia === true && delConfDia !== true) {
        this.props.dispatch(setLayoutListIndex(layoutListState));
      } else if (uploadPlanDia === true) {
        this.props.dispatch(
          setUploadPlan({
            planName,
            planDesc,
            planVers,
            planVeri,
            file,
            id: '-1',
          })
        );
        fileUpload = null;
      } else if (choosePlanDia === true) {
        // set
        const layoutListEdit = cloneDeep(layoutList);
        layoutListEdit[tabValue].planInfo = {
          ...layoutListEdit[tabValue].planInfo,
          planSrc: uploadPlanList[chosenPlan].id,
          planName: uploadPlanList[chosenPlan].name,
          defaultWindowWidth: 1000,
          defaultWindowHeight: 500,
        };
        this.props.dispatch(setLayoutListIndex(layoutListEdit));
      } else if (delConfDia === true) {
        layoutListState.splice(delIdx, 1);
        this.props.dispatch(setLayoutListIndex(layoutListState));
        this.setState({ tabValue: 0 });
      } else if (addWidgetDia === true) {
        const layoutListEdit = cloneDeep(layoutList);
        const { addWidgetChartTitle, selChart, addWidgetXAxisDataLimit, selYAxisData } = this.state;

        const chartOrderNum = layoutListEdit[tabValue].chartInfo.length;
        const addWidgetLayoutInfo = {
          chartType: selChart,
          chartOrder: chartOrderNum,
          chartLayout: {
            title: addWidgetChartTitle,
          },
          chartData: {
            api: {
              lineChartApi: 'getEventList',
            },
            fport: selYAxisData[0].split(',')[0],
            mac: selYAxisData[0].split(',')[1],
            limit: addWidgetXAxisDataLimit,
            vals: [{ mainVal: 'information.'.concat(selYAxisData[0].split(',')[2]) }],
          },
        };
        layoutListEdit[tabValue].chartInfo.push(addWidgetLayoutInfo);
        this.props.dispatch(setLayoutListIndex(layoutListEdit));
      }
      hdlDiaClose();
    };

    const addTabDiaFunc = () => {
      return (
        <Grid container key={Math.random()}>
          <Grid container alignItems="center" justify="center" direction="row">
            <Grid item xs={10} sm={7} md={5} lg={5} xl={5}>
              <TextField
                id="text-field-controlled"
                underlineShow={false}
                value={this.state.addTabName}
                onChange={event => this.setState({ addTabName: event.target.value })}
                hintText="TAB NAME"
              />
            </Grid>
            <Grid item xs={10} sm={7} md={5} lg={5} xl={5}>
              <MenuItem>
                <div style={{ display: 'inline-flex', alignContent: 'center', justifyContent: 'center', lineHeight: 2 }}>
                  <div style={{ marginLeft: 25, marginRight: 20 }}>
                    {/* <FormattedMessage {...messages.AddTabPickIcon} />: */}
                    Pick an Icon:
                  </div>
                  <MaterialUiIconPicker onPick={icon => this.setState({ pickIcon: icon.name })} label="PICK" pickLabel="Pick IT" />
                  {this.state.pickIcon && (
                    <div style={{ marginLeft: 20, marginTop: 5 }}>
                      <FontIcon className="material-icons">{this.state.pickIcon}</FontIcon>
                    </div>
                  )}
                </div>
              </MenuItem>
            </Grid>
            <Grid item xs={10} sm={7} md={5} lg={5} xl={5}>
              <SelectField
                floatingLabelText="Tab Content Type"
                value={this.state.tabContentType}
                onChange={(event, index, value) => {
                  this.setState({ tabContentType: value });
                }}
                floatingLabelStyle={{ fontFamily: 'Roboto' }}
                dropDownMenuProps={{ anchorOrigin: { vertical: 'center', horizontal: 'left' } }}
                style={{ marginLeft: 0, marginTop: -10 }}
              >
                <MenuItem value={'Chart'} primaryText="Chart Dashboard" />
                <MenuItem value={'Plan'} primaryText="Plan Dashboard" />
              </SelectField>
            </Grid>
            <Grid item xs={10} sm={7} md={5} lg={5} xl={5} />
          </Grid>
        </Grid>
      );
    };

    const editTabDiaFunc = () => {
      const { waitingS } = this.props;
      const { layoutListState } = this.state;
      return (
        <Grid>
          {waitingS ? (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              {/* <CircularProgress className={classes.progress} size={50} /> */}
              <Spin tip="Loading..." />
            </div>
          ) : (
            layoutList.map((item, index) => (
              <Grid container key={index} justify="center" style={{ display: 'inline-flex', alignItems: 'center' }}>
                <div style={{ width: '4vw', fontWeight: 500 }}>
                  {Object.keys(item)[0]
                    .toUpperCase()
                    .concat(index)
                    .concat(':')}
                </div>
                <TextField
                  hintText="TAB NAME"
                  inputStyle={{ color: 'gray', padding: '0 10px' }}
                  hintStyle={{ padding: '0 25px' }}
                  underlineFocusStyle={{ borderColor: '#1976D2' }}
                  style={{
                    marginLeft: 5,
                    marginRight: 10,
                    width: '11em',
                  }}
                  value={layoutListState === undefined ? item.tab : layoutListState[index].tab}
                  onChange={e => {
                    const arrayvar = layoutListState.slice();
                    arrayvar[index] = { ...arrayvar[index], tab: e.target.value, tabIcon: layoutListState[index].tabIcon };
                    this.setState({ layoutListState: arrayvar });
                  }}
                />
                <div style={{ marginRight: 10 }}>
                  <FontIcon className="material-icons">{layoutListState[index].tabIcon}</FontIcon>
                </div>
                <MaterialUiIconPicker onPick={e => this.chgPickedIcon(e, index)} label="Pick" pickLabel="Pick IT" />
                <Tooltip id="delete-icon" title="删除分页">
                  <IconButton
                    iconStyle={{ color: '#F44336' }}
                    onClick={() => {
                      event.preventDefault();
                      // layoutListState.splice(index, 1);
                      // this.props.dispatch(setLayoutListIndex(layoutListState));
                      this.setState({ delConfDia: true, delIdx: index });
                    }}
                    aria-label="Delete"
                  >
                    <DeleteSweep />
                  </IconButton>
                </Tooltip>
                {/* {item.tabType === 'Plan' ? (
                  <SelectField
                    floatingLabelText="Plan Name"
                    value={layoutListState[index].planInfo.planSrc}
                    onChange={(event, indexPlan, valuePlan) => {
                      const arrayvar = layoutListState.slice();
                      arrayvar[index].planInfo = { ...arrayvar[index].planInfo, planSrc: valuePlan };
                      this.setState({ layoutListState: arrayvar });
                    }}
                    floatingLabelStyle={{ fontFamily: 'Roboto' }}
                    dropDownMenuProps={{ anchorOrigin: { vertical: 'center', horizontal: 'left' } }}
                    style={{ marginLeft: 0, marginTop: 0, marginBottom: 0, padding: 0 }}
                  >
                    {uploadPlanList.map(itemPlan => (
                      <MenuItem value={itemPlan.id} primaryText={itemPlan.name} key={Math.random()} />
                    ))}
                  </SelectField>
                ) : (
                  <SelectField
                    floatingLabelText="Plan Name"
                    floatingLabelFixed
                    value={0}
                    floatingLabelStyle={{ fontFamily: 'Roboto' }}
                    dropDownMenuProps={{ anchorOrigin: { vertical: 'center', horizontal: 'left' } }}
                    style={{ marginLeft: 0, marginTop: 0, marginBottom: 0, padding: 0 }}
                    disabled
                  >
                    <MenuItem value={0} primaryText="NA" />
                  </SelectField>
                )} */}
              </Grid>
            ))
          )}
        </Grid>
      );
    };

    const addWidgetDiaFunc = () => {
      const { classes } = this.props;
      const getSteps = () => {
        return ['选择资料', '选择图表与资料设定', '预览 & 调整'];
      };
      const addWidgetSelFPortFunc = () => {
        const { eventType, sensorListByPort } = this.props;
        const { selValFPort, selMacAddr } = this.state;
        const selFPortIntl = intl.formatMessage({ id: 'MERC.containers.Dashboard.selFPortIntl' });
        // choose event list
        const eventTypeList = [];
        for (let i = 0; i < eventType.length; i += 1) {
          const formattedMessageString = 'MERC.containers.EventPage.'.concat(eventType[i].showTitle);
          const formattedMessage = intl.formatMessage({ id: formattedMessageString });
          eventTypeList.push(<MenuItem key={Math.random()} value={eventType[i]._id} primaryText={formattedMessage} />);
        }
        const eventTypeSelField = [];
        eventTypeSelField.push(
          <SelectField
            floatingLabelText={selFPortIntl}
            floatingLabelStyle={{ fontFamily: 'Roboto' }}
            floatingLabelFixed
            hintText={selFPortIntl}
            value={selValFPort}
            // value={selValFPort === null ? eventType[0]._id : selValFPort}
            onChange={(event, index, value) => {
              this.setState({ selValFPort: value, selMacAddr: null });
              getSensorListByfportFlag = 0;
            }}
            dropDownMenuProps={{ anchorOrigin: { vertical: 'center', horizontal: 'left' } }}
            errorStyle={{ color: 'orange' }}
            key={Math.random()}
          >
            {eventTypeList}
          </SelectField>
        );

        // macAddrList
        const macAddrList = [];
        if (sensorListByPort !== null) {
          for (let i = 0; i < sensorListByPort.length; i += 1) {
            macAddrList.push(
              <MenuItem
                key={Math.random()}
                checked={selMacAddr && selMacAddr.indexOf(sensorListByPort[i].device_mac) > -1}
                value={sensorListByPort[i].device_mac}
                insetChildren
                primaryText={sensorListByPort[i].device_name}
              />
            );
          }
        }
        // choose macAddr
        const macAddr = [];
        if (selValFPort !== null) {
          if (getSensorListByfportFlag === 0) {
            this.props.dispatch(getSensorListByfport({ fport: selValFPort }));
            getSensorListByfportFlag = 1;
          }
          if (sensorListByPort !== null) {
            macAddr.push(
              <SelectField
                // floatingLabelText={selFPortIntl}
                floatingLabelText="请选择感测器"
                floatingLabelStyle={{ fontFamily: 'Roboto' }}
                floatingLabelFixed
                value={selMacAddr}
                hintText="请选择感测器"
                // value={selValFPort === null ? eventType[0]._id : selValFPort}
                onChange={(event, index, value) => {
                  this.setState({ selMacAddr: value });
                  const { selMacAddrName } = this.state;
                  const macAddrName = [...selMacAddrName];
                  if (Array.isArray(value)) {
                    for (let i = 0; i < sensorListByPort.length; i += 1) {
                      if (sensorListByPort[i].device_mac === value[value.length - 1]) {
                        macAddrName.push(sensorListByPort[i].device_name);
                        this.setState({ selMacAddrName: macAddrName });
                        break;
                      }
                    }
                  } else {
                    for (let i = 0; i < sensorListByPort.length; i += 1) {
                      if (sensorListByPort[i].device_mac === value) {
                        macAddrName.push(sensorListByPort[i].device_name);
                        this.setState({ selMacAddrName: macAddrName });
                        break;
                      }
                    }
                  }
                  getSensorListByfportFlag = 0;
                }}
                dropDownMenuProps={{ anchorOrigin: { vertical: 'center', horizontal: 'left' } }}
                // multiple
                key={1}
              >
                {macAddrList}
              </SelectField>
            );
          }
        }
        return (
          <Grid key={Math.random}>
            <Grid item>{eventTypeSelField}</Grid>
            <Grid item>{macAddr}</Grid>
          </Grid>
        );
      };

      const addWidgetSelChartFunc = () => {
        const { selChart, addWidgetChartTitle, addWidgetXAxisTitle, addWidgetXAxisDataLimit, addWidgetYAxisTitle, yAxisField } = this.state;
        const strucChartTitle = [];
        strucChartTitle.push(
          <TextField
            id="chartTitle"
            label="请输入图表标题"
            className={classes.textField}
            floatingLabelText="请输入图表标题"
            placeholder="请输入图表标题"
            floatingLabelFixed
            value={addWidgetChartTitle}
            key={5}
            onChange={e => {
              this.setState({ addWidgetChartTitle: e.target.value });
            }}
          />
        );
        const strucSelChartType = [];
        strucSelChartType.push(
          <SelectField
            // floatingLabelText={selFPortIntl}
            floatingLabelText="请选择图表类型"
            floatingLabelStyle={{ fontFamily: 'Roboto' }}
            floatingLabelFixed
            value={selChart}
            hintText="请选择图表类型"
            // value={selValFPort === null ? eventType[0]._id : selValFPort}
            onChange={(event, index, value) => {
              this.setState({ selChart: value });
            }}
            dropDownMenuProps={{ anchorOrigin: { vertical: 'center', horizontal: 'left' } }}
            key={1}
            icon={<LineChartIcon />}
          >
            <MenuItem value="lineChart" primaryText="折线图" leftIcon={<LineChartIcon />} />
            <MenuItem value="switchChart" primaryText="开关控制图" leftIcon={<SwitchChartIcon />} />
          </SelectField>
        );

        const strucSelChartData = [];
        if (selChart === 'lineChart') {
          const { dataField } = this.props;
          const { addWidgetYAxisLegendTitle, selXAxisData, selMacAddrName, selMacAddr, selYAxisData, selValFPort } = this.state;
          strucSelChartData.push(
            <Card style={{ padding: 20, marginTop: 20, marginBottom: 20 }} key="Card">
              折线图设定
              <Grid container justify="center" key="Grid-container">
                <Grid item xs={5} sm={5} md={5} lg={5} xl={5}>
                  <TextField
                    id="x-axisTitle"
                    floatingLabelText="水平轴标题"
                    placeholder="请输入水平轴标题"
                    floatingLabelFixed
                    value={addWidgetXAxisTitle}
                    onChange={e => {
                      this.setState({ addWidgetXAxisTitle: e.target.value });
                    }}
                    style={{ width: '14em' }}
                    key={6}
                  />
                </Grid>
                <Grid item xs={5} sm={5} md={5} lg={5} xl={5}>
                  <SelectField
                    // floatingLabelText={selFPortIntl}
                    floatingLabelText="请选择水平轴资料"
                    floatingLabelStyle={{ fontFamily: 'Roboto' }}
                    floatingLabelFixed
                    value={selXAxisData}
                    hintText="请选择水平轴资料"
                    // value={selValFPort === null ? eventType[0]._id : selValFPort}
                    onChange={(event, index, value) => {
                      this.setState({ selXAxisData: value });
                    }}
                    dropDownMenuProps={{ anchorOrigin: { vertical: 'center', horizontal: 'left' } }}
                    key={Math.random()}
                    style={{ width: '14em' }}
                  >
                    <MenuItem value="recv" primaryText="時間" />
                    {selMacAddrName.map((itemName, index2) =>
                      dataField[index2].map(itemObj => (
                        <MenuItem
                          value={selValFPort
                            .toString()
                            .concat(',')
                            .concat(selMacAddr[index2])
                            .concat(',')
                            .concat(itemObj)}
                          primaryText={itemName.concat(',').concat(itemObj)}
                        />
                      ))
                    )}
                  </SelectField>
                </Grid>
                <Grid item xs={5} sm={5} md={5} lg={5} xl={5}>
                  <TextField
                    id="x-axisDataLimit"
                    floatingLabelText="资料笔数"
                    placeholder="请输入资料笔数"
                    floatingLabelFixed
                    value={addWidgetXAxisDataLimit}
                    onChange={e => {
                      this.setState({ addWidgetXAxisDataLimit: e.target.value });
                    }}
                    style={{ width: '14em' }}
                    key={'x-axisDataLimit'}
                  />
                </Grid>
                <Grid item xs={5} sm={5} md={5} lg={5} xl={5} />
                <Grid item xs={5} sm={5} md={5} lg={5} xl={5}>
                  <TextField
                    id="y-axisTitle"
                    floatingLabelText="垂直轴标题"
                    placeholder="请输入垂直轴标题"
                    floatingLabelFixed
                    value={addWidgetYAxisTitle}
                    onChange={e => {
                      this.setState({ addWidgetYAxisTitle: e.target.value });
                    }}
                    style={{ width: '14em' }}
                    key={'y-axisTitle'}
                  />
                </Grid>
                <Grid item xs={5} sm={5} md={5} lg={5} xl={5}>
                  {/* <TextField
                    id="y-axisDataLimit"
                    floatingLabelText="垂直轴资料笔数"
                    placeholder="请输入垂直轴资料笔数"
                    floatingLabelFixed
                    value={addWidgetYAxisDataLimit}
                    onChange={e => {
                      this.setState({ addWidgetYAxisDataLimit: e.target.value });
                    }}
                    style={{ width: '14em' }}
                    key={'y - axisDataLimit'}
                  /> */}
                </Grid>
              </Grid>
              {addWidgetYAxisLegendTitle.map((item, index) => (
                <Grid container justify="center" key={'Grid-container-'.concat(index)}>
                  <Grid item xs={5} sm={5} md={5} lg={5} xl={5}>
                    <TextField
                      id="y-axisLegend"
                      floatingLabelText={'#'.concat(index + 1).concat(' 垂直轴资料标题')}
                      floatingLabelStyle={{ fontFamily: 'Roboto' }}
                      placeholder="请输入垂直轴资料标题"
                      floatingLabelFixed
                      value={addWidgetYAxisLegendTitle[index]}
                      onChange={e => {
                        const arr = [...addWidgetYAxisLegendTitle];
                        arr[index] = e.target.value;
                        this.setState({ addWidgetYAxisLegendTitle: arr });
                      }}
                      style={{ width: '14em' }}
                      key={'y-axisLegend'}
                    />
                  </Grid>
                  <Grid item xs={5} sm={5} md={5} lg={5} xl={5}>
                    <SelectField
                      // floatingLabelText={selFPortIntl}
                      floatingLabelText={'#'.concat(index + 1).concat(' 垂直轴资料')}
                      floatingLabelStyle={{ fontFamily: 'Roboto' }}
                      floatingLabelFixed
                      value={selYAxisData[index]}
                      hintText="请选择垂直轴资料"
                      // value={selValFPort === null ? eventType[0]._id : selValFPort}
                      onChange={(event, index1, value) => {
                        const arr = [...selYAxisData];
                        arr[index] = value;
                        this.setState({ selYAxisData: arr });
                      }}
                      dropDownMenuProps={{ anchorOrigin: { vertical: 'center', horizontal: 'left' } }}
                      key={'#'.concat(index + 1).concat(' 垂直轴资料')}
                      style={{ width: '14em' }}
                    >
                      <MenuItem value="recv" primaryText="時間" />
                      {selMacAddrName.map((itemName, index2) =>
                        dataField[index2].map(itemObj => (
                          <MenuItem
                            value={selValFPort
                              .toString()
                              .concat(',')
                              .concat(selMacAddr)
                              .concat(',')
                              .concat(itemObj)}
                            primaryText={itemName.concat(',').concat(itemObj)}
                          />
                        ))
                      )}
                    </SelectField>
                  </Grid>
                </Grid>
              ))}
              <Grid />
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginRight: 60, marginTop: 30 }}>
                <Tooltip id="tooltip-left" title="于垂直轴新增资料" placement="bottom">
                  <FloatingActionButton
                    backgroundColor="#1976D2"
                    mini
                    style={{ marginRight: 20 }}
                    onClick={() => {
                      const arr = [...addWidgetYAxisLegendTitle];
                      arr.push('');
                      this.setState({ addWidgetYAxisLegendTitle: arr });
                      const selYAxisDataArr = [...selYAxisData];
                      selYAxisDataArr.push('');
                      this.setState({ selYAxisData: selYAxisDataArr });
                    }}
                  >
                    <Add />
                  </FloatingActionButton>
                </Tooltip>
                <Tooltip id="tooltip-delete" title="删除垂直轴新增资料" placement="bottom">
                  <FloatingActionButton
                    backgroundColor="#E53935"
                    mini
                    style={{ marginRight: 20 }}
                    onClick={() => {
                      const arr = [...yAxisField];
                      const index = yAxisField.length;
                      arr.splice(index - 2, 2);
                      const arrTitle = [...addWidgetYAxisLegendTitle];
                      const indexTitle = arrTitle.length;
                      arrTitle.splice(indexTitle - 1, 1);
                      this.setState({ yAxisField: arr, addWidgetYAxisLegendTitle: arrTitle });

                      const selYAxisDataArr = [...selYAxisData];
                      const indexData = selYAxisDataArr.length;
                      selYAxisDataArr.splice(indexData - 1, 1);
                      this.setState({ selYAxisData: selYAxisDataArr });
                      // selYAxisDataArr.push('');
                      // this.setState({ selYAxisData: selYAxisDataArr });
                    }}
                  >
                    <RemoveIcon />
                  </FloatingActionButton>
                </Tooltip>
              </div>
            </Card>
          );
        } else if (selChart === 'switchChart') {
          strucSelChartData.push(<Card>test</Card>);
        }

        return (
          <Grid key="all">
            <Grid container justify="center">
              {strucChartTitle}
            </Grid>
            <Grid container justify="center">
              {strucSelChartType}
            </Grid>
            <Grid item>{strucSelChartData}</Grid>
          </Grid>
        );
      };

      const addWidgetPreviewFunc = () => {
        const { prevData } = this.props;
        const { addWidgetChartTitle } = this.state;
        let respProcT;
        // let respProcH;
        const prewGraph = [];
        if (prevData !== null) {
          for (let i = 0; i < 1; i += 1) {
            respProcT = tempDataProcess(prevData[i], 'information.temperature');
            // respProcH = humiDataProcess(prevData[i], 'information.humidity');
          }
          prewGraph.push(
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6} key={Math.random()}>
              <Card className={classes.chartCard}>
                <Line data={dataLineTemp([respProcT], 0)} options={lineOptions(addWidgetChartTitle)} />
              </Card>
              {/* <Card className={classes.chartCard}>
                <Line data={dataLineHumi([respProcH], 0)} options={lineOptions(addWidgetChartTitle)} />
              </Card> */}
            </Grid>
          );
        }
        return prewGraph;
      };

      const getStepContent = stepIndex => {
        switch (stepIndex) {
          case 0:
            return addWidgetSelFPortFunc();
          case 1:
            // return '选择图表内容';
            return addWidgetSelChartFunc();
          case 2:
            // return '预览 & 调整内容';
            return addWidgetPreviewFunc();
          default:
            return 'Unknown stepIndex';
        }
      };

      const handleNext = () => {
        const { activeStep, selValFPort, selMacAddr, selMacAddrName, selXAxisData, addWidgetXAxisDataLimit, selYAxisData } = this.state;
        if (activeStep === 0) {
          this.props.dispatch(getDataField({ selValFPort, selMacAddr, selMacAddrName }));
        }
        if (activeStep === 1) {
          this.props.dispatch(getPreviewGraph({ selXAxisData, addWidgetXAxisDataLimit, selYAxisData }));
        }

        this.setState({
          activeStep: activeStep + 1,
        });
      };

      const handleBack = () => {
        const { activeStep } = this.state;
        if (activeStep === 1) {
          this.setState({
            selChart: null,
            addWidgetChartTitle: '',
            addWidgetXAxisTitle: '',
            addWidgetXAxisDataLimit: '',
            addWidgetYAxisTitle: '',
            addWidgetYAxisLegendTitle: [''],
            addWidgetYAxisDataLimit: '',
            yAxisField: [],
            selXAxisData: '',
            selYAxisData: [''],
          });
        }
        this.setState({
          activeStep: activeStep - 1,
        });
      };

      const handleReset = () => {
        this.setState({
          activeStep: 0,
        });
      };

      const steps = getSteps();
      const { activeStep } = this.state;

      return (
        <Grid container direction="row" justify="center">
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map(label => {
                return (
                  <Step key={label}>
                    <StepLabel
                      classes={{
                        iconContainer: classes.iconContainer,
                      }}
                    >
                      {label}
                    </StepLabel>
                  </Step>
                );
              })}
            </Stepper>
          </Grid>
          {this.state.activeStep === steps.length ? (
            <Grid container direction="row" justify="flex-end">
              <Typography>All steps completed - you&quot;re finished</Typography>
              <Grid item>
                <RaisedButton onClick={handleReset}>Reset</RaisedButton>
              </Grid>
            </Grid>
          ) : (
            <Grid container direction="row" justify="center" style={{ marginLeft: 50, marginRight: 50 }}>
              {getStepContent(activeStep)}
              <Grid container direction="row" justify="flex-end">
                <Tooltip id="tooltip-back" title="上一步" placement="bottom">
                  <FloatingActionButton
                    disabled={activeStep === 0}
                    backgroundColor={activeStep === 0 ? '' : '#1976D2'}
                    mini
                    onClick={handleBack}
                    style={{ marginRight: 20 }}
                  >
                    <ArrowLeftIcon />
                  </FloatingActionButton>
                </Tooltip>
                {activeStep === steps.length - 1 ? (
                  <Tooltip id="tooltip-complete" disabled title="已完成" placement="bottom">
                    <FloatingActionButton backgroundColor="#9E9E9E" mini>
                      <CheckIcon />
                    </FloatingActionButton>
                  </Tooltip>
                ) : (
                  <Tooltip id="tooltip-next" title="下一步" placement="bottom">
                    <FloatingActionButton backgroundColor="#1976D2" mini onClick={handleNext}>
                      <ArrowRightIcon />
                    </FloatingActionButton>
                  </Tooltip>
                )}

                {/* <RaisedButton style={{ color: 'white', borderRadius: 10 }} backgroundColor="#1976D2" onClick={handleNext}>
                  {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                </RaisedButton> */}
              </Grid>
            </Grid>
          )}
        </Grid>
      );
    };

    const editPlanDiaFunc = () => {
      return <div>editPlanDiaFunc content</div>;
    };

    const uploadPlanDiaFunc = () => {
      const { planName, planDesc, planVers, planVeri } = this.state;
      return (
        <Grid container alignItems="center" justify="center" direction="row" key={Math.random()}>
          <Grid item xs={10} sm={7} md={5} lg={5} xl={5}>
            <TextField
              hintText="Please Enter Plan Name"
              hintStyle={{ fontFamily: 'Roboto' }}
              floatingLabelText="Plan Name"
              floatingLabelStyle={{ fontFamily: 'Roboto' }}
              floatingLabelFixed
              inputStyle={{ color: 'gray' }}
              value={planName}
              onChange={event => this.setState({ planName: event.target.value })}
            />
          </Grid>
          <Grid item xs={10} sm={7} md={5} lg={5} xl={5}>
            <TextField
              hintText="Please Enter Plan Description"
              hintStyle={{ fontFamily: 'Roboto' }}
              floatingLabelText="Plan Description"
              floatingLabelStyle={{ fontFamily: 'Roboto' }}
              floatingLabelFixed
              inputStyle={{ color: 'gray' }}
              value={planDesc}
              onChange={event => this.setState({ planDesc: event.target.value })}
            />
          </Grid>
          <Grid item xs={10} sm={7} md={5} lg={5} xl={5}>
            <TextField
              hintText="Please Enter Plan Version"
              hintStyle={{ fontFamily: 'Roboto' }}
              floatingLabelText="Plan Version"
              floatingLabelStyle={{ fontFamily: 'Roboto' }}
              floatingLabelFixed
              inputStyle={{ color: 'gray' }}
              value={planVers}
              onChange={event => this.setState({ planVers: event.target.value })}
            />
          </Grid>
          <Grid item xs={10} sm={7} md={5} lg={5} xl={5}>
            <TextField
              hintText="Please Enter Plan Verifier"
              hintStyle={{ fontFamily: 'Roboto' }}
              floatingLabelText="Plan Verifier"
              floatingLabelStyle={{ fontFamily: 'Roboto' }}
              floatingLabelFixed
              inputStyle={{ color: 'gray' }}
              value={planVeri}
              onChange={event => this.setState({ planVeri: event.target.value })}
            />
          </Grid>
          <Grid item xs={10} sm={7} md={5} lg={5} xl={5}>
            <div
              style={{
                marginTop: 10,
                marginBottom: 10,
                fontSize: 12,
                fontFamily: 'Roboto',
                color: '#BDBDBD',
                fontWeight: 500,
              }}
            >
              Upload Plan (ex. jpg, png...)
            </div>
            <input
              type="file"
              onChange={event => {
                fileUpload = event.target.files[0];
                // this.setState({
                //   file: event.target.files[0],
                // });
              }}
              placeholder="myFile"
            />
          </Grid>
          {/* <div>
            <Upload
              name="avatar"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              action="//jsonplaceholder.typicode.com/posts/"
              beforeUpload={beforeUpload}
              onChange={handleChange}
            >
              {imageUrl ? <img src={imageUrl} alt="avatar" /> : uploadButton}
            </Upload>
          </div> */}
          {/* <Grid item xs={10} sm={7} md={5} lg={5} xl={5} /> */}
        </Grid>
      );
    };

    const choosePlanDiaFunc = () => {
      const { waitingS, uploadPlanList } = this.props;
      const { chosenPlan } = this.state;
      return (
        <Grid container alignItems="center" justify="center" direction="row">
          {waitingS ? (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              {/* <CircularProgress className={classes.progress} size={50} /> */}
              <Spin tip="Loading..." />
            </div>
          ) : (
            <SelectField
              floatingLabelText="Plan Name"
              value={chosenPlan}
              onChange={(event, index) => this.setState({ chosenPlan: index })}
              floatingLabelStyle={{ fontFamily: 'Roboto' }}
              dropDownMenuProps={{ anchorOrigin: { vertical: 'center', horizontal: 'left' } }}
              style={{ marginLeft: 0, marginTop: -10 }}
            >
              {uploadPlanList.map((item, index) => (
                <MenuItem value={index} primaryText={item.name} key={Math.random()} />
              ))}
            </SelectField>
          )}
        </Grid>
      );
    };

    const delConfDiaFunc = () => {
      const { delIdx } = this.state;
      return (
        <Grid container justify="center">
          Delete the Tab {layoutList[delIdx].tab}?
        </Grid>
      );
    };

    const actions = [
      <FlatButton label={<FormattedMessage {...messages.cancel} />} primary onClick={hdlDiaClose} />,
      <FlatButton label={<FormattedMessage {...messages.confirm} />} primary onClick={hldDiaConfirm} />,
    ];

    return (
      <div>
        {/* main dialog */}
        <Dialog
          title={
            (addTabDia && addTabTitle) ||
            (editTabDia && editTabTitle) ||
            (addWidgetDia && addWidgetTitle) ||
            (uploadPlanDia && 'Upload Plan') ||
            (choosePlanDia && 'Choose a Plan') ||
            (editPlanDia && 'Edit Plan - '.concat('planName'))
          }
          actions={actions}
          modal={false}
          open={addTabDia || editTabDia || addWidgetDia || uploadPlanDia || editPlanDia || choosePlanDia}
          onRequestClose={hdlDiaClose}
          contentStyle={{
            borderRadius: 4,
          }}
          titleStyle={{ fontWeight: 800 }}
          autoScrollBodyContent
        >
          {addTabDia && addTabDiaFunc()}
          {editTabDia && editTabDiaFunc()}
          {addWidgetDia && addWidgetDiaFunc()}
          {editPlanDia && editPlanDiaFunc()}
          {uploadPlanDia && uploadPlanDiaFunc()}
          {choosePlanDia && choosePlanDiaFunc()}
          {/* sub dialog */}
        </Dialog>
        <Dialog
          title="Delete confirmation"
          actions={actions}
          modal={false}
          open={delConfDia}
          onRequestClose={() => this.setState({ delConfDia: false })}
          contentStyle={{
            borderRadius: 4,
          }}
          titleStyle={{ fontWeight: 800 }}
        >
          {delConfDia && delConfDiaFunc()}
        </Dialog>
      </div>
    );
  }

  modelFunc() {
    const { intl } = this.props;
    const { addTabOpen, editTabOpen } = this.state;

    const formItemLayout = {
      labelCol: {
        span: 8,
      },
      wrapperCol: {
        span: 16,
      },
      style: { height: '1.5em' },
    };

    const saveFormRef = formRef => {
      this.formRef = formRef;
    };

    const addTabTitle = intl.formatMessage({ id: 'IIoT.containers.Dashboard.AddTab' });
    const editTabTitle = intl.formatMessage({ id: 'IIoT.containers.Dashboard.EditTab' });
    const messageConfDele = intl.formatMessage({ id: 'MERC.containers.Dashboard.ConfDele' });

    const addTabFunc = form => {
      const { getFieldDecorator } = form;
      return (
        <Form layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label={<FormattedMessage {...messages.addTabName} />} {...formItemLayout}>
                {getFieldDecorator('name', { rules: [{ required: true, message: '必填欄位' }] })(<Input type="textarea" />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={<FormattedMessage {...messages.addTabIcon} />} {...formItemLayout}>
                {getFieldDecorator('select', {
                  rules: [{ required: true, message: 'Please select your country!' }],
                  initialValue: 'dashboard',
                })(
                  <Select placeholder="Please select a country">
                    {iconList.map(item => (
                      <Option key={item}>
                        <IconA type={item} style={{ marginRight: '0.5em' }} />
                        {item}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <FormItem {...formItemLayout} label="分頁類別">
                {getFieldDecorator('contentType', {
                  initialValue: 'Chart',
                  rules: [{ required: true, message: '必填欄位' }],
                })(
                  <Select>
                    <Option key="Chart">Chart</Option>
                    <Option key="Plan">Plan</Option>
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
      const { waitingS, layoutList } = this.props;
      const { layoutListState } = this.state;
      const { getFieldDecorator } = form;
      return (
        <div>
          {waitingS ? (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Spin tip="Loading..." />
            </div>
          ) : (
            layoutList.map((item, index) => (
              <Form layout="vertical" key={Math.random()}>
                <Row gutter={16}>
                  <Col span={4}>
                    <Form.Item label={<FormattedMessage {...messages.addTabName} />} style={{ height: '1.5em' }} />
                  </Col>
                  <Col span={9}>
                    {getFieldDecorator('name'.concat(index), {
                      initialValue: item.tab,
                      rules: [{ required: true, message: '必填欄位' }],
                    })(<Input type="textarea" />)}
                  </Col>
                  <Col span={9}>
                    {/* <Form.Item> */}
                    {getFieldDecorator('icon'.concat(index), {
                      rules: [{ required: true, message: 'Please select your country!' }],
                      initialValue: layoutListState[index].tabIcon,
                    })(
                      <Select placeholder="Please select a country">
                        {iconList.map(itemIcon => (
                          <Option key={itemIcon}>
                            <IconA type={itemIcon} style={{ marginRight: '0.5em' }} />
                            {itemIcon}
                          </Option>
                        ))}
                      </Select>
                    )}
                    {/* </Form.Item> */}
                  </Col>
                  <Col span={2}>
                    <Popconfirm
                      placement="bottomRight"
                      title={messageConfDele.concat(layoutList[index].tab, '?')}
                      onConfirm={() => {
                        layoutListState.splice(index, 1);
                        this.props.dispatch(setLayoutListIndex(layoutListState));
                      }}
                      okText={<FormattedMessage {...messages.confirm} />}
                      cancelText={<FormattedMessage {...messages.cancel} />}
                    >
                      <Button type="danger" icon="delete" />
                    </Popconfirm>

                    {/* <IconA type="delete" style={{ marginRight: '0.5em' }} /> */}
                  </Col>
                </Row>
              </Form>
            ))
          )}
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
              title={(addTabOpen && addTabTitle) || (editTabOpen && editTabTitle)}
              visible={visible}
              okText={<FormattedMessage {...messages.confirm} />}
              cancelText={<FormattedMessage {...messages.cancel} />}
              onCancel={onCancel}
              onOk={onCreate}
            >
              {addTabOpen && addTabFunc(form)}
              {editTabOpen && editTabFunc(form)}
            </Modal>
          );
        }
      }
    );

    return (
      <CollectionCreateForm
        wrappedComponentRef={saveFormRef}
        visible={addTabOpen || editTabOpen}
        onCancel={() => {
          this.setState({ addTabOpen: false, editTabOpen: false });
        }}
        onCreate={() => {
          const form = this.formRef.props.form;
          form.validateFields((err, values) => {
            if (err) return;
            if (addTabOpen) {
              const { layoutList } = this.props;
              const { name, contentType, select } = values;
              const layoutListEdit = cloneDeep(layoutList);
              if (contentType === 'Chart') {
                layoutListEdit.push({ tab: name, tabIcon: select, tabType: contentType, chartInfo: [] });
              } else if (contentType === 'Plan') {
                layoutListEdit.push({
                  tab: name,
                  tabIcon: select,
                  tabType: contentType,
                  planInfo: { widgetInfo: [], planSrc: '' },
                });
              }
              this.props.dispatch(setLayoutListIndex(layoutListEdit));
            } else if (editTabOpen) {
              const { layoutListState } = this.state;
              const layoutList = [];
              for (let i = 0; i < layoutListState.length; i += 1) {
                layoutList.push({ ...layoutListState[i], tab: values['name'.concat(i)], tabIcon: values['icon'.concat(i)] });
              }
              this.props.dispatch(setLayoutListIndex(layoutList));
            }
            form.resetFields();
            this.setState({ visible: false });
            this.setState({ addTabOpen: false, editTabOpen: false });
          });
        }}
      />
    );
  }

  renderHeaderData(column) {
    const TableHeaderColumnArr = [];
    for (let i = 0; i < column.length; i += 1) {
      if (i === 0) {
        TableHeaderColumnArr.push(
          <TableHeaderColumn isKey dataField={column[i]} key={Math.random()}>
            {column[i]}
          </TableHeaderColumn>
        );
      } else {
        TableHeaderColumnArr.push(
          <TableHeaderColumn dataField={column[i]} key={Math.random()}>
            {column[i]}
          </TableHeaderColumn>
        );
      }
    }
    return TableHeaderColumnArr;
  }

  render() {
    const { classes, layoutList } = this.props;
    const { tabValue } = this.state;
    return (
      <div>
        <Helmet>
          <title>DashboardIioT</title>
          <meta name="description" content="Description of DashboardIioT" />
        </Helmet>
        <div className={classes.root}>
          {layoutList === null ? (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              {/* <CircularProgress className={classes.progress} size={50} /> */}
              <Spin style={{ marginTop: '3em', marginBottom: '3em' }} tip="Loading..." />
            </div>
          ) : (
            <div>
              <AppBar position="static" color="default">
                <Tabs
                  value={tabValue}
                  onChange={(event, value) => {
                    event.preventDefault();
                    this.setState({ tabValue: value, imageLoading: true });
                    this.props.dispatch(getLayoutDataList({ tabValue: value }));
                    currXY = [];
                  }}
                  classes={{
                    root: classes.tabsRoot,
                    indicator: classes.tabsIndicator,
                  }}
                  variant="scrollable"
                  scrollButtons="auto"
                >
                  {this.tabsFunc().tabsList}
                </Tabs>
              </AppBar>
              {this.tabsFunc().tabList}
              {/* {this.saveBtnFunc()} */}
              {/* {this.refreshFunc()} */}
              {/* {this.speedDialFunc()} */}
            </div>
          )}
        </div>
        {this.dialogFunc()}
        {this.modelFunc()}
        {layoutList !== null && this.contBtnFunc()}
      </div>
    );
  }
}

DashboardIioT.propTypes = {
  dispatch: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
  layoutList: PropTypes.array,
  classes: PropTypes.object.isRequired,
  layoutDataList: PropTypes.array,
  waitingS: PropTypes.bool,
  waitingM: PropTypes.bool,
  uploadPlanList: PropTypes.array,
  eventType: PropTypes.array,
  sensorListByPort: PropTypes.array,
  dataField: PropTypes.array,
  prevData: PropTypes.array,
  refreshPlan: PropTypes.bool,
};

const mapStateToProps = createStructuredSelector({
  dashboardiiot: makeSelectDashboardIioT(),
  menuOpen: SelectMenuOpened(),
  layoutList: SelectSetLayoutList(),
  layoutDataList: SelectSetLayoutDataList(),
  waitingS: SelectSendingReqS(),
  waitingM: SelectSendingReqM(),
  refreshPlan: SelectRefreshPlan(),
  uploadPlanList: SelectUploadPlanList(),
  eventType: SelectEventType(),
  sensorListByPort: SelectSensorListByPort(),
  dataField: SelectDataField(),
  prevData: SelectPrevData(),
  layoutDataWSearch: SelectLayoutDataWSearch(),
  loginSuccess: SelectLoginSuccess(),
});

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    // margin: '1em',
  },
  progress: {
    margin: theme.spacing.unit * 2,
  },
  toggle: {
    padding: 10,
  },
  chartCard: {
    borderRadius: 10,
    borderStyle: 'solid',
    borderWidth: '2px',
    borderColor: '#0277BD',
    padding: 10,
    margin: 10,
  },
  marginBadge: {
    margin: 0,
  },
  uploadPlanTextfield: {
    margin: 10,
  },
  iconContainer: {
    transform: 'scale(1.5)',
  },
  button: {
    margin: theme.spacing.unit,
  },
  tabsRoot: {
    // borderBottom: '1px solid #e8e8e8',
  },
  tabRoot: {
    textTransform: 'initial',
    minWidth: 72,
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
    '&$tabSelected': {
      color: '#1890ff',
      fontWeight: theme.typography.fontWeightMedium,
    },
    '&:focus': {
      color: '#40a9ff',
    },
  },
  tabSelected: {},
  tabsIndicator: {
    backgroundColor: '#1890ff',
    height: '0.5em',
    width: '1em',
  },
  font: {
    fontSize: 12,
  },
  popover: {
    pointerEvents: 'none',
  },
  popperClose: {
    pointerEvents: 'none',
  },
  lightTooltip: {
    padding: '2px',
    zIndex: '9999',
  },
  bootstrapRoot: {
    padding: 0,
    'label + &': {
      marginTop: theme.spacing.unit * 3,
    },
  },
  bootstrapInput: {
    borderRadius: 2,
    backgroundColor: theme.palette.common.white,
    border: '1.5px solid #ced4da',
    fontSize: '1.2em',
    padding: '2px 3px',
    width: '15em',
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
  },
  avatarF: {},
  avatarH: {
    backgroundColor: '#ffcc80',
  },
  avatarT: {
    backgroundColor: '#ef9a9a',
  },
  actions: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '-1em',
    marginRight: '0.5em',
  },
  tooltipCus: {
    fontSize: 20,
  },
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
const withReducer = injectReducer({ key: 'dashboardIioT', reducer });
const withSaga = injectSaga({ key: 'dashboardIioT', saga });
export default compose(
  withReducer,
  withSaga,
  withConnect,
  injectIntl,
  withStyles(styles),
  Form.create()
)(DashboardIioT);
