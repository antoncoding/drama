import React from "react";
import { Box, Tag } from "@aragon/ui";
import { Avatar } from "../Avatar";

export function AccountCard({
  account,
  tag,
}: {
  account: string;
  tag?: string;
}) {
  return (
    <Box padding={10}>
      <div
        style={{
          // all child vertical aligned
          display: "flex",
          alignItems: "center",
        }}
      >
        <Avatar size={50} account={account} showAddress={true} />
        {tag && <Tag uppercase={false}> {tag} </Tag>}
      </div>
    </Box>
  );
}
