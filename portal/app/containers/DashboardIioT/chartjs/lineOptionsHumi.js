import 'chartjs-plugin-datalabels/dist/chartjs-plugin-datalabels';

const lineOptions = title => {
  return {
    title: {
      display: true,
      text: title,
      fontSize: 16,
      fontWeight: 500,
      padding: 0,
    },
    scales: {
      xAxes: [
        {
          scaleLabel: {
            display: false,
            labelString: '时间',
            fontSize: 10,
          },
          ticks: { fontSize: 10, padding: 0 },
          padding: 0,
        },
      ],
      yAxes: [
        {
          scaleLabel: {
            display: false,
            labelString: '数值',
            fontSize: 10,
          },
          ticks: {
            // Include a dollar sign in the ticks
            fontSize: 10,
            min: 0,
            max: 100,
            // eslint-disable-next-line
            /*
            callback: function(value) {
              return '$'.concat(value);
            },*/
          },
        },
      ],
    },
    animation: false,
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
      },
    },
  };
};

export default lineOptions;
