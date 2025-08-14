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

export interface TransactionResponse {
  items: Transaction[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}
