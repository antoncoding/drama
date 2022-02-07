import React, { useCallback, useMemo } from "react";
import { LinkBase, useTheme } from "@aragon/ui";
import { etherProvider, getENS } from "../../utils/web3";
import Davatar from "@davatar/react";
import { useHistory } from "react-router-dom";
import { useAsyncMemo } from "../../hooks/useAsyncMemo";

export function Avatar({
  account,
  size = 80,
  showAddress = false,
  isSpecialEntity = false,
  entityLink = undefined,
}: {
  account: string;
  scale?: number;
  size?: number;
  showAddress?: boolean;
  isSpecialEntity?: boolean;
  entityLink?: string;
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

  console.log(`shortenAddress`, shortenAddress);

  const goToAccount = useCallback(() => {
    history.push(`/account/${account}`);
  }, [account, history]);

  return isSpecialEntity ? (
    // special button take you to the link
    <LinkBase
      onClick={() => window.open(entityLink, "_blank", "noopener,noreferrer")}
      style={{
        padding: 5,
        // all child vertical aligned
        display: "flex",
        alignItems: "center",
      }}
    >
      <div
        style={{
          color: theme.surfaceContentSecondary,
        }}
      >
        {account}
      </div>
    </LinkBase>
  ) : (
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
