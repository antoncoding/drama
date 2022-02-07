export interface ContractAdapter {
  name: string;
  contractAddress: string;
  link?: string;

  parseTxInput: (txInput: string) => {
    message: string | undefined;
    recipient: string | undefined;
    recipientIsAddress: boolean | undefined;
    recipientLink: string | undefined;
  };
}
