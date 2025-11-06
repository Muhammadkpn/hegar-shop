const router = require('express').Router();

// import controllers
const { subscribeController } = require('../../controllers');

router.get('/', subscribeController.getEmailSubscribe);
router.post('/', subscribeController.addEmailSubscribe);
router.patch('/:id', subscribeController.editEmailSubscribe);
router.delete('/:id', subscribeController.deleteEmailSubscribe);

module.exports = router;
