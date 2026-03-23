/**
 * useWallet.js
 * ─────────────────────────────────────────────────────────────────
 * React hook that manages MetaMask wallet state.
 * Use this in any component that needs the connected wallet address.
 *
 * Usage:
 *   const { address, connecting, connected, connect, disconnect, error } = useWallet();
 * ─────────────────────────────────────────────────────────────────
 */

import { useState, useEffect, useCallback } from "react";
import {
    connectWallet,
    isMetaMaskInstalled,
    listenForWalletChanges,
    formatAddress,
} from "../utils/web3Provider.js";

export function useWallet() {
    const [address, setAddress] = useState(null);
    const [connecting, setConnecting] = useState(false);
    const [error, setError] = useState(null);

    const connected = Boolean(address);

    /* Try to restore a previously connected wallet on page load */
    useEffect(() => {
        if (!isMetaMaskInstalled()) return;

        window.ethereum
            .request({ method: "eth_accounts" })
            .then(accounts => { if (accounts[0]) setAddress(accounts[0]); })
            .catch(() => {});

        /* Keep in sync if user switches account/network */
        listenForWalletChanges(
            (newAddress) => setAddress(newAddress),
            () => {} // network changes trigger a page reload (handled in web3Provider)
        );
    }, []);

    const connect = useCallback(async() => {
        setConnecting(true);
        setError(null);
        try {
            const { address: addr } = await connectWallet();
            setAddress(addr);
        } catch (err) {
            setError(err.message);
        } finally {
            setConnecting(false);
        }
    }, []);

    const disconnect = useCallback(() => {
        /* MetaMask doesn't have a programmatic disconnect —
           clearing local state is the correct approach */
        setAddress(null);
    }, []);

    return {
        address, // full address e.g. "0x71C7...8976F"
        shortAddress: formatAddress(address), // "0x71C7…976F"
        connecting,
        connected,
        connect,
        disconnect,
        error,
        isMetaMaskInstalled: isMetaMaskInstalled(),
    };
}