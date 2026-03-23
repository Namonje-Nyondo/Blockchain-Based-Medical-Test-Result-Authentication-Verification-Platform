/**
 * web3Provider.js
 * ─────────────────────────────────────────────────────────────────
 * Handles MetaMask wallet connection and network switching.
 * Uses DYNAMIC import for ethers so the app renders even if
 * ethers is not installed yet (no blank white screen).
 * ─────────────────────────────────────────────────────────────────
 */

import { NETWORK_CONFIG } from "./contractABI.js";

/* ── Find MetaMask specifically (ignores Coinbase etc.) ─────── */
function getMetaMaskProvider() {
  if (typeof window === "undefined") return null;

  /* Multiple wallets → providers array */
  if (window.ethereum?.providers?.length) {
    const mm = window.ethereum.providers.find(
      p => p.isMetaMask && !p.isCoinbaseWallet
    );
    if (mm) return mm;
  }

  /* Only MetaMask installed */
  if (window.ethereum?.isMetaMask && !window.ethereum?.isCoinbaseWallet) {
    return window.ethereum;
  }

  return null;
}

export function isMetaMaskInstalled() {
  return Boolean(getMetaMaskProvider());
}

/**
 * connectWallet()
 * Dynamically imports ethers so a missing package never crashes the app.
 */
export async function connectWallet() {
  const mmProvider = getMetaMaskProvider();
  if (!mmProvider) {
    throw new Error(
      "MetaMask is not installed. Please install it from metamask.io and refresh the page."
    );
  }

  /* Dynamic import — safe even if ethers isn't installed yet */
  let BrowserProvider;
  try {
    ({ BrowserProvider } = await import("ethers"));
  } catch {
    throw new Error(
      "ethers.js is not installed. Run 'npm install' in your project folder, then refresh."
    );
  }

  try {
    await mmProvider.request({ method: "eth_requestAccounts" });
  } catch (err) {
    if (err.code === 4001) throw new Error("Wallet connection cancelled.");
    throw new Error(`Connection failed: ${err.message}`);
  }

  await ensureCorrectNetwork(mmProvider);

  const provider = new BrowserProvider(mmProvider);
  const signer   = await provider.getSigner();
  const address  = await signer.getAddress();

  return { provider, signer, address };
}

export async function ensureCorrectNetwork(mmProvider) {
  const p = mmProvider || getMetaMaskProvider();
  if (!p) return;

  const currentChainId = await p.request({ method: "eth_chainId" });
  if (currentChainId === NETWORK_CONFIG.chainId) return;

  try {
    await p.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: NETWORK_CONFIG.chainId }],
    });
  } catch (switchError) {
    if (switchError.code === 4902) {
      await p.request({
        method: "wallet_addEthereumChain",
        params: [NETWORK_CONFIG],
      });
    } else {
      throw new Error(`Network switch failed: ${switchError.message}`);
    }
  }
}

export async function getReadProvider() {
  const mm = getMetaMaskProvider();
  if (!mm) throw new Error("MetaMask not found.");

  let BrowserProvider;
  try {
    ({ BrowserProvider } = await import("ethers"));
  } catch {
    throw new Error("ethers.js not installed. Run 'npm install'.");
  }

  return new BrowserProvider(mm);
}

export function formatAddress(address) {
  if (!address) return "";
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

export function listenForWalletChanges(onAccountChange, onNetworkChange) {
  const mm = getMetaMaskProvider();
  if (!mm) return;

  mm.on("accountsChanged", (accounts) => {
    onAccountChange(accounts[0] || null);
  });

  mm.on("chainChanged", (chainId) => {
    onNetworkChange(chainId);
    window.location.reload();
  });
}
