package com.xdpsx.auction.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Constraint(validatedBy = AuctionTypeValidator.class)
@Target({ ElementType.TYPE })
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface AuctionTypeConstraint {
    String message() default "Invalid auction step price";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
