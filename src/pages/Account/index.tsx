import React, { useMemo, useState } from "react";

import { EthIdenticon, LoadingRing, Tag } from "@aragon/ui";
import { useParams } from "react-router-dom";

import { useAsyncMemo } from "../../hooks/useAsyncMemo";
import { getENS, getMessages } from "../../utils/web3";

import { MessageCard } from "../../components/MessageCard";
import { EtherscanTx } from "../../types";

export function Account(props: any) {
  const [isLoading, setLoading] = useState(true);

  const { address } = useParams();

  const rawMessages = useAsyncMemo(
    async () => {
      if (!address) return [];
      setLoading(true);
      const messages = await getMessages(address);
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

  const messageCards = rawMessages.map((tx: EtherscanTx) => (
    <MessageCard tx={tx} key={tx.hash} account={address} />
  ));

  const isEmpty = useMemo(
    () => messageCards.filter((c) => c !== null).length === 0,
    [messageCards]
  );

  return (
    <div>
      <EthIdenticon address={address} scale={2} radius={2} soften={0.2} />
      {ensName && <Tag> {ensName} </Tag>}
      {/* <Title3>Account {<IdentityBadge entity={address} />}</Title3> */}
      <br />
      <br />
      {isEmpty && !isLoading && `No on-chain message found for this account.`}
      {isLoading ? <LoadingRing /> : messageCards}
    </div>
  );
}
