import { IsNotEmpty, IsString, IsNumber, IsDateString } from 'class-validator';

export class TransactionRequest {
  @IsNotEmpty()
  @IsString()
  sourceAccountId: string;

  @IsNotEmpty()
  @IsString()
  targetAccountId: string;

  @IsNotEmpty()
  @IsString()
  transferTypeId: string;

  @IsNotEmpty()
  @IsNumber()
  value: number;
}

export class TransactionGetRequest {
  @IsNotEmpty()
  @IsString()
  externalId: string;

  @IsNotEmpty()
  @IsDateString()
  createdAt: Date;
}
