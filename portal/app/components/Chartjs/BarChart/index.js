/**
 *
 * BarChart
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Bar } from 'react-chartjs-2';
import 'chartjs-plugin-datalabels';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { compose } from 'redux';
// import messages from '../../../containers/TagPage/messages';

class BarChart extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { dataInput, intl } = this.props;
    const xAxis = [];
    const yAxis = [];
    // const yMachineCntAxis = [];
    let data = {};

    const formattedMessage = intl.formatMessage({ id: 'MERC.containers.TagPage.tag' });
    const formattedWorkListNum = intl.formatMessage({ id: 'MERC.containers.TagPage.workListNum' });
    let ticksMax = 11;
    if (dataInput !== null) {
      for (let i = 0; i < dataInput.length; i += 1) {
        xAxis.push(dataInput[i].name);
        yAxis.push(dataInput[i].cnt);
        if (dataInput[i].cnt > ticksMax) {
          ticksMax = dataInput[i].cnt;
        }
      }
      ticksMax += 5;
      const datasets = [
        {
          label: formattedMessage,
          backgroundColor: 'rgba(99,132,225,0.2)',
          borderColor: 'rgba(99,132,225,1)',
          borderWidth: 1,
          hoverBackgroundColor: 'rgba(99,132,225,0.4)',
          hoverBorderColor: 'rgba(99,132,225,1)',
          data: yAxis,
          yAxisID: 'y-axis-1',
        },
      ];
      data = {
        labels: xAxis,
        datasets,
      };
    }

    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 20 }}>
        {/* <h2>Bar Example (custom size)</h2> */}
        <Bar
          data={data}
          height={40}
          options={{
            responsive: true,
            plugins: {
              datalabels: {
                display: true,
                color: '#1976D2',
                align: 'end',
                anchor: 'end',
                font: {
                  size: 40,
                },
              },
            },
            scales: {
              xAxes: [
                {
                  ticks: { fontSize: 16, padding: 0 },
                },
              ],
              yAxes: [
                {
                  type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
                  display: true,
                  position: 'left',
                  id: 'y-axis-1',
                  scaleLabel: {
                    display: true,
                    labelString: formattedWorkListNum,
                    fontSize: '16',
                  },
                  ticks: {
                    max: ticksMax,
                    min: 0,
                    stepSize: 2,
                  },
                  categoryPercentage: 0.5,
                  barPercentage: 1.0,
                },
              ],
            },
          }}
        />
      </div>
    );
  }
}

BarChart.propTypes = {
  dataInput: PropTypes.array,
  intl: intlShape.isRequired,
};

// export default BarChart;
export default compose(injectIntl)(BarChart);
