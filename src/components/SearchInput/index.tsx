import React, { useMemo, useState, useCallback } from "react";
import { TextInput, Button, IconSearch, useToast } from "@aragon/ui";
import { useHistory } from "react-router-dom";
import { parseENS, validate_addr, validate_txhash } from "../../utils/web3";
import { useAsyncMemo } from "../../hooks/useAsyncMemo";
import useWindowSize from "../../hooks/useWindowSize";

export function SearchInput(props: any) {
  const toast = useToast();

  const { width: screenWidth } = useWindowSize();

  const isSmallScreen = useMemo(() => screenWidth < 600, [screenWidth]);

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
      console.log(`jj`);
      history.push(`/account/${input}`);
    } else if (reversed) {
      console.log(`here`);
      history.push(`/account/${reversed}`);
    } else if (inputIsTransaction) {
      history.push(`/tx/${input}`);
    } else {
      toast("Invalid Input!");
    }
  }, [inputIsAddress, inputIsTransaction, history, input, toast, reversed]);

  return (
    <div>
      <TextInput
        placeholder={!isSmallScreen && "Search by address, ENS or tx hash."}
        value={input}
        onChange={(event) => setInput(event.target.value)}
        wide={!isSmallScreen}
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
