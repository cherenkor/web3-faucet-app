import { useCallback, useEffect, useState } from "react";
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import cn from "classnames";

import "./App.css";
import { loadContract } from "./utils/load-contract";

function App() {
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [contract, setContract] = useState<any | null>(null);
  const [provider, setProvider] = useState<any | null>(null);
  const [currentAccount, setCurrentAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>();
  const [isProviderLoading, setIsProviderLoading] = useState(true);
  const [isDonating, setIsDonating] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [error, setError] = useState<JSX.Element>();
  const canConnectToContract = currentAccount && contract;

  const getAccount = useCallback(async () => {
    const accounts = await web3?.eth.getAccounts();

    if (accounts?.[0]) {
      setCurrentAccount(accounts[0]);
    }
  }, [web3]);

  const loadBalance = useCallback(async () => {
    const contractBalance = await web3?.eth.getBalance(contract.address);
    const balanceInEther = web3?.utils.fromWei(contractBalance || "0", "ether");
    setBalance(balanceInEther);
  }, [contract, web3]);

  const addFunds = useCallback(async () => {
    setIsDonating(true);

    try {
      await contract.addFunds({
        from: currentAccount,
        value: web3?.utils.toWei("1", "ether"),
      });
      loadBalance();
    } catch (ex) {
      console.error(ex);
      alert("Something went wrong. Please check console for logs.");
    } finally {
      setIsDonating(false);
    }
  }, [currentAccount, contract, web3, loadBalance]);

  const withdrawFunds = useCallback(async () => {
    setIsWithdrawing(true);

    try {
      await contract.withdraw(web3?.utils.toWei("0.1", "ether"), {
        from: currentAccount,
      });
      loadBalance();
    } catch (ex) {
      console.error(ex);
      alert("Something went wrong. Please check console for logs.");
    } finally {
      setIsWithdrawing(false);
    }
  }, [currentAccount, loadBalance, contract, web3]);

  const setAccountListeners = (provider: any) => {
    provider.on("accountsChanged", ([firstAccount]: string[]) => {
      setCurrentAccount(firstAccount);
    });

    provider._jsonRpcConnection.events.on("notification", ({ method }: any) => {
      if (method === "metamask_unlockStateChanged") {
        setCurrentAccount(null);
      }
    });

    provider.on("chainChanged", () => {
      window.location.reload();
    });
  };

  useEffect(() => {
    const loadProvider = async () => {
      setIsProviderLoading(true);

      const newProvider: any = await detectEthereumProvider();

      if (newProvider) {
        const faucetContract = await loadContract("Faucet", newProvider);
        setAccountListeners(newProvider);

        if (!faucetContract) {
          setError(<>The network is not supported. Please select Ganache.</>);
          throw Error("Wrong network");
        }

        setWeb3(new Web3(newProvider));
        setProvider(newProvider);
        setContract(faucetContract);
      } else {
        console.error("Please, install Metamask and connect it to the site.");
      }
    };

    loadProvider()
      .catch(console.error)
      .finally(() => setIsProviderLoading(false));
  }, []);

  useEffect(() => {
    if (web3) {
      getAccount().catch(console.error);
    }
  }, [getAccount, web3]);

  useEffect(() => {
    if (contract && web3) {
      loadBalance().catch(console.error);
    }
  }, [loadBalance, contract, web3, provider]);

  return (
    <>
      <div className="faucet-wrapper">
        <div className="faucet">
          {isProviderLoading ? (
            <div>
              <h2 className="has-text-centered mb-2">Looking for Web3</h2>
              <progress
                className="progress is-small is-primary"
                max="100"
              ></progress>
            </div>
          ) : (
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
                      provider
                        ?.request({ method: "eth_requestAccounts" })
                        .then(getAccount);
                    }}
                    className="button is-small"
                  >
                    Connect Wallet
                  </button>
                )
              ) : (
                <div className="notification is-warning is-size-6 py-2 px-4 is-rounded">
                  {error || (
                    <>
                      Wallet is not detected!{" "}
                      <a
                        href="https://docs.metamask.io"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Install Metamask
                      </a>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
          {!isProviderLoading && currentAccount && (
            <>
              <div className="balance-view is-size-2 my-4">
                Current Balance: <strong>{balance || "—"}</strong> ETH
              </div>

              <button
                onClick={() => addFunds()}
                className={cn("button is-link mr-2", {
                  "is-loading": isDonating,
                })}
                disabled={!canConnectToContract}
              >
                Donate 1 eth
              </button>
              <button
                disabled={!canConnectToContract}
                onClick={() => withdrawFunds()}
                className={cn("button is-primary", {
                  "is-loading": isWithdrawing,
                })}
              >
                Withdraw 0.1 eth
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
