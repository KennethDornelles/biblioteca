import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class LoanRenewalDto {
  @IsString()
  @IsNotEmpty({ message: 'ID do empréstimo é obrigatório' })
  loanId: string;

  @IsString()
  @IsNotEmpty({ message: 'ID do usuário é obrigatório' })
  userId: string;

  @IsOptional()
  @IsString()
  librarianId?: string;

  @IsOptional()
  @IsString()
  observations?: string;
}

