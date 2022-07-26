import Environment from 'lib/constants/environment'
import config from 'lib/config'

const ExplorerUrl = {
	[Environment.TESTNET]: 'https://ledger-testnet.hashlog.io/tx/',
	[Environment.PREVIEWNET]: null,
	[Environment.MAINNET]: 'https://ledger.hashlog.io/tx/',
}

function getExplorerUrl(tx: string): string {
	const { network } = config

	return `${ExplorerUrl[network]}${tx}`
}

const explorer = {
	getExplorerUrl,
}

export default explorer
