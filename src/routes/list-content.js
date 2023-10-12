import { Router } from 'express';
import * as listContentController from '../controllers/list-content.controller.js';
import validate from '../middlewares/validator/list-content.js';

const router = Router();

router
  .route('/')
  .get(validate('getAll'), listContentController.getAll)
  .post(validate('create'), listContentController.createAListContent);

router
  .route('/:id')
  .get(validate('checkId'), listContentController.getOne)
  .put(
    validate('checkId'),
    validate('update'),
    listContentController.updateAListContent,
  )
  .delete(validate('checkId'), listContentController.deleteAListContent);

export default router;
