import { ContractAdapter } from "./interface";
import { utils } from "ethers";
/**
 * Example tx:
 * https://etherscan.io/tx/0x41dd0c99b3f0ea5902d67b9d99cc26e4d4573955da593a3155ee5dcb93e8cd88
 */
export class JuiceBuxAdapter implements ContractAdapter {
  name = "JuiceBox";
  link = "https://juicebox.money/#/projects";
  contractAddress = "0x981c8ecd009e3e84ee1ff99266bf1461a12e5c68";
  startBlock = 13979856;

  parseTxInput = (txInput: string) => {
    const functionHash = utils.hexDataSlice(txInput, 0, 4);
    if (functionHash !== "0x02c8986f")
      return {
        recipient: undefined,
        message: "",
        recipientIsAddress: false,
        recipientLink: undefined,
      };
    const [projectId, , memo] = utils.defaultAbiCoder.decode(
      ["uint256", "address", "string", "bool"], // project id, beneficiary, memo, preferUnstakedTickets
      utils.hexDataSlice(txInput, 4)
    );

    return {
      recipient:
        nameMap[projectId.toString()] || `Project ${projectId.toString()}`,
      message: memo,
      recipientIsAddress: false,
      recipientLink:
        linkMap[projectId.toString()] || "https://juicebox.money/#/projects",
    };
  };
}

const nameMap = {
  "89": "DAOTaiFung",
  "323": "AssangeDAO",
};

const linkMap = {
  "89": "https://juicebox.money/#/p/daotaifung",
  "323": "https://juicebox.money/#/p/assangedao",
};
