import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonService } from '../misc/common-service.misc';
import apiEndpoints from '../misc/api-endpoints.misc';
import { Roles } from '../models/roles.model';

@Injectable({
  providedIn: 'root',
})
export class ActionService {
  constructor(
    private httpClient: HttpClient,
    private readonly commonService: CommonService
  ) {}

  getActions() {
    return this.httpClient.get<any[]>(`${apiEndpoints.actionUrl}`);
  }

  getAction(id: string) {
    return this.httpClient.get<Roles>(`${apiEndpoints.rolesUrl}/${id}`);
  }

}
