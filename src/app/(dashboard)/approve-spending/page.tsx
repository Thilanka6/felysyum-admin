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

import { FELY_CONTRACT_ADDRESS, FELY_ABI } from "@/app/contracts/felyContract";

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
      console.log("sss");
      console.log(token);
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

      const data = MyStakingData.data.stakings;

      setStakeData(
        data.map((item: any) => ({
          id: item.id,
          user_id: item.user.id,
          wallet_address: item.wallet_address,
          usdt_amount: item.usdt_amount, // ✅ flat field
          fely_amount: item.fely_amount, // ✅ flat field
          fely_bonus_amount: item.fely_bonus_amount, // ✅ flat field
          month: item.month, // ✅ flat field
          transaction_hash: item.transaction_hash,
          status: item.status_display, // ✅ use `status_display` for "Pending"
        })),
      );

      // setStakeData(
      //   data.map((item: any) => ({
      //     id: item.id,
      //     user_id: item.user.id,
      //     wallet_address: item.wallet_address,
      //     usdt_amount: item.amounts.usdt_amount,
      //     fely_amount: item.amounts.fely_amount,
      //     fely_bonus_amount: item.amounts.fely_bonus_amount, // fixed: was item.amount.fely_bonus_amount
      //     month: item.staking_info.month,
      //     transaction_hash: item.transaction_hash,
      //     status: item.status.display,
      //   })),
      // );
    } catch (error) {
      console.error("Error fetching stakings:", error);
      setTransactionStatus("Failed to fetch staking data");
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
      setTransactionStatus("Preparing transaction...");

      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();
      const feeData = await provider.getFeeData();

      // ── Gas price with 20% bump to avoid replacement underpriced ────────────
      const baseGasPrice = feeData.gasPrice ?? ethers.parseUnits("150", "gwei");
      const gasPrice = (baseGasPrice * BigInt(120)) / BigInt(100); // +20%
      console.log(
        "gasPrice (with 20% bump):",
        ethers.formatUnits(gasPrice, "gwei"),
        "gwei",
      );

      // ── Get current nonce (includes pending txs) ─────────────────────────────
      const nonce = await provider.getTransactionCount(
        await signer.getAddress(),
        "pending",
      );
      console.log("Nonce:", nonce);

      // ── Convert decimal strings → uint256 (18 decimals) ─────────────────────
      const capitalBig: bigint = ethers.parseUnits(capital.trim(), 18);
      const interBig: bigint = ethers.parseUnits(inter.trim(), 18);
      const totalNeeded: bigint = capitalBig + interBig;

      console.log("capital  :", capitalBig.toString());
      console.log("inter    :", interBig.toString());
      console.log("total    :", totalNeeded.toString());

      // ── STEP 1: Get staking contract + address ───────────────────────────────
      const stakingContract = await returnContract(month);
      const stakingAddress = await stakingContract.getAddress();

      // ── STEP 2: FELY token contract ──────────────────────────────────────────
      const felyContract = new ethers.Contract(
        FELY_CONTRACT_ADDRESS,
        FELY_ABI,
        signer,
      );

      // ── STEP 3: Check admin wallet FELY balance ──────────────────────────────
      setTransactionStatus("Checking FELY balance...");
      const walletBalance: bigint = await felyContract.balanceOf(
        await signer.getAddress(),
      );
      console.log(
        "Wallet FELY balance:",
        ethers.formatUnits(walletBalance, 18),
      );

      if (walletBalance < totalNeeded) {
        setTransactionStatus(
          `❌ Insufficient FELY in wallet. Have: ${ethers.formatUnits(walletBalance, 18)}, Need: ${ethers.formatUnits(totalNeeded, 18)}`,
        );
        return;
      }

      // ── STEP 4: Approve FELY spending (capital + inter) ──────────────────────
      setTransactionStatus("Approving FELY spending... (1/2)");
      console.log(
        "Approving:",
        stakingAddress,
        "amount:",
        totalNeeded.toString(),
      );

      const approveTx = await felyContract.approve(
        stakingAddress,
        totalNeeded,
        {
          gasPrice,
          nonce, // explicit nonce — avoids replacement conflicts
        },
      );

      setTransactionStatus(
        `Approve tx sent: ${approveTx.hash} — confirming...`,
      );
      console.log("Approve TX hash:", approveTx.hash);

      const approveReceipt = await approveTx.wait(1);
      if (!approveReceipt || approveReceipt.status !== 1) {
        setTransactionStatus("❌ FELY approval failed on-chain.");
        return;
      }

      console.log("✅ FELY approved successfully");
      setTransactionStatus("FELY approved! Sending stake transaction... (2/2)");

      // ── STEP 5: Get fresh nonce for next tx ──────────────────────────────────
      const nonceForStake = await provider.getTransactionCount(
        await signer.getAddress(),
        "pending",
      );
      console.log("Nonce for stake tx:", nonceForStake);

      // ── STEP 6: Estimate gas for assignStake ─────────────────────────────────
      let gasLimit: bigint;
      try {
        const estimated = await stakingContract.assignStake.estimateGas(
          account,
          capitalBig,
          interBig,
        );
        gasLimit = (estimated * BigInt(120)) / BigInt(100); // +20% buffer
        console.log(
          "Estimated gas:",
          estimated.toString(),
          "→ with buffer:",
          gasLimit.toString(),
        );
      } catch (estimateErr: any) {
        console.warn("Gas estimation failed:", estimateErr);
        setTransactionStatus(
          `Contract reverted during estimation: ${estimateErr?.reason ?? estimateErr?.message ?? "unknown"}`,
        );
        setTimeout(() => setTransactionStatus(null), 6000);
        return;
      }

      // ── STEP 7: Call assignStake ─────────────────────────────────────────────
      setTransactionStatus("Waiting for wallet confirmation... (2/2)");
      const stakeTx = await stakingContract.assignStake(
        account,
        capitalBig,
        interBig,
        {
          gasLimit,
          gasPrice,
          nonce: nonceForStake, // explicit nonce for stake tx
        },
      );

      setTransactionStatus(`Stake tx sent: ${stakeTx.hash} — confirming...`);
      console.log("Stake TX hash:", stakeTx.hash);

      // ── STEP 8: Wait for confirmation ────────────────────────────────────────
      const stakeReceipt = await stakeTx.wait(1);

      if (stakeReceipt && stakeReceipt.status === 1) {
        setTransactionStatus(`✅ Stake confirmed! Hash: ${stakeTx.hash}`);
        console.log("Stake receipt:", stakeReceipt);
        await updateStakingStatus(stid, "active", stakeTx.hash);
        setTimeout(() => setTransactionStatus(null), 5000);
      } else {
        setTransactionStatus(
          "❌ Stake transaction failed on-chain. Check Polygonscan.",
        );
        console.error("Failed stake receipt:", stakeReceipt);
        setTimeout(() => setTransactionStatus(null), 6000);
      }
    } catch (error: any) {
      console.error("Approve error:", error);

      if (error?.code === "ACTION_REJECTED" || error?.code === 4001) {
        setTransactionStatus("Transaction rejected by user.");
      } else if (error?.code === "REPLACEMENT_UNDERPRICED") {
        setTransactionStatus(
          "❌ Replacement fee too low. Please wait for pending tx to clear or try again.",
        );
      } else if (error?.reason) {
        setTransactionStatus(`Contract error: ${error.reason}`);
      } else if (error?.data) {
        console.error("Revert data:", error.data);
        setTransactionStatus("Contract reverted. See console for revert data.");
      } else if (error?.message) {
        setTransactionStatus(`Error: ${error.message.slice(0, 150)}`);
      } else {
        setTransactionStatus("Transaction failed. See console.");
      }

      setTimeout(() => setTransactionStatus(null), 6000);
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

  const updateStakingStatus = async (
    id: number | string,
    st: string,
    tans_hash: string,
  ) => {
    try {
      const obj = {
        status: st,
        stake_transaction_hash: tans_hash,
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
    <div className="w-full space-y-4">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold text-gray-800">Pending Approvals</h1>
          <p className="text-[11px] text-gray-400 mt-0.5">Approve Stake FELY requests via MetaMask</p>
        </div>
        <nav className="flex items-center gap-1 text-[11px] text-gray-400">
          <span>Pages</span>
          <span className="text-gray-300">/</span>
          <span>Stake FELY</span>
          <span className="text-gray-300">/</span>
          <span className="text-blue-600 font-semibold">Pending Approvals</span>
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
            {stakeData.length} pending
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
                <th className="px-4 py-3 text-left font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">Txn Hash</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">Plan</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">USDT</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">FELY</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">Bonus</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {stakeData.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="text-xs font-medium">No pending approvals found</span>
                    </div>
                  </td>
                </tr>
              ) : (
                stakeData.map((row, i) => {
                  const walletShort = row.wallet_address
                    ? `${row.wallet_address.substring(0, 8)}...${row.wallet_address.substring(row.wallet_address.length - 6)}`
                    : "N/A";
                  const txShort = row.transaction_hash
                    ? `${row.transaction_hash.substring(0, 10)}...${row.transaction_hash.substring(row.transaction_hash.length - 8)}`
                    : "N/A";
                  const planLabel = row.month === 5 ? "5 Days" : `${row.month} Mo`;
                  return (
                    <tr key={i} className="hover:bg-blue-50/30 transition-colors duration-100 group">
                      <td className="px-4 py-2.5 whitespace-nowrap font-medium text-gray-800">#{row.user_id}</td>
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <span className="font-mono text-gray-600">{walletShort}</span>
                      </td>
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <span className="font-mono text-gray-600">{txShort}</span>
                      </td>
                      <td className="px-4 py-2.5 text-center whitespace-nowrap">
                        <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 border border-blue-200">
                          {planLabel}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-center whitespace-nowrap">
                        <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-bold text-green-700 border border-green-200">
                          {row.usdt_amount}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-center whitespace-nowrap">
                        <span className="inline-flex items-center rounded-full bg-violet-50 px-2 py-0.5 text-[10px] font-bold text-violet-700 border border-violet-200">
                          {row.fely_amount}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-center whitespace-nowrap">
                        <span className="inline-flex items-center rounded-full bg-orange-50 px-2 py-0.5 text-[10px] font-bold text-orange-700 border border-orange-200">
                          {row.fely_bonus_amount}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => approve(row.month, row.wallet_address, row.fely_amount, row.fely_bonus_amount, row.id)}
                            className="rounded-md bg-emerald-600 px-3 py-1.5 text-[10px] font-bold text-white hover:bg-emerald-700 transition-colors shadow-sm uppercase tracking-wide"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => updateStakingStatus(row.id, "cancelled", "0x0000000000000000000000000000000000000000000000000000000000000000")}
                            className="rounded-md bg-red-500 px-3 py-1.5 text-[10px] font-bold text-white hover:bg-red-600 transition-colors shadow-sm uppercase tracking-wide"
                          >
                            Reject
                          </button>
                        </div>
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
