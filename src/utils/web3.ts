import Web3 from "web3";

import { EtherscanTx } from "../types";

const web3 = new Web3(
  `https://mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_KEY}`
);

/**
 * get all tx that are utf-8 messages
 * @param account
 */
export async function getMessages(account: string) {
  const txs = await getTransactions(account);

  const toAddresses = txs.map((t) => t.to);

  const contractMap = await getNewContractMap(toAddresses);

  return txs.filter((tx) => contractMap[tx.to] === false);
}

async function getNewContractMap(toAddresses: string[]) {
  const distinctAddresses = [...new Set(toAddresses)];

  const map = getStoredContractMap();

  const newAddresses = distinctAddresses.filter(
    (addr) => map[addr] === undefined
  );

  console.log("new addresses", newAddresses);

  for (const address of newAddresses) {
    const isContract = await getIsContract(address);

    console.log(`isContract`, isContract);

    map[address] = isContract; // modify object directly
  }

  storeContractMap(map);

  return map;
}

function getStoredContractMap() {
  const key = "isContract";
  const str = localStorage.getItem(key);
  const obj = str !== null ? JSON.parse(str) : {};

  return obj as { [key: string]: boolean };
}

function storeContractMap(map: { [key: string]: boolean }) {
  const key = "isContract";
  const str = JSON.stringify(map);
  localStorage.setItem(key, str);
}

/**
 * get all transactions involve this address
 * @param account
 * @returns
 */
export async function getTransactions(account: string) {
  const endpoint =
    `https://api.etherscan.io/api?module=account&action=txlist&address=${account}&startblock=0&endblock=99999999&page=1&offset=1000&sort=asc
  &apikey=${process.env.REACT_APP_ETHERSCAN_KEY}`.replace("\n", "");
  const res = await fetch(endpoint);
  const txs = (await res.json()).result as EtherscanTx[];

  const filtered = txs
    .filter((tx) => tx.contractAddress === "") // it's not a contract creation tx
    .filter((tx) => parseInt(tx.gasUsed) > 21000)
    .sort((a, b) => (parseInt(a.timeStamp) > parseInt(b.timeStamp) ? -1 : 1));
  return filtered;
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

export async function getENS(account: string) {
  return "hackwhale.eth";
}
