import React, { useMemo, useState } from "react";

import { LoadingRing, useTheme } from "@aragon/ui";
import { useParams } from "react-router-dom";

import { useAsyncMemo } from "../../hooks/useAsyncMemo";
import { getENS, getEthBalance, getMessages } from "../../utils/web3";

import { MessageCard } from "../../components/MessageCard";
import { EtherscanTx } from "../../types";
import { Avatar } from "../../components/Avatar";

export function Account(props: any) {
  const [isLoading, setLoading] = useState(true);

  const { address } = useParams();

  const theme = useTheme();

  const rawMessages = useAsyncMemo(
    async () => {
      if (!address) return [];
      setLoading(true);
      const messages = await getMessages(address, true);
      setLoading(false);
      return messages;
    },
    [address],
    []
  );

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

  const messageCards = rawMessages.map((tx: EtherscanTx) => (
    <MessageCard tx={tx} key={tx.hash} account={address} />
  ));

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
        <Avatar account={address} ensName={ensName} />
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
      </div>
      <div>
        <br />
        {isEmpty && !isLoading && `No on-chain message found for this account.`}
        {isLoading ? <LoadingRing /> : messageCards}
      </div>
    </div>
  );
}
