import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';

@Injectable()
export class SecurityHeadersInterceptor implements NestInterceptor {
  private readonly logger = new Logger(SecurityHeadersInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    // Log suspicious requests
    this.logSuspiciousActivity(request);

    // Add additional security headers
    response.setHeader('X-Content-Type-Options', 'nosniff');
    response.setHeader('X-Frame-Options', 'DENY');
    response.setHeader('X-XSS-Protection', '1; mode=block');
    response.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

    return next.handle().pipe(
      tap(() => {
        // Log API response time
        const responseTime = Date.now() - request['startTime'];
        if (responseTime > 5000) { // Log slow requests
          this.logger.warn(`Slow request detected: ${request.method} ${request.url} - ${responseTime}ms`);
        }
      }),
    );
  }

  private logSuspiciousActivity(request: Request) {
    const userAgent = request.get('User-Agent') || '';
    const ip = request.ip;
    
    // Log potential bot activity
    if (this.isPotentialBot(userAgent)) {
      this.logger.warn(`Potential bot detected - IP: ${ip}, User-Agent: ${userAgent}`);
    }

    // Log requests with suspicious patterns
    if (this.hasSuspiciousPatterns(request.url)) {
      this.logger.warn(`Suspicious URL pattern - IP: ${ip}, URL: ${request.url}`);
    }

    // Mark start time for response time calculation
    request['startTime'] = Date.now();
  }

  private isPotentialBot(userAgent: string): boolean {
    const botPatterns = [
      /bot/i,
      /crawler/i,
      /spider/i,
      /scraper/i,
      /curl/i,
      /wget/i,
      /python/i,
    ];

    return botPatterns.some(pattern => pattern.test(userAgent));
  }

  private hasSuspiciousPatterns(url: string): boolean {
    const suspiciousPatterns = [
      /\.php$/i,
      /\.asp$/i,
      /\.jsp$/i,
      /admin/i,
      /wp-admin/i,
      /phpmyadmin/i,
      /config/i,
      /\.env/i,
      /\.git/i,
    ];

    return suspiciousPatterns.some(pattern => pattern.test(url));
  }
}
