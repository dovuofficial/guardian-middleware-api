/* eslint-disable */
import { BlockData } from 'src/guardian/policies'
import guardian from 'src/guardian'
import Config from 'src/config'
import { AccountLoginResponse, SessionResponse } from 'src/guardian/account'

const executeRootBlock: ExecuteRootBlock = async (
	accessToken,
	policyId,
	doc
) => {
	const rootBlock = await guardian.policies.blocks(accessToken, policyId)
	await executeBlock(accessToken, policyId, rootBlock.id, doc)
	console.log(`Finished root block execution for policy: ${policyId}`)
}

const executeBlockViaTag: ExecuteBlockViaTag = async (
	accessToken,
	policyId,
	tag,
	doc
) => {
	const blockId = await guardian.policies.blockByTag(
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
	const blockId = await guardian.policies.blockByTag(
		accessToken,
		policyId,
		tag
	)

	return guardian.policies.blockById(accessToken, policyId, blockId)
}

const getCurrentUserDid = async (accessToken) => {
	const session: SessionResponse = await guardian.account.session(accessToken)

	return session.did
}

const retrievePreviousBlockContext: PreviousDocumentContext = async (
	policyId,
	did,
	tag
) => {
	// 😅 Impersonate the Standard registry to get data from a given block
	const account: AccountLoginResponse = await guardian.account.login({
		username: Config.registryUsername,
		password: Config.registryPassword,
	})

	const submissions = await engine.fetchBlockSubmissions(
		account.accessToken,
		policyId as string,
		tag
	)

	return submissions.data.find((submission) => submission.owner === did)
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
	await guardian.policies.sendToBlock(accessToken, policyId, blockId, doc)
}

const executeBlock: ExecuteBlock = async (
	accessToken,
	policyId,
	blockId,
	doc
) => {
	const data = await guardian.policies.blockById(
		accessToken,
		policyId,
		blockId
	)

	console.log(data.blockType)

	switch (data.blockType) {
		case 'interfaceContainerBlock':
			return interfaceContainerBlock(accessToken, policyId, data, doc)
		case 'interfaceStepBlock':
			return interfaceStepBlock(accessToken, policyId, data, doc)
		case 'policyRolesBlock':
			return policyRolesBlock(accessToken, policyId, data)
		case 'requestVcDocumentBlock':
			return requestVcDocument(accessToken, policyId, data, doc)
		case 'interfaceActionBlock':
			return sendActionToBlock(accessToken, policyId, blockId, doc)
		case 'buttonBlock': // This has been added as a "buttonBlock" is a thing
			return sendActionToBlock(accessToken, policyId, blockId, doc)
		case 'informationBlock':
			return informationBlock(data)

		default:
			// Guardian does not send some data for this blocks
			if (data.roles) {
				// policyRolesBlock
				return policyRolesBlock(accessToken, policyId, {
					id: blockId,
					roles: data.roles,
					uiMetaData: data.uiMetaData,
					blockType: 'policyRolesBlock',
				})
			}
			if (
				Object.getOwnPropertyNames(data).length === 1 &&
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
	console.log(`Title: ${uiMeta.title || 'MISSING TITLE'}`)

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
		return executeBlock(accessToken, policyId, blockData.id, doc) // Re-execute this block
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
			await guardian.policies.sendToBlock(
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

	// @ts-ignore
	doc.document.type = blockData.schema.type

	blockData.schema.fields.map((field) => {
		if (!field.isRef) {
			return
		}

		doc.document[field.name].type = field.type.substring(1)
	})

	console.log('Sending document')

	await guardian.policies.sendToBlock(
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

type FetchDid = (accessToken: string) => Promise<string>

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

type PreviousDocumentContext = (
	policyId: string,
	did: string,
	tag: string
) => Promise<BlockData>

export interface Engine {
	executeRootBlock: ExecuteRootBlock
	executeBlock: ExecuteBlock
	executeBlockViaTag: ExecuteBlockViaTag
	fetchBlockSubmissions: FetchBlockSubmissions
	retrievePreviousBlockContext: PreviousDocumentContext
	getCurrentUserDid: FetchDid
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
	retrievePreviousBlockContext,
	getCurrentUserDid,
}

export default engine
