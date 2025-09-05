import { Review } from '@prisma/client';

// Tipo para criação de review
export type CreateReviewData = Omit<Review, 'id' | 'reviewDate' | 'createdAt' | 'updatedAt'>;

// Tipo para atualização de review
export type UpdateReviewData = Partial<Pick<Review, 'rating' | 'comment'>>;

// Tipo para resposta de review com relacionamentos
export type ReviewWithRelations = Review & {
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
};

// Tipo para filtros de review
export type ReviewFilters = {
  userId?: string;
  materialId?: string;
  rating?: number;
  minRating?: number;
  maxRating?: number;
  hasComment?: boolean;
  page?: number;
  limit?: number;
};

// Tipo para estatísticas de review
export type ReviewStats = {
  total: number;
  averageRating: number;
  ratingDistribution: Record<number, number>;
  totalWithComments: number;
  totalWithoutComments: number;
};

// Tipo para validação de review
export type ReviewValidation = {
  canReview: boolean;
  reason?: string;
  existingReview?: Review;
};

// Tipo para agregação de reviews por material
export type MaterialReviewStats = {
  materialId: string;
  totalReviews: number;
  averageRating: number;
  ratingDistribution: Record<number, number>;
  totalWithComments: number;
};

// Tipo para agregação de reviews por usuário
export type UserReviewStats = {
  userId: string;
  totalReviews: number;
  averageRating: number;
  totalWithComments: number;
  lastReviewDate?: Date;
};
