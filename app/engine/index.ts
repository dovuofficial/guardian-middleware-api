import { BlockData } from '@app/guardian/policies'
import Guardian from '../guardian'

const executeRootBlock: ExecuteRootBlock = async (
	accessToken,
	policyId,
	doc
) => {
	const rootBlock = await Guardian.policies.blocks(accessToken, policyId)
	await executeBlock(accessToken, policyId, rootBlock.id, doc)
	console.log(`Finished root block execution for policy: ${policyId}`)
}

const executeBlockViaTag: ExecuteBlockViaTag = async (
	accessToken,
	policyId,
	tag,
	doc
) => {
	const blockId = await Guardian.policies.blockByTag(
		accessToken,
		policyId,
		tag
	)

	await executeBlock(accessToken, policyId, blockId, doc)
}

const fetchBlockSubmissions: FetchBlockSubmissions = async (
	accessToken,
	policyId,
	tag
) => {
	const blockId = await Guardian.policies.blockByTag(
		accessToken,
		policyId,
		tag
	)

	return await Guardian.policies.blockById(accessToken, policyId, blockId)
}

const sendActionToBlock = async (
	accessToken: string,
	policyId: string,
	blockId: string,
	doc: Record<string, unknown>
) => {
	// console.log(doc)
	console.log(blockId)

	// tighten this.
	await Guardian.policies.sendToBlock(accessToken, policyId, blockId, doc)
}

const executeBlock: ExecuteBlock = async (
	accessToken,
	policyId,
	blockId,
	doc
) => {
	const data = await Guardian.policies.blockById(
		accessToken,
		policyId,
		blockId
	)

	console.log(data.blockType)

	switch (data.blockType) {
		case 'interfaceContainerBlock':
			return await interfaceContainerBlock(
				accessToken,
				policyId,
				data,
				doc
			)
		case 'interfaceStepBlock':
			return await interfaceStepBlock(accessToken, policyId, data, doc)
		case 'policyRolesBlock':
			return await policyRolesBlock(accessToken, policyId, data)
		case 'requestVcDocumentBlock':
			return await requestVcDocument(accessToken, policyId, data, doc)
		case 'interfaceActionBlock':
			return await sendActionToBlock(accessToken, policyId, blockId, doc)
		case 'buttonBlock': // This has been added as a "buttonBlock" is a thing
			return await sendActionToBlock(accessToken, policyId, blockId, doc)
		case 'informationBlock':
			return informationBlock(data)

		default:
			// Guardian does not send some data for this blocks
			if (data.roles) {
				// policyRolesBlock
				return await policyRolesBlock(accessToken, policyId, {
					id: blockId,
					roles: data.roles,
					uiMetaData: data.uiMetaData,
					blockType: 'policyRolesBlock',
				})
			}
			if (
				Object.getOwnPropertyNames(data).length == 1 &&
				data.uiMetaData
			) {
				return informationBlock({
					id: blockId,
					uiMetaData: data.uiMetaData,
					blockType: 'informationBlock',
				})
			}
			break
	}
	return true
}

const interfaceContainerBlock = async (
	accessToken: string,
	policyId: string,
	blockData: BlockData,
	doc: Record<string, unknown>
) => {
	const uiMeta = blockData.uiMetaData
	uiMeta.title && console.log(`Title: ${uiMeta.title}`)

	console.log('stuck')
	console.log(blockData)

	if (!blockData.blocks) {
		return
	}

	const blocks = blockData.blocks.filter((element) => element != null)
	for (let i = 0; i < blocks.length; i++) {
		const stop = await executeBlock(
			accessToken,
			policyId,
			blocks[i].id,
			doc
		)
		if (stop) {
			return true
		}
		return await executeBlock(accessToken, policyId, blockData.id, doc) // Re-execute this block
	}
}

const policyRolesBlock = async (
	accessToken: string,
	policyId: string,
	blockData: BlockData
) => {
	const uiMeta = blockData.uiMetaData
	uiMeta.title && console.log(`Title: ${uiMeta.title}`)
	uiMeta.description && console.log(`Description: ${uiMeta.description}`)

	if (!blockData.roles) {
		return
	}

	blockData.roles.forEach((element, ix) => {
		console.log(`[${ix}] - ${element}`)
	})

	while (true) {
		// rl.question('Rol: ? ', async function (rol) {
		// let ix = parseInt(rol);
		const ix = 0
		if (!isNaN(ix) && blockData.roles.length > ix && ix >= 0) {
			const data = { role: blockData.roles[ix] }
			await Guardian.policies.sendToBlock(
				accessToken,
				policyId,
				blockData.id,
				data
			)
			return
		}
		// });
	}
}

const interfaceStepBlock = async (
	accessToken: string,
	policyId: string,
	blockData: BlockData,
	doc: Record<string, unknown>
) => {
	if (!blockData.blocks) {
		return
	}

	const blocks = blockData.blocks.filter((element) => element != null)
	for (let i = 0; i < blocks.length; i++) {
		const stop = await executeBlock(
			accessToken,
			policyId,
			blocks[i].id,
			doc
		)
		if (stop) {
			return true
		}
		await executeBlock(accessToken, policyId, blockData.id, doc) // Re-execute this block
	}
}

interface Document extends Record<string, unknown> {
	document: DocumentDetail
}
interface DocumentDetail {
	'@context': string
	type: string
	name: string
}

const requestVcDocument = async (
	accessToken: string,
	policyId: string,
	blockData: BlockData,
	doc: Record<string, unknown>
) => {
	const uiMeta = blockData.uiMetaData
	uiMeta.title && console.log(`Title: ${uiMeta.title}`)
	uiMeta.description && console.log(`Description: ${uiMeta.description}`)

	// We adjust the doc with injecting context and schema types were appropriate
	doc.document['@context'] = blockData.schema?.contextURL || ''

	doc.document.type = blockData.schema.type

	blockData.schema.fields.map((field) => {
		if (!field.isRef) {
			return
		}

		doc.document[field.name].type = field.type.substring(1)
	})

	console.log('Sending document')

	await Guardian.policies.sendToBlock(
		accessToken,
		policyId,
		blockData.id,
		doc
	)
}

const informationBlock = (blockData: BlockData) => {
	const uiMeta = blockData.uiMetaData
	uiMeta.title && console.log(`Title: ${uiMeta.title}`)
	uiMeta.description && console.log(`Description: ${uiMeta.description}`)
	return true // stop processing
}

type ExecuteRootBlock = (
	accessToken: string,
	policyId: string,
	doc: Record<string, unknown>
) => Promise<void>

type ExecuteBlock = (
	accessToken: string,
	policyId: string,
	blockId: string,
	doc: Record<string, unknown>
) => Promise<void | boolean>

type ExecuteBlockViaTag = (
	accessToken: string,
	policyId: string,
	tag: string,
	doc: Record<string, unknown>
) => Promise<void>

type FetchBlockSubmissions = (
	accessToken: string,
	policyId: string,
	tag: string
) => Promise<BlockData>
export interface Engine {
	executeRootBlock: ExecuteRootBlock
	executeBlock: ExecuteBlock
	executeBlockViaTag: ExecuteBlockViaTag
	fetchBlockSubmissions: FetchBlockSubmissions
}

// TODO: This should be more fluent with injecting policy id and modifying auth
// Possible signature:
// Engine.usePolicy(policyId).authorise(token).executeBlock(block)
// Engine.usePolicy(policyId).authorise(token).withTag('tag').executeBlock(doc)
const engine: Engine = {
	executeRootBlock,
	executeBlock,
	executeBlockViaTag,
	fetchBlockSubmissions,
}

export default engine
