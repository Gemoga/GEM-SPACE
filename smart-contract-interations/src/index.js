// Import required modules
import { createApp } from "@deroll/app";
import { encodeFunctionData, getAddress, hexToString } from "viem";
import storageContractABI from "./storageABI.json";
import nftContractABI from "./simpleNftABI.json";

let storageContractAddress = "";
let nftContractAddress = "";

// Initialize the application
const application = createApp({
    url: process.env.ROLLUP_HTTP_SERVER_URL || "http://127.0.0.1:5004",
});

// Handle incoming encoded input data
application.addAdvanceHandler(async ({ metadata, payload }) => {
  const decodedPayload = hexToString(payload);
  console.log("Decoded Payload:", decodedPayload);

  const parsedPayload = JSON.parse(decodedPayload);
  const senderAddress = metadata.msg_sender;
  console.log("Sender Address:", senderAddress);

  switch(parsedPayload.method) {
    case "set_address": // {"method": "set_address", "address": "0x1234..."}
      storageContractAddress = getAddress(parsedPayload.address);
      console.log("Storage Contract Address Updated:", storageContractAddress);
      break;

    case "generate_number": // {"method": "generate_number", "number": "7"}
      const calculatedNumber = parsedPayload.number * 2;
      console.log("Calculated Number by Cartesi Backend:", calculatedNumber);

      // Prepare and create voucher
      const storeFunctionData = encodeFunctionData({
        abi: storageContractABI,
        functionName: "store",
        args: [calculatedNumber],
      });

      application.createVoucher({
        destination: storageContractAddress,
        payload: storeFunctionData,
      });
      break;

    case "mint_nft": // {"method": "mint_nft"}
      const nftMetadata = "this is my base64 image string";

      // Prepare and create voucher for minting NFT
      const mintFunctionData = encodeFunctionData({
        abi: nftContractABI,
        functionName: "mintTo",
        args: [senderAddress],
      });

      application.createVoucher({
        destination: nftContractAddress,
        payload: mintFunctionData,
      });
      break;

    default:
      console.log("Unknown method received");
      break;
  }

  return "accepted";
});

// Start the application
application.start().catch((error) => {
    console.error(error);
    process.exit(1);
});
