import { render } from "@react-email/components";
import nodemailer, { type SendMailOptions } from "nodemailer";
import type { ReactElement } from "react";
import { env } from "~/env";

export const transporter = nodemailer.createTransport({
  host: env.EMAIL_HOST,
  port: Number(env.EMAIL_PORT),
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASSWORD,
  },
});

export const EMAIL_FROM = env.EMAIL_FROM;

export const sendEmail = async (
  options: SendMailOptions,
  template: ReactElement,
) => {
  const emailHtml = await render(template);

  await transporter.sendMail({
    from: EMAIL_FROM,
    to: options.to,
    subject: options.subject,
    html: emailHtml,
  });
};
