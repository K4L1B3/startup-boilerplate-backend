import {
  Controller,
  Post,
  Body,
  Req,
  Res,
  RawBodyRequest,
  Headers,
  Inject,
  LoggerService,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { StripeService } from './stripe.service';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@ApiTags('Stripe')
@Controller('stripe')
export class StripeController {
  constructor(
    private readonly stripeService: StripeService,
    private readonly configService: ConfigService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  @Post('create-customer')
  @ApiOperation({ summary: 'Create a Stripe customer' })
  @ApiResponse({
    status: 201,
    description: 'Customer created successfully',
    schema: {
      example: {
        id: 'cus_J1a2b3c4d5e6f7g8h9',
        object: 'customer',
        email: 'email@example.com',
        name: 'John Doe',
      },
    },
  })
  @ApiBody({
    description: 'Customer creation payload',
    schema: {
      example: {
        email: 'email@example.com',
        name: 'John Doe',
        userId: 1,
      },
    },
  })
  async createCustomer(
    @Body() createCustomerDto: { email: string; name: string; userId: number },
  ) {
    this.logger.log(`Creating customer for email: ${createCustomerDto.email}`);
    const customer = await this.stripeService.createCustomer(
      createCustomerDto.email,
      createCustomerDto.name,
    );
    await this.stripeService.assignCustomerIdToUser(
      createCustomerDto.userId,
      customer.id,
    );
    this.logger.log(`Customer created with ID: ${customer.id}`);
    return customer;
  }

  @Post('create-checkout-session')
  @ApiOperation({ summary: 'Create a Stripe checkout session' })
  @ApiResponse({
    status: 201,
    description: 'Checkout session created successfully',
    schema: {
      example: {
        id: 'cs_test_a1b2c3d4e5f6g7h8i9',
        object: 'checkout.session',
        payment_method_types: 'card',
        customer: 'cus_J1a2b3c4d5e6f7g8h9',
        line_items: [
          {
            price: 'price_1Hh1JK2eZvKYlo2Cx8N8l1w8',
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: 'http://localhost:3000/success',
        cancel_url: 'http://localhost:3000/cancel',
      },
    },
  })
  @ApiBody({
    description: 'Checkout session creation payload',
    schema: {
      example: {
        customerId: 'cus_J1a2b3c4d5e6f7g8h9',
        priceId: 'price_1PgDQ4RsfIl9COKnX0NmyBQP',
        paymentMethodTypes: ['card'],
      },
    },
  })
  async createCheckoutSession(
    @Body() createCheckoutSessionDto: { customerId: string; priceId: string },
  ) {
    this.logger.log(
      `Creating checkout session for customer: ${createCheckoutSessionDto.customerId}`,
    );
    const session = await this.stripeService.createCheckoutSession(
      createCheckoutSessionDto.customerId,
      createCheckoutSessionDto.priceId,
      ['card'],
    );
    this.logger.log(`Checkout session created with ID: ${session.id}`);
    return session;
  }

  @Post('webhook')
  @ApiOperation({ summary: 'Handle Stripe webhooks' })
  @ApiResponse({
    status: 200,
    description: 'Webhook handled successfully',
  })
  async handleWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Res() res: Response,
    @Headers('stripe-signature') signature: string,
  ) {
    try {
      this.logger.log('Handling Stripe webhook');
      await this.stripeService.handleWebhook(signature, req.rawBody);
      this.logger.log('Webhook handled successfully');
      res.status(200).send();
    } catch (err) {
      this.logger.error(`Webhook handling failed: ${err.message}`);
      res.status(400).send(`Webhook Error: ${err.message}`);
    }
  }
}
