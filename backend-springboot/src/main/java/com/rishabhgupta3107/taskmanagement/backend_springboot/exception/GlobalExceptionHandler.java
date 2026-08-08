package com.rishabhgupta3107.taskmanagement.backend_springboot.exception;

import jakarta.persistence.EntityNotFoundException;
import java.time.Instant;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/** Translates exceptions into consistent JSON error responses with correct HTTP status codes. */
@RestControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(EntityNotFoundException.class)
  public ResponseEntity<Map<String, Object>> handleNotFound(EntityNotFoundException ex) {
    return build(HttpStatus.NOT_FOUND, ex.getMessage());
  }

  @ExceptionHandler({BadCredentialsException.class, UsernameNotFoundException.class})
  public ResponseEntity<Map<String, Object>> handleAuth(RuntimeException ex) {
    return build(HttpStatus.UNAUTHORIZED, "Incorrect username or password.");
  }

  @ExceptionHandler(AccessDeniedException.class)
  public ResponseEntity<Map<String, Object>> handleAccessDenied(AccessDeniedException ex) {
    return build(HttpStatus.FORBIDDEN, "You do not have access to this resource.");
  }

  @ExceptionHandler(DuplicateUsernameException.class)
  public ResponseEntity<Map<String, Object>> handleDuplicate(DuplicateUsernameException ex) {
    return build(HttpStatus.CONFLICT, ex.getMessage());
  }

  @ExceptionHandler(IllegalArgumentException.class)
  public ResponseEntity<Map<String, Object>> handleIllegalArgument(IllegalArgumentException ex) {
    return build(HttpStatus.BAD_REQUEST, ex.getMessage());
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<Map<String, Object>> handleValidation(MethodArgumentNotValidException ex) {
    Map<String, String> fieldErrors = new HashMap<>();
    ex.getBindingResult()
        .getFieldErrors()
        .forEach(error -> fieldErrors.put(error.getField(), error.getDefaultMessage()));
    Map<String, Object> body = baseBody(HttpStatus.BAD_REQUEST, "Validation failed.");
    body.put("fieldErrors", fieldErrors);
    return ResponseEntity.badRequest().body(body);
  }

  private ResponseEntity<Map<String, Object>> build(HttpStatus status, String message) {
    return ResponseEntity.status(status).body(baseBody(status, message));
  }

  private Map<String, Object> baseBody(HttpStatus status, String message) {
    Map<String, Object> body = new LinkedHashMap<>();
    body.put("timestamp", Instant.now().toString());
    body.put("status", status.value());
    body.put("error", status.getReasonPhrase());
    body.put("message", message);
    return body;
  }
}
