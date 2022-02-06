import React, { useCallback, useMemo } from "react";
import { LinkBase, useTheme } from "@aragon/ui";
import { etherProvider, getENS } from "../../utils/web3";
import Davatar from "@davatar/react";
import { useHistory } from "react-router-dom";
import { useAsyncMemo } from "../../hooks/useAsyncMemo";

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
  const theme = useTheme();
  const history = useHistory();

  const ens = useAsyncMemo(
    async () => {
      return await getENS(account);
    },
    [account],
    undefined
  );

  const shortenAddress = useMemo(() => {
    return account.slice(0, 4).concat("...").concat(account.slice(-4));
  }, [account]);

  const goToAccount = useCallback(() => {
    history.push(`/account/${account}`);
  }, [account, history]);

  return (
    <LinkBase
      style={{
        padding: 5,
        // all child vertical aligned
        display: "flex",
        alignItems: "center",
      }}
      onClick={goToAccount}
    >
      <Davatar
        address={account}
        size={size}
        style={{ borderRadius: 4 }}
        provider={etherProvider}
        generatedAvatarType="blockies"
      />
      {showAddress && (
        <div
          style={{
            paddingLeft: 10,
            color: theme.surfaceContentSecondary,
          }}
        >
          {ens || shortenAddress}
        </div>
      )}
    </LinkBase>
  );
}
