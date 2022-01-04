import React from "react";
import { EtherscanTx } from "../../types";
import { Box } from "@aragon/ui";
import { Body3 } from "../aragon";

export function MessageCard({ tx }: { tx: EtherscanTx }) {
  return (
    <Box>
      <Body3>
        {input_to_ascii(tx.input)}
        <br />
        {}
        <br />
        {tx.hash}
      </Body3>
    </Box>
  );
}

function input_to_ascii(str1: string) {
  const hex = str1.slice(2);
  return decodeURIComponent(
    hex.replace(/\s+/g, "").replace(/[0-9a-f]{2}/g, "%$&")
  );
}
