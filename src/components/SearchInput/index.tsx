import React, { useMemo, useState, useCallback } from "react";
import { TextInput, Button, IconSearch, useToast } from "@aragon/ui";
import { useHistory } from "react-router-dom";
import { parseENS, validate_addr, validate_txhash } from "../../utils/web3";
import { useAsyncMemo } from "../../hooks/useAsyncMemo";

export function SearchInput(props: any) {
  const toast = useToast();
  const history = useHistory();

  const [input, setInput] = useState("");

  const inputIsAddress = useMemo(() => {
    return validate_addr(input);
  }, [input]);

  const reversed = useAsyncMemo(
    async () => {
      return await parseENS(input);
    },
    [input],
    undefined
  );

  const inputIsTransaction = useMemo(() => {
    return validate_txhash(input);
  }, [input]);

  const handleClick = useCallback(() => {
    if (inputIsAddress) {
      history.push(`/account/${input}`);
    } else if (reversed !== undefined) {
      history.push(`/account/${reversed}`);
    } else if (inputIsTransaction) {
      toast("Transaction page coming soon!");
      // history.push(`/tx/${input}`)
    }
  }, [inputIsAddress, inputIsTransaction, history, input, toast, reversed]);

  return (
    <div>
      <TextInput
        placeholder="Search by Ethereum address or ENS"
        value={input}
        onChange={(event) => setInput(event.target.value)}
        wide={true}
        adornmentPosition={"end"}
        adornment={
          <Button
            label="search"
            onClick={handleClick}
            size="small"
            mode={"strong"}
            display={"icon"}
            icon={<IconSearch />}
            disabled={!inputIsAddress && !inputIsTransaction && !reversed}
          ></Button>
        }
      />
    </div>
  );
}
