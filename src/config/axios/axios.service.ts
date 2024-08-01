// src/config/axios/axios.service.ts
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosRequestConfig } from 'axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AxiosService {
  constructor(private readonly httpService: HttpService) {}

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await lastValueFrom(this.httpService.get<T>(url, config));
    return response.data;
  }

  async post<T>(
    url: string,
    data: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response = await lastValueFrom(
      this.httpService.post<T>(url, data, config),
    );
    return response.data;
  }

  // Outros métodos HTTP (put, delete, etc.) podem ser adicionados aqui
}

// Uso do axios em um controller e service especifico:

//CONTROLLER:

// // some/some.controller.ts
// import { Controller, Get } from '@nestjs/common';
// import { SomeService } from './some.service';

// @Controller('some')
// export class SomeController {
//   constructor(private readonly someService: SomeService) {}

//   @Get()
//   async getData() {
//     const data = await this.someService.fetchData();
//     return data;
//   }
// }

//SERVICE:

// // some/some.service.ts
// import { Injectable } from '@nestjs/common';
// import { AxiosService } from '../axios/axios.service';

// @Injectable()
// export class SomeService {
//   constructor(private readonly axiosService: AxiosService) {}

//   async fetchData(): Promise<any> {
//     const data = await this.axiosService.get('https://api.example.com/data');
//     return data;
//   }
// }
