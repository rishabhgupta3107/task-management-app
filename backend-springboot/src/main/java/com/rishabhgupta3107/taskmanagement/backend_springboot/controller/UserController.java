package com.rishabhgupta3107.taskmanagement.backend_springboot.controller;

import com.rishabhgupta3107.taskmanagement.backend_springboot.dto.UpdateProfileRequest;
import com.rishabhgupta3107.taskmanagement.backend_springboot.dto.UserProfileResponse;
import com.rishabhgupta3107.taskmanagement.backend_springboot.service.UserService;
import jakarta.validation.Valid;
import java.security.Principal;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

  private final UserService userService;

  @GetMapping("/me")
  public UserProfileResponse getMyProfile(Principal principal) {
    return userService.getProfile(principal.getName());
  }

  @PutMapping("/me")
  public UserProfileResponse updateMyProfile(
      @Valid @RequestBody UpdateProfileRequest request, Principal principal) {
    return userService.updateProfile(principal.getName(), request);
  }
}
