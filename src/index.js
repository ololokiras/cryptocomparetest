const Cryptocomparelayer = require('./CpyptoCompareLayer');

const cryptocomparelayer = new Cryptocomparelayer();

async function main() {
  const coins = await cryptocomparelayer.initCoins();
  const fromSymbol = 'BTC';
  const toSymbol = 'USD';

  const stats = await cryptocomparelayer.getStats(fromSymbol, toSymbol);
  if (stats !== false) {
    console.log(stats);
  }

  if (coins) {
    if (coins[fromSymbol]) {
      const socialStats = await cryptocomparelayer.getSocialStats(coins[fromSymbol].Id);
      if (socialStats !== false) {
        console.log(socialStats);
      }

      const snapShotStats = await cryptocomparelayer.getCoinSnapshot(coins[fromSymbol].Id);
      if (snapShotStats !== false) {
        console.log(snapShotStats);
      }
    }
  }
}


main();

