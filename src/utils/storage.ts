import { EtherscanTxLite, EtherscanTxWithParsedMessage } from "../types";
const LZString = require("lz-string");

export function getStoredContractMap() {
  const key = "isContract";
  const str = localStorage.getItem(key);
  const obj = str !== null ? JSON.parse(str) : {};

  return obj as { [key: string]: boolean };
}

export function storeContractMap(map: { [key: string]: boolean }) {
  const key = "isContract";
  const str = JSON.stringify(map);
  localStorage.setItem(key, str);
}

export function getLikedTxs() {
  const key = "liked-txs-complex";
  const str = localStorage.getItem(key);
  const obj = str !== null ? JSON.parse(str) : [];

  return obj as EtherscanTxWithParsedMessage[];
}

export function storeLikedTxs(array: EtherscanTxWithParsedMessage[]) {
  const key = "liked-txs-complex";
  const str = JSON.stringify(array);
  localStorage.setItem(key, str);
}

type StoredEthereumTxsForAccount = { txs: EtherscanTxLite[]; endBlock: number };

export function getStoredEtherscanTxs(address: string) {
  const key = `etherscan-tx/${address.toLowerCase()}`;
  const str = getAndDecode(key);
  const obj =
    str !== null
      ? JSON.parse(str)
      : {
          txs: [],
          endBlock: 0,
        };

  return obj as StoredEthereumTxsForAccount;
}

export function storeEtherscanTx(
  address: string,
  info: StoredEthereumTxsForAccount
) {
  try {
    const key = `etherscan-tx/${address.toLowerCase()}`;
    compressAndStore(key, info);
  } catch (error) {
    console.log(error);
  }
}

function getAndDecode(key: string): string | null {
  const str = localStorage.getItem(key);
  if (!str) return null;
  return LZString.decompress(str);
}

function compressAndStore(key: string, value: any) {
  localStorage.setItem(key, LZString.compress(JSON.stringify(value)));
}
// function smartStoreLocalStorage(key: string, value: string): void {

//   const maxChars = 1000000

//   console.log(`value.length`, value.length)

//   if (value.length < maxChars) localStorage.setItem(key, value)

//   // data too long!
//   let subKeyId = 0

//   let keepStoring = true
//   while(keepStoring) {
//     if (value.length <= maxChars) keepStoring = false

//     const subKey = subKeyId === 0 ? key : `${key}/${subKeyId}`

//     const data = value.slice(0, maxChars)
//     console.log(`data`, data.length)
//     localStorage.setItem(subKey, data);
//     subKeyId = subKeyId + 1
//   }
// }
