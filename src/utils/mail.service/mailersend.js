import { MailerSend, EmailParams, Sender, Recipient } from 'mailersend';
import { MAILERSEND } from '../../config/constants.js';

/**
 *
 * @param {{
 *  subject: string,
 *  sender: {name:string, email:string},
 *  recipients: {email:string, data: object}[],
 *  tags: {string[]}
 *  templateId:string,
 * }} template - html body
 * @returns
 */
export default async (template, isBulk = false) => {
  const mailerSend = new MailerSend({
    apiKey: MAILERSEND.API_KEY,
  });

  const sentFrom = new Sender(template.sender.email, template.sender.name);

  if (isBulk) {
    const recipients = template.recipients.map((x) =>
      new EmailParams()
        .setFrom(sentFrom)
        .setReplyTo(sentFrom)
        .setTo([new Recipient(x.email)])
        .setPersonalization([x])
        .setSubject(template.subject)
        .setTemplateId(template.templateId)
        .setTags(template.tags),
    );

    return mailerSend.email.sendBulk(recipients);
  }

  const recipients = template.recipients.map((x) => new Recipient(x.email));
  const emailParams = new EmailParams()
    .setFrom(sentFrom)
    .setReplyTo(sentFrom)
    .setTo(recipients)
    .setPersonalization(template.recipients)
    .setSubject(template.subject)
    .setTags(template.tags)
    .setTemplateId(template.templateId);

  return mailerSend.email.send(emailParams);
};
