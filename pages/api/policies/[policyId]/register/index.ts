import onlyPost from 'lib/middleware/onlyPost'
import prepare from 'lib/utils/prepare'
import useGuardianContext from 'lib/context/useGuardianContext'
import registerProjectHandler from 'lib/handler/policies/registerProjectHandler'

export default prepare(onlyPost, useGuardianContext)(registerProjectHandler)
