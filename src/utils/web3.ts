import Web3 from "web3";
import {
  EtherscanTx,
  EtherscanTxLite,
  EtherscanTxWithParsedMessage,
} from "../types";
import ENS, { getEnsAddress } from "@ensdomains/ensjs";
import { ethers, providers } from "ethers";

import {
  storeContractMap,
  getStoredContractMap,
  getStoredEtherscanTxs,
  storeEtherscanTx,
} from "./storage";
import { spammers } from "./constant";
import { adapterAddresses, parser } from "../adapters";

export const web3 = new Web3(
  `https://mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_KEY}`
);

export const etherProvider = new providers.InfuraProvider(
  1,
  process.env.REACT_APP_INFURA_KEY
);

const ens = new ENS({
  provider: web3.currentProvider,
  ensAddress: getEnsAddress("1"),
});

export function validate_addr(address: string) {
  return web3.utils.isAddress(address);
}

export function validate_txhash(hash: string) {
  return /^0x([A-Fa-f0-9]{64})$/.test(hash);
}

/**
 * get all tx that are utf-8 messages
 * @param account
 */
export async function getMessages(
  account: string,
  hideSpam: boolean,
  startBlock: number,
  isContract = false
) {
  // is input is a contract address, external  calls will only return transaction sent from other people.
  if (isContract)
    return getParsedMessagesForContract(account, startBlock, hideSpam);
  else return getParsedMessagesForUser(account, hideSpam);
}

async function getParsedMessagesForUser(
  account: string,
  hideSpam: boolean
): Promise<EtherscanTxWithParsedMessage[]> {
  const txs = (await getTransactions(account, 0, true))
    .filter((tx) => hideSpam && !spammers.includes(tx.from.toLocaleLowerCase()))
    .filter(
      (tx) =>
        adapterAddresses.includes(tx.to) || input_to_ascii(tx.input) !== ""
    );

  const toAddresses = txs
    .map((t) => t.to)
    // exclude adapter address from the contract list, cause we will parse them separately
    .filter((t) => !adapterAddresses.includes(t.toLowerCase()));

  const contractMap = await getNewContractMap(toAddresses);

  return txs
    .filter((tx) => {
      // this is one of the tx adapters can parse!
      if (adapterAddresses.includes(tx.to)) {
        return true;
      }
      return contractMap[tx.to] === false;
    })
    .map((tx) => {
      const adapter = parser.getAdapterByAddress(tx.to);
      // it's a parsable tx to a contract
      if (adapter) {
        const { recipient, recipientIsAddress, recipientLink, message } =
          adapter.parseTxInput(tx.input);
        return {
          ...tx,
          isAdapterTx: true,
          adapterName: adapter.name,
          adapterRecipient: recipient,
          adapterRecipientIsAddress: recipientIsAddress,
          adapterRecipientLink: recipientLink,
          parsedMessage: message,
        };
      } else {
        // it's a normal tx
        const message = input_to_ascii(tx.input);
        return {
          ...tx,
          isAdapterTx: false,
          adapterRecipientIsAddress: true,
          parsedMessage: message,
        };
      }
    })
    .filter((tx) => tx.parsedMessage !== "")
    .sort((a, b) => (parseInt(a.timeStamp) > parseInt(b.timeStamp) ? -1 : 1));
}

async function getParsedMessagesForContract(
  contractAddress: string,
  startBlock: number,
  hideSpam: boolean
): Promise<EtherscanTxWithParsedMessage[]> {
  const adapter = parser.getAdapterByAddress(contractAddress);
  if (!adapter) return [];

  const txs = (await getTransactions(contractAddress, startBlock, false))
    .filter((tx) => hideSpam && !spammers.includes(tx.from.toLocaleLowerCase()))
    .sort((a, b) => (parseInt(a.timeStamp) > parseInt(b.timeStamp) ? -1 : 1));

  const txWithParsedMessage = txs
    .map((tx) => {
      const { recipient, recipientIsAddress, recipientLink, message } =
        adapter.parseTxInput(tx.input);
      return {
        ...tx,
        isAdapterTx: true,
        adapterName: adapter.name,
        adapterRecipient: recipient,
        adapterRecipientIsAddress: recipientIsAddress,
        adapterRecipientLink: recipientLink,
        parsedMessage: message,
      };
    })
    .filter((tx) => {
      return tx.parsedMessage !== "";
    });

  // store txs after filtering un-parsable transactions

  return txWithParsedMessage;
}

/**
 * parse transaction input into UTF8 text
 * @param str1
 * @returns
 */
