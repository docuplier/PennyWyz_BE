import model from '../database/models/index.js';
import * as tokenService from './token.service.js';
import getUniqueId from '../utils/getUniqueId.js';
import sendEmail from '../utils/mail.service/index.js';
import { hashPassword, validatePassword } from '../utils/hash.js';
import { EMAIL } from '../config/constants.js';
import {
  ResourceConflictError,
  ResourceNotFoundError,
  ForbiddenError,
} from '../utils/Errors.js';

const { Op } = model.Sequelize;
const parse = (queryParams = {}) => queryParams;

export const createAUser = async (data) => {
  const checkDuplicate = await model.User.findOne({
    where: { email: { [Op.iLike]: data.email } },
  });
  if (checkDuplicate) {
    throw new ResourceConflictError(
      `User, with email: ${data.email}, already exists.`,
    );
  }

  const hashedPassword = await hashPassword(data.password);
  const id = await getUniqueId((i) => model.User.findByPk(i));
  const newUser = await model.User.create({
    ...data,
    password: hashedPassword,
    id,
  });

  sendEmail(EMAIL.EMAIL_VERIFICATION.TYPE, {
    userId: newUser.id,
    email: newUser.email,
  })
    .then(console.log)
    .catch(console.log);

  const accessToken = await tokenService.generateToken(newUser.id);
  return {
    accessToken,
    user: newUser.dataValues,
  };
};

export const loginAUser = async (credentials) => {
  try {
    const savedUser = await model.User.findOne({
      where: { email: { [Op.iLike]: credentials.email } },
    });
    if (!savedUser) throw new ForbiddenError();

    const isValidPassword = await validatePassword(
      credentials.password,
      savedUser.password,
    );
    if (!isValidPassword) throw new ForbiddenError();

    const activeLoginCount = await tokenService.getActiveLoginCount(
      savedUser.id,
    );
    const accessToken = await tokenService.generateToken(savedUser.id);
    return {
      activeLoginCount,
      accessToken,
    };
  } catch (error) {
    if (error instanceof ForbiddenError) {
      throw new ForbiddenError('Invalid login credentials.');
    }
    throw error;
  }
};

export const updateAUser = async (id, updateData) => {
  if (updateData.email) {
    const checkDuplicate = await model.User.findOne({
      where: { email: { [Op.iLike]: updateData.email }, id: { [Op.ne]: id } },
    });
    if (checkDuplicate) {
      throw new ResourceConflictError(
        `User, with email: ${updateData.email}, already exists.`,
      );
    }
  }
  if (updateData.password) {
    // eslint-disable-next-line no-param-reassign
    updateData.password = await hashPassword(updateData.password);
  }

  const result = await model.User.update(updateData, { where: { id } });
  const affectedRecordCount = result[0];
  if (!affectedRecordCount) {
    throw new ResourceNotFoundError('User record not found.');
  }

  return true;
};

export const deleteAUser = async (id) => {
  const isDeleted = await model.User.destroy({ where: { id } });
  if (!isDeleted) throw new ResourceNotFoundError('User record not found.');

  return true;
};

export const getOneUser = async (id) => {
  const savedRecord = await model.User.findByPk(id);
  if (!savedRecord) throw new ResourceNotFoundError('User Record not Found');

  return savedRecord;
};

export const listSelectedUsers = async (query) => {
  const findOption = parse(query);
  return model.User.findAll(findOption);
};

export const logoutAllTokens = async (id) => {
  const res = await tokenService.blackListUserTokens(id);
  return res > 0;
};
