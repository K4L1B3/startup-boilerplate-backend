import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { join } from 'path';

@Injectable()
export class EmailMailerService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmail(
    to: string,
    subject: string,
    template: string,
    context?: object,
  ): Promise<void> {
    const templatePath = join(__dirname, template);
    console.log(`Sending email to ${to} using template ${templatePath}`);
    await this.mailerService.sendMail({
      to,
      subject,
      template: templatePath,
      context,
    });
  }

  async sendWelcomeEmail(to: string) {
    const subject = 'PandoraChat: Bem vindo ao PandoraChat';
    const template = '../../../assets/Templates/WelcomeEmail.html';

    await this.sendEmail(to, subject, template);
  }

  async sendVerifyEmail(to: string, code: string) {
    const subject = 'PandoraChat: Verifique o seu e-mail';
    const template = '../../../assets/Templates/VerifyEmail.html';
    const context = { code };

    await this.sendEmail(to, subject, template, context);
  }
}
