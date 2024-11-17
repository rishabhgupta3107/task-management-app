import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TokenInterceptorService } from './token-interceptor.service';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';

describe('TokenInterceptorService', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let authService: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: TokenInterceptorService,
          multi: true
        }
      ]
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
    authService = TestBed.inject(AuthService);

    // Mock the getToken method of AuthService to return a predefined token
    spyOn(authService, 'getToken').and.returnValue('test.jwt.token');
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should add Authorization header', () => {
    httpClient.get('/dummy-endpoint').subscribe();

    const req = httpMock.expectOne('/dummy-endpoint');
    expect(req.request.headers.get('Authorization')).toBe('Bearer test.jwt.token');
  });
});