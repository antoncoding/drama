import Web3 from "web3";
import { EtherscanTx } from "../types";
import ENS, { getEnsAddress } from "@ensdomains/ensjs";
import { ethers, providers } from "ethers";

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

  for (const address of newAddresses) {
    const isContract = await getIsContract(address);

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
  let txs: EtherscanTx[] = [];

  const endpoint =
    `https://api.etherscan.io/api?module=account&action=txlist&address=${account}&startblock=0&endblock=99999999&offset=10000&sort=asc
  &apikey=${process.env.REACT_APP_ETHERSCAN_KEY}`.replace("\n", "");
  const res = await fetch(endpoint);

  txs = (await res.json()).result as EtherscanTx[];
  if (txs.length === 10000) {
    // need to recursive search to get full history
    txs = [];

    const currentBlock = await web3.eth.getBlockNumber();
    let endBlock = currentBlock;

    // assume there won't be more than 10_000 tx in 500_000 block
    const batch = 1000_000;

    let startBlock = endBlock - batch;
    let searching = true;

    while (searching) {
      console.log(`searching block ${startBlock} => ${endBlock}`);
      const pagedEndpoint =
        `https://api.etherscan.io/api?module=account&action=txlist&address=${account}&startblock=${startBlock}&endblock=${endBlock}&offset=10000&page=1&sort=asc
    &apikey=${process.env.REACT_APP_ETHERSCAN_KEY}`.replace("\n", "");

      const res = await fetch(pagedEndpoint);
      const pageTxs = (await res.json()).result as EtherscanTx[];

      endBlock = startBlock - 1;
      startBlock = endBlock - batch;

      txs = txs.concat(pageTxs);

      if (startBlock < 0) searching = false;
    }
  }

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
