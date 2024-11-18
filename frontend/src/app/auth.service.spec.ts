import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should login and store the token', () => {
    const dummyToken = 'test.jwt.token';
  
    service.login('john', 'password').subscribe();
  
    const req = httpMock.expectOne(`${service['baseUrl']}/login`);
    expect(req.request.method).toBe('POST');
    req.flush({ jwt: dummyToken }, { status: 200, statusText: 'OK' });
  
    expect(localStorage.getItem('token')).toBe(dummyToken);
  });
  
  it('should return true if the user is logged in', () => {
    localStorage.setItem('token', 'test.jwt.token');
    expect(service.isLoggedIn()).toBeTrue();
  });

  it('should return false if the user is not logged in', () => {
    localStorage.removeItem('token');
    expect(service.isLoggedIn()).toBeFalse();
  });

  it('should retrieve the token from local storage', () => {
    const dummyToken = 'test.jwt.token';
    localStorage.setItem('token', dummyToken);
    expect(service.getToken()).toBe(dummyToken);
  });

  it('should remove the token from local storage on logout', () => {
    localStorage.setItem('token', 'test.jwt.token');
    service.logout();
    expect(localStorage.getItem('token')).toBeNull();
  });
});