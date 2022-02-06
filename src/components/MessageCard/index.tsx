import React, { useMemo } from "react";
import { EtherscanTx } from "../../types";
import { Box, TransactionBadge, ButtonBase, useTheme } from "@aragon/ui";
import { timeSince } from "../../utils/time";
import { input_to_ascii } from "../../utils/web3";
import { Body2 } from "../aragon";
import { Avatar } from "../Avatar";

export function MessageCard({
  tx,
  account,
}: {
  tx: EtherscanTx;
  account: string;
}) {
  const msg = input_to_ascii(tx.input);

  const isIncoming = useMemo(
    () => tx.to.toLowerCase() === account.toLowerCase(),
    [account, tx]
  );
  const theme = useTheme();

  return msg.length === 0 ? null : (
    <Box>
      <div style={{ paddingBottom: "1%", position: "relative" }}>
        <div style={{ display: "flex" }}>
          <div
            style={{
              marginTop: "auto",
              marginBottom: "auto",
              paddingRight: 5,
              color: theme.surfaceContentSecondary,
            }}
          >
            {" "}
            [ {isIncoming ? "In" : "Out"} ]{" "}
          </div>
          <div style={{ marginTop: "auto", marginBottom: "auto" }}> From </div>
          <Avatar account={tx.from} scale={1} size={30} />
          <div style={{ marginTop: "auto", marginBottom: "auto" }}> to </div>
          <Avatar account={tx.to} scale={1} size={30} />
          <div style={{ marginTop: "auto", marginBottom: "auto" }}>
            {" "}
            - {timeSince(parseInt(tx.timeStamp))}{" "}
          </div>
        </div>

        {/* external link, fix at top right corner */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
          }}
        >
          <ButtonBase
            onClick={() =>
              (window as any)
                .open(`https://etherscan.io/tx/${tx.hash}`, "_blank")
                .focus()
            }
          >
            <TransactionBadge transaction={tx.hash} />
          </ButtonBase>
        </div>
      </div>
      <Body2
        style={{
          whiteSpace: "pre-line",
        }}
      >
        {msg}
      </Body2>
    </Box>
  );
}
