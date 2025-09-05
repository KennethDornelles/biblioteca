import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Material, MaterialSearchParams, MaterialSearchResponse, MaterialCategory, MaterialTypeInfo } from '../models/material.model';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {
  private readonly API_URL = 'http://localhost:3001/api';

  constructor(private http: HttpClient) {}

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
    if (params.page) httpParams = httpParams.set('page', params.page.toString());
    if (params.limit) httpParams = httpParams.set('limit', params.limit.toString());
    if (params.sortBy) httpParams = httpParams.set('sortBy', params.sortBy);
    if (params.sortOrder) httpParams = httpParams.set('sortOrder', params.sortOrder);

    return this.http.get<MaterialSearchResponse>(`${this.API_URL}/materials/search`, { params: httpParams });
  }

  // Obter todos os materiais (catálogo completo)
  getAllMaterials(page: number = 1, limit: number = 20, sortBy: string = 'title', sortOrder: string = 'asc'): Observable<MaterialSearchResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('sortBy', sortBy)
      .set('sortOrder', sortOrder);

    return this.http.get<MaterialSearchResponse>(`${this.API_URL}/materials`, { params });
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
    return this.http.get<Material[]>(`${this.API_URL}/materials/recent`, { params });
  }
}
