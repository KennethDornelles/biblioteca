import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoanService, Loan, CreateLoanRequest, UpdateLoanRequest } from '../../services/loan.service';
import { MaterialService } from '../../services/material.service';
import { MaterialSearchResponse } from '../../models/material.model';
import { AuthService } from '../../services/auth.service';

interface Material {
  id: string;
  title: string;
  author: string;
  isbn?: string;
  coverImage?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
}

@Component({
  selector: 'app-loan-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './loan-form.component.html',
  styleUrl: './loan-form.component.scss'
})
export class LoanFormComponent implements OnInit {
  loanForm: FormGroup;
  isEditMode = false;
  loanId: string | null = null;
  loading = false;
  saving = false;
  error: string | null = null;

  // Dados para os selects
  materials: Material[] = [];
  users: User[] = [];

  // Filtros para busca
  materialSearchTerm = '';
  userSearchTerm = '';

  // Estados de carregamento
  loadingMaterials = false;
  loadingUsers = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private loanService: LoanService,
    private materialService: MaterialService,
    private authService: AuthService
  ) {
    this.loanForm = this.fb.group({
      materialId: ['', Validators.required],
      userId: ['', Validators.required],
      dueDate: ['', Validators.required],
      notes: ['']
    });
  }

  ngOnInit() {
    this.loanId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.loanId;

    if (this.isEditMode) {
      this.loadLoan();
    }

    this.loadMaterials();
    this.loadUsers();
  }

  loadLoan() {
    if (!this.loanId) return;

    this.loading = true;
    this.error = null;

    this.loanService.getLoanById(this.loanId).subscribe({
      next: (loan) => {
        this.loanForm.patchValue({
          materialId: loan.materialId,
          userId: loan.userId,
          dueDate: this.formatDateForInput(loan.dueDate),
          notes: loan.notes || ''
        });
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Erro ao carregar empréstimo';
        this.loading = false;
        console.error('Erro ao carregar empréstimo:', error);
      }
    });
  }

  loadMaterials() {
    this.loadingMaterials = true;
    this.materialService.getAllMaterials().subscribe({
      next: (response: MaterialSearchResponse) => {
        this.materials = response.materials || response;
        this.loadingMaterials = false;
      },
      error: (error: any) => {
        console.error('Erro ao carregar materiais:', error);
        this.loadingMaterials = false;
      }
    });
  }

  loadUsers() {
    this.loadingUsers = true;
    // Simulando carregamento de usuários - você pode implementar um UserService
    // Por enquanto, vamos usar dados mockados
    setTimeout(() => {
      this.users = [
        { id: '1', name: 'João Silva', email: 'joao@exemplo.com' },
        { id: '2', name: 'Maria Santos', email: 'maria@exemplo.com' },
        { id: '3', name: 'Pedro Oliveira', email: 'pedro@exemplo.com' }
      ];
      this.loadingUsers = false;
    }, 1000);
  }

  get filteredMaterials(): Material[] {
    if (!this.materialSearchTerm) return this.materials;

    return this.materials.filter(material =>
      material.title.toLowerCase().includes(this.materialSearchTerm.toLowerCase()) ||
      material.author.toLowerCase().includes(this.materialSearchTerm.toLowerCase()) ||
      (material.isbn && material.isbn.includes(this.materialSearchTerm))
    );
  }

  get filteredUsers(): User[] {
    if (!this.userSearchTerm) return this.users;

    return this.users.filter(user =>
      user.name.toLowerCase().includes(this.userSearchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(this.userSearchTerm.toLowerCase())
    );
  }

  onMaterialSelect(material: Material) {
    this.loanForm.patchValue({ materialId: material.id });
    this.materialSearchTerm = `${material.title} - ${material.author}`;
  }

  onUserSelect(user: User) {
    this.loanForm.patchValue({ userId: user.id });
    this.userSearchTerm = `${user.name} (${user.email})`;
  }

  onSubmit() {
    if (this.loanForm.valid) {
      this.saving = true;
      this.error = null;

      const formData = this.loanForm.value;

      if (this.isEditMode && this.loanId) {
        const updateData: UpdateLoanRequest = {
          notes: formData.notes
        };

        this.loanService.updateLoan(this.loanId, updateData).subscribe({
          next: (loan) => {
            this.saving = false;
            this.router.navigate(['/loans', loan.id]);
          },
          error: (error) => {
            this.error = 'Erro ao atualizar empréstimo';
            this.saving = false;
            console.error('Erro ao atualizar empréstimo:', error);
          }
        });
      } else {
        const createData: CreateLoanRequest = {
          materialId: formData.materialId,
          userId: formData.userId,
          dueDate: formData.dueDate,
          notes: formData.notes
        };

        this.loanService.createLoan(createData).subscribe({
          next: (loan) => {
            this.saving = false;
            this.router.navigate(['/loans', loan.id]);
          },
          error: (error) => {
            this.error = 'Erro ao criar empréstimo';
            this.saving = false;
            console.error('Erro ao criar empréstimo:', error);
          }
        });
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  markFormGroupTouched() {
    Object.keys(this.loanForm.controls).forEach(key => {
      const control = this.loanForm.get(key);
      control?.markAsTouched();
    });
  }

  formatDateForInput(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]!;
  }

  getMinDate(): string {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0]!;
  }

  getMaxDate(): string {
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 1);
    return maxDate.toISOString().split('T')[0]!;
  }

  goBack() {
    if (this.isEditMode && this.loanId) {
      this.router.navigate(['/loans', this.loanId]);
    } else {
      this.router.navigate(['/loans']);
    }
  }

  getFieldError(fieldName: string): string {
    const field = this.loanForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return `${this.getFieldLabel(fieldName)} é obrigatório`;
      }
    }
    return '';
  }

  getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      materialId: 'Material',
      userId: 'Usuário',
      dueDate: 'Data de Vencimento',
      notes: 'Observações'
    };
    return labels[fieldName] || fieldName;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loanForm.get(fieldName);
    return !!(field?.invalid && field.touched);
  }
}
