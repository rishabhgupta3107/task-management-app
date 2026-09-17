package com.rishabhgupta3107.taskmanagement.backend_springboot.controller;

import com.rishabhgupta3107.taskmanagement.backend_springboot.dto.ClientRequest;
import com.rishabhgupta3107.taskmanagement.backend_springboot.dto.ClientResponse;
import com.rishabhgupta3107.taskmanagement.backend_springboot.service.ClientService;
import jakarta.validation.Valid;
import java.security.Principal;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/clients")
@RequiredArgsConstructor
public class ClientController {

  private final ClientService clientService;

  @GetMapping
  public List<ClientResponse> list(Principal principal) {
    return clientService.list(principal.getName());
  }

  @GetMapping("/{id}")
  public ClientResponse get(@PathVariable Long id, Principal principal) {
    return clientService.get(id, principal.getName());
  }

  @PostMapping
  public ResponseEntity<ClientResponse> create(
      @Valid @RequestBody ClientRequest request, Principal principal) {
    return ResponseEntity.status(HttpStatus.CREATED)
        .body(clientService.create(request, principal.getName()));
  }

  @PutMapping("/{id}")
  public ClientResponse update(
      @PathVariable Long id, @Valid @RequestBody ClientRequest request, Principal principal) {
    return clientService.update(id, request, principal.getName());
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable Long id, Principal principal) {
    clientService.delete(id, principal.getName());
    return ResponseEntity.noContent().build();
  }

  @PostMapping("/{id}/ingest-token/rotate")
  public ClientResponse rotateIngestToken(@PathVariable Long id, Principal principal) {
    return clientService.rotateIngestToken(id, principal.getName());
  }
}
