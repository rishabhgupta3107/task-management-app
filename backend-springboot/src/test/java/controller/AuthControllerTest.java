package controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import com.rishabhgupta3107.taskmanagement.backend_springboot.controller.AuthController;
import com.rishabhgupta3107.taskmanagement.backend_springboot.security.AuthenticationRequest;
import com.rishabhgupta3107.taskmanagement.backend_springboot.security.AuthenticationResponse;
import com.rishabhgupta3107.taskmanagement.backend_springboot.security.JwtUtil;
import com.rishabhgupta3107.taskmanagement.backend_springboot.service.CustomUserDetailsService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;

public class AuthControllerTest {

  @Mock private AuthenticationManager authenticationManager;

  @Mock private CustomUserDetailsService userDetailsService;

  @Mock private JwtUtil jwtUtil;

  @InjectMocks private AuthController authController;

  @BeforeEach
  public void setUp() {
    MockitoAnnotations.openMocks(this);
  }

  @Test
  public void testCreateAuthenticationToken() throws Exception {
    AuthenticationRequest request = new AuthenticationRequest("john", "password");
    UserDetails userDetails = mock(UserDetails.class);
    String token = "test.jwt.token";

    when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
        .thenReturn(null);
    when(userDetailsService.loadUserByUsername("john")).thenReturn(userDetails);
    when(userDetails.getUsername()).thenReturn("john");
    when(jwtUtil.generateToken("john")).thenReturn(token);

    ResponseEntity<?> response = authController.createAuthenticationToken(request);
    AuthenticationResponse authResponse = (AuthenticationResponse) response.getBody();

    assertNotNull(authResponse);
    assertEquals(token, authResponse.getJwt());
  }
}
