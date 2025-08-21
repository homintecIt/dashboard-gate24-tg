import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonService } from '../misc/common-service.misc';
import apiEndpoints from '../misc/api-endpoints.misc';
import { Roles } from '../models/roles.model';

@Injectable({
  providedIn: 'root',
})
export class RolesService {
  constructor(
    private httpClient: HttpClient,
    private readonly commonService: CommonService
  ) {}

  getRoles() {
    return this.httpClient.get<Roles[]>(`${apiEndpoints.rolesUrl}`);
  }

  getRole(id: string) {
    return this.httpClient.get<Roles>(`${apiEndpoints.rolesUrl}/${id}`);
  }

  addRoles(data: any) {
    return this.httpClient.post<any>(`${apiEndpoints.rolesUrl}`, data);
  }

  updateRole(data: any) {
    return this.httpClient.put<any>(`${apiEndpoints.rolesUrl}/${data.id}`, data);
  }
}
