import { Router } from 'express';
import * as listController from '../controllers/list.controller.js';
import validate from '../middlewares/validator/list.js';
import authenticate from '../middlewares/auth/authenticate.js';

const router = Router();

router
  .route('/')
  .get(validate('getAll'), authenticate, listController.getAll)
  .post(validate('create'), authenticate, listController.createAList);

router
  .route('/:id')
  .get(validate('checkId'), listController.getOne)
  .put(
    validate('checkId'),
    authenticate,
    validate('update'),
    listController.updateAList,
  )
  .delete(validate('checkId'), authenticate, listController.deleteAList);

router.post(
  '/:id/send',
  authenticate,
  validate('checkId'),
  validate('sendOne'),
  listController.sendOne,
);

export default router;
