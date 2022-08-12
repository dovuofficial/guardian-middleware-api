import Joi from 'joi'
import { components } from 'src/spec/openapi'
import { MRV } from 'src/config'

type MeasurementReportingVerification =
	components['schemas']['MeasurementReportingVerification']

const cftSchema = Joi.object<MeasurementReportingVerification>({
	field0: Joi.string().required(),
	field1: Joi.number().required(),
	field2: Joi.string().required(),
	field3: Joi.number().required(),
	field4: Joi.number().required(),
})

const agrecalcSchema = Joi.object<MeasurementReportingVerification>({
	field0: Joi.number().required(),
	field1: Joi.number().required(),
	field2: Joi.number().required(),
	field3: Joi.number().required(),
	field4: Joi.number().required(),
	field5: Joi.number().required(),
	field6: Joi.number().required(),
	field7: Joi.number().required(),
	field8: Joi.number().required(),
	field9: Joi.number().required(),
	field10: Joi.number().required(),
	field11: Joi.number().required(),
	field12: Joi.number().required(),
	field13: Joi.number().required(),
	field14: Joi.number().required(),
})

const getSchemaFromPath = (mrvType: string) => {
	if (mrvType.toLowerCase() === MRV.AGRECALC.toLowerCase()) {
		return agrecalcSchema
	}

	if (mrvType.toLowerCase() === MRV.COOL_FARM_TOOL.toLowerCase()) {
		return cftSchema
	}

	return false
}

export default (
	mrvType: string,
	candidate: MeasurementReportingVerification
): Array<string> | void => {
	const schema = getSchemaFromPath(mrvType)

	if (!schema) {
		return [
			`The policy can only process MRV types of "${MRV.AGRECALC}" or "${MRV.COOL_FARM_TOOL}" please update your request.`,
		]
	}

	const validation = schema.validate(candidate || {}, { abortEarly: false })

	if (validation.error) {
		return validation.error.details.map((error) => error.message)
	}

	return null
}
