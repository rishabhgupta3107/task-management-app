package com.rishabhgupta3107.taskmanagement.backend_springboot.controller;

import com.rishabhgupta3107.taskmanagement.backend_springboot.dto.AddMemberRequest;
import com.rishabhgupta3107.taskmanagement.backend_springboot.dto.TeamMemberResponse;
import com.rishabhgupta3107.taskmanagement.backend_springboot.dto.UpdateMemberRequest;
import com.rishabhgupta3107.taskmanagement.backend_springboot.service.TeamService;
import jakarta.validation.Valid;
import java.security.Principal;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/team")
@RequiredArgsConstructor
public class TeamController {

  private final TeamService teamService;

  @GetMapping
  public List<TeamMemberResponse> getMyTeam(Principal principal) {
    return teamService.getReports(principal.getName());
  }

  @PostMapping("/members")
  public TeamMemberResponse addMember(
      @Valid @RequestBody AddMemberRequest request, Principal principal) {
    return teamService.addMember(principal.getName(), request.getUsername());
  }

  @PutMapping("/members/{username}")
  public TeamMemberResponse updateMember(
      @PathVariable String username,
      @RequestBody UpdateMemberRequest request,
      Principal principal) {
    return teamService.updateMember(principal.getName(), username, request);
  }
}
