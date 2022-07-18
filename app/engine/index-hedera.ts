import Guardian from '../guardian'
import readline from 'readline'

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
})

const executeRootBlock = async (accessToken, policyId) => {
	const rootBlock = await Guardian.policies.blocks(accessToken, policyId)
	await executeBlock(accessToken, policyId, rootBlock.id)
	console.log(`Finished root block execution for policy: ${policyId}`)
}

const executeBlock = async (accessToken, policyId, blockId) => {
	const data = await Guardian.policies.blockById(
		accessToken,
		policyId,
		blockId
	)
	// console.log(data.blockType)
	switch (data.blockType) {
		case 'interfaceContainerBlock':
			return await interfaceContainerBlock(accessToken, policyId, data)
		case 'interfaceStepBlock':
			return await interfaceStepBlock(accessToken, policyId, data)
		case 'policyRolesBlock':
			return await policyRolesBlock(accessToken, policyId, data)
		case 'requestVcDocumentBlock':
			return await requestVcDocument(accessToken, policyId, data)
		case 'informationBlock':
			return await informationBlock(accessToken, policyId, data)

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
			} else if (
				Object.getOwnPropertyNames(data).length == 1 &&
				data.uiMetaData
			) {
				return await informationBlock(accessToken, policyId, {
					id: blockId,
					uiMetaData: data.uiMetaData,
					blockType: 'informationBlock',
				})
			}
			break
	}
	return null
}

const interfaceContainerBlock = async (accessToken, policyId, blockData) => {
	const uiMeta = blockData.uiMetaData
	uiMeta.title && console.log(`Title: ${uiMeta.title}`)

	const blocks = blockData.blocks.filter((element) => element != null)
	for (let i = 0; i < blocks.length; i++) {
		const stop = await executeBlock(accessToken, policyId, blocks[i].id)
		if (stop) {
			return true
		} else {
			return await executeBlock(accessToken, policyId, blockData.id) // Re-execute this block
		}
	}
}

const policyRolesBlock = async (accessToken, policyId, blockData) => {
	const uiMeta = blockData.uiMetaData
	uiMeta.title && console.log(`Title: ${uiMeta.title}`)
	uiMeta.description && console.log(`Description: ${uiMeta.description}`)

	blockData.roles.forEach((element, ix) => {
		console.log(`[${ix}] - ${element}`)
	})

	while (true) {
		// rl.question('Rol: ? ', async function (rol) {
		// let ix = parseInt(rol);
		let ix = 0
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

const interfaceStepBlock = async (accessToken, policyId, blockData) => {
	const blocks = blockData.blocks.filter((element) => element != null)
	for (let i = 0; i < blocks.length; i++) {
		const stop = await executeBlock(accessToken, policyId, blocks[i].id)
		if (stop) {
			return true
		} else {
			await executeBlock(accessToken, policyId, blockData.id) // Re-execute this block
		}
	}
}

// const requestVcDocument = async (accessToken, policyId, blockData) => {
//     const uiMeta = blockData.uiMetaData;
//     uiMeta.title && console.log(`Title: ${uiMeta.title}`);
//     uiMeta.description && console.log(`Description: ${uiMeta.description}`);

//     console.log('Fields: ');
//     blockData.schema.fields.forEach(field => {
//         console.log(`Name: ${field.name} Type: ${field.type} Title: ${field.title} Req: ${field.required}`);
//     });

//     // console.log(blockData.schema.fields)

//     // Generating a document for our schema
//     // This should be done by the user instead

//     const doc = {
//         "document": {
//             "field0":"4/30/2022",
//             "field1":"app details description",
//             "field2":"contact details description",
//             "field3":"lead user details",
//             "type": blockData.schema.type,
//             "@context":[
//                 blockData.schema.contextURL,
//             ]
//         },
//         "ref":null
//     };

//     // const doc = {
//     //     "document": {
//     //             "field0": "4/28/2022",
//     //             "field1": "addr line 1",
//     //             "field2": "addr line 2",
//     //             "field3": "addr line 3",
//     //             "field4": "NG14 8JF",
//     //             "field5": "United Kingdom",
//     //             "field6": "legal status",
//     //             "field7": "UK",
//     //             "field8": "12345678",
//     //             "field9": "78654567",
//     //             "field10": "www.dovu.earth",
//     //             "field11": "meat",
//     //             "field12": "2000",
//     //             "field13": "dfsdsfsdfss",
//     //             "field14": "fsdsfsdfs",
//     //             "field15": "fsdsfsdfs",
//     //             "field16": "fsdsfsdfs",
//     //             "field17": "fsdsfsdfs",
//     //             "field18": "fsdsfsdfs",
//     //             "field19": "fsdsfsdfs",
//     //             "type": blockData.schema.type,
//     //             "@context":[
//     //                 blockData.schema.contextURL,
//     //             ]
//     //         },

//     //     "ref":null
//     // };

//     console.log("accessToken: " + accessToken)
//     console.log("policyId: " + policyId)
//     console.log("blockData.id: " + blockData.id)
//     console.log("type: " + blockData.schema.type)
//     console.log("contextURL: " + blockData.schema.contextURL)
//     console.log('Sending document');

//     await Guardian.policies.sendToBlock(accessToken, policyId, blockData.id, doc);

// }

const requestVcDocument = async (accessToken, policyId, blockData) => {
	const uiMeta = blockData.uiMetaData
	uiMeta.title && console.log(`Title: ${uiMeta.title}`)
	uiMeta.description && console.log(`Description: ${uiMeta.description}`)

	console.log('Fields: ')
	blockData.schema.fields.forEach((field) => {
		console.log(
			`Name: ${field.name} Type: ${field.type} Title: ${field.title} Req: ${field.required}`
		)
	})

	// Generating a document for our schema
	// This should be done by the user instead
	const doc = {
		document: {
			field0: 'A Farm Name',
			field1: 'Pepe Name',
			field2: 100,
			field3: 'Havana Location',
			type: blockData.schema.type,
			'@context': [blockData.schema.contextURL],
		},
		ref: null,
	}

	console.log('Sending document')

	await Guardian.policies.sendToBlock(
		accessToken,
		policyId,
		blockData.id,
		doc
	)
}

const informationBlock = async (accessToken, policyId, blockData) => {
	const uiMeta = blockData.uiMetaData
	uiMeta.title && console.log(`Title: ${uiMeta.title}`)
	uiMeta.description && console.log(`Description: ${uiMeta.description}`)
	return true // stop processing
}

const indexHedera = {
	executeRootBlock: (token, policyId) => executeRootBlock(token, policyId),
}

export default indexHedera
