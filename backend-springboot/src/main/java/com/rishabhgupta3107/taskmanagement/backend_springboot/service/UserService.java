package com.rishabhgupta3107.taskmanagement.backend_springboot.service;

import com.rishabhgupta3107.taskmanagement.backend_springboot.dto.RegisterRequest;
import com.rishabhgupta3107.taskmanagement.backend_springboot.dto.UpdateProfileRequest;
import com.rishabhgupta3107.taskmanagement.backend_springboot.dto.UserProfileResponse;
import com.rishabhgupta3107.taskmanagement.backend_springboot.exception.DuplicateUsernameException;
import com.rishabhgupta3107.taskmanagement.backend_springboot.model.OrgRole;
import com.rishabhgupta3107.taskmanagement.backend_springboot.model.Users;
import com.rishabhgupta3107.taskmanagement.backend_springboot.repository.UsersRepository;
import java.time.LocalDate;
import java.time.Period;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

  private final UsersRepository usersRepository;
  private final PasswordEncoder passwordEncoder;

  @Transactional
  public void register(RegisterRequest request) {
    if (usersRepository.existsByUsername(request.getUsername())) {
      throw new DuplicateUsernameException(
          "Username '" + request.getUsername() + "' is already taken.");
    }

    Users user = new Users();
    user.setUsername(request.getUsername());
    user.setPassword(passwordEncoder.encode(request.getPassword()));
    user.setRole("ROLE_USER");
    user.setOrgRole(OrgRole.WORKER);
    user.setFullName(request.getFullName());
    user.setEmail(request.getEmail());
    user.setDob(request.getDob());
    user.setAvatarUrl(request.getAvatarUrl());

    if (request.getManagerUsername() != null && !request.getManagerUsername().isBlank()) {
      Users manager =
          usersRepository
              .findByUsername(request.getManagerUsername())
              .orElseThrow(
                  () -> new UsernameNotFoundException("Manager not found: " + request.getManagerUsername()));
      user.setManager(manager);
    }
    usersRepository.save(user);
  }

  @Transactional(readOnly = true)
  public UserProfileResponse getProfile(String username) {
    return toResponse(requireUser(username));
  }

  @Transactional
  public UserProfileResponse updateProfile(String username, UpdateProfileRequest request) {
    Users user = requireUser(username);
    user.setFullName(request.getFullName());
    user.setEmail(request.getEmail());
    user.setDob(request.getDob());
    user.setAvatarUrl(request.getAvatarUrl());
    user.setTitle(request.getTitle());
    user.setBio(request.getBio());
    user.setTimezone(request.getTimezone());
    return toResponse(usersRepository.save(user));
  }

  private Users requireUser(String username) {
    return usersRepository
        .findByUsername(username)
        .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
  }

  private UserProfileResponse toResponse(Users user) {
    UserProfileResponse response = new UserProfileResponse();
    response.setUsername(user.getUsername());
    response.setFullName(user.getFullName());
    response.setEmail(user.getEmail());
    response.setDob(user.getDob());
    response.setAge(calculateAge(user.getDob()));
    response.setAvatarUrl(user.getAvatarUrl());
    response.setTitle(user.getTitle());
    response.setBio(user.getBio());
    response.setTimezone(user.getTimezone());
    response.setCreatedAt(user.getCreatedAt());

    OrgRole orgRole = user.getOrgRole() != null ? user.getOrgRole() : OrgRole.WORKER;
    response.setOrgRole(orgRole);
    response.setCanManageTeam(orgRole.canManageTeam());
    if (user.getManager() != null) {
      response.setManagerUsername(user.getManager().getUsername());
      response.setManagerName(user.getManager().getFullName());
    }
    return response;
  }

  private Integer calculateAge(LocalDate dob) {
    return dob == null ? null : Period.between(dob, LocalDate.now()).getYears();
  }
}
