/* eslint-disable no-prototype-builtins */
import model from '../database/models/index.js';
import { ResourceConflictError, ResourceNotFoundError } from '../utils/Errors.js';

const parse = (queryParams = {}) => {
  const filter = {
    where: { listId: queryParams.listId },
    include: [model.Product],
  };

  return filter;
};

export const create = async (data) => {
  const checkDuplicate = await model.ListContent.findOne({
    where: { productId: data.productId, listId: data.listId },
  });
  if (checkDuplicate) {
    throw new ResourceConflictError('There is a duplicate product item.');
  }

  return model.ListContent.create(data);
};

export const update = async (id, data) => {
  const d = {};
  if (data.hasOwnProperty('quantity')) d.quantity = data.quantity;
  if (data.hasOwnProperty('checked')) d.checked = data.checked;

  const result = await model.ListContent.update(d, { where: { id } });
  const affectedRecordCount = result[0];
  if (!affectedRecordCount) {
    throw new ResourceNotFoundError('List Content record not found.');
  }

  return true;
};

export const deleteAListContent = async (id) => {
  const isDeleted = await model.ListContent.destroy({ where: { id } });
  if (!isDeleted) {
    throw new ResourceNotFoundError('List Content record not found.');
  }

  return true;
};

export const getOne = async (id) => {
  const savedRecord = await model.ListContent.findByPk(id, {
    include: [model.Product],
  });
  if (!savedRecord) {
    throw new ResourceNotFoundError('List Content record not found.');
  }

  return savedRecord;
};

export const listSelectedProducts = async (query) => {
  const findOption = parse(query);
  return model.ListContent.findAll(findOption);
};
