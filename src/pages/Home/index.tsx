import React from "react";
import { useTheme } from "@aragon/ui";
import { Title1, Title3 } from "../../components/aragon";
import { SearchInput } from "../../components/SearchInput";
import { getLikedTxs } from "../../utils/storage";
import { MessageCard } from "../../components/MessageCard";
import { AccountCard } from "../../components/AccountCard";
import { EtherscanTx } from "../../types";

// todo: move into the function and make it dynamic
import { featuring } from "../../utils/constant";

export function Home(props: any) {
  const theme = useTheme();

  const txs = getLikedTxs();

  const liked = txs.map((tx: EtherscanTx) => (
    <MessageCard tx={tx} key={tx.hash} showMedia={false} />
  ));

  return (
    <div
      style={{
        display: "flex",
        paddingTop: "1%",
        alignItems: "center",
        justifyContent: "center",
        color: `${theme.surfaceContentSecondary}`,
      }}
    >
      <div
        style={{
          minWidth: 600,
          padding: 20,
        }}
      >
        {/* eslint-disable-next-line jsx-a11y/accessible-emoji */}
        <Title1> Welcome to Pizzino 🎫 </Title1>
        <br></br>
        See what people are talking about on-chain.
        <br />
        <SearchInput />
        <br />
        <br />
        {
          <div>
            <Title3> Featuring </Title3>
            {featuring.map((info) => {
              return <AccountCard account={info.account} tag={info.tag} />;
            })}
          </div>
        }
        <br />
        <br />
        {liked.length > 0 && (
          <div>
            <Title3> Liked </Title3>
            {liked}
          </div>
        )}
        {/* have nothing to show on home page */}
        {liked.length === 0 && (
          <img
            alt="cute"
            src={require("../../imgs/home.jpg")}
            style={{ width: 600, opacity: 0.75, borderRadius: 4 }}
          />
        )}
      </div>
    </div>
  );
}
