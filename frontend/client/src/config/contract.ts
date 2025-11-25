export const CONTRACT_ADDRESS = "0x9bD9585EC69Ec61FE09bc75dAc19447B6047B31d";

export const CONTRACT_ABI = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "reporter",
        type: "address",
      },
    ],
    name: "ReportSubmitted",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_type",
        type: "string",
      },
      {
        internalType: "string",
        name: "_description",
        type: "string",
      },
      {
        internalType: "string",
        name: "_location",
        type: "string",
      },
      {
        internalType: "string",
        name: "_metadataCID",
        type: "string",
      },
    ],
    name: "submitReport",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;
