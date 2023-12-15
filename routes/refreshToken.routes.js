const { Router } = require('express')
const controller = require('../controllers/refreshToken.controller')

const router = Router()

router.post('/', controller.post)

module.exports = router
