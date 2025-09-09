import { MaterialResponseDto } from './material-response.dto';

export class MaterialDetailDto extends MaterialResponseDto {
  reviews: Array<{
    id: string;
    rating: number;
    comment: string;
    reviewDate: Date;
    user: {
      id: string;
      name: string;
      type: string;
    };
  }>;

  activeLoans: Array<{
    id: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
    loanDate: Date;
    dueDate: Date;
  }>;

  activeReservations: Array<{
    id: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
    reservationDate: Date;
    expirationDate: Date;
  }>;

  averageRating: number;
  totalReviews: number;
}
