package com.rishabhgupta3107.taskmanagement.backend_springboot.service;

import com.rishabhgupta3107.taskmanagement.backend_springboot.dto.MetricPointDto;
import com.rishabhgupta3107.taskmanagement.backend_springboot.model.Client;
import com.rishabhgupta3107.taskmanagement.backend_springboot.model.MetricPoint;
import com.rishabhgupta3107.taskmanagement.backend_springboot.repository.ClientRepository;
import com.rishabhgupta3107.taskmanagement.backend_springboot.repository.MetricPointRepository;
import jakarta.persistence.EntityNotFoundException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class MetricService {

  private final MetricPointRepository metricRepository;
  private final ClientRepository clientRepository;
  private final ClientService clientService;

  /** Bulk ingest (manual entry, CSV import, or the simple push API all land here). */
  @Transactional
  public int ingest(Long clientId, List<MetricPointDto> points, String username) {
    Client client = clientService.requireOwned(clientId, username);
    return save(client, points);
  }

  /** Token-authenticated ingest for the per-client push API (no user session). */
  @Transactional
  public int ingestByToken(String token, List<MetricPointDto> points) {
    Client client =
        clientRepository
            .findByIngestToken(token)
            .orElseThrow(() -> new EntityNotFoundException("Invalid ingest token"));
    return save(client, points);
  }

  private int save(Client client, List<MetricPointDto> points) {
    List<MetricPoint> entities = new ArrayList<>();
    for (MetricPointDto dto : points) {
      MetricPoint p = new MetricPoint();
      p.setMetricKey(dto.getMetricKey());
      p.setChannel(dto.getChannel());
      p.setDate(dto.getDate());
      p.setValue(dto.getValue());
      p.setClient(client);
      entities.add(p);
    }
    metricRepository.saveAll(entities);
    return entities.size();
  }

  @Transactional(readOnly = true)
  public List<MetricPointDto> query(Long clientId, LocalDate from, LocalDate to, String username) {
    clientService.requireOwned(clientId, username);
    List<MetricPoint> points =
        (from != null && to != null)
            ? metricRepository.findByClientIdAndDateBetweenOrderByDateAsc(clientId, from, to)
            : metricRepository.findByClientIdOrderByDateAsc(clientId);
    return points.stream().map(MetricService::toDto).toList();
  }

  static MetricPointDto toDto(MetricPoint p) {
    MetricPointDto dto = new MetricPointDto();
    dto.setMetricKey(p.getMetricKey());
    dto.setChannel(p.getChannel());
    dto.setDate(p.getDate());
    dto.setValue(p.getValue());
    return dto;
  }
}
