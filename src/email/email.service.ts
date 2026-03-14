import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { envs } from '../config/envs';

@Injectable()
export class EmailService {
  private transporter = nodemailer.createTransport({
    service: envs.MAILER_SERVICE,
    auth: {
      user: envs.MAILER_EMAIL,
      pass: envs.MAILER_PASSWORD,
    },
  });

  async sendEmail(to: string, subject: string, html: string) {
    return await this.transporter.sendMail({
      from: envs.MAILER_EMAIL,
      to,
      subject,
      html,
    });
  }
}