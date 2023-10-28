import * as listService from '../services/list.service.js';

export const createAList = async (req, res, next) => {
  try {
    const result = await listService.create(req.body, req.user.id);
    return res.status(201).json({
      status: 'success',
      message: 'List record created successfully.',
      data: result,
    });
  } catch (error) {
    return next(error);
  }
};

export const updateAList = async (req, res, next) => {
  try {
    const result = await listService.update(
      req.params.id,
      req.body,
      req.user.id,
    );
    return res.status(200).json({
      status: 'success',
      message: 'List record updated successfully.',
      data: result,
    });
  } catch (error) {
    return next(error);
  }
};

export const deleteAList = async (req, res, next) => {
  try {
    await listService.deleteAList(req.params.id, req.user.id);
    return res.status(200).json({
      status: 'success',
      message: 'List record deleted successfully.',
    });
  } catch (error) {
    return next(error);
  }
};

export const getAll = async (req, res, next) => {
  try {
    const data = await listService.getAll(req.query, req.user.id);

    return res.status(200).json({
      status: 'success',
      message: 'List record list.',
      data,
    });
  } catch (error) {
    return next(error);
  }
};

export const getOne = async (req, res, next) => {
  try {
    const data = await listService.getOne(req.params.id);

    return res.status(200).json({
      status: 'success',
      message: 'List details.',
      data,
    });
  } catch (error) {
    return next(error);
  }
};

export const sendOne = async (req, res, next) => {
  try {
    await listService.sendOne(req.params.id, req.body);

    return res.status(200).json({
      status: 'success',
      message: 'Email notification sent.',
    });
  } catch (error) {
    return next(error);
  }
};
