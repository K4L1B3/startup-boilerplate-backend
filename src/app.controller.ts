// src/app.controller.ts
import { Controller, Get, Redirect } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller()
export class AppController {
  @Get()
  @ApiExcludeEndpoint()
  @Redirect('/swagger', 302)
  redirectToApi() {}
}

