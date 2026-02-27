"use client";

import { useEffect, useState } from "react";
import { serverGetWithBareGet } from "@/app/server_request/server_services";
import { useAdmin } from "@/hooks/useAdmin";
import { FELY_CONTRACT_ADDRESS, FELY_ABI } from "@/app/contracts/felyContract";
import { ethers } from "ethers";
import { serverPatchWithBareGet } from "@/app/server_request/server_services";

export default function PendingWithdrawalsPage() {
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const { admin, token } = useAdmin();
  const [isMobile, setIsMobile] = useState(false);
  const [yourWalletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState<string | null>(
    null,
  );
  const POLYGON_CHAIN_ID = "0x89";

  type PendingWithdrawal = {
    id: number;
    user_id: number;
    usdt_amount: string;
    wallet_address: string;
    fely_amount: string;
    withdrawal_date: string;
    status: string;
  };

  const [pendingWithdrawals, setPendingWithdrawals] = useState<
    PendingWithdrawal[]
  >([]);

  const copyToClipboard = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

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
          setTransactionStatus("");
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

  const updateWindrwalStatus = async (id: number | string) => {
    try {
      const obj = {
        action: "approve",
        reason:
          "Withdrawal approved - user verification completed successfully",
      };

      const rtn = await serverPatchWithBareGet(
        obj,
        `/admin/withdrawals/${id}/process`, // ✅ dynamic id
        token!,
      );

      console.log(rtn);
    } catch (error) {
      console.error("Error connecting wallet:", error);
      setTransactionStatus("Failed to connect wallet");
      setTimeout(() => setTransactionStatus(null), 3000);
    }
    getAllWithdrawals(token);
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

  useEffect(() => {
    if (token) {
      getAllWithdrawals(token);
    }
  }, [token]);

  const getAllWithdrawals = async (Bearer: any) => {
    try {
      const response = await serverGetWithBareGet(
        "",
        "/admin/withdrawals?status=pending&sort_by=created_at&sort_order=desc",
        Bearer,
      );
      const data = response.data.withdrawals; // or your API response array

      setPendingWithdrawals(
        data.map((item: any) => ({
          id: item.id,
          user_id: item.user.id,
          wallet_address: item.user.wallet_address,
          usdt_amount: item.amounts.usdt_amount,
          fely_amount: item.amounts.fely_amount,
          withdrawal_date: item.dates.withdrawal_date,
          status: item.status.text,
        })),
      );

      console.log(response);
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  const apparove = async (account: string, amount: string, recid: number) => {
    if (!isConnected) {
      setTransactionStatus("Not Connected to Perform This action");
      return;
    }

    if (!ethers.isAddress(account)) {
      setTransactionStatus(`Invalid account address: ${account}`);
      return;
    }

    try {
      setTransactionStatus("Preparing transaction...");

      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();
      const feeData = await provider.getFeeData();

      const baseGasPrice = feeData.gasPrice ?? ethers.parseUnits("150", "gwei");
      const gasPrice = (baseGasPrice * BigInt(120)) / BigInt(100);

      const amountBig: bigint = ethers.parseUnits(amount.trim(), 18);

      const felyContract = new ethers.Contract(
        FELY_CONTRACT_ADDRESS,
        FELY_ABI,
        signer,
      );

      setTransactionStatus("Waiting for wallet confirmation...");
      const transferTx = await felyContract.transfer(account, amountBig, {
        gasPrice,
      });

      setTransactionStatus(
        `Transfer tx sent: ${transferTx.hash} — confirming...`,
      );

      const receipt = await transferTx.wait(1);

      if (receipt && receipt.status === 1) {
        setTransactionStatus(`✅ Transfer confirmed! Hash: ${transferTx.hash}`);
        setTimeout(() => setTransactionStatus(null), 5000);
        updateWindrwalStatus(recid);
      } else {
        setTransactionStatus("❌ Transfer failed on-chain.");
        setTimeout(() => setTransactionStatus(null), 6000);
      }
    } catch (error: any) {
      if (error?.code === "ACTION_REJECTED" || error?.code === 4001) {
        setTransactionStatus("Transaction rejected by user.");
      } else if (error?.reason) {
        setTransactionStatus(`Contract error: ${error.reason}`);
      } else if (error?.message) {
        setTransactionStatus(`Error: ${error.message.slice(0, 150)}`);
      } else {
        setTransactionStatus("Transaction failed. See console.");
      }

      setTimeout(() => setTransactionStatus(null), 6000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header / Title */}
      <div className="flex items-center justify-between">
        <h1 className="text-lg md:text-xl font-bold text-gray-900">
          Pending Withdrawals
        </h1>
        {/* Breadcrumbs could go here if needed */}
        <span className="text-xs text-gray-500">
          Pages {">"} Pending Withdrawals
        </span>
      </div>

      {/* Filter Section */}
      <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-100 md:p-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4 lg:gap-6 items-end">
          {/* FX Code */}
          <div>
            <label className="mb-2 block text-xs font-semibold text-gray-900 md:text-sm">
              Code
            </label>
            <input
              type="text"
              placeholder="Enter Code"
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
            />
          </div>

          {/* From Date */}
          <div>
            <label className="mb-2 block text-xs font-semibold text-gray-900 md:text-sm">
              From Date
            </label>
            <div className="relative">
              <input
                type="date"
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
              />
            </div>
          </div>

          {/* To Date */}
          <div>
            <label className="mb-2 block text-xs font-semibold text-gray-900 md:text-sm">
              To Date
            </label>
            <div className="relative">
              <input
                type="date"
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button className="flex flex-1 items-center justify-center gap-2 rounded-md bg-[#E49127] px-4 py-2 font-semibold text-white shadow-md transition-all hover:bg-[#CF7D1C]">
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              SEARCH
            </button>
            <button
              className="flex items-center justify-center gap-2 rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
              title="Reset"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

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
        <div>{transactionStatus}</div>
        <div> {yourWalletAddress}</div>
      </div>

      {/* Table Section */}
      <div className="overflow-hidden rounded-xl bg-white shadow-sm border border-gray-100">
        <div className="border-b border-gray-100 bg-gray-50/50 px-4 py-3 md:px-6 md:py-4">
          <h2 className="text-sm font-bold text-gray-900 md:text-base">
            Pending Withdrawals
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-gray-50 text-[10px] uppercase text-gray-500">
              <tr>
                <th className="px-4 py-2 font-semibold whitespace-nowrap md:px-6 md:py-3">
                  user id
                </th>
                <th className="px-4 py-2 font-semibold whitespace-nowrap md:px-6 md:py-3">
                  wallet_address
                </th>

                <th className="px-4 py-2 font-semibold whitespace-nowrap md:px-6 md:py-3 text-right">
                  usdt amount
                </th>
                <th className="px-4 py-2 font-semibold whitespace-nowrap md:px-6 md:py-3">
                  fely amount
                </th>
                <th className="px-4 py-2 font-semibold whitespace-nowrap md:px-6 md:py-3">
                  withdrawal date
                </th>
                <th className="px-4 py-2 font-semibold whitespace-nowrap md:px-6 md:py-3 text-center">
                  status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pendingWithdrawals.map((row, i) => (
                <tr className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap md:px-6 md:py-3">
                    {row.user_id}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-left md:px-6 md:py-3">
                    {row.wallet_address}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-right md:px-6 md:py-3">
                    {row.usdt_amount}
                  </td>
                  <td className="px-4 py-2 font-mono text-gray-500 whitespace-nowrap md:px-6 md:py-3">
                    {row.fely_amount}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-gray-500 md:px-6 md:py-3">
                    {new Date(row.withdrawal_date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-2 text-center whitespace-nowrap md:px-6 md:py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() =>
                          apparove(row.wallet_address, row.fely_amount, row.id)
                        }
                        className="rounded bg-emerald-500 px-3 py-1 text-[10px] font-bold text-white shadow-sm hover:bg-emerald-600 transition-all uppercase tracking-wide"
                      >
                        Approve
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
