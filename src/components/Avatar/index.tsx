import React, { useCallback } from "react";
import { LinkBase } from "@aragon/ui";
import { etherProvider } from "../../utils/web3";
import Davatar from "@davatar/react";
import { useHistory } from "react-router-dom";

export function Avatar({
  account,
  ensName,
  size = 80,
  showAddress = false,
}: {
  account: string;
  ensName?: string | null;
  scale?: number;
  size?: number;
  showAddress?: boolean;
}) {
  const history = useHistory();

  const goToAccount = useCallback(() => {
    history.push(`/account/${account}`);
  }, [account, history]);

  return (
    <LinkBase style={{ padding: 5 }} onClick={goToAccount}>
      <Davatar
        address={account}
        size={size}
        style={{ borderRadius: 4 }}
        provider={etherProvider}
        generatedAvatarType="blockies"
      />
    </LinkBase>
  );
}
