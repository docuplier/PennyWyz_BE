import { FRONTEND } from '../config/constants.js';
import * as userService from '../services/user.service.js';
import { getLoginUrl } from '../utils/socialLogins/google.js';

export const registerAUser = async (req, res, next) => {
  try {
    const result = await userService.createAUser(req.body);
    return res.status(201).json({
      status: 'success',
      message: 'User record created successfully.',
      data: result,
    });
  } catch (error) {
    return next(error);
  }
};

export const loginAUser = async (req, res, next) => {
  try {
    const result = await userService.loginAUser(req.body);
    const message = result.activeLoginCount
      ? 'There is already an active session using your account.'
      : 'User logged in successfully.';

    return res.status(200).json({
      status: 'success',
      message,
      data: result,
    });
  } catch (error) {
    return next(error);
  }
};

export const updateUserProfile = async (req, res, next) => {
  try {
    const result = await userService.updateAUser(req.user.id, req.body);
    return res.status(200).json({
      status: 'success',
      message: 'User record updated successfully.',
      data: result,
    });
  } catch (error) {
    return next(error);
  }
};

export const verifyUser = async (req, res, next) => {
  try {
    const result = await userService.updateAUser(req.params.id, {
      isVerified: true,
    });

    return res.status(200).json({
      status: 'success',
      message: 'User verified successfully.',
      data: result,
    });
  } catch (error) {
    return next(error);
  }
};

export const deleteUserProfile = async (req, res, next) => {
  try {
    await userService.deleteAUser(req.user.id);
    return res.status(200).json({
      status: 'success',
      message: 'User record deleted successfully.',
    });
  } catch (error) {
    return next(error);
  }
};

export const listSelectedUsers = async (req, res, next) => {
  try {
    const data = await userService.listSelectedUsers(req.query);

    return res.status(200).json({
      status: 'success',
      message: 'User list.',
      data,
    });
  } catch (error) {
    return next(error);
  }
};

export const getOne = async (req, res, next) => {
  try {
    const id = req.params.id || req.user.id;
    const isUserProfile = req.params.id === req.user.id;
    const data = await userService.getOneUser(id, isUserProfile);

    return res.status(200).json({
      status: 'success',
      message: 'User details.',
      data,
    });
  } catch (error) {
    return next(error);
  }
};

export const logoutAllTokens = async (req, res, next) => {
  try {
    await userService.logoutAllTokens(req.user.id);
    return res.status(200).json({
      status: 'success',
      message: 'All tokens logged out successfully successfully.',
    });
  } catch (error) {
    return next(error);
  }
};

export const socialAuth = async (req, res, next) => {
  try {
    return res.redirect(getLoginUrl());
  } catch (error) {
    return next(error);
  }
};

export const socialAuthWebhook = async (req, res, next) => {
  try {
    const socialAuthCode = await userService.socialAuth(req.query.code);

    return res.redirect(
      `${FRONTEND.BASE_URL}${FRONTEND.SOCIAL_AUTH}?provider=${req.params.provider}&code=${socialAuthCode}`,
    );
  } catch (error) {
    return next(error);
  }
};
