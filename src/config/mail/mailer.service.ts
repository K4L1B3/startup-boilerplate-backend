import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Inject, LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { join } from 'path';

@Injectable()
export class EmailMailerService {
  constructor(
    private readonly mailerService: MailerService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  async sendEmail(
    to: string,
    subject: string,
    template: string,
    context?: object,
  ): Promise<void> {
    const templatePath = join(__dirname, template);
    this.logger.log(`Sending email to ${to} using template ${templatePath}`);
    try {
      await this.mailerService.sendMail({
        to,
        subject,
        template: templatePath,
        context,
      });
      this.logger.log(`Email sent to ${to} with subject: ${subject}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}: ${error.message}`);
    }
  }

  async sendWelcomeEmail(to: string) {
    const subject = 'PandoraChat: Bem vindo ao PandoraChat';
    const template = '../../../assets/Templates/WelcomeEmail.html';

    this.logger.log(`Sending welcome email to ${to}`);
    await this.sendEmail(to, subject, template);
  }

  async sendVerifyEmail(to: string, code: string) {
    const subject = 'PandoraChat: Verifique o seu e-mail';
    const template = '../../../assets/Templates/VerifyEmail.html';
    const context = { code };

    this.logger.log(`Sending verification email to ${to} with code: ${code}`);
    await this.sendEmail(to, subject, template, context);
  }
}
