package com.rishabhgupta3107.taskmanagement.backend_springboot.security;

import lombok.Getter;

@Getter
public class AuthenticationResponse {

    private final String jwt;

    public AuthenticationResponse(String jwt) {
        this.jwt = jwt;
    }
}
