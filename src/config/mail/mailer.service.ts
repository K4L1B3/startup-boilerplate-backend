import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Inject, LoggerService } from '@nestjs/common';
import * as winston from 'winston';
import { join } from 'path';

@Injectable()
export class EmailMailerService {
  constructor(
    private readonly mailerService: MailerService,
    @Inject('winston')
    private readonly logger: winston.Logger,
  ) {}

  async sendEmail(
    to: string,
    subject: string,
    template: string,
    context?: object,
  ): Promise<void> {
    const templatePath = join(__dirname, template);
    this.logger.info(`Sending email to ${to} using template ${templatePath}`);
    try {
      await this.mailerService.sendMail({
        to,
        subject,
        template: templatePath,
        context,
      });
      this.logger.info(`Email sent to ${to} with subject: ${subject}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}: ${error.message}`);
    }
  }

  async sendWelcomeEmail(to: string) {
    const subject = 'PandoraChat: Bem vindo ao PandoraChat';
    const template = '../../../assets/Templates/WelcomeEmail.html';

    this.logger.info(`Sending welcome email to ${to}`);
    await this.sendEmail(to, subject, template);
  }

  async sendVerifyEmail(to: string, code: string) {
    const subject = 'PandoraChat: Verifique o seu e-mail';
    const template = '../../../assets/Templates/VerifyEmail.html';
    const context = { code };

    this.logger.info(`Sending verification email to ${to} with code: ${code}`);
    await this.sendEmail(to, subject, template, context);
  }
}
