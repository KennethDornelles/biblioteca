// Módulo
export { LoanModule } from './loan.module';

// Controller
export { LoanController } from './loan.controller';

// Service
export { LoanService } from './loan.service';

// DTOs
export { CreateLoanDto } from './dto/create-loan.dto';
export { UpdateLoanDto } from './dto/update-loan.dto';
export { LoanResponseDto } from './dto/loan-response.dto';
export { LoanFiltersDto } from './dto/loan-filters.dto';
export { LoanSearchDto } from './dto/loan-search.dto';
export { PaginatedLoansDto } from './dto/paginated-loans.dto';
export { LoanRenewalDto } from './dto/loan-renewal.dto';
export { LoanReturnDto } from './dto/loan-return.dto';

// Entity
export { Loan } from '../../interfaces/entities/loan.entity';

// Enums, Interfaces, Types, Constants, Utils e Config estão disponíveis em src/
// Para importar, use: import { LoanStatus } from '../../enums';

