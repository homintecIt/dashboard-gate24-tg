
export class ListeClientService {
  id?: number;
  created_at?: string;
  updated_at?: string;
  nom?: string;
  prenom?: string;
  email?: string;
  tel?: number;
  adresse?:string
  cin?: string;
  uuid: any;
}

export class AccountList {
  id?: number;
  created_at?: string;
  updated_at?: string;
  uuid?: string;
  accountNumber?: string;
  solde?: number;
  client?: ListeClientService;
}
