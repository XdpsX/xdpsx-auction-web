package com.xdpsx.auction.model.enums;

import lombok.Getter;

@Getter
public enum EmailTemplateName {
    EMAIL_VALIDATION("email_validation")
    ;

    private final String name;

    EmailTemplateName(String name) {
        this.name = name;
    }
}
