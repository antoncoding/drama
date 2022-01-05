import React, { useMemo } from "react";

import { EthIdenticon } from "@aragon/ui";
import { useParams } from "react-router-dom";

import { useAsyncMemo } from "../../hooks/useAsyncMemo";
import { getMessages } from "../../utils/web3";

import { MessageCard } from "../../components/MessageCard";
import { EtherscanTx } from "../../types";

export function Account(props: any) {
  const { address } = useParams();

  const rawMessages = useAsyncMemo(
    async () => {
      if (!address) return [];
      return getMessages(address);
    },
    [address],
    []
  );

  const messageCards = rawMessages.map((tx: EtherscanTx) => (
    <MessageCard tx={tx} key={tx.hash} />
  ));

  const isEmpty = useMemo(
    () => messageCards.filter((c) => c !== null).length === 0,
    [messageCards]
  );

  return (
    <div>
      <EthIdenticon address={address} scale={2} radius={2} soften={0.2} />
      {/* <Title3>Account {<IdentityBadge entity={address} />}</Title3> */}
      <br />
      <br />
      {isEmpty && `No on-chain message found for this account.`}
      {messageCards}
    </div>
  );
}
