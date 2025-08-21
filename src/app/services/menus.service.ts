import { Menus } from 'src/app/models/menus.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonService } from '../misc/common-service.misc';
import apiEndpoints from '../misc/api-endpoints.misc';

@Injectable({
  providedIn: 'root',
})
export class MenusService {
  constructor(
    private httpClient: HttpClient,
    private readonly commonService: CommonService
  ) {}

  getMenus() {
    return this.httpClient.get<Menus[]>(`${apiEndpoints.menusUrl}`);
  }

  getMenu(id: string) {
    return this.httpClient.get<Menus>(`${apiEndpoints.menusUrl}/${id}`);
  }

  addMenus(data: any) {
    return this.httpClient.post<any>(`${apiEndpoints.menusUrl}`, data);
  }

  updateMenu(data: any) {
    return this.httpClient.put<any>(`${apiEndpoints.menusUrl}/${data.id}`, data);
  }
}
