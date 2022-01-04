import React from "react";
import { Header, IdentityBadge } from "@aragon/ui";
import { useParams } from "react-router-dom";

import { Title3 } from "../../components/aragon";
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

  return (
    <div>
      <Header
        primary={<Title3>Account {<IdentityBadge entity={address} />}</Title3>}
      ></Header>

      {messageCards}
    </div>
  );
}
