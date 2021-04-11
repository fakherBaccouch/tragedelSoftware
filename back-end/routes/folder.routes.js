const router = require('express').Router();
const folderController = require('../controllers/folder.controller');
const{requireAuth,checkUser} =require ('../middleware/auth.middleware')

router.get('/', folderController.readFolder);
router.post('/',checkUser, folderController.createFolder);
router.get('/:id',checkUser, folderController.readOneFolder);

module.exports = router;