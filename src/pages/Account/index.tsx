import React, { useEffect, useMemo, useState } from "react";

import { LoadingRing, useTheme, Button } from "@aragon/ui";
import { useParams } from "react-router-dom";

import { useAsyncMemo } from "../../hooks/useAsyncMemo";
import { getENS, getEthBalance, getMessages } from "../../utils/web3";

import { MessageCard } from "../../components/MessageCard";
import { EtherscanTx } from "../../types";
import { Avatar } from "../../components/Avatar";
import { parser } from "../../adapters";

enum DisplayMode {
  All,
  Sent,
  Received,
}

export function Account(props: any) {
  const [isLoading, setLoading] = useState(true);

  const { address } = useParams();

  const theme = useTheme();

  const [mode, setMode] = useState<DisplayMode>(DisplayMode.All);

  const [rawMessages, setRawMessages] = useState<EtherscanTx[]>([]);

  const isAdaptor = useMemo(() => parser.isAdaptorAddress(address), [address]);

  useEffect(() => {
    async function fetchMessages() {
      setLoading(true);
      let firstBlock = 0;
      if (isAdaptor) {
        const adaptor = parser.getAdapterByAddress(address);
        firstBlock = adaptor?.startBlock || 0;
      }
      return await getMessages(address, true, firstBlock, isAdaptor);
    }
    setLoading(true);
    fetchMessages()
      .then((messages) => {
        setRawMessages(messages);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [isAdaptor, address]);

  const messagesToShow = useMemo(() => {
    return rawMessages.filter((tx) => {
      if (mode === DisplayMode.All) return true;
      if (mode === DisplayMode.Sent)
        return tx.from.toLowerCase() === address.toLowerCase();
      if (mode === DisplayMode.Received)
        return tx.to.toLowerCase() === address.toLowerCase();
      return false;
    });
  }, [rawMessages, mode, address]);

  const ensName = useAsyncMemo(
    async () => {
      return await getENS(address);
    },
    [address],
    undefined
  );

  const ethBalance = useAsyncMemo(
    async () => {
      const exactBalance = await getEthBalance(address);
      if (exactBalance === null) return "0";
      const balanceSplit = exactBalance.split(".");
      if (balanceSplit.length === 1) return exactBalance;
      const integer = exactBalance.split(".")[0];
      const decimals = exactBalance.split(".")[1].slice(0, 4);
      return `${integer}.${decimals}`;
    },
    [address],
    undefined
  );

  const [totalSent, totalReceived] = useMemo(() => {
    const sent = rawMessages.filter(
      (tx) => tx.from.toLowerCase() === address.toLowerCase()
    ).length;
    const received = rawMessages.length - sent;
    return [sent, received];
  }, [address, rawMessages]);

  const messageCards = useMemo(() => {
    return messagesToShow
      .map((tx: EtherscanTx) => (
        <MessageCard tx={tx} key={tx.hash} account={address} showMedia={true} />
      ))
      .filter((card) => card != null)
      .slice(0, 20);
  }, [messagesToShow, address]);

  const isEmpty = useMemo(
    () => messageCards.filter((c) => c !== null).length === 0,
    [messageCards]
  );

  const shortenAddress = useMemo(() => {
    return address.slice(0, 4).concat("...").concat(address.slice(-4));
  }, [address]);

  return (
    <div>
      <div style={{ display: "flex" }}>
        <Avatar account={address} />
        <div>
          {
            <div
              style={{
                paddingLeft: 5,
                paddingTop: 5,
                fontSize: 18,
                marginTop: "auto",
                marginBottom: "auto",
                color: theme.surfaceContentSecondary,
              }}
            >
              {" "}
              {ensName || shortenAddress}{" "}
            </div>
          }
          {
            <div
              style={{
                paddingLeft: 5,
                paddingTop: 5,
                fontSize: 14,
                marginTop: "auto",
                marginBottom: "auto",
                color: theme.surfaceContentSecondary,
              }}
            >
              {" "}
              Balance: {ethBalance} ETH{" "}
            </div>
          }
          {
            <div
              style={{
                paddingLeft: 5,
                paddingTop: 5,
                fontSize: 14,
                marginTop: "auto",
                marginBottom: "auto",
                color: theme.surfaceContentSecondary,
              }}
            >
              {isLoading
                ? "Loading"
                : `Total sent: ${totalSent}, total received: ${totalReceived}`}
            </div>
          }
        </div>

        {/* This div is for putting the bottom group at the bottom-right */}
        <div style={{ flexGrow: 100, display: "flex", position: "relative" }}>
          <div style={{ position: "absolute", bottom: 0, right: 0 }}>
            <Button
              size="mini"
              mode={mode === DisplayMode.All ? "positive" : "normal"}
              onClick={() => setMode(DisplayMode.All)}
            >
              {" "}
              All{" "}
            </Button>
            <Button
              size="mini"
              mode={mode === DisplayMode.Sent ? "positive" : "normal"}
              onClick={() => setMode(DisplayMode.Sent)}
            >
              {" "}
              Sent{" "}
            </Button>
            <Button
              size="mini"
              mode={mode === DisplayMode.Received ? "positive" : "normal"}
              onClick={() => setMode(DisplayMode.Received)}
            >
              {" "}
              Received{" "}
            </Button>
          </div>
        </div>
      </div>
      <div>
        <br />
        {isEmpty &&
          !isLoading &&
          mode === DisplayMode.All &&
          `No on-chain message found for this account.`}
        {isEmpty &&
          !isLoading &&
          mode === DisplayMode.Received &&
          `No on-chain message received for this account.`}
        {isEmpty &&
          !isLoading &&
          mode === DisplayMode.Sent &&
          `No on-chain message sent from this account.`}
        {isLoading ? <LoadingRing /> : messageCards}
      </div>
    </div>
  );
}
