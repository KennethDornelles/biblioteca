// Interface base para review
export interface IReview {
  id: string;
  userId: string;
  materialId: string;
  rating: number;
  comment?: string;
  reviewDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Interface para criação de review
export interface ICreateReview {
  userId: string;
  materialId: string;
  rating: number;
  comment?: string;
}

// Interface para atualização de review
export interface IUpdateReview {
  rating?: number;
  comment?: string;
}

// Interface para resposta de review
export interface IReviewResponse {
  id: string;
  userId: string;
  materialId: string;
  rating: number;
  comment?: string;
  reviewDate: Date;
  createdAt: Date;
  updatedAt: Date;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  material?: {
    id: string;
    title: string;
    author: string;
  };
}

// Interface para filtros de busca
export interface IReviewFilters {
  userId?: string;
  materialId?: string;
  rating?: number;
  minRating?: number;
  maxRating?: number;
  hasComment?: boolean;
  page?: number;
  limit?: number;
}

// Interface para resposta paginada
export interface IPaginatedReviews {
  data: IReviewResponse[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// Interface para estatísticas de review
export interface IReviewStats {
  total: number;
  averageRating: number;
  ratingDistribution: Record<number, number>;
  totalWithComments: number;
  totalWithoutComments: number;
}

// Interface para validação de review
export interface IReviewValidation {
  canReview: boolean;
  reason?: string;
  existingReview?: IReview;
}
