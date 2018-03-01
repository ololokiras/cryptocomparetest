const axios = require('axios');

class CpyptoCompareLayer {
  async initCoins() {
    const coinsQuery = 'https://www.cryptocompare.com/api/data/coinlist/';
    const response = await axios.get(coinsQuery);
    if (response.data) {
      return response.data.Data;
    } else {
      return false;
    }
  }

  async getStats(fromSymbol, toSymbol) {
    const statsQuery = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${fromSymbol}&tsyms=${toSymbol}&e=CCCAGG`;
    const statsResponse = await axios.get(statsQuery);
    // console.log(statsResponse);
    const nowHourinMS = Date.now();
    const nowHourQuery = `https://min-api.cryptocompare.com/data/histohour?fsym=${fromSymbol}&tsym=${toSymbol}&limit=1&aggregate=1&toTs=${nowHourinMS}`;
    const nowResponse = await axios.get(nowHourQuery);

    if (statsResponse.data.Response !== 'Error' && nowResponse.data.Response !== 'Error') {
      const total24 = statsResponse.data.DISPLAY[fromSymbol][toSymbol].TOTALVOLUME24HTO;
      const marketcap = statsResponse.data.DISPLAY[fromSymbol][toSymbol].MKTCAP;
      const price = statsResponse.data.DISPLAY[fromSymbol][toSymbol].PRICE;
      const change24Percent = statsResponse.data.DISPLAY[fromSymbol][toSymbol].CHANGEPCT24HOUR;
      
      const { close, open } = nowResponse.data.Data[1];
      let result;
      let side;

      if (close > open) {
        side = '+';
        result = close / open;
      } else {
        side = '-';
        result = open / close;
      }

      const changeHourPercent = side + result.toFixed(2);
      const stats = {
        total24, marketcap, price, change24Percent, changeHourPercent
      };
      return stats;
    } else {
      return false;
    }
  }

  async getSocialStats(coinId) {
    const socialQuery = `https://www.cryptocompare.com/api/data/socialstats/?id=${coinId}`;
    const socialstats = await axios.get(socialQuery);
    if (socialstats.data.Response === 'Success') {
      const result = {
        symbol: socialstats.data.Data.General.Name,
        name: socialstats.data.Data.General.CoinName,
        twitter: socialstats.data.Data.Twitter,
        reddit: socialstats.data.Data.Reddit,
        facebook: socialstats.data.Data.Facebook,
        code: []
      };
      socialstats.data.Data.CodeRepository.List.forEach(item => {
        result.code.push({
          url: item.url,
          lastUpdate: this.timeConverter(item.last_update)
        });// new Date(Number(item.last_update)) });
      });
      return result;
    } else {
      return false;
    }
  }

  async getCoinSnapshot(coinId) {
    const snapshotQuery = `https://www.cryptocompare.com/api/data/coinsnapshotfullbyid/?id=${coinId}`;
    const snapshotStats = await axios.get(snapshotQuery);
    console.log(snapshotStats.data.Response);
    if (snapshotStats.data.Response === 'Success') {
      const result = {
        image: `https://www.cryptocompare.com${snapshotStats.data.Data.General.ImageUrl}`,
        description: snapshotStats.data.Data.General.Description,
        features: snapshotStats.data.Data.General.Features,
        technology: snapshotStats.data.Data.General.Technology,
        totalSupply: snapshotStats.data.Data.General.TotalCoinSupply,
        algorithm: snapshotStats.data.Data.General.Algorithm,
        proofType: snapshotStats.data.Data.General.ProofType,
        startDate: snapshotStats.data.Data.General.StartDate,
        ico: {
          status: snapshotStats.data.Data.ICO.Status,
          whitePaper: snapshotStats.data.Data.ICO.WhitePaper
        }
      };
      return result;
    } else {
      return false;
    }
  }

  timeConverter(milliseconds) {
    const a = new Date(milliseconds * 1000);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const year = a.getFullYear();
    const month = months[a.getMonth()];
    const date = a.getDate();
    const hour = a.getHours();
    const min = a.getMinutes();
    const sec = a.getSeconds();
    const time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
    return time;
  }
}


module.exports = CpyptoCompareLayer;
