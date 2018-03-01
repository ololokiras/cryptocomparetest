const axios = require('axios');

const fromSymbol = 'BTC';
const toSymbol = 'USD';

let total24;
let marketcap;
let price;
let changePercent;


function getLastHourChange(fromSymbol, toSymbol) {
  const nowHourinMS = Date.now();
  const beforeHourinMS = nowHourinMS - 3600000;
  const nowHourQeury = `https://min-api.cryptocompare.com/data/pricehistorical?fsym=${fromSymbol}&tsyms=${toSymbol}&ts=${nowHourinMS}`;
  const beforeHourQuery = `https://min-api.cryptocompare.com/data/pricehistorical?fsym=${fromSymbol}&tsyms=${toSymbol}&ts=${beforeHourinMS}`;
  axios.all([
    axios.get(beforeHourQuery),
    axios.get(nowHourQeury)
  ]).then(axios.spread((resBefore, resNow) => {
    const change = resNow.data[fromSymbol][toSymbol] - resBefore.data[fromSymbol][toSymbol];
    const percent = (change / resNow.data[fromSymbol][toSymbol]) * 100;
    console.log('change: ', percent);
  }))
  .catch(err => {
    console.log(err);
  });
}

function getStats(fromSymbol, toSymbol) {
  const volumeQuery = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${fromSymbol}&tsyms=${toSymbol}&e=CCCAGG`;
  axios.get(volumeQuery)
    .then(res => {
      total24 = res.data.DISPLAY[fromSymbol][toSymbol].TOTALVOLUME24HTO;
      marketcap = res.data.DISPLAY[fromSymbol][toSymbol].MKTCAP;
      price = res.data.DISPLAY[fromSymbol][toSymbol].PRICE;
      changePercent = res.data.DISPLAY[fromSymbol][toSymbol].CHANGEPCT24HOUR;
      console.log('total24', total24);
      console.log('marketcap', marketcap);
      console.log('price', price);
      console.log('changePercent', changePercent);
    })
    .catch(err => {
      console.log(err);
    });
}

getLastHourChange(fromSymbol, toSymbol);
getStats(fromSymbol, toSymbol);
