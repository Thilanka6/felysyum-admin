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
  const [transactionStatus, setTransactionStatus] = useState<string | null>(null);
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

  const [pendingWithdrawals, setPendingWithdrawals] = useState<PendingWithdrawal[]>([]);

  const copyToClipboard = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    checkMobile();
    checkIfWalletIsConnected();
  }, []);

  useEffect(() => {
    if ((window as any).ethereum) {
      (window as any).ethereum.on("chainChanged", (chainId: string) => {
        window.location.reload();
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
      if (!(window as any).ethereum) return;
      await checkAndSwitchNetwork();
      const accounts = await (window as any).ethereum.request({ method: "eth_accounts" });
      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
        setIsConnected(true);
        setTransactionStatus("connected");
      } else {
        setIsConnected(false);
      }
    } catch (error) {
      console.error("Error checking wallet connection:", error);
    }
  };

  const checkAndSwitchNetwork = async () => {
    try {
      const chainId = await (window as any).ethereum.request({ method: "eth_chainId" });
      if (chainId !== POLYGON_CHAIN_ID) {
        setTransactionStatus("Switching to Polygon network...");
        try {
          await (window as any).ethereum.request({ method: "wallet_switchEthereumChain", params: [{ chainId: POLYGON_CHAIN_ID }] });
          setTransactionStatus("Network switched successfully");
          setTimeout(() => setTransactionStatus(null), 3000);
        } catch (switchError: any) {
          if (switchError.code === 4902) {
            await (window as any).ethereum.request({
              method: "wallet_addEthereumChain",
              params: [{ chainId: POLYGON_CHAIN_ID, chainName: "Polygon Mainnet", nativeCurrency: { name: "POL", symbol: "POL", decimals: 18 }, rpcUrls: ["https://polygon-rpc.com/"], blockExplorerUrls: ["https://polygonscan.com/"] }],
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

  const updateWindrwalStatus = async (id: number | string, transaction_hash: string) => {
    try {
      const obj = { action: "approve", transaction_hash, reason: "Withdrawal approved - user verification completed successfully" };
      const rtn = await serverPatchWithBareGet(obj, `/admin/withdrawals/${id}/process`, token!);
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
      window.open(`https://metamask.app.link/dapp/${dappUrl}`, "_blank");
      return;
    }
    try {
      if ((window as any).ethereum) {
        setTransactionStatus("Connecting Wallet...");
        const accounts = await (window as any).ethereum.request({ method: "eth_requestAccounts" });
        await checkAndSwitchNetwork();
        setWalletAddress(accounts[0]);
        setIsConnected(true);
        setTransactionStatus("Wallet connected!");
        setTimeout(() => setTransactionStatus(null), 3000);
      } else {
        setTransactionStatus("No wallet found. Please install MetaMask.");
      }
    } catch (error) {
      setTransactionStatus("Failed to connect wallet");
      setTimeout(() => setTransactionStatus(null), 3000);
    }
  };

  useEffect(() => {
    if (token) getAllWithdrawals(token);
  }, [token]);

  const getAllWithdrawals = async (Bearer: any) => {
    try {
      const response = await serverGetWithBareGet("", "/admin/withdrawals?status=pending&sort_by=created_at&sort_order=desc", Bearer);
      const data = response.data.withdrawals;
      setPendingWithdrawals(data.map((item: any) => ({
        id: item.id,
        user_id: item.user.id,
        wallet_address: item.user.wallet_address,
        usdt_amount: item.amounts.usdt_amount,
        fely_amount: item.amounts.fely_amount,
        withdrawal_date: item.dates.withdrawal_date,
        status: item.status.text,
      })));
    } catch (error) {
      console.error("Error fetching withdrawals:", error);
    }
  };

  const apparove = async (account: string, amount: string, recid: number) => {
    if (!isConnected) { setTransactionStatus("Not Connected to Perform This action"); return; }
    if (!ethers.isAddress(account)) { setTransactionStatus(`Invalid account address: ${account}`); return; }
    try {
      setTransactionStatus("Preparing transaction...");
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();
      const feeData = await provider.getFeeData();
      const baseGasPrice = feeData.gasPrice ?? ethers.parseUnits("150", "gwei");
      const gasPrice = (baseGasPrice * BigInt(120)) / BigInt(100);
      const amountBig: bigint = ethers.parseUnits(amount.trim(), 18);
      const felyContract = new ethers.Contract(FELY_CONTRACT_ADDRESS, FELY_ABI, signer);
      setTransactionStatus("Waiting for wallet confirmation...");
      const transferTx = await felyContract.transfer(account, amountBig, { gasPrice });
      setTransactionStatus(`Transfer tx sent: ${transferTx.hash} — confirming...`);
      const receipt = await transferTx.wait(1);
      if (receipt && receipt.status === 1) {
        setTransactionStatus(`✅ Transfer confirmed! Hash: ${transferTx.hash}`);
        setTimeout(() => setTransactionStatus(null), 5000);
        updateWindrwalStatus(recid, transferTx.hash);
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
    <div className="w-full space-y-4">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold text-gray-800">Pending Withdrawals</h1>
          <p className="text-[11px] text-gray-400 mt-0.5">Approve pending withdrawal requests via MetaMask</p>
        </div>
        <nav className="flex items-center gap-1 text-[11px] text-gray-400">
          <span>Pages</span>
          <span className="text-gray-300">/</span>
          <span className="text-blue-600 font-semibold">Pending Withdrawals</span>
        </nav>
      </div>

      {/* ── Wallet Connect Bar ── */}
      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm">
        <button
          onClick={connectWallet}
          className={`inline-flex items-center gap-2 rounded-md px-4 py-1.5 text-xs font-semibold text-white transition-colors shadow-sm ${isConnected ? "bg-emerald-600 hover:bg-emerald-700" : "bg-blue-600 hover:bg-blue-700"}`}
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          {isConnected ? "Wallet Connected" : "Connect Wallet"}
        </button>
        {yourWalletAddress && (
          <span className="font-mono text-[10px] text-gray-500 bg-gray-50 border border-gray-200 rounded px-2 py-1">
            {yourWalletAddress.substring(0, 10)}...{yourWalletAddress.substring(yourWalletAddress.length - 8)}
          </span>
        )}
        {transactionStatus && transactionStatus !== "connected" && (
          <span className={`text-[11px] font-medium px-2 py-1 rounded ${transactionStatus.includes("✅") ? "bg-emerald-50 text-emerald-700" : transactionStatus.includes("❌") ? "bg-red-50 text-red-700" : "bg-blue-50 text-blue-700"}`}>
            {transactionStatus}
          </span>
        )}
        <div className="ml-auto">
          <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] text-amber-700 font-semibold border border-amber-200">
            {pendingWithdrawals.length} pending
          </span>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[11px] text-gray-600">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">User ID</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">Wallet Address</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">USDT Amount</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">FELY Amount</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">Withdrawal Date</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pendingWithdrawals.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="text-xs font-medium">No pending withdrawals found</span>
                    </div>
                  </td>
                </tr>
              ) : (
                pendingWithdrawals.map((row, i) => {
                  const walletShort = row.wallet_address
                    ? `${row.wallet_address.substring(0, 8)}...${row.wallet_address.substring(row.wallet_address.length - 6)}`
                    : "N/A";
                  return (
                    <tr key={i} className="hover:bg-blue-50/30 transition-colors duration-100 group">
                      {/* User ID */}
                      <td className="px-4 py-2.5 whitespace-nowrap font-medium text-gray-800">
                        #{row.user_id}
                      </td>
                      {/* Wallet */}
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-gray-600">{walletShort}</span>
                          <button
                            onClick={() => copyToClipboard(row.wallet_address)}
                            className="rounded px-1.5 py-0.5 text-[9px] font-semibold border border-gray-200 bg-white text-gray-500 hover:text-blue-600 hover:border-blue-300 transition-colors"
                          >
                            {copiedHash === row.wallet_address ? "✓" : "Copy"}
                          </button>
                        </div>
                      </td>
                      {/* USDT */}
                      <td className="px-4 py-2.5 text-center whitespace-nowrap">
                        <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-0.5 text-[11px] font-bold text-green-700 border border-green-200">
                          {row.usdt_amount} USDT
                        </span>
                      </td>
                      {/* FELY */}
                      <td className="px-4 py-2.5 text-center whitespace-nowrap">
                        <span className="inline-flex items-center rounded-full bg-violet-50 px-2 py-0.5 text-[11px] font-bold text-violet-700 border border-violet-200">
                          {row.fely_amount} FELY
                        </span>
                      </td>
                      {/* Date */}
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <div className="font-medium text-gray-800">{new Date(row.withdrawal_date).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })}</div>
                        <div className="text-[10px] text-gray-400">{new Date(row.withdrawal_date).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })}</div>
                      </td>
                      {/* Action */}
                      <td className="px-4 py-2.5 text-center whitespace-nowrap">
                        <button
                          onClick={() => apparove(row.wallet_address, row.fely_amount, row.id)}
                          className="rounded-md bg-emerald-600 px-3 py-1.5 text-[10px] font-bold text-white hover:bg-emerald-700 transition-colors shadow-sm uppercase tracking-wide"
                        >
                          Approve
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
