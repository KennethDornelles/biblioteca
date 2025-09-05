import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';

interface DashboardCard {
  title: string;
  value: string;
  icon: string;
  color: string;
  route: string;
}

interface RecentActivity {
  id: string;
  type: 'loan' | 'return' | 'reservation' | 'fine';
  description: string;
  date: Date;
  status: 'success' | 'warning' | 'error' | 'info';
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  user: User | null = null;

  dashboardCards: DashboardCard[] = [
    {
      title: 'Empréstimos Ativos',
      value: '3',
      icon: '📚',
      color: 'blue',
      route: '/loans'
    },
    {
      title: 'Reservas',
      value: '2',
      icon: '📋',
      color: 'green',
      route: '/reservations'
    },
    {
      title: 'Multas',
      value: '0',
      icon: '⚠️',
      color: 'red',
      route: '/fines'
    },
    {
      title: 'Histórico',
      value: '15',
      icon: '📊',
      color: 'purple',
      route: '/history'
    }
  ];

  recentActivities: RecentActivity[] = [
    {
      id: '1',
      type: 'loan',
      description: 'Empréstimo: "Introdução ao Angular"',
      date: new Date('2024-01-15'),
      status: 'success'
    },
    {
      id: '2',
      type: 'reservation',
      description: 'Reserva: "Clean Code"',
      date: new Date('2024-01-14'),
      status: 'info'
    },
    {
      id: '3',
      type: 'return',
      description: 'Devolução: "JavaScript: The Good Parts"',
      date: new Date('2024-01-13'),
      status: 'success'
    },
    {
      id: '4',
      type: 'fine',
      description: 'Multa: "Atraso na devolução"',
      date: new Date('2024-01-10'),
      status: 'warning'
    }
  ];

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
    if (!this.user) {
      this.router.navigate(['/login']);
    }
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  getStatusClass(status: string): string {
    return `status-${status}`;
  }

  getActivityIcon(type: string): string {
    const icons = {
      loan: '📚',
      return: '↩️',
      reservation: '📋',
      fine: '⚠️'
    };
    return icons[type as keyof typeof icons] || '📄';
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
