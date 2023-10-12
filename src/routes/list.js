import { Router } from 'express';
import * as listController from '../controllers/list.controller.js';
import validate from '../middlewares/validator/list.js';

const router = Router();

router
  .route('/')
  .get(validate('getAll'), listController.getAll)
  .post(validate('create'), listController.createAList);

router
  .route('/:id')
  .get(validate('checkId'), listController.getOne)
  .put(validate('checkId'), validate('update'), listController.updateAList)
  .delete(validate('checkId'), listController.deleteAList);

export default router;
