import { EtherscanTx } from "../types";
import { JuiceBuxAdapter } from "./Juicebox";

const juiceBox = new JuiceBuxAdapter();

export const adapterAddresses = [juiceBox.contractAddress];

export const adapters = [juiceBox];

class ContractParser {
  isAdaptorAddress(address: string) {
    return adapterAddresses.includes(address);
  }

  isInputForAdaptor(tx: EtherscanTx) {
    return adapterAddresses.includes(tx.to);
  }

  getAdapterByAddress(address: string) {
    for (const adapter of adapters) {
      if (adapter.contractAddress === address) return adapter;
    }
    return undefined;
  }

  getAdapter(tx: EtherscanTx) {
    for (const adapter of adapters) {
      if (adapter.contractAddress === tx.to) return adapter;
    }
    return undefined;
  }

  parseInput(input: string) {
    for (const adapter of adapters) {
      try {
        return adapter.parseTxInput(input);
      } catch (error) {
        console.log(`parsing error`, error);
        return { recipient: undefined, message: undefined };
      }
    }
    throw new Error("None of the adapters can parse this tx.");
  }
}

export const parser = new ContractParser();
