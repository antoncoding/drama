import React from "react";
import { EtherscanTx } from "../../types";
import { Box, IdentityBadge, IconExternal, LinkBase } from "@aragon/ui";
import { timeSince } from "../../utils/time";
import { Body2 } from "../aragon";

export function MessageCard({ tx }: { tx: EtherscanTx }) {
  const msg = input_to_ascii(tx.input);
  return msg.length === 0 ? null : (
    <Box>
      <div style={{ paddingBottom: "1%", position: "relative" }}>
        <IdentityBadge entity={tx.from} /> - {timeSince(parseInt(tx.timeStamp))}
        {/* external link, fix at top right corner */}
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
      <Body2
        style={{
          whiteSpace: "pre-line",
        }}
      >
        {input_to_ascii(tx.input).replace(" ", "\n")}
      </Body2>
    </Box>
  );
}

function input_to_ascii(str1: string) {
  if (str1 === "0x00") return "";
  try {
    const hex = str1.slice(2);
    return decodeURIComponent(
      hex.replace(/\s+/g, "").replace(/[0-9a-f]{2}/g, "%$&")
    );
  } catch {
    return "";
  }
}
