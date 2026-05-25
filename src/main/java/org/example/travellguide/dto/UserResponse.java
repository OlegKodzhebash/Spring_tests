package org.example.travellguide.dto;

import org.example.travellguide.model.AppUser;

public class UserResponse {
    private Long id;
    private String login;
    private String phone;

    public UserResponse() {
    }

    public UserResponse(AppUser user) {
        this.id = user.getId();
        this.login = user.getLogin();
        this.phone = user.getPhone();
    }

    public Long getId() {
        return id;
    }

    public String getLogin() {
        return login;
    }

    public String getPhone() {
        return phone;
    }
}