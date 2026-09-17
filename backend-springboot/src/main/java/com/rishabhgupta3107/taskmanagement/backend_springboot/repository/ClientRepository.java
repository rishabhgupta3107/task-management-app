package com.rishabhgupta3107.taskmanagement.backend_springboot.repository;

import com.rishabhgupta3107.taskmanagement.backend_springboot.model.Client;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClientRepository extends JpaRepository<Client, Long> {

  List<Client> findByOwnerUsernameOrderByNameAsc(String username);

  Optional<Client> findByIdAndOwnerUsername(Long id, String username);

  Optional<Client> findByIngestToken(String ingestToken);
}
