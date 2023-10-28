import { MAILERSEND, EMAIL, FRONTEND } from '../../config/constants.js';
import sendMail from './mailersend.js';

const validate = (mailType, data) => {
  const typeDataFields = {
    [EMAIL.EMAIL_VERIFICATION.TYPE]: ['userId', 'email'],
    [EMAIL.LIST_SHARING.TYPE]: ['name', 'listId', 'emails'],
  };
  if (!typeDataFields[mailType]) {
    throw new Error(`Invalid mailType: got ${mailType}.`);
  }
  const absentFields = typeDataFields[mailType].filter((x) => !data[x]);
  if (absentFields.length > 0) {
    throw new Error(
      `Some fields are missing for this mail type: ${mailType}. Missing "${absentFields.join(
        ', ',
      )}"`,
    );
  }
};

const getEmailTemplate = (mailType, data) => {
  const mailTemplatesByType = {
    [EMAIL.EMAIL_VERIFICATION.TYPE]: () => ({
      templateId: MAILERSEND.TEMPLATE_ID.EMAIL_VERIFICATION,
      subject: data.subject || EMAIL.EMAIL_VERIFICATION.SUBJECT,
      sender: {
        email: EMAIL.MAILER.SENDER.EMAIL,
        name: EMAIL.MAILER.SENDER.NAME,
      },
      recipients: [
        {
          email: data.email,
          data: {
            verify_url: `${FRONTEND.BASE_URL}${FRONTEND.VERIFY_USER.replace(
              ':userId',
              data.userId,
            )}`,
          },
        },
      ],
    }),

    [EMAIL.LIST_SHARING.TYPE]: () => ({
      templateId: MAILERSEND.TEMPLATE_ID.LIST_SHARING,
      subject: data.subject || EMAIL.LIST_SHARING.SUBJECT,
      sender: {
        email: EMAIL.MAILER.SENDER.EMAIL,
        name: EMAIL.MAILER.SENDER.NAME,
      },
      recipients: data.emails.map((email) => ({
        email,
        data: {
          list_url: `${FRONTEND.BASE_URL}${FRONTEND.LIST_ONE.replace(
            ':listId',
            data.listId,
          )}`,
          list_title: data.name,
        },
      })),
    }),
  };

  return mailTemplatesByType[mailType]();
};

export default (mailType, data) => {
  validate(mailType, data);
  const template = getEmailTemplate(mailType, data);
  const isBulk = template.recipients.length > 1;

  template.tags = data.tags || [mailType];
  return sendMail(template, isBulk);
};
