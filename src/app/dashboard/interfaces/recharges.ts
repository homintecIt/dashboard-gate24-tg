export interface Compte {
  id: number;
  uuid: string;
  accountNumber: string;
  solde: number;
}

export interface Recharge {
  id: number;
  created_at: string;
  montant: string;
  montant_avant_recharge: number;
  montant_apres_recharge: number;
  site: string;
  percepteur: string;
  refer: string | null;
  traiter: number;
  compte: Compte| null;
}

export interface RechargeResponse {
  items: Recharge[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}
