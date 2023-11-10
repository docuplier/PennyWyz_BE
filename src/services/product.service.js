import model from '../database/models/index.js';
import {
  ResourceConflictError,
  ResourceNotFoundError,
} from '../utils/Errors.js';

const { Op } = model.Sequelize;

const parse = (queryParams = {}) => {
  const { limit = 10, page = 1, country } = queryParams;
  const filter = { where: { country }, limit, offset: (page - 1) * limit };

  if (queryParams.search) {
    filter.where.name = {
      [Op.iLike]: `%${queryParams.search}%`,
    };
  }

  return filter;
};

export const createAProduct = async (data) => {
  const checkDuplicate = await model.Product.findOne({
    where: { name: { [Op.iLike]: data.name }, country: data.country },
  });
  if (checkDuplicate) {
    throw new ResourceConflictError(
      `Product, with productName: ${data.name}, already exists.`,
    );
  }

  const newProduct = await model.Product.create(data);

  return newProduct;
};

export const createProducts = async (data) => {
  if (!data.category) return false;
  const [savedCategory, _] = await model.Category.findOrCreate({
    where: { name: data.category },
    defaults: { name: data.category },
  });

  await model.Product.bulkCreate(
    data.products.map((x) => ({ ...x, categoryId: savedCategory.id })),
  );

  return true;
};

export const updateAProduct = async (id, updateData) => {
  if (updateData.name) {
    const checkDuplicate = await model.Product.findOne({
      where: {
        name: { [Op.iLike]: updateData.name },
        id: { [Op.ne]: id },
      },
    });
    if (checkDuplicate) {
      throw new ResourceConflictError(
        `Product, with productName: ${updateData.nName}, already exists.`,
      );
    }
  }

  const result = await model.Product.update(updateData, { where: { id } });
  const affectedRecordCount = result[0];
  if (!affectedRecordCount) {
    throw new ResourceNotFoundError('Product record not found.');
  }

  return true;
};

export const deleteAProduct = async (id) => {
  const isDeleted = await model.Product.destroy({ where: { id } });
  if (!isDeleted) throw new ResourceNotFoundError('Product record not found.');

  return true;
};

export const getOneProduct = async (id) => {
  const savedRecord = await model.Product.findByPk(id);
  if (!savedRecord)
    throw new ResourceNotFoundError('Product record not found.');

  return savedRecord;
};

export const listSelectedProducts = async (query) => {
  const findOption = parse(query);
  const productList = await model.Product.findAll(findOption);

  return productList;
};
