import * as listContentService from '../services/list-content.service.js';

export const createAListContent = async (req, res, next) => {
  try {
    const result = await listContentService.create(req.body);
    return res.status(201).json({
      status: 'success',
      message: 'List Content record created successfully.',
      data: result,
    });
  } catch (error) {
    return next(error);
  }
};

export const updateAListContent = async (req, res, next) => {
  try {
    const result = await listContentService.update(req.params.id, req.body);
    return res.status(200).json({
      status: 'success',
      message: 'List Content record updated successfully.',
      data: result,
    });
  } catch (error) {
    return next(error);
  }
};

export const deleteAListContent = async (req, res, next) => {
  try {
    await listContentService.deleteAListContent(req.params.id);
    return res.status(200).json({
      status: 'success',
      message: 'List Content record deleted successfully.',
    });
  } catch (error) {
    return next(error);
  }
};

export const getAll = async (req, res, next) => {
  try {
    const data = await listContentService.listSelectedProducts(req.query);

    return res.status(200).json({
      status: 'success',
      message: 'List Content record list.',
      data,
    });
  } catch (error) {
    return next(error);
  }
};

export const getOne = async (req, res, next) => {
  try {
    const data = await listContentService.getOne(req.params.id);

    return res.status(200).json({
      status: 'success',
      message: 'List Content details.',
      data,
    });
  } catch (error) {
    return next(error);
  }
};
