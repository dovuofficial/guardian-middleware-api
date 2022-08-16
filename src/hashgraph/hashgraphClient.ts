import config from 'src/config'
import Environment from 'src/constants/environment'
import { Client, PrivateKey, AccountCreateTransaction } from '@hashgraph/sdk'

const { TESTNET, PREVIEWNET, MAINNET } = Environment

const networkClientForEnvironment = {
	[TESTNET]: Client.forTestnet(),
	[PREVIEWNET]: Client.forPreviewnet(),
	[MAINNET]: Client.forMainnet(),
}

let hederaNetworkClient = null

const client = () => {
	const { network, accountId, privateKey } = config

	if (!network) {
		throw new Error(
			`Network from environment could not match for any hedera network. Change your "HEDERA_NETWORK" environment variable to either: "testnet", "previewnet" or "mainnet"`
		)
	}
	if (!accountId) {
		throw new Error(
			`Account ID from environment could not match for any hedera network. Change your "HEDERA_OPERATOR_ACCOUNT_ID" environment variable to a valid hedera account id`
		)
	}
	if (!privateKey) {
		throw new Error(
			`Private key from environment could not match for any hedera network. Change your "HEDERA_OPERATOR_PRIVATE_KEY" environment variable to a valid hedera private key`
		)
	}

	if (hederaNetworkClient === null) {
		hederaNetworkClient = networkClientForEnvironment[network].setOperator(
			accountId,
			privateKey
		)
	}

	return hederaNetworkClient
}

export interface HederaAccount {
	accountId: string
	privateKey: string
	publicKey: string
}

const createAccount = async (): Promise<HederaAccount> => {
	const privateKey = await PrivateKey.generate()
	const { publicKey } = privateKey
	const hederaClient = client()
	const transaction = new AccountCreateTransaction()
		.setKey(publicKey)
		.setInitialBalance(200.0)

	const txResponse = await transaction.execute(hederaClient)
	const receipt = await txResponse.getReceipt(hederaClient)
	const accountId = receipt.accountId.toString()

	return {
		accountId,
		privateKey: privateKey.toString(),
		publicKey: publicKey.toString(),
	}
}

export interface HashgraphClient {
	createAccount: () => Promise<{
		accountId: string
		privateKey: string
		publicKey: string
	}>
}

export default {
	createAccount,
}
