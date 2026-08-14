package com.rishabhgupta3107.taskmanagement.backend_springboot.security;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.rishabhgupta3107.taskmanagement.backend_springboot.security.JwtUtil;
import io.jsonwebtoken.Claims;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

public class JwtUtilTest {

  // Must be >= 256 bits for HS256.
  private static final String TEST_SECRET =
      "test-secret-key-that-is-long-enough-for-hs256-signing-0123456789";

  private JwtUtil jwtUtil;

  @BeforeEach
  public void setUp() {
    jwtUtil = new JwtUtil(TEST_SECRET, 3_600_000L);
  }

  @Test
  public void testGenerateToken() {
    String token = jwtUtil.generateToken("john");
    assertNotNull(token);
  }

  @Test
  public void testValidateToken() {
    String token = jwtUtil.generateToken("john");
    assertTrue(jwtUtil.validateToken(token, "john"));
  }

  @Test
  public void testExtractUsername() {
    String token = jwtUtil.generateToken("john");
    assertEquals("john", jwtUtil.extractUsername(token));
  }

  @Test
  public void testExtractExpiration() {
    String token = jwtUtil.generateToken("john");
    Claims claims = jwtUtil.extractAllClaims(token);
    assertNotNull(claims.getExpiration());
  }
}
