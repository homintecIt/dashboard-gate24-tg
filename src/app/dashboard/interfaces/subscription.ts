
export interface Subscription {
  id: number;
  targId: string;
  targCode: string;
  typeTarg: string;
  statutTarg: string;
  plaque: string | null;
  created_at: string;
  updated_at: string;
  compte: {
    uuid: string;
    accountNumber: string;
    solde: number;
  };
}
export interface SubscriptionResponse {
  items: Subscription[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}