export function input_to_ascii(str1: string) {
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

async function getNewContractMap(toAddresses: string[]) {
  const distinctAddresses = [...new Set(toAddresses)];

  const map = getStoredContractMap();

  const newAddresses = distinctAddresses.filter(
    (addr) => map[addr] === undefined
  );

  for (const address of newAddresses) {
    const isContract = await getIsContract(address);

    map[address] = isContract; // modify object directly
  }

  storeContractMap(map);

  return map;
}

/**
 * get all transactions involve this address
 * @param account
 * @returns
 */
export async function getTransactions(
  account: string,
  earliestBlock = 0,
  greedy = true
) {
  const accountLowercase = account.toLowerCase();
  const currentBlock = await web3.eth.getBlockNumber();

  // check if we have previously get this
  let { endBlock: lastBlock, txs: oldTxs } =
    getStoredEtherscanTxs(accountLowercase);

  const startBlock = Math.max(earliestBlock, lastBlock);

  const endpoint =
    `https://api.etherscan.io/api?module=account&action=txlist&address=${accountLowercase}&startblock=${startBlock}&endblock=99999999&offset=10000&sort=asc
  &apikey=${process.env.REACT_APP_ETHERSCAN_KEY}`.replace("\n", "");
  const res = await fetch(endpoint);

  let newTxs = (await res.json()).result as EtherscanTx[];

  if (newTxs.length === 10000) {
    // need to recursive search to get full history
    newTxs = [];

    // in greedy search: we assume there won't be more than 10_000 tx in 50_000 block
    const batch = greedy ? 100_000 : 10_000;

    let roundEndBlock = currentBlock;
    let roundStartBlock = roundEndBlock - batch;

    let searching = true;

    while (searching) {
      if (roundStartBlock < startBlock) {
        roundStartBlock = startBlock;
        // end the loop after this round
        searching = false;
      }

      console.log(`searching block ${roundStartBlock} => ${roundEndBlock}`);
      const pagedEndpoint =
        `https://api.etherscan.io/api?module=account&action=txlist&address=${accountLowercase}&startblock=${roundStartBlock}&endblock=${roundEndBlock}&offset=10000&page=1&sort=asc
    &apikey=${process.env.REACT_APP_ETHERSCAN_KEY}`.replace("\n", "");

      const res = await fetch(pagedEndpoint);
      const result = (await res.json()).result as EtherscanTx[];

      const pageTxs = Array.isArray(result)
        ? result.sort((a, b) =>
            parseInt(a.timeStamp) > parseInt(b.timeStamp) ? -1 : 1
          )
        : [];

      roundEndBlock = roundStartBlock - 1;
      roundStartBlock = roundEndBlock - batch;

      newTxs = newTxs.concat(pageTxs);
    }
  }

  newTxs = newTxs
    .filter((tx) => tx.contractAddress === "") // it's not a contract creation tx
    .filter((tx) => parseInt(tx.gasUsed) > 21000);

  const txs = oldTxs.concat(newTxs);

  // store the filtered txs
  storeQueriesTxsForAddress(accountLowercase, currentBlock, txs);
  return txs;
}

function storeQueriesTxsForAddress(
  address: string,
  latestBlock: number,
  txs: EtherscanTxLite[]
) {
  const cleanedTx = txs.map((tx) => {
    return {
      blockNumber: tx.blockNumber,
      from: tx.from,
      gasUsed: tx.gasUsed,
      hash: tx.hash,
      input: tx.input,
      timeStamp: tx.timeStamp,
      to: tx.to,
      value: tx.value,
    };
  });
  storeEtherscanTx(address, { txs: cleanedTx, endBlock: latestBlock });
}

/**
 * check is an address is contract address
 * @param address
 * @returns
 */
export async function getIsContract(address: string) {
  const code = await web3.eth.getCode(address);
  return code !== "0x";
}

export async function parseENS(string: string) {
  if (!string.includes(".eth")) return false;
  try {
    const address = await ens.name(string).getAddress();
    if (address === "0x0000000000000000000000000000000000000000")
      return undefined;
    return address as string;
  } catch (error) {
    return undefined;
  }
}

export async function getENS(address: string) {
  if (!web3.utils.isAddress(address)) return null;
  try {
    const { name: ensName } = await ens.getName(address);
    return ensName as string | null;
  } catch (error) {
    console.log(`getENS error`, error);
    return null;
  }
}

export async function getEthBalance(address: string) {
  try {
    const balance = await etherProvider.getBalance(address);
    return ethers.utils.formatEther(balance);
  } catch (error) {
    console.log(`getEthBalance error`, error);
    return null;
  }
}

export async function getAddressAvatar(address: string) {
  const ensName = await getENS(address);
  if (!ensName) return null;
  return await getAvatar(ensName);
}

export async function getAvatar(ensName: string) {
  try {
    const resolver = await etherProvider.getResolver(ensName);
    const avatar = await resolver?.getText("avatar");
    if (!avatar || avatar.length === 0) return null;
    return avatar;
  } catch (error) {
    console.log(`get Avatar error`, error);
    return null;
  }
}
