export interface Compte {
  id: number;
  uuid: string;
  accountNumber: string;
  solde: number;
}

export interface Transaction {
  id: number;
  montant: string,
  type_transaction: string,
  solde: string,
  date: Date,
  compte: Compte| null;
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
