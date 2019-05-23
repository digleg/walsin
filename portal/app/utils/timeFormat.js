// from 2018-01-02T09:33:26.000Z to 2018-01-02 09:33:26

export function timeFormat(data) {
  const splitT = data.split('T');
  const splitDot = splitT[1].split('.');
  let timeFinal = '';
  timeFinal = timeFinal
    .concat(splitT[0])
    .concat(' ')
    .concat(splitDot[0]);
  return timeFinal;
}
