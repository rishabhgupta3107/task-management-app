package com.rishabhgupta3107.taskmanagement.backend_springboot.repository;

import com.rishabhgupta3107.taskmanagement.backend_springboot.model.MetricPoint;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MetricPointRepository extends JpaRepository<MetricPoint, Long> {

  List<MetricPoint> findByClientIdAndDateBetweenOrderByDateAsc(
      Long clientId, LocalDate from, LocalDate to);

  List<MetricPoint> findByClientIdOrderByDateAsc(Long clientId);
}
