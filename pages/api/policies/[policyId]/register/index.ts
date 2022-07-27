import onlyPost from 'src/middleware/onlyPost'
import prepare from 'src/utils/prepare'
import useGuardianContext from 'src/context/useGuardianContext'
import registerProjectHandler from 'src/handler/policies/registerProjectHandler'

export default prepare(onlyPost, useGuardianContext)(registerProjectHandler)
