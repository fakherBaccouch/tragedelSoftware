const router = require('express').Router();
const filesController = require('../controllers/file.controller');
const{requireAuth,checkUser} =require ('../middleware/auth.middleware')



router.get('/:id', filesController.showFiles);
router.post('/upload',checkUser, filesController.uploadFile);
router.get('/download/:id', filesController.download);
//router.post('/addReceiver', filesController.addReceiver);
//router.delete('/:id', filesController.deleteFiles);
//router.patch('/download-file/:id', filesController.likeFiles);

// commentaires
//router.patch('/comment-file/:id', filesController.commentFile);
//router.patch('/edit-comment-file/:id', filesController.editCommentFile);
//router.patch('/delete-comment-file/:id', filesController.deleteCommentFile);

module.exports = router; 