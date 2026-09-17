package com.rishabhgupta3107.taskmanagement.backend_springboot.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MetricPointDto {

  @NotBlank(message = "metricKey is required.")
  @Size(max = 60)
  private String metricKey;

  @Size(max = 40)
  private String channel;

  @NotNull(message = "date is required.")
  @JsonFormat(pattern = "yyyy-MM-dd")
  private LocalDate date;

  private double value;
}
