import Environment from 'src/constants/environment'
import config from 'src/config'

const ExplorerUrl = {
	[Environment.TESTNET]: 'https://ledger-testnet.hashlog.io/tx/',
	[Environment.PREVIEWNET]: null,
	[Environment.MAINNET]: 'https://ledger.hashlog.io/tx/',
}

function getExplorerUrl(tx: string): string {
	const { network = Environment.TESTNET } = config

	return `${ExplorerUrl[network]}${tx}`
}

const explorer = {
	getExplorerUrl,
}

export default explorer
