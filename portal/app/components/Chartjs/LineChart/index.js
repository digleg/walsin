/**
 *
 * LineChart
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Line } from 'react-chartjs-2';
import electColorArr from './colorArr';

class LineChart extends React.PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { grpName, data } = this.props;
    if (data.size !== 0) {
      const dataLength = data[0].length;
      const datasets = [];
      for (let i = 0; i < dataLength; i += 1) {
        datasets.push({
          label: data[0][i],
          fill: false,
          lineTension: 0.3,
          backgroundColor: electColorArr[i][0],
          borderColor: electColorArr[i][0],
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: electColorArr[i][1],
          pointBackgroundColor: '#fff',
          pointBorderWidth: 5,
          pointHoverRadius: 2,
          pointHoverBackgroundColor: electColorArr[i][1],
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 2,
          data: data[2][i],
        });
      }
      return (
        <Line
          data={{
            labels: data[1][0],
            datasets,
          }}
          options={{
            title: {
              display: true,
              text: grpName,
              fontSize: 10,
              padding: 0,
            },
            scales: {
              xAxes: [
                {
                  ticks: { fontSize: 8, padding: 0 },
                  padding: 0,
                },
              ],
              yAxes: [
                {
                  scaleLabel: {
                    display: true,
                    labelString: 'NT',
                    fontSize: 10,
                  },
                  ticks: {
                    // Include a dollar sign in the ticks
                    fontSize: 10,
                    // eslint-disable-next-line
                    callback: function(value) {
                      return '$'.concat(value);
                    },
                  },
                },
              ],
            },
            // responsive: options.responsive,
          }}
          legend={{
            // position: 'right',
            labels: {
              fontSize: 8,
              margin: 0,
            },
          }}
        />
      );
    }
    return <Line data={{}} />;
  }
}

LineChart.propTypes = {
  grpName: PropTypes.string,
  data: PropTypes.any,
};

export default LineChart;
