import { BigNumber, BigNumberish, ethers } from "ethers";
import { JsonRpcProvider } from "@ethersproject/providers";

interface Gas {
  maxFeePerGas: BigNumberish;
  maxPriorityFeePerGas: BigNumberish;
}

export async function getGasFee(provider: JsonRpcProvider): Promise<Gas> {
  try{
    const [fee, block] = await Promise.all([
      provider.send("eth_maxPriorityFeePerGas", []),
      provider.getBlock("latest"),
    ]);
    const tip = ethers.BigNumber.from(fee);
    const buffer = tip.div(100).mul(13);
    const maxPriorityFeePerGas = tip.add(buffer);
    const maxFeePerGas = block.baseFeePerGas
      ? block.baseFeePerGas.mul(2).add(maxPriorityFeePerGas)
      : maxPriorityFeePerGas;
  
    return { maxFeePerGas, maxPriorityFeePerGas };
  }catch(e){
    console.log("Error")
    return {maxPriorityFeePerGas:BigNumber.from("1500000000"),maxFeePerGas:BigNumber.from("1500000000")}
  }

}
