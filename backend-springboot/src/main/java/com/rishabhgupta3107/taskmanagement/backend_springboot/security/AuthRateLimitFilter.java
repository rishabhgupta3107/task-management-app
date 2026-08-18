package com.rishabhgupta3107.taskmanagement.backend_springboot.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * Per-IP brute-force limiter for the auth endpoints (login/register). A fixed
 * window of {@code MAX_REQUESTS} per {@code WINDOW_MS}; over the limit returns
 * 429. Pure in-memory / zero external dependencies — good for a single
 * instance. For a multi-instance deploy, back this with Redis or bucket4j.
 */
public class AuthRateLimitFilter extends OncePerRequestFilter {

  private static final int MAX_REQUESTS = 5;
  private static final long WINDOW_MS = 60_000L;

  private final ConcurrentHashMap<String, Window> buckets = new ConcurrentHashMap<>();

  private static final class Window {
    long windowStart;
    int count;
  }

  @Override
  protected boolean shouldNotFilter(HttpServletRequest request) {
    String path = request.getRequestURI();
    boolean isAuthPost =
        "POST".equalsIgnoreCase(request.getMethod())
            && (path.endsWith("/api/auth/login") || path.endsWith("/api/auth/register"));
    return !isAuthPost;
  }

  @Override
  protected void doFilterInternal(
      HttpServletRequest request, HttpServletResponse response, FilterChain chain)
      throws ServletException, IOException {
    String ip = clientIp(request);
    long now = System.currentTimeMillis();
    Window window = buckets.computeIfAbsent(ip, key -> new Window());

    boolean limited;
    synchronized (window) {
      if (now - window.windowStart > WINDOW_MS) {
        window.windowStart = now;
        window.count = 0;
      }
      window.count++;
      limited = window.count > MAX_REQUESTS;
    }

    if (limited) {
      response.setStatus(429);
      response.setHeader("Retry-After", "60");
      response.setContentType("application/json");
      response.getWriter().write("{\"error\":\"Too many attempts. Please try again later.\"}");
      return;
    }
    chain.doFilter(request, response);
  }

  private String clientIp(HttpServletRequest request) {
    String forwarded = request.getHeader("X-Forwarded-For");
    if (forwarded != null && !forwarded.isBlank()) {
      return forwarded.split(",")[0].trim();
    }
    return request.getRemoteAddr();
  }
}
