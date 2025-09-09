import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Material, MaterialSearchParams, MaterialSearchResponse, MaterialCategory, MaterialTypeInfo } from '../models/material.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {
  private readonly API_URL = 'http://localhost:3001/api';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (token) {
      return new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
    }
    return new HttpHeaders();
  }

  // Buscar materiais com filtros
  searchMaterials(params: MaterialSearchParams): Observable<MaterialSearchResponse> {
    let httpParams = new HttpParams();

    if (params.query) httpParams = httpParams.set('query', params.query);
    if (params.category) httpParams = httpParams.set('category', params.category);
    if (params.type) httpParams = httpParams.set('type', params.type);
    if (params.author) httpParams = httpParams.set('author', params.author);
    if (params.publisher) httpParams = httpParams.set('publisher', params.publisher);
    if (params.publicationYear) httpParams = httpParams.set('publicationYear', params.publicationYear.toString());
    if (params.status) httpParams = httpParams.set('status', params.status);
    if (params.isbn) httpParams = httpParams.set('isbn', params.isbn);
    if (params.language) httpParams = httpParams.set('language', params.language);
    if (params.location) httpParams = httpParams.set('location', params.location);
    if (params.keywords) httpParams = httpParams.set('keywords', params.keywords);
    if (params.page) httpParams = httpParams.set('page', params.page.toString());
    if (params.limit) httpParams = httpParams.set('limit', params.limit.toString());
    if (params.sortBy) httpParams = httpParams.set('sortBy', params.sortBy);
    if (params.sortOrder) httpParams = httpParams.set('sortOrder', params.sortOrder);

    return this.http.get<MaterialSearchResponse>(`${this.API_URL}/search`, {
      params: httpParams,
      headers: this.getAuthHeaders()
    });
  }

  // Obter todos os materiais (catálogo completo)
  getAllMaterials(page: number = 1, limit: number = 20, sortBy: string = 'title', sortOrder: string = 'asc'): Observable<MaterialSearchResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('sortBy', sortBy)
      .set('sortOrder', sortOrder);

    return this.http.get<MaterialSearchResponse>(`${this.API_URL}/materials`, {
      params,
      headers: this.getAuthHeaders()
    });
  }

  // Obter materiais do catálogo com filtros
  getCatalogMaterials(page: number = 1, limit: number = 20, sortBy: string = 'title', sortOrder: string = 'asc', filters?: any): Observable<MaterialSearchResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('sortBy', sortBy)
      .set('sortOrder', sortOrder);

    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
          params = params.set(key, filters[key].toString());
        }
      });
    }

    return this.http.get<MaterialSearchResponse>(`${this.API_URL}/materials`, {
      params,
      headers: this.getAuthHeaders()
    });
  }

  // Obter material por ID
  getMaterialById(id: string): Observable<Material> {
    return this.http.get<Material>(`${this.API_URL}/materials/${id}`);
  }

  // Obter materiais por categoria
  getMaterialsByCategory(category: string, page: number = 1, limit: number = 20): Observable<MaterialSearchResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<MaterialSearchResponse>(`${this.API_URL}/materials/category/${category}`, { params });
  }

  // Obter materiais por tipo
  getMaterialsByType(type: string, page: number = 1, limit: number = 20): Observable<MaterialSearchResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<MaterialSearchResponse>(`${this.API_URL}/materials/type/${type}`, { params });
  }

  // Obter categorias disponíveis
  getCategories(): Observable<MaterialCategory[]> {
    return this.http.get<MaterialCategory[]>(`${this.API_URL}/materials/categories`);
  }

  // Obter tipos de materiais disponíveis
  getMaterialTypes(): Observable<MaterialTypeInfo[]> {
    return this.http.get<MaterialTypeInfo[]>(`${this.API_URL}/materials/types`);
  }

  // Busca rápida (para autocomplete)
  quickSearch(query: string, limit: number = 10): Observable<Material[]> {
    const params = new HttpParams()
      .set('query', query)
      .set('limit', limit.toString());

    return this.http.get<Material[]>(`${this.API_URL}/materials/quick-search`, { params });
  }

  // Obter sugestões de busca
  getSearchSuggestions(query: string): Observable<{ suggestions: string[] }> {
    const params = new HttpParams().set('q', query);
    return this.http.get<{ suggestions: string[] }>(`${this.API_URL}/search/suggestions`, { params });
  }

  // Obter estatísticas de busca (apenas para administradores e bibliotecários)
  getSearchStats(): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/search/stats`, {
      headers: this.getAuthHeaders()
    });
  }

  // Obter materiais relacionados
  getRelatedMaterials(materialId: string, limit: number = 5): Observable<Material[]> {
    const params = new HttpParams().set('limit', limit.toString());
    return this.http.get<Material[]>(`${this.API_URL}/materials/${materialId}/related`, { params });
  }

  // Obter materiais mais populares
  getPopularMaterials(limit: number = 10): Observable<Material[]> {
    const params = new HttpParams().set('limit', limit.toString());
    return this.http.get<Material[]>(`${this.API_URL}/materials/popular`, { params });
  }

  // Obter materiais recentes
  getRecentMaterials(limit: number = 10): Observable<Material[]> {
    const params = new HttpParams().set('limit', limit.toString());
    return this.http.get<Material[]>(`${this.API_URL}/materials/recent`, {
      params,
      headers: this.getAuthHeaders()
    });
  }

  // Obter estatísticas do catálogo
  getCatalogStatistics(): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/materials/statistics`, {
      headers: this.getAuthHeaders()
    });
  }

  // Obter subcategorias de uma categoria
  getSubcategories(category: string): Observable<{ subcategory: string; count: number }[]> {
    return this.http.get<{ subcategory: string; count: number }[]>(`${this.API_URL}/materials/categories/${category}/subcategories`, {
      headers: this.getAuthHeaders()
    });
  }

  // Obter histórico de empréstimos de um material
  getMaterialLoanHistory(materialId: string, page: number = 1, limit: number = 20): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<any>(`${this.API_URL}/materials/${materialId}/loan-history`, {
      params,
      headers: this.getAuthHeaders()
    });
  }

  // Obter avaliações de um material
  getMaterialReviews(materialId: string, page: number = 1, limit: number = 10, sortBy: string = 'reviewDate', sortOrder: string = 'desc'): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('sortBy', sortBy)
      .set('sortOrder', sortOrder);

    return this.http.get<any>(`${this.API_URL}/materials/${materialId}/reviews`, {
      params,
      headers: this.getAuthHeaders()
    });
  }

  // Exportar catálogo
  exportCatalog(format: 'csv' | 'excel' | 'pdf', filters?: any): Observable<Blob> {
    let params = new HttpParams().set('format', format);

    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
          params = params.set(key, filters[key].toString());
        }
      });
    }

    return this.http.get(`${this.API_URL}/materials/export`, {
      params,
      headers: this.getAuthHeaders(),
      responseType: 'blob'
    });
  }

  // Obter sugestões de busca do catálogo
  getCatalogSuggestions(query: string): Observable<{ suggestions: string[] }> {
    const params = new HttpParams().set('q', query);
    return this.http.get<{ suggestions: string[] }>(`${this.API_URL}/materials/suggestions`, {
      params,
      headers: this.getAuthHeaders()
    });
  }
}
