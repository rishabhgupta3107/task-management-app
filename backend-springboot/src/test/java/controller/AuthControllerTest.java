package controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.rishabhgupta3107.taskmanagement.backend_springboot.controller.AuthController;
import com.rishabhgupta3107.taskmanagement.backend_springboot.dto.RegisterRequest;
import com.rishabhgupta3107.taskmanagement.backend_springboot.security.AuthenticationRequest;
import com.rishabhgupta3107.taskmanagement.backend_springboot.security.AuthenticationResponse;
import com.rishabhgupta3107.taskmanagement.backend_springboot.security.JwtUtil;
import com.rishabhgupta3107.taskmanagement.backend_springboot.service.TeamService;
import com.rishabhgupta3107.taskmanagement.backend_springboot.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

public class AuthControllerTest {

  @Mock private AuthenticationManager authenticationManager;
  @Mock private JwtUtil jwtUtil;
  @Mock private UserService userService;
  @Mock private TeamService teamService;

  @InjectMocks private AuthController authController;

  @BeforeEach
  public void setUp() {
    MockitoAnnotations.openMocks(this);
  }

  @Test
  public void testLoginReturnsToken() {
    AuthenticationRequest request = new AuthenticationRequest("john", "password");
    when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
        .thenReturn(null);
    when(jwtUtil.generateToken("john")).thenReturn("test.jwt.token");

    ResponseEntity<AuthenticationResponse> response = authController.login(request);

    assertNotNull(response.getBody());
    assertEquals("test.jwt.token", response.getBody().getJwt());
  }

  @Test
  public void testRegisterReturns201() {
    RegisterRequest request = new RegisterRequest();
    request.setUsername("newuser");
    request.setPassword("password123");

    ResponseEntity<Void> response = authController.register(request);

    assertEquals(HttpStatus.CREATED, response.getStatusCode());
    verify(userService, times(1)).register(request);
  }
}
