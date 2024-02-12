'use strict';
const fs = require('node:fs');
const readline = require('node:readline');
const rs = fs.createReadStream('./popu-pref.csv');
const rl = readline.createInterface({ input: rs });
const prefDataMap = new Map(); // keyを都道府県 vlaueを集計データオブジェクト
rl.on('line', lineString => {
  const columns = lineString.split(',');
  const year    = parseInt(columns[0]);
  const pref    = columns[1];
  const popu    = parseInt(columns[3]);
  if (year === 2016 || year === 2021) {
    let value = null;
    if (prefDataMap.has(pref)) {
      value = prefDataMap.get(pref);
    } else {
      value = {
        before: 0,
        after : 0,
        change: null,
      };
    }
    if (year === 2016) {
      value.before = popu;
    }
    if (year === 2021) {
      value.after = popu;
    }
    prefDataMap.set(pref, value);
  }
});
rl.on('close', () => {
  for (const [key, value] of prefDataMap) {
    value.change = value.after / value.before;
  }
  const rankingArray = Array.from(prefDataMap).sort((pair1, pair2) => {
    return pair2[1].change - pair1[1].change;
  });
  const rankingStrings = rankingArray.map(([key, value]) => {
    return `${key}: ${value.before}=>${value.after} 変化率: ${value.change}`;
  });
  console.log(rankingStrings);
});