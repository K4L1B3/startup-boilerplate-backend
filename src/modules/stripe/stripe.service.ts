import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import Stripe from 'stripe';
import { Repository } from 'typeorm';
import { User, UserPlan } from '../user/entity/user.entity'; // Ajuste para seu caminho correto
import { EmailMailerService } from 'src/config/mail/mailer.service';
import * as winston from 'winston';

@Injectable()
export class StripeService {
  public stripe: Stripe;

  constructor(
    private configService: ConfigService,
    private readonly mailerService: EmailMailerService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @Inject('winston') 
private readonly logger: winston.Logger,
  ) {
    this.stripe = new Stripe(
      this.configService.get<string>('STRIPE_SECRET_KEY'),
      {
        apiVersion: '2024-06-20',
      },
    );
  }

  async createCustomer(email: string, name: string) {
    this.logger.info(`Creating customer for email: ${email}`);
    const customer = await this.stripe.customers.create({
      email,
      name,
    });

    return customer;
  }

  async createCheckoutSession(
    customerId: string,
    priceId: string,
    paymentMethodTypes: 'card'[],
  ) {
    this.logger.info(`Creating checkout session for customer: ${customerId}`);
    const session = await this.stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: paymentMethodTypes,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: 'http://localhost:3000/success',
      cancel_url: 'http://localhost:3000/cancel',
    });

    return session;
  }

  async assignCustomerIdToUser(userId: number, customerId: string) {
    this.logger.info(`Assigning Stripe customer ID to user: ${userId}`);
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      this.logger.error(`User with ID ${userId} not found`);
      throw new Error('User not found');
    }

    user.stripeCustomerId = customerId;
    await this.usersRepository.save(user);
  }

  async handleWebhook(signature: string, payload: Buffer) {
    let event;
    const webhookSecret = this.configService.get<string>(
      'STRIPE_WEBHOOK_SECRET_KEY',
    );

    try {
      event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        webhookSecret,
      );
      this.logger.info(`Webhook event received: ${event.type}`);
    } catch (err) {
      this.logger.error(
        `Webhook signature verification failed: ${err.message}`,
      );
      throw new Error(`Webhook signature verification failed: ${err.message}`);
    }

    switch (event.type) {
      case 'customer.created':
        await this.handleCustomerCreated(event.data.object as Stripe.Customer);
        this.logger.info('Customer created');
        break;
      case 'checkout.session.completed':
        await this.handleCheckoutSessionCompleted(
          event.data.object as Stripe.Checkout.Session,
        );
        this.logger.info('Checkout session completed');
        break;
      case 'payment_intent.succeeded':
        await this.handlePaymentIntentSucceeded(
          event.data.object as Stripe.PaymentIntent,
        );
        this.logger.info('Payment intent succeeded');
        break;
      case 'customer.subscription.updated':
        await this.handleSubscriptionUpdated(
          event.data.object as Stripe.Subscription,
        );
        this.logger.info('Subscription updated');
        break;
      case 'customer.subscription.deleted':
        await this.handleCustomerSubscriptionDeleted(
          event.data.object as Stripe.Subscription,
        );
        this.logger.info('Subscription deleted');
        break;
      default:
        this.logger.warn(`Unhandled event type ${event.type}`);
    }

    return event;
  }

  async handleCustomerCreated(customer: Stripe.Customer) {
    const customerId = customer.id;
    this.logger.info(`Handling customer created for ID: ${customerId}`);
    const user = await this.usersRepository.findOne({
      where: { stripeCustomerId: customerId },
    });

    if (user) {
      user.subscriptionStatus = 'pending';
      await this.usersRepository.save(user);
    }
  }

  async handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
    const customerId = session.customer as string;
    this.logger.info(
      `Handling checkout session completed for customer ID: ${customerId}`,
    );
    const user = await this.usersRepository.findOne({
      where: { stripeCustomerId: customerId },
    });

    this.mailerService.sendWelcomeEmail(user.email);

    if (user) {
      user.subscriptionStatus = 'active';
      await this.usersRepository.save(user);
    }
  }

  async handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
    const customerId = paymentIntent.customer as string;
    this.logger.info(
      `Handling payment intent succeeded for customer ID: ${customerId}`,
    );
    const user = await this.usersRepository.findOne({
      where: { stripeCustomerId: customerId },
    });

    this.mailerService.sendWelcomeEmail(user.email);

    if (user) {
      user.subscriptionStatus = 'active';
      await this.usersRepository.save(user);
    }
  }

  async handleSubscriptionUpdated(subscription: Stripe.Subscription) {
    const customerId = subscription.customer as string;
    this.logger.info(
      `Handling subscription updated for customer ID: ${customerId}`,
    );
    const user = await this.usersRepository.findOne({
      where: { stripeCustomerId: customerId },
    });

    if (user) {
      const planId = subscription.items.data[0].plan.id;

      switch (planId) {
        case 'price_1PgDQ4RsfIl9COKnX0NmyBQP':
          user.plan = UserPlan.Basic;
          break;
        case 'price_1PgDQPRsfIl9COKn7yqjuIB4':
          user.plan = UserPlan.Premium;
          break;
        case 'price_1PgDQkRsfIl9COKn5bElCidh':
          user.plan = UserPlan.Year;
          break;
        default:
          user.plan = UserPlan.Basic;
      }

      await this.usersRepository.save(user);
    }
  }

  async handleCustomerSubscriptionDeleted(subscription: Stripe.Subscription) {
    const customerId = subscription.customer as string;
    this.logger.info(
      `Handling subscription deleted for customer ID: ${customerId}`,
    );
    const user = await this.usersRepository.findOne({
      where: { stripeCustomerId: customerId },
    });

    if (user) {
      user.subscriptionStatus = 'inactive';
      await this.usersRepository.save(user);
    }
  }

  async deleteCustomer(customerId: string) {
    this.logger.info(`Deleting customer with ID: ${customerId}`);
    await this.stripe.customers.del(customerId);
  }
}
