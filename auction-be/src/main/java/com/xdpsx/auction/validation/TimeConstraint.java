package com.xdpsx.auction.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Constraint(validatedBy = TimeValidator.class)
@Target({ ElementType.TYPE })
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface TimeConstraint {
    String message() default "Invalid auction time";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
