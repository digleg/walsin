/**
 *
 * BarChart
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { HorizontalBar } from 'react-chartjs-2';
import 'chartjs-plugin-datalabels/dist/chartjs-plugin-datalabels';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';

import { compose } from 'redux';
import { colorArr } from './colorArr';
import messages from '../../../containers/TagPage/messages';

class BarHoriChart extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { intl, titles, labels, dataInput, max } = this.props;
    const labelsTmp = [];
    const formattedHour = intl.formatMessage({ id: 'MERC.containers.TagPage.hour' });

    for (let i = 0; i < labels.length; i += 1) {
      labelsTmp.push(labels[i].name);
    }
    const datasetsArr = [];
    for (let j = 0; j < dataInput.length; j += 1) {
      datasetsArr.push({
        label: labelsTmp[j],
        backgroundColor: colorArr[j].backgroundColor,
        borderColor: colorArr[j].borderColor,
        borderWidth: 0.8,
        hoverBackgroundColor: colorArr[j].hoverBackgroundColor,
        hoverBorderColor: colorArr[j].hoverBorderColor,
        data: [dataInput[j]],
      });
    }

    const data = {
      datasets: datasetsArr,
    };

    const options = {
      scales: {
        xAxes: [
          {
            stacked: true,
            ticks: {
              display: false,
              max: Number([max[0]]),
            },
          },
        ],
        yAxes: [
          {
            stacked: true,
            ticks: {
              display: false,
            },
          },
        ],
      },
      legend: {
        display: false,
      },
      tooltips: {
        mode: 'single',
        xAlign: 'center',
        yAlign: 'center',
      },
      title: {
        display: false,
        text: titles,
        position: 'top',
      },
      plugins: {
        datalabels: {
          display: true,
          color: '#EEEEEE',
          align: 'center',
          anchor: 'center',
          font: {
            size: 16,
            weight: 500,
          },
          formatter(value, context) {
            return context.dataset.label.concat(' : ', value, ' ', formattedHour);
          },
        },
      },
      layout: {
        padding: {
          left: 0,
          right: 0,
          top: -10,
          bottom: -10,
        },
      },
      responsive: true,
      animation: false,
    };
    return <HorizontalBar data={data} options={options} height={10} />;
  }
}

BarHoriChart.propTypes = {
  dataInput: PropTypes.array,
  labels: PropTypes.array,
  titles: PropTypes.string,
  max: PropTypes.array,
  intl: intlShape.isRequired,
};

export default compose(injectIntl)(BarHoriChart);
