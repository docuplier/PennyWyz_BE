import * as productService from '../services/product.service.js';

export const createAProduct = async (req, res, next) => {
  try {
    const result = await productService.createAProduct(req.body, req.user.id);
    return res.status(201).json({
      status: 'success',
      message: 'Product record created successfully.',
      data: result,
    });
  } catch (error) {
    return next(error);
  }
};

export const createProducts = async (req, res, next) => {
  try {
    const result = await productService.createProducts(req.body);
    return res.status(201).json({
      status: 'success',
      message: 'Product records created successfully.',
      data: result,
    });
  } catch (error) {
    return next(error);
  }
};

export const updateAProduct = async (req, res, next) => {
  try {
    const result = await productService.updateAProduct(req.params.id, req.body, req.user.id);
    return res.status(200).json({
      status: 'success',
      message: 'Product record updated successfully.',
      data: result,
    });
  } catch (error) {
    return next(error);
  }
};

export const deleteAProduct = async (req, res, next) => {
  try {
    await productService.deleteAProduct(req.params.id, req.user.id);
    return res.status(200).json({
      status: 'success',
      message: 'Product record deleted successfully.',
    });
  } catch (error) {
    return next(error);
  }
};

export const listSelectedProducts = async (req, res, next) => {
  try {
    const data = await productService.listSelectedProducts(req.query);

    return res.status(200).json({
      status: 'success',
      message: 'Product list.',
      data,
    });
  } catch (error) {
    return next(error);
  }
};

export const getOne = async (req, res, next) => {
  try {
    const data = await productService.getOneProduct(req.params.id, req.user.id);

    return res.status(200).json({
      status: 'success',
      message: 'Product details.',
      data,
    });
  } catch (error) {
    return next(error);
  }
};
