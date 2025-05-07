export enum TransactionStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export interface Transaction {
  id: string;
  sourceAccountId: string;
  targetAccountId: string;
  transferTypeId: string;
  value: number;
  status: TransactionStatus;
  createdAt: Date;
}
