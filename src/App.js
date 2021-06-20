import './App.css';


import SuperfluidSdk from '@superfluid-finance/js-sdk';
import { Web3Provider } from '@ethersproject/providers';

const sf = new SuperfluidSdk.Framework({
  ethers: new Web3Provider(window.ethereum)
});


function App() {
  let user = null;

  const connectWallet = async () => {
    const walletAddress = await window.ethereum.request({
      method: 'eth_requestAccounts',
      params: [
        {
          eth_accounts: {}
        }
      ]
    })
    // Initialize super fluid using first wallet address, could improve by using a selector
    await sf.initialize()
    user = sf.user({
      address: walletAddress[0],
      // token address for ETHx, this means we are streaming ETHx
      // https://docs.superfluid.finance/superfluid/networks/networks
      token: "0x5943F705aBb6834Cad767e6E4bB258Bc48D9C947"
    })
  }

  const startFlow = async () => {
    await user.flow({
      recipient: "0xbFC83562A00dAda05961e8FA450144743E7147c8",
      flowRate: calculateRate("10")
    })
    const details = await user.details();
    console.log(details)
  }

  const stopFlow = async () => {
    await user.flow({
      recipient: "0xbFC83562A00dAda05961e8FA450144743E7147c8",
      flowRate: "0"
    })
    const details = await user.details();
    console.log(details)
  }

  return (
    <div className="App">
      <button onClick={connectWallet}>
        Connect Wallet
      </button>
      <button onClick={startFlow}>
        Start Flow
      </button>
      <button onClick={stopFlow}>
        Stop Flow
      </button>
    </div>
  );
}


function calculateRate(tokensPerMonth){
  const oneMinute = 60;
  const oneHour = 60 * oneMinute;
  const oneDay = 24 * oneHour;
  const oneMonth = 30 * oneDay;

  const rate = tokensPerMonth * 1e18 / oneMonth
  return rate.toFixed(0)
}

export default App;
