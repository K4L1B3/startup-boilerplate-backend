// src/common/http.service.ts
import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class HttpService {
  private readonly axiosClient: AxiosInstance;

  constructor(baseURL: string) {
    this.axiosClient = axios.create({
      baseURL,
      // Adicione outras configurações padrão do Axios aqui
    });
  }

  get client(): AxiosInstance {
    return this.axiosClient;
  }
}
