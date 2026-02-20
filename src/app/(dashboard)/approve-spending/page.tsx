"use client";
import { useEffect, useState } from "react";
import { serverGetWithBareGet } from "@/app/server_request/server_services";
import { serverPatchWithBareGet } from "@/app/server_request/server_services";
import { ethers } from "ethers";
import { useAdmin } from "@/hooks/useAdmin";

import {
  STAKE12MONTH_CONTRACT,
  STAKE12MONTH_ABI,
} from "@/app/contracts/stake12months";

import {
  STAKE6MONTH_CONTRACT,
  STAKE6MONTH_ABI,
} from "@/app/contracts/stake6months";

import {
  STAKE3MONTH_CONTRACT,
  STAKE3MONTH_ABI,
} from "@/app/contracts/stake3months";

import {
  STAKE5DAYS_CONTRACT,
  STAKE5DAYS_ABI,
} from "@/app/contracts/stake5days";

export default function ApproveSpendingPage() {
  const [isConnected, setIsConnected] = useState(false);
  const [yourWalletAddress, setWalletAddress] = useState<string | null>(null);
  const [transactionStatus, setTransactionStatus] = useState<string | null>(
    null,
  );
  const POLYGON_CHAIN_ID = "0x89";
  const [isMobile, setIsMobile] = useState(false);
  const { admin, token } = useAdmin();

  type StakeRow = {
    id: number;
    user_id: number;
    wallet_address: string;
    transaction_hash: string;
    month: number;
    usdt_amount: string;
    fely_amount: string;
    fely_bonus_amount: string;
    status: string;
  };
  const [stakeData, setStakeData] = useState<StakeRow[]>([]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent,
        ),
      );
    };

    checkMobile();
    checkIfWalletIsConnected();
    //console.log({admin?.email})
  }, []);

  useEffect(() => {
    if (token) {
      getmyStaking(token);
    }
  }, [token]);

  const checkIfWalletIsConnected = async () => {
    try {
      // Check if MetaMask is installed
      if (!(window as any).ethereum) {
        console.log("MetaMask is not installed");
        return;
      }

      // Check network first
      await checkAndSwitchNetwork();

      // Check if already connected (no popup)
      const accounts = await (window as any).ethereum.request({
        method: "eth_accounts",
      });

      if (accounts.length > 0) {
        // Already connected!

        setWalletAddress(accounts[0]);
        setIsConnected(true);
        setTransactionStatus("connected");
      } else {
        // Not connected
        setIsConnected(false);
        console.log("Not connected");
      }
    } catch (error) {
      console.error("Error checking wallet connection:", error);
    }
  };

  const connectWallet = async () => {
    if (isMobile && !(window as any).ethereum) {
      const dappUrl = window.location.href.replace(/^https?:\/\//, "");
      const metamaskDeepLink = `https://metamask.app.link/dapp/${dappUrl}`;
      setTransactionStatus("Opening MetaMask app...");
      window.open(metamaskDeepLink, "_blank");
      return;
    }

    try {
      if ((window as any).ethereum) {
        setTransactionStatus("Connecting Wallet...");

        // ✅ 1. Request accounts FIRST
        const accounts = await (window as any).ethereum.request({
          method: "eth_requestAccounts",
        });

        // ✅ 2. Then switch network
        await checkAndSwitchNetwork();

        // ✅ 3. Set connected state
        setWalletAddress(accounts[0]);
        setIsConnected(true);
        setTransactionStatus("Wallet connected!");
        setTimeout(() => setTransactionStatus(null), 3000);
      } else {
        setTransactionStatus("No wallet found. Please install MetaMask.");
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      setTransactionStatus("Failed to connect wallet");
      setTimeout(() => setTransactionStatus(null), 3000);
    }
  };
  // Check and switch to Polygon network
  const checkAndSwitchNetwork = async () => {
    try {
      const chainId = await (window as any).ethereum.request({
        method: "eth_chainId",
      });

      console.log("Current Chain ID:", chainId);

      if (chainId !== POLYGON_CHAIN_ID) {
        setTransactionStatus("Switching to Polygon network...");

        try {
          // Try to switch to Polygon
          await (window as any).ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: POLYGON_CHAIN_ID }],
          });
          setTransactionStatus("Network switched successfully");
          setTimeout(() => setTransactionStatus(null), 3000);
        } catch (switchError: any) {
          // If Polygon is not added, add it
          if (switchError.code === 4902) {
            setTransactionStatus("Adding Polygon network...");
            await (window as any).ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: POLYGON_CHAIN_ID,
                  chainName: "Polygon Mainnet",
                  nativeCurrency: {
                    name: "POL",
                    symbol: "POL",
                    decimals: 18,
                  },
                  rpcUrls: ["https://polygon-rpc.com/"],
                  blockExplorerUrls: ["https://polygonscan.com/"],
                },
              ],
            });
            setTransactionStatus("Network added successfully");
            setTimeout(() => setTransactionStatus(null), 3000);
          } else {
            throw switchError;
          }
        }
      }
    } catch (error) {
      console.error("Error switching network:", error);
      setTransactionStatus("Failed to switch network");
      setTimeout(() => setTransactionStatus(null), 3000);
      throw error;
    }
  };

  // Listen for network changes
  useEffect(() => {
    if ((window as any).ethereum) {
      (window as any).ethereum.on("chainChanged", (chainId: string) => {
        console.log("Network changed to:", chainId);
        window.location.reload(); // Reload page on network change
      });

      (window as any).ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
        } else {
          setIsConnected(false);
          setWalletAddress(null);
        }
      });
    }

    return () => {
      if ((window as any).ethereum) {
        (window as any).ethereum.removeAllListeners("chainChanged");
        (window as any).ethereum.removeAllListeners("accountsChanged");
      }
    };
  }, []);

  const getmyStaking = async (Bearer: any) => {
    try {
      const obj = {
        status: "pending",
      };
      const MyStakingData = await serverGetWithBareGet(
        obj,
        "/admin/stakings",
        Bearer,
      );
      console.log(MyStakingData);
      setStakeData(MyStakingData.data.stakings);
    } catch (error) {
      console.error("Error connecting wallet:", error);
      setTransactionStatus("Failed to connect wallet");
      setTimeout(() => setTransactionStatus(null), 3000);
    }
  };

  const approve = async (
    month: number,
    account: string,
    capital: string,
    inter: string,
    stid: number,
  ) => {
    if (!isConnected) {
      setTransactionStatus("Not Connected to Perform This action");
      return;
    }

    if (!ethers.isAddress(account)) {
      setTransactionStatus(`Invalid account address: ${account}`);
      return;
    }

    try {
      const resolvedAccount = ethers.getAddress(account);
      const contract: ethers.Contract = await returnContract(month);
      const capitalAmount = ethers.parseUnits(capital, 18);
      const interestAmount = ethers.parseUnits(inter, 18);

      // ✅ Pre-flight: simulate the call first to get a readable error
      try {
        await contract.assignStake.staticCall(
          resolvedAccount,
          capitalAmount,
          interestAmount,
        );
      } catch (simError: any) {
        console.error("Simulation failed — tx would revert:", simError);

        // Attempt to decode the custom error using the contract's ABI
        if (simError?.data) {
          try {
            const decoded = contract.interface.parseError(simError.data);
            setTransactionStatus(`Revert: ${decoded?.name}(${decoded?.args})`);
          } catch {
            setTransactionStatus(`Revert with unknown error: ${simError.data}`);
          }
        }
        return; // bail before sending
      }

      const tx = await contract.assignStake(
        resolvedAccount,
        capitalAmount,
        interestAmount,
      );

      setTransactionStatus("Transaction Pending...");
      const receipt = await tx.wait();
      setTransactionStatus(`Transaction Successful! Hash: ${receipt.hash}`);
      updateStakingStatus(stid, "completed");
    } catch (error: any) {
      console.error("Transaction failed:", error);

      // Try to decode custom error from the contract ABI
      const contract = await returnContract(month).catch(() => null);
      if (contract && error?.data) {
        try {
          const decoded = contract.interface.parseError(error.data);
          setTransactionStatus(
            `Transaction Failed: ${decoded?.name}(${decoded?.args?.join(", ")})`,
          );
          return;
        } catch {
          /* fall through */
        }
      }

      setTransactionStatus(
        `Transaction Failed: ${error?.message ?? "Unknown error"}`,
      );
    }
  };

  // Add proper return type annotation
  const returnContract = async (plan: number): Promise<ethers.Contract> => {
    const provider = new ethers.BrowserProvider((window as any).ethereum);
    const signer = await provider.getSigner();

    if (plan == 5) {
      return new ethers.Contract(STAKE5DAYS_CONTRACT, STAKE5DAYS_ABI, signer);
    } else if (plan == 3) {
      return new ethers.Contract(STAKE3MONTH_CONTRACT, STAKE3MONTH_ABI, signer);
    } else if (plan == 6) {
      return new ethers.Contract(STAKE6MONTH_CONTRACT, STAKE6MONTH_ABI, signer);
    } else {
      return new ethers.Contract(
        STAKE12MONTH_CONTRACT,
        STAKE12MONTH_ABI,
        signer,
      );
    }
  };

  const updateStakingStatus = async (id: number | string, st: string) => {
    try {
      const obj = {
        status: st,
      };

      const rtn = await serverPatchWithBareGet(
        obj,
        `/admin/stakings/${id}/status`, // ✅ dynamic id
        token!,
      );

      console.log(rtn);
    } catch (error) {
      console.error("Error connecting wallet:", error);
      setTransactionStatus("Failed to connect wallet");
      setTimeout(() => setTransactionStatus(null), 3000);
    }
    getmyStaking(token);
  };

  return (
    <>
      {/* Wallet Connection Section */}
      <div className="mb-6 p-4 bg-white rounded-xl shadow-sm border border-gray-100 md:mb-8 md:p-6">
        <h2 className="text-sm font-bold text-gray-900 mb-2 md:text-base">
          Wallet Connection & Spending Cap
        </h2>
        <p className="text-xs text-gray-500 mb-4 md:text-sm">
          Connect your wallet to oversee and approve spending caps.
        </p>

        {/* Wallet Controls */}
        <div>
          <button
            onClick={connectWallet}
            className="flex items-center gap-2 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-primaryHover transition-all shadow-md md:text-sm md:px-4 md:py-2"
          >
            <svg
              className="h-4 w-4 md:h-5 md:w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
            <span>
              {isConnected ? "Wallet Connected" : "Connect Wallet"}
            </span>{" "}
          </button>
          <span>{transactionStatus}</span>

          {/* Wallet ID Label */}
          <div
            className={`mt-2 text-xs font-medium text-gray-500 md:text-sm ${isConnected ? "block" : "hidden"}`}
          >
            {yourWalletAddress}
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="overflow-hidden rounded-xl bg-white shadow-sm border border-gray-100">
        <div className="border-b border-gray-100 bg-gray-50/50 px-4 py-3 md:px-6 md:py-4">
          <h2 className="text-sm font-bold text-gray-900 md:text-base">
            Stake FELY Pending Approvals
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-gray-50 text-[10px] uppercase text-gray-500">
              <tr>
                <th className="px-4 py-2 font-semibold whitespace-nowrap md:px-6 md:py-3">
                  user_id
                </th>
                <th className="px-4 py-2 font-semibold whitespace-nowrap md:px-6 md:py-3">
                  wallet_address
                </th>
                <th className="px-4 py-2 font-semibold whitespace-nowrap md:px-6 md:py-3">
                  transaction_hash
                </th>
                <th className="px-4 py-2 font-semibold whitespace-nowrap md:px-6 md:py-3">
                  month
                </th>
                <th className="px-4 py-2 font-semibold whitespace-nowrap md:px-6 md:py-3">
                  usdt_amount
                </th>
                <th className="px-4 py-2 font-semibold text-center whitespace-nowrap md:px-6 md:py-3">
                  fely_amount
                </th>
                <th className="px-4 py-2 font-semibold text-center whitespace-nowrap md:px-6 md:py-3">
                  fely_bonus_amount
                </th>
                <th className="px-4 py-2 font-semibold text-center whitespace-nowrap md:px-6 md:py-3">
                  status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {stakeData.map((row, i) => (
                <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap md:px-6 md:py-3">
                    {row.user_id}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap md:px-6 md:py-3">
                    {row.wallet_address}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap md:px-6 md:py-3">
                    {row.transaction_hash}
                  </td>
                  <td className="px-4 py-2 font-mono text-gray-500 whitespace-nowrap md:px-6 md:py-3">
                    {row.month}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap md:px-6 md:py-3">
                    {row.usdt_amount}
                  </td>
                  <th className="px-4 py-2 font-semibold text-center whitespace-nowrap md:px-6 md:py-3">
                    {row.fely_amount}
                  </th>
                  <th className="px-4 py-2 font-semibold text-center whitespace-nowrap md:px-6 md:py-3">
                    {row.fely_bonus_amount}
                  </th>
                  <td className="px-4 py-2 text-center whitespace-nowrap md:px-6 md:py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() =>
                          approve(
                            row.month,
                            row.wallet_address,
                            row.fely_amount,
                            row.fely_bonus_amount,
                            row.id,
                          )
                        }
                        className="rounded bg-emerald-500 px-3 py-1 text-[10px] font-bold text-white shadow-sm hover:bg-emerald-600 transition-all uppercase tracking-wide"
                      >
                        Approve
                      </button>

                      <button
                        onClick={() => updateStakingStatus(row.id, "cancelled")}
                        className="rounded bg-red-500 px-3 py-1 text-[10px] font-bold text-white shadow-sm hover:bg-red-600 transition-all uppercase tracking-wide"
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
