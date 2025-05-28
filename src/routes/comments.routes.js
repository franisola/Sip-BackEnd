import express from 'express';
import { createComment, deleteComment, getComments, getComment, getLastComments } from '../controllers/comment.controller.js';


import { authRequired } from '../middlewares/validateToken.js';
import { validateSchema } from '../middlewares/validator.middleware.js';
import { commentSchema } from '../schemas/comment.schema.js';

const router = express.Router();

router.post('/services/:id_service/comments', validateSchema(commentSchema), createComment);
router.get('/services/:id_service/comments', authRequired, getComments);
router.get('/comments/:id', authRequired, getComment);
router.delete('/comments/:id', authRequired, deleteComment);

router.get('/pet-sitter-comments', authRequired, getLastComments);


//router.post('/services/:id_service/comments', createComment);


export default router;