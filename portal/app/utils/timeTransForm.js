// outTs - inTs = processTime
// if outTs === null then out is now
/* eslint-disable no-mixed-operators */

import timediff from 'timediff/timediff';

export function timeTransForm(inTs, outTs) {
  const d = new Date();
  const len = d.getTime();
  const offset = d.getTimezoneOffset() * 60000;
  const utcTime = len + offset;
  // +8為時區調整
  const num = 3600000 * 8;
  // new Date(utcTime + num).toISOString()

  let outTsLoc = outTs;
  if (outTsLoc === undefined) {
    outTsLoc = new Date(utcTime + num + num).toISOString();
  }
  const timeResult = timediff(inTs, outTsLoc, 'HmS');
  const timeSpec = (timeResult.hours + timeResult.minutes / 60 + timeResult.seconds / 3600).toFixed(3);
  return timeSpec;
}
