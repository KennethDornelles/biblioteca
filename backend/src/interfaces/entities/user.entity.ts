import { UserType, StudentLevel } from '../../enums';

export class User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  password: string;
  registrationDate: Date;
  type: UserType;
  active: boolean;

  // Campos específicos do tipo de usuário
  registrationNumber?: string; // Para estudantes
  course?: string; // Para estudantes
  level?: StudentLevel; // Para estudantes
  department?: string; // Para professores
  title?: string; // Para professores
  admissionDate?: Date; // Para professores/funcionários

  // Configurações de limite
  loanLimit: number;
  loanDays: number;

  // Campos de auditoria
  createdAt: Date;
  updatedAt: Date;
}
