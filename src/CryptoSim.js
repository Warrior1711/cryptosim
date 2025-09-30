import React, { useState } from 'react';
import { coins as initialCoins } from './data';
import CryptoChart from './Chart';
import darkTheme from './theme';

const startingBalance = 10000;

function randomWalk(prev) {
  // Simple random walk for price simulation
  const change = (Math.random() - 0.5) * 0.03; // ±3%
  return Math.max(1, prev * (1 + change));
}

export default function CryptoSim() {
  const [balance, setBalance] = useState(startingBalance);
  const [coins, setCoins] = useState(initialCoins.map(coin => ({
    ...coin,
    priceHistory: [coin.price],
    userOwned: 0,
    circulation: coin.circulation
  })));
  const [selected, setSelected] = useState(coins[0].symbol);

  // Simulate price movement
  function tick() {
    setCoins(coins => coins.map(coin => {
      const newPrice = randomWalk(coin.priceHistory[coin.priceHistory.length-1]);
      return { ...coin, priceHistory: [...coin.priceHistory, newPrice] };
    }));
  }

  // Buy logic
  function buy(symbol, amount) {
    setCoins(coins => coins.map(coin => {
      if (coin.symbol !== symbol) return coin;
      const price = coin.priceHistory[coin.priceHistory.length-1];
      const totalCost = price * amount;
      if (totalCost > balance || amount > coin.circulation - coin.userOwned) return coin;
      setBalance(b => b - totalCost);
      return { ...coin, userOwned: coin.userOwned + amount };
    }));
  }

  // Sell logic
  function sell(symbol, amount) {
    setCoins(coins => coins.map(coin => {
      if (coin.symbol !== symbol) return coin;
      if (amount > coin.userOwned) return coin;
      const price = coin.priceHistory[coin.priceHistory.length-1];
      setBalance(b => b + price * amount);
      return { ...coin, userOwned: coin.userOwned - amount };
    }));
  }

  // Edit circulation
  function editCirculation(symbol, value) {
    setCoins(coins => coins.map(coin => coin.symbol === symbol ? { ...coin, circulation: value } : coin));
  }

  // UI
  return (
    <div style={{ background: darkTheme.background, color: darkTheme.text, minHeight: '100vh', padding: 24 }}>
      <h1>Crypto Simulator</h1>
      <button onClick={tick} style={{ background: darkTheme.accent, color: darkTheme.text, border: 'none', padding: '8px 16px', borderRadius: 4 }}>
        Next Tick (Simulate Price)
      </button>
      <div style={{ margin: '16px 0' }}>Balance: <b>${balance.toFixed(2)}</b></div>
      <div>
        {coins.map(coin => (
          <div key={coin.symbol} style={{ background: darkTheme.surface, margin: '8px 0', padding: 12, borderRadius: 6 }}>
            <h2>{coin.name} ({coin.symbol})</h2>
            <div>Current Price: <b>${coin.priceHistory[coin.priceHistory.length-1].toFixed(2)}</b></div>
            <div>Owned: <b>{coin.userOwned}</b></div>
            <div>Circulation: <b>{coin.circulation}</b> <span style={{ fontSize: '0.9em' }}>
              <input type="number" value={coin.circulation} min={1} max={1000000000}
                onChange={e => editCirculation(coin.symbol, Number(e.target.value))}
                style={{ width: 80, marginLeft: 8 }} />
              </span>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <input type="number" min={1} max={coin.circulation - coin.userOwned} placeholder="Buy Amt" id={`buy-${coin.symbol}`} style={{ width: 60 }} />
              <button style={{ background: darkTheme.accent, color: darkTheme.text, border: 'none', borderRadius: 4, padding: '4px 12px' }}
                onClick={() => {
                  const val = Number(document.getElementById(`buy-${coin.symbol}`).value);
                  buy(coin.symbol, val);
                }}>Buy</button>
              <input type="number" min={1} max={coin.userOwned} placeholder="Sell Amt" id={`sell-${coin.symbol}`} style={{ width: 60 }} />
              <button style={{ background: darkTheme.error, color: darkTheme.text, border: 'none', borderRadius: 4, padding: '4px 12px' }}
                onClick={() => {
                  const val = Number(document.getElementById(`sell-${coin.symbol}`).value);
                  sell(coin.symbol, val);
                }}>Sell</button>
            </div>
            <div style={{ marginTop: 12 }}>
              <CryptoChart history={coin.priceHistory} coin={coin} />
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 24, background: darkTheme.surface, padding: 12, borderRadius: 6 }}>
        <h3>News Events <span style={{ fontSize: '0.8em', color: darkTheme.accent }}>(coming soon)</span></h3>
        <i>Random market news, events, and challenges will appear here in future updates!</i>
      </div>
    </div>
  );
}
