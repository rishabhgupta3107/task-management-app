package com.rishabhgupta3107.taskmanagement.backend_springboot.controller;

import com.rishabhgupta3107.taskmanagement.backend_springboot.dto.RegisterRequest;
import com.rishabhgupta3107.taskmanagement.backend_springboot.security.AuthenticationRequest;
import com.rishabhgupta3107.taskmanagement.backend_springboot.security.AuthenticationResponse;
import com.rishabhgupta3107.taskmanagement.backend_springboot.security.JwtUtil;
import com.rishabhgupta3107.taskmanagement.backend_springboot.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

  private final AuthenticationManager authenticationManager;
  private final JwtUtil jwtUtil;
  private final UserService userService;

  @PostMapping("/login")
  public ResponseEntity<AuthenticationResponse> login(
      @Valid @RequestBody AuthenticationRequest request) {
    // A bad password raises BadCredentialsException, mapped to 401 by the global handler.
    authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));

    String jwt = jwtUtil.generateToken(request.getUsername());
    return ResponseEntity.ok(new AuthenticationResponse(jwt));
  }

  @PostMapping("/register")
  public ResponseEntity<Void> register(@Valid @RequestBody RegisterRequest request) {
    userService.register(request);
    return ResponseEntity.status(HttpStatus.CREATED).build();
  }
}
