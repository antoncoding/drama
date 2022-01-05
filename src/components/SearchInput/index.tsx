import React, { useMemo, useState, useCallback } from "react";
import { TextInput, Button, IconSearch, useToast } from "@aragon/ui";
import { useHistory } from "react-router-dom";
import { validate_addr, validate_txhash } from "../../utils/web3";

export function SearchInput(props: any) {
  const toast = useToast();
  const history = useHistory();

  const [input, setInput] = useState("");

  const inputIsAddress = useMemo(() => {
    return validate_addr(input);
  }, [input]);

  const inputIsTransaction = useMemo(() => {
    return validate_txhash(input);
  }, [input]);

  const handleClick = useCallback(() => {
    if (inputIsAddress) {
      history.push(`/account/${input}`);
    } else if (inputIsTransaction) {
      toast("Transaction page coming soon!");
      // history.push(`/tx/${input}`)
    }
  }, [inputIsAddress, inputIsTransaction, history, input, toast]);

  return (
    <div>
      <TextInput
        placeholder="Search by Ethereum address"
        value={input}
        onChange={(event) => setInput(event.target.value)}
        wide={true}
        adornmentPosition={"end"}
        adornment={
          <Button
            label=""
            onClick={handleClick}
            size="small"
            mode={"strong"}
            icon={<IconSearch />}
            disabled={!inputIsAddress && !inputIsTransaction}
          ></Button>
        }
      />
    </div>
  );
}
