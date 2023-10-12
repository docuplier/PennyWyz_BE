import bcrypt from 'bcryptjs';

export const hashPassword = async (password) => {
  const randomNumber = Math.floor(Math.random() * 10) + 1;
  const salt = await bcrypt.genSalt(randomNumber);
  const hashedPassword = await bcrypt.hash(password, salt);

  return hashedPassword;
};

export const validatePassword = (incomingPassword, hashedPassword) => {
  return bcrypt.compare(incomingPassword, hashedPassword);
};
