const now = new Date().getHours();
const hourlyAvg = (array, hour) => {
  const filteredArr = array.filter((vs) => vs.hour == hour);
  if (filteredArr.length > 0) {
    return (mappedArr = filteredArr.map(avgSpo2Hr));
  } else {
    return 0;
  }
};
function avgSpo2Hr(vs) {
  let avgHr = arrayAverage(vs.message.heartRate);
  let avgSpo2 = arrayAverage(vs.message.spo2);
  return (vs = { avgHr, avgSpo2 });
}
function arrayAverage(nums) {
  if (nums.length > 0) {
    return nums.reduce((a, b) => a + b) / nums.length;
  } else {
    return 0;
  }
}
function neatHourlyAvg(array) {
  let totalHr = 0;
  let totalSpo2 = 0;
  array.forEach(({ avgHr, avgSpo2 }) => {
    totalHr = totalHr + avgHr;
    totalSpo2 = totalSpo2 + avgSpo2;
  });
  const heartRate = totalHr / array.length;
  const spo2 = totalSpo2 / array.length;
  return { heartRate, spo2 };
}

const todayAvg = (data) => {
  const hourArr = [];
  const hourAvgArr = [];
  for (let i = 0; i <= now; i++) {
    hourArr.push(hourlyAvg(data, i));
  }
  hourArr.forEach((array, i) => {
    if (array) {
      hourAvgArr[i] = neatHourlyAvg(hourArr[i]);
    }
  });
  return hourAvgArr;
};
const yesturdayAvg = (data) => {
  const hourArr = [];
  const hourAvgArr = [];
  for (let i = now; i <= 24; i--) {
    hourArr.push(hourlyAvg(data, i));
  }
  hourArr.forEach((array, i) => {
    if (array) {
      hourAvgArr[i] = neatHourlyAvg(hourArr[i]);
    }
  });
  return hourAvgArr;
};
const test = (name) => {
  console.log(name);
};

exports.todayAvg = todayAvg
exports.yesturdayAvg = yesturdayAvg