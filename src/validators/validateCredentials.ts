import Joi from 'joi'
import { components } from 'src/spec/openapi'

type Credentials = components['schemas']['Credentials']

const schema = Joi.object<Credentials>({
	username: Joi.string().required(),
	password: Joi.string().required(),
})

export default (candidate: Credentials): Array<string> | void => {
	const validation = schema.validate(candidate || {}, { abortEarly: false })

	if (validation.error) {
		return validation.error.details.map((error) => error.message)
	}

	return null
}
