import { EtherscanTxWithParsedMessage } from "../types";

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
