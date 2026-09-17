package com.rishabhgupta3107.taskmanagement.backend_springboot.dto;

import com.rishabhgupta3107.taskmanagement.backend_springboot.model.Widget;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

/** Used for both widget creation/update and in responses (id is null on create). */
@Getter
@Setter
public class WidgetDto {

  private Long id;

  @NotNull(message = "Widget type is required.")
  private Widget.WidgetType type;

  @NotBlank(message = "Widget title is required.")
  @Size(max = 120)
  private String title;

  @Size(max = 60)
  private String metricKey;

  @Size(max = 10)
  private String aggregation;

  private int position;
}
