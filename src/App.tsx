import { useEffect, useState } from "react";
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";

import "./App.css";
import { loadContract } from "./utils/load-contract";

function App() {
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [contract, setContract] = useState<any | null>(null);
  const [provider, setProvider] = useState<any | null>(null);
  const [currentAccount, setCurrentAccount] = useState<string>();
  const [balance, setBalance] = useState<string>();

  useEffect(() => {
    const loadProvider = async () => {
      const newProvider = await detectEthereumProvider();
      const faucetContract = await loadContract("Faucet", newProvider);

      if (newProvider) {
        setWeb3(new Web3(newProvider as any));
        setProvider(newProvider as any);
        setContract(faucetContract);
      } else {
        alert("Please, install Metamask and connect it to the site.");
      }
    };

    loadProvider();
  }, []);
  console.log({ contract, provider });

  useEffect(() => {
    const getAccount = async () => {
      const accounts = await web3?.eth.getAccounts();

      if (accounts?.[0]) {
        setCurrentAccount(accounts[0]);
      }
    };

    if (web3) {
      getAccount();
    }
  }, [web3]);

  useEffect(() => {
    const loadBalance = async () => {
      const contractBalance = await web3?.eth.getBalance(contract.address);
      const balanceInEther = web3?.utils.fromWei(
        contractBalance || "0",
        "ether"
      );
      setBalance(balanceInEther);
    };

    if (contract && web3) loadBalance();
  }, [contract, web3]);

  return (
    <>
      <div className="faucet-wrapper">
        <div className="faucet">
          <div className="is-flex is-align-items-center">
            <span className="mr-2">
              <strong>Account: </strong>
            </span>

            {!!web3 ? (
              currentAccount ? (
                <span>{currentAccount}</span>
              ) : (
                <button
                  onClick={() => {
                    provider?.request({ method: "eth_requestAccounts" });
                  }}
                  className="button is-small"
                >
                  Connect Wallet
                </button>
              )
            ) : (
              <div>Loading info...</div>
            )}
          </div>
          {!!contract && (
            <>
              <div className="balance-view is-size-2 my-4">
                Current Balance: <strong>{balance}</strong> ETH
              </div>

              <button className="button is-link mr-2">Donate</button>
              <button className="button is-primary">Withdraw</button>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
