export type EtherscanTx = {
  blockHash: string;
  blockNumber: string;
  confirmations: string;
  contractAddress: "";
  cumulativeGasUsed: string;
  from: string;
  gas: string;
  gasPrice: string;
  gasUsed: string;
  hash: string;
  input: string;
  isError: string;
  nonce: string;
  timeStamp: string;
  to: string;
  transactionIndex: string;
  txreceipt_status: string;
  value: string;
};

export type EtherscanTxLite = {
  blockNumber: string;
  from: string;
  gasUsed: string;
  hash: string;
  input: string;
  timeStamp: string;
  to: string;
  value: string;
};

export type EtherscanTxWithParsedMessage = EtherscanTxLite & {
  parsedMessage: string;
  // if the message is parsed by adapter
  isAdapterTx: boolean;
  adapterRecipientIsAddress: boolean;
  adapterName?: string;
  adapterRecipient?: string;
  adapterRecipientLink?: string;
};
