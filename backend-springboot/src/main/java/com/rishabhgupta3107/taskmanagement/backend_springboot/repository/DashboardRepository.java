package com.rishabhgupta3107.taskmanagement.backend_springboot.repository;

import com.rishabhgupta3107.taskmanagement.backend_springboot.model.Dashboard;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DashboardRepository extends JpaRepository<Dashboard, Long> {

  List<Dashboard> findByClientIdAndClientOwnerUsernameOrderByCreatedAtDesc(
      Long clientId, String username);

  Optional<Dashboard> findByIdAndClientOwnerUsername(Long id, String username);

  Optional<Dashboard> findByShareTokenAndShareEnabledTrue(String shareToken);

  long countByClientId(Long clientId);

  /** Dashboards with an active report schedule (frequency other than NONE). */
  List<Dashboard> findByScheduleFrequencyNot(String frequency);
}
