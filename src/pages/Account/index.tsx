import React, { useEffect, useMemo, useState } from "react";

import { LoadingRing, useTheme, Button, Tag } from "@aragon/ui";
import { useParams } from "react-router-dom";

import { useAsyncMemo } from "../../hooks/useAsyncMemo";
import { getENS, getEthBalance, getMessages } from "../../utils/web3";

import { MessageCard } from "../../components/MessageCard";
import { EtherscanTxWithParsedMessage } from "../../types";
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

  const [rawMessages, setRawMessages] = useState<
    EtherscanTxWithParsedMessage[]
  >([]);

  const [page, setPage] = useState(0);

  const perPage = 20;

  const adapter = useMemo(() => parser.getAdapterByAddress(address), [address]);

  // reset page when account is changed
  useEffect(() => {
    setPage(0);
  }, [address]);

  useEffect(() => {
    async function fetchMessages() {
      setLoading(true);
      let firstBlock = 0;
      if (adapter) {
        firstBlock = adapter?.startBlock || 0;
      }
      return await getMessages(
        address,
        true,
        firstBlock,
        adapter !== undefined
      );
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
  }, [adapter, address]);

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
      .map((tx: EtherscanTxWithParsedMessage) => (
        <MessageCard tx={tx} key={tx.hash} account={address} showMedia={true} />
      ))
      .slice(page * perPage, (page + 1) * perPage);
  }, [messagesToShow, address, page]);

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
              {ensName || shortenAddress} {adapter && `(${adapter.name})`}
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

        <div style={{ flexGrow: 100, display: "flex", position: "relative" }}>
          {/* This div is for putting the bottom group at the top-right */}
          <div style={{ position: "absolute", top: 0, right: 0 }}>
            {adapter && <Tag> Contract </Tag>}
          </div>

          {/* This div is for putting the bottom group at the bottom-right */}
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
        {isLoading ? (
          <LoadingRing />
        ) : (
          <div>
            {messageCards}

            {!isEmpty && (
              <div
                style={{
                  paddingTop: 20,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {page > 0 && (
                  <Button size="small" onClick={() => setPage((p) => p - 1)}>
                    Prev
                  </Button>
                )}
                {page + 1 * perPage < messagesToShow.length && (
                  <Button size="small" onClick={() => setPage((p) => p + 1)}>
                    Next
                  </Button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
