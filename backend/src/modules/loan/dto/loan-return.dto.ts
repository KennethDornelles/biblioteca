import { IsString, IsOptional, IsDateString, IsNotEmpty } from 'class-validator';

export class LoanReturnDto {
  @IsString()
  @IsNotEmpty({ message: 'ID do empréstimo é obrigatório' })
  loanId: string;

  @IsString()
  @IsNotEmpty({ message: 'ID do bibliotecário é obrigatório' })
  librarianId: string;

  @IsOptional()
  @IsDateString()
  returnDate?: string;

  @IsOptional()
  @IsString()
  observations?: string;
}

