import { Subscription } from "./subscription";

export interface Compte {
  id: number;
  uuid: string;
  accountNumber: string;
  solde: number;
  status?: string;
  client?: {
    id?: number;
    nom?: string;
    prenom?: string;
    email?: string;
    tel?: string;
  };
}

export interface Transaction {
  id: number;
  montant: string,
  type_transaction: string,
  solde: string,
  date: Date,
  compte: Compte| null;
  abonnement :Subscription
}
export interface VTransaction {
  type_transaction: string;
  montant_transaction: number;
  date_transaction: Date;
  site_transaction :string
  compte_id: number;
  account_number: string;
  abonnement_id: number;
  nom_client: string;
  solde_transaction:number;
  tagCode:string
}

export interface TransactionResponse {
  items: VTransaction[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
    totalAmount :number
  };



}
