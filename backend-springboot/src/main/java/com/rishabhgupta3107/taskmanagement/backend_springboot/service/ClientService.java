package com.rishabhgupta3107.taskmanagement.backend_springboot.service;

import com.rishabhgupta3107.taskmanagement.backend_springboot.dto.ClientRequest;
import com.rishabhgupta3107.taskmanagement.backend_springboot.dto.ClientResponse;
import com.rishabhgupta3107.taskmanagement.backend_springboot.model.Client;
import com.rishabhgupta3107.taskmanagement.backend_springboot.model.Users;
import com.rishabhgupta3107.taskmanagement.backend_springboot.repository.ClientRepository;
import com.rishabhgupta3107.taskmanagement.backend_springboot.repository.DashboardRepository;
import com.rishabhgupta3107.taskmanagement.backend_springboot.repository.UsersRepository;
import jakarta.persistence.EntityNotFoundException;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Clients are scoped to the agency user (owner) that created them. */
@Service
@RequiredArgsConstructor
public class ClientService {

  private final ClientRepository clientRepository;
  private final DashboardRepository dashboardRepository;
  private final UsersRepository usersRepository;

  @Transactional(readOnly = true)
  public List<ClientResponse> list(String username) {
    return clientRepository.findByOwnerUsernameOrderByNameAsc(username).stream()
        .map(this::toResponse)
        .toList();
  }

  @Transactional(readOnly = true)
  public ClientResponse get(Long id, String username) {
    return toResponse(requireOwned(id, username));
  }

  @Transactional
  public ClientResponse create(ClientRequest request, String username) {
    Users owner =
        usersRepository
            .findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
    Client client = new Client();
    apply(request, client);
    client.setOwner(owner);
    client.setIngestToken(newIngestToken());
    return toResponse(clientRepository.save(client));
  }

  @Transactional
  public ClientResponse rotateIngestToken(Long id, String username) {
    Client client = requireOwned(id, username);
    client.setIngestToken(newIngestToken());
    return toResponse(clientRepository.save(client));
  }

  @Transactional
  public ClientResponse update(Long id, ClientRequest request, String username) {
    Client client = requireOwned(id, username);
    apply(request, client);
    return toResponse(clientRepository.save(client));
  }

  @Transactional
  public void delete(Long id, String username) {
    clientRepository.delete(requireOwned(id, username));
  }

  /** Shared ownership guard used by other services. */
  @Transactional(readOnly = true)
  public Client requireOwned(Long id, String username) {
    return clientRepository
        .findByIdAndOwnerUsername(id, username)
        .orElseThrow(() -> new EntityNotFoundException("Client not found"));
  }

  private void apply(ClientRequest request, Client client) {
    client.setName(request.getName());
    client.setIndustry(request.getIndustry());
    client.setBrandColor(request.getBrandColor());
    client.setLogoUrl(request.getLogoUrl());
  }

  private ClientResponse toResponse(Client client) {
    ClientResponse dto = new ClientResponse();
    dto.setId(client.getId());
    dto.setName(client.getName());
    dto.setIndustry(client.getIndustry());
    dto.setBrandColor(client.getBrandColor());
    dto.setLogoUrl(client.getLogoUrl());
    dto.setIngestToken(client.getIngestToken());
    dto.setCreatedAt(client.getCreatedAt());
    dto.setDashboardCount(dashboardRepository.countByClientId(client.getId()));
    return dto;
  }

  private String newIngestToken() {
    return "ing_" + UUID.randomUUID().toString().replace("-", "");
  }
}

