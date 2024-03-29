import Joi from 'joi'
import { MRV } from 'src/config/guardianTags'
import { components } from 'src/spec/openapi'

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
})

// Regular expression for a positive integer ending in 3 0s
const positiveIntegerDivisibleByThousandRegex = /^([1-9]\d*)(000)$/

const generalSupplyDocumentationSchema =
	Joi.object<MeasurementReportingVerification>({
		field0: Joi.string().required(),
		field1: Joi.string().required(),
		field2: Joi.string().required(),
		field3: Joi.string()
			.regex(positiveIntegerDivisibleByThousandRegex)
			.required()
			.messages({
				'string.pattern.base':
					'Must be a string representing a positive integer divisible by 1,000',
			}),
		field4: Joi.string().required(),
	})

// Regex for a positive integer divisible by 1,000

const getSchemaFromPath = (mrvType: string) => {
	if (mrvType.toLowerCase() === MRV.AGRECALC.toLowerCase()) {
		return agrecalcSchema
	}

	if (mrvType.toLowerCase() === MRV.COOL_FARM_TOOL.toLowerCase()) {
		return cftSchema
	}

	if (
		mrvType.toLowerCase() === MRV.GENERAL_SUPPLY_DOCUMENTATION.toLowerCase()
	) {
		return generalSupplyDocumentationSchema
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
			`The policy can only process MRV types of "${MRV.AGRECALC}", "${MRV.COOL_FARM_TOOL}" or "${MRV.GENERAL_SUPPLY_DOCUMENTATION}". Please update your request.`,
		]
	}

	const validation = schema.validate(candidate || {}, { abortEarly: false })

	if (validation.error) {
		return validation.error.details.map((error) => error.message)
	}

	return null
}
