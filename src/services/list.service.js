import model from '../database/models/index.js';
import getUniqueId from '../utils/getUniqueId.js';
import sendEmail from '../utils/mail.service/index.js';
import {
  ResourceConflictError,
  ResourceNotFoundError,
} from '../utils/Errors.js';
import { EMAIL } from '../config/constants.js';

const { Op } = model.Sequelize;

const parse = (userId, queryParams = {}) => {
  const { limit = 10, page = 1 } = queryParams;
  const filter = {
    where: { userId },
    limit,
    include: [{ model: model.ListContent, include: [model.Product] }],
    offset: (page - 1) * limit,
  };

  if (queryParams.search) {
    filter.where.name = {
      [Op.iLike]: `%${queryParams.search}%`,
    };
  }

  return filter;
};

export const create = async (data, userId) => {
  const checkDuplicate = await model.List.findOne({
    where: { name: { [Op.iLike]: data.name }, userId },
  });
  if (checkDuplicate) {
    throw new ResourceConflictError(
      `List, with name: ${data.name}, already exists.`,
    );
  }

  const id = await getUniqueId((i) => model.User.findByPk(i));
  return model.List.create({ ...data, userId, id });
};

export const update = async (id, updateData, userId) => {
  if (updateData.name) {
    const checkDuplicate = await model.List.findOne({
      where: {
        name: { [Op.iLike]: updateData.name },
        userId,
        id: { [Op.ne]: id },
      },
    });
    if (checkDuplicate) {
      throw new ResourceConflictError(
        `List, with name: ${updateData.name}, already exists.`,
      );
    }
  }

  const result = await model.List.update(updateData, { where: { id, userId } });
  const affectedRecordCount = result[0];
  if (!affectedRecordCount) {
    throw new ResourceNotFoundError('List record not found.');
  }

  return true;
};

export const deleteAList = async (id, userId) => {
  const isDeleted = await model.List.destroy({ where: { id, userId } });
  if (!isDeleted) throw new ResourceNotFoundError('List record not found.');

  return true;
};

export const getOne = async (id) => {
  const savedRecord = await model.List.findByPk(id, {
    include: [
      { model: model.ListContent, include: [model.Product] },
      {
        model: model.User,
        attributes: ['id', 'email', 'lastName', 'firstName'],
      },
    ],
  });
  if (!savedRecord) throw new ResourceNotFoundError('List record not found.');

  return savedRecord;
};

export const sendOne = async (id, data) => {
  const savedRecord = await model.List.findByPk(id);
  if (!savedRecord) throw new ResourceNotFoundError('List record not found.');

  sendEmail(EMAIL.LIST_SHARING.TYPE, {
    emails: data.emails,
    listId: savedRecord.id,
    name: savedRecord.name,
  }).then(console.log);

  return true;
};

export const getAll = async (query, userId) => {
  const findOption = parse(userId, query);
  const all = await model.List.findAll(findOption);

  return all.map((l) => {
    const price = l.ListContents.reduce(
      (acc, lc) => ({
        lowerRange:
          acc.lowerRange + lc.Product.priceData.lowerRange * lc.quantity,
        upperRange:
          acc.upperRange + lc.Product.priceData.upperRange * lc.quantity,
      }),
      { lowerRange: 0, upperRange: 0 },
    );
    return {
      id: l.id,
      name: l.name,
      country: l.country,
      price,
      itemsCount: l.ListContents.length,
      createdAt: l.createdAt,
      updatedAt: l.updatedAt,
    };
  });
};
