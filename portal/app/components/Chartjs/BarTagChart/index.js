/**
 *
 * BarTagChart
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
// import styled from 'styled-components';
import 'chartjs-plugin-datalabels/dist/chartjs-plugin-datalabels';
import { Bar } from 'react-chartjs-2';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { compose } from 'redux';
import messages from '../../../containers/TagPage/messages';

// import { FormattedMessage } from 'react-intl';
// import messages from './messages';

class BarTagChart extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { intl, dataTag, dataExtra } = this.props;
    const labels = [];
    const dataT = [];
    const dataExtraLoc = [];
    let singleFlg = 0;
    for (let i = 0; i < dataTag.length; i += 1) {
      labels.push(dataTag[i].name);
      dataT.push(dataTag[i].time);
      dataExtraLoc.push(dataExtra[i]);
    }
    if (dataExtraLoc[0] === undefined) {
      singleFlg = 1;
    }
    const formattedTime = intl.formatMessage({ id: 'MERC.containers.TagPage.time' });
    const formattedWeight = intl.formatMessage({ id: 'MERC.containers.TagPage.weight' });
    const formattedMechineName = intl.formatMessage({ id: 'MERC.containers.TagPage.mechineName' });
    const formattedProcessTime = intl.formatMessage({ id: 'MERC.containers.TagPage.processTime' });
    const formattedNetWeight = intl.formatMessage({ id: 'MERC.containers.TagPage.netWeight' });
    const formattedHour = intl.formatMessage({ id: 'MERC.containers.TagPage.hour' });
    const formattedKg = intl.formatMessage({ id: 'MERC.containers.TagPage.kg' });

    let datasets;
    let yAxes;
    if (singleFlg === 0) {
      datasets = [
        {
          label: formattedTime,
          backgroundColor: '#1976D2',
          borderColor: '#7986CB',
          hoverBackgroundColor: '#90CAF9',
          hoverBorderColor: '#7986CB',
          borderWidth: 1,
          data: dataT,
          yAxisID: 'y-axis-1',
        },
        {
          label: formattedWeight,
          backgroundColor: '#5E35B1',
          borderColor: '#B39DDB',
          hoverBackgroundColor: '#7E57C2',
          hoverBorderColor: '#B39DDB',
          borderWidth: 1,
          data: dataExtraLoc,
          yAxisID: 'y-axis-2',
        },
      ];
      yAxes = [
        {
          scaleLabel: {
            display: true,
            labelString: formattedProcessTime,
            fontSize: 18,
          },
          position: 'left',
          id: 'y-axis-1',
        },
        {
          scaleLabel: {
            display: true,
            labelString: formattedNetWeight,
            fontSize: 18,
          },
          position: 'right',
          id: 'y-axis-2',
          ticks: { beginAtZero: true },
        },
      ];
    } else if (singleFlg === 1) {
      datasets = [
        {
          label: formattedTime,
          backgroundColor: '#1976D2',
          borderColor: '#7986CB',
          hoverBackgroundColor: '#90CAF9',
          hoverBorderColor: '#7986CB',
          borderWidth: 1,
          data: dataT,
          yAxisID: 'y-axis-1',
        },
      ];
      yAxes = [
        {
          scaleLabel: {
            display: true,
            labelString: formattedProcessTime,
            fontSize: 18,
          },
          position: 'left',
          id: 'y-axis-1',
        },
      ];
    }

    const data = {
      labels,
      datasets,
    };
    return (
      <Bar
        data={data}
        width={100}
        height={300}
        options={{
          maintainAspectRatio: false,
          scales: {
            xAxes: [
              {
                scaleLabel: {
                  display: true,
                  labelString: formattedMechineName,
                  fontSize: 18,
                },
              },
            ],
            yAxes,
          },
          layout: {
            padding: {
              left: 0,
              right: 0,
              top: 40,
              bottom: 0,
            },
          },
          legend: {
            display: false,
          },
          plugins: {
            datalabels: {
              display: true,
              color: '#000000',
              align: 'top',
              anchor: 'top',
              font: {
                size: 12,
                weight: 500,
              },
              formatter(value) {
                if (typeof value === 'string') {
                  return value
                    .toString()
                    .concat(' ')
                    .concat(formattedHour);
                } else if (typeof value === 'number') {
                  return value
                    .toString()
                    .concat(' ')
                    .concat(formattedKg);
                }
                return null;
              },
            },
          },
        }}
      />
    );
  }
}

BarTagChart.propTypes = {
  intl: intlShape.isRequired,
  dataTag: PropTypes.array,
  dataExtra: PropTypes.array,
};

export default compose(injectIntl)(BarTagChart);
