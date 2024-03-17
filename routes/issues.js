const router = require('express').Router()
const issuesController = require('../controllers/issues')
const { verifyIssueId, verifySpecialityId } = require('../middlewares/verify-routes-params')
const authorization = require('../middlewares/verify-permission')

router.post(
    '/v1/issues', 
    authorization.allPermission,
    (request, response) => issuesController.addIssue(request, response)
)

router.get(
    '/v1/issues', 
    (request, response) => issuesController.getIssues(request, response)
)

router.get(
    '/v1/issues/specialities/:specialityId', 
    authorization.allPermission,
    verifySpecialityId,
    (request, response) => issuesController.getIssuesBySpecialityId(request, response)
)

router.put(
    '/v1/issues/:issueId', 
    authorization.allPermission,
    verifyIssueId,
    (request, response) => issuesController.updateIssue(request, response)
)

router.delete(
    '/v1/issues/:issueId', 
    authorization.allPermission,
    verifyIssueId,
    (request, response) => issuesController.deleteIssue(request, response)
)


module.exports = router