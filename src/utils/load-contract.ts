import contract from "@truffle/contract";

export const loadContract = async (contractName: string, provider: any) => {
  const res = await fetch(`/contracts/${contractName}.json`);
  const Artifact = await res.json();
  const _contract = contract(Artifact);

  _contract.setProvider(provider);

  let deployedContract = null;

  try {
     deployedContract = await _contract.deployed();
  } catch (ex) {
    console.error(ex);
  }

  return deployedContract;
};
