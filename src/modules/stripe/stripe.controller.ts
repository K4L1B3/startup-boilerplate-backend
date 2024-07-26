import {
  Controller,
  Post,
  Body,
  Req,
  Res,
  RawBodyRequest,
  Headers,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { StripeService } from './stripe.service';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';

@ApiTags('Stripe')
@Controller('stripe')
export class StripeController {
  constructor(
    private readonly stripeService: StripeService,
    private readonly configService: ConfigService,
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
    const customer = await this.stripeService.createCustomer(
      createCustomerDto.email,
      createCustomerDto.name,
    );
    await this.stripeService.assignCustomerIdToUser(
      createCustomerDto.userId,
      customer.id,
    );
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
    return this.stripeService.createCheckoutSession(
      createCheckoutSessionDto.customerId,
      createCheckoutSessionDto.priceId,
      ['card'],
    );
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
      await this.stripeService.handleWebhook(signature, req.rawBody);
      res.status(200).send();
    } catch (err) {
      console.error(err.message);
      res.status(400).send(`Webhook Error: ${err.message}`);
    }
  }
}
