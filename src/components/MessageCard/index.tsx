import React from "react";
import { EtherscanTx } from "../../types";
import { Box, IdentityBadge, IconExternal, LinkBase } from "@aragon/ui";
import { timeSince } from "../../utils/time";
import { Body2 } from "../aragon";

export function MessageCard({ tx }: { tx: EtherscanTx }) {
  return (
    <Box>
      <div style={{ paddingBottom: "1%", position: "relative" }}>
        <IdentityBadge entity={tx.from} /> - {timeSince(parseInt(tx.timeStamp))}
        {/* external link */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
          }}
        >
          <LinkBase
            onClick={() =>
              (window as any)
                .open(`https://etherscan.io/tx/${tx.hash}`, "_blank")
                .focus()
            }
          >
            <IconExternal />
          </LinkBase>
        </div>
      </div>
      <Body2>
        {input_to_ascii(tx.input)}
        <br />
        {}
      </Body2>
    </Box>
  );
}

function input_to_ascii(str1: string) {
  const hex = str1.slice(2);
  return decodeURIComponent(
    hex.replace(/\s+/g, "").replace(/[0-9a-f]{2}/g, "%$&")
  );
}
