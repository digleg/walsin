const humiDataProcess = (resp, val) => {
  const { data } = resp;
  const valFunc = val.split('.');
  const tempData = [];
  const title = ['湿度'];
  let tempDegree = [];
  let tempDate = [];
  for (let i = 0; i < data.length; i += 1) {
    if (tempDate.length > 10) break;
    if (data[i].extra.fport === 161) {
      if (data[i][valFunc[0]][valFunc[1]] < 100 && data[i][valFunc[0]][valFunc[1]] > 0) {
        tempDegree.push(data[i][valFunc[0]][valFunc[1]]);
        tempDate.push(
          data[i].date
            .split(' ')[1]
            .split(':')[0]
            .concat(':')
            .concat(data[i].date.split(' ')[1].split(':')[1])
        );
      }
    }
  }
  tempDate = tempDate.reverse();
  tempDegree = tempDegree.reverse();
  tempData.push(title);
  tempData.push(tempDate);
  tempData.push(tempDegree);
  return tempData;
};

export default humiDataProcess;
