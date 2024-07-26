import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import Stripe from 'stripe';
import { Repository } from 'typeorm';
import { User } from '../user/entity/user.entity'; // Ajuste para seu caminho correto

@Injectable()
export class StripeService {
  public stripe: Stripe;

  constructor(
    private configService: ConfigService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {
    this.stripe = new Stripe(
      this.configService.get<string>('STRIPE_SECRET_KEY'),
      {
        apiVersion: '2024-06-20',
      },
    );
  }

  async createCustomer(email: string, name: string) {
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
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
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
    } catch (err) {
      throw new Error(`Webhook signature verification failed: ${err.message}`);
    }

    switch (event.type) {
      case 'checkout.session.completed':
        await this.handleCheckoutSessionCompleted(
          event.data.object as Stripe.Checkout.Session,
        );
        console.log('Payment received!');
        break;
      case 'customer.subscription.deleted':
        await this.handleCustomerSubscriptionDeleted(
          event.data.object as Stripe.Subscription,
        );
        console.log('Subscription Canceled!');
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return event;
  }

  async handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
    console.log('Entrei na função de handleCheckout');
    const customerId = session.customer as string;
    const user = await this.usersRepository.findOne({
      where: { stripeCustomerId: customerId },
    });

    // Future Feature: >>>>> send email to dashboard <<<<

    if (user) {
      user.subscriptionStatus = 'active';
      await this.usersRepository.save(user);
    }
  }

  async handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
    console.log('Entrei na função de handlepayment');
    const customerId = paymentIntent.customer as string;
    const user = await this.usersRepository.findOne({
      where: { stripeCustomerId: customerId },
    });

    // Future Feature: >>>>> send email to dashboard <<<<

    if (user) {
      user.subscriptionStatus = 'active';
      await this.usersRepository.save(user);
    }
  }

  async handleCustomerSubscriptionDeleted(subscription: Stripe.Subscription) {
    console.log('Entrei na função de handleSubcriptionDeleted');
    const customerId = subscription.customer as string;
    const user = await this.usersRepository.findOne({
      where: { stripeCustomerId: customerId },
    });

    if (user) {
      user.subscriptionStatus = 'inactive';
      await this.usersRepository.save(user);
    }
  }
}
