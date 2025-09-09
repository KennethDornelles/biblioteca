import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Loan {
  id: string;
  userId: string;
  materialId: string;
  material: {
    id: string;
    title: string;
    author: string;
    isbn?: string;
    coverImage?: string;
  };
  user: {
    id: string;
    name: string;
    email: string;
  };
  loanDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'ACTIVE' | 'RETURNED' | 'OVERDUE' | 'LOST';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLoanRequest {
  materialId: string;
  userId: string;
  dueDate: string;
  notes?: string;
}

export interface UpdateLoanRequest {
  status?: 'ACTIVE' | 'RETURNED' | 'OVERDUE' | 'LOST';
  returnDate?: string;
  notes?: string;
}

export interface LoanFilters {
  status?: string;
  userId?: string;
  materialId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface LoanResponse {
  data: Loan[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable({
  providedIn: 'root'
})
export class LoanService {
  private readonly API_URL = 'http://localhost:3001/api';

  constructor(private http: HttpClient) {}

  getLoans(filters?: LoanFilters): Observable<LoanResponse> {
    let params = new HttpParams();

    if (filters) {
      Object.keys(filters).forEach(key => {
        const value = filters[key as keyof LoanFilters];
        if (value !== undefined && value !== null) {
          params = params.set(key, value.toString());
        }
      });
    }

    return this.http.get<LoanResponse>(`${this.API_URL}/loan`, { params });
  }

  getLoanById(id: string): Observable<Loan> {
    return this.http.get<Loan>(`${this.API_URL}/loan/${id}`);
  }

  createLoan(loanData: CreateLoanRequest): Observable<Loan> {
    return this.http.post<Loan>(`${this.API_URL}/loan`, loanData);
  }

  updateLoan(id: string, loanData: UpdateLoanRequest): Observable<Loan> {
    return this.http.patch<Loan>(`${this.API_URL}/loan/${id}`, loanData);
  }

  deleteLoan(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/loan/${id}`);
  }

  returnLoan(id: string, returnDate?: string): Observable<Loan> {
    const data = returnDate ? { returnDate } : {};
    return this.http.patch<Loan>(`${this.API_URL}/loan/${id}`, {
      status: 'RETURNED',
      ...data
    });
  }

  getOverdueLoans(): Observable<Loan[]> {
    return this.http.get<Loan[]>(`${this.API_URL}/loan?status=OVERDUE`);
  }

  getActiveLoans(): Observable<Loan[]> {
    return this.http.get<Loan[]>(`${this.API_URL}/loan?status=ACTIVE`);
  }

  getUserLoans(userId: string): Observable<Loan[]> {
    return this.http.get<Loan[]>(`${this.API_URL}/loan?userId=${userId}`);
  }

  getMaterialLoans(materialId: string): Observable<Loan[]> {
    return this.http.get<Loan[]>(`${this.API_URL}/loan?materialId=${materialId}`);
  }
}
