package security;

import com.rishabhgupta3107.taskmanagement.backend_springboot.security.JwtUtil;
import io.jsonwebtoken.Claims;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class JwtUtilTest {

    @Value("${jwt.secret}")
    private String SECRET_KEY;

    private JwtUtil jwtUtil;

    @BeforeEach
    public void setUp() {
        jwtUtil = new JwtUtil();
        ReflectionTestUtils.setField(jwtUtil, "SECRET_KEY", SECRET_KEY);
    }

    @Test
    public void testGenerateToken() {
        String token = jwtUtil.generateToken("john");
        assertNotNull(token);
    }

    @Test
    public void testValidateToken() {
        String token = jwtUtil.generateToken("john");
        boolean isValid = jwtUtil.validateToken(token, "john");
        assertTrue(isValid);
    }

    @Test
    public void testExtractUsername() {
        String token = jwtUtil.generateToken("john");
        String username = jwtUtil.extractUsername(token);
        assertEquals("john", username);
    }

    @Test
    public void testExtractExpiration() {
        String token = jwtUtil.generateToken("john");
        Claims claims = jwtUtil.extractAllClaims(token);
        assertNotNull(claims.getExpiration());
    }
}