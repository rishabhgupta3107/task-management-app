package com.rishabhgupta3107.taskmanagement.backend_springboot.repository;

import com.rishabhgupta3107.taskmanagement.backend_springboot.model.Widget;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WidgetRepository extends JpaRepository<Widget, Long> {

  List<Widget> findByDashboardIdOrderByPositionAsc(Long dashboardId);

  Optional<Widget> findByIdAndDashboardId(Long id, Long dashboardId);

  long countByDashboardId(Long dashboardId);
}
