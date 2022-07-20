import { withSwagger } from 'next-swagger-doc'
import Config from '@app/config'

const swaggerHandler = withSwagger({
	definition: Config.openApiDefinition,
	apiFolder: 'pages/api',
})
export default swaggerHandler()
