const dataLine = (dashboardDataList, tmp) => {
  return {
    labels: dashboardDataList[tmp][1],
    datasets: [
      {
        label: dashboardDataList[tmp][0].concat('(℃)'),
        fill: false,
        lineTension: 0.1,
        backgroundColor: 'rgba(191,63,63,0.4)',
        borderColor: 'rgba(191,63,63,1)',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: 'rgba(191,63,63,1)',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(191,63,63,1)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: dashboardDataList[tmp][2],
      },
    ],
  };
  // }
  // return 0;
};

export default dataLine;
