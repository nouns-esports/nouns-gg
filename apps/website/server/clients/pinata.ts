import { env } from "~/env";
import { PinataSDK } from "pinata-web3";

export const pinataClient = new PinataSDK({
	pinataJwt: env.PINATA_JWT,
	pinataGateway: "ipfs.nouns.gg",
});
