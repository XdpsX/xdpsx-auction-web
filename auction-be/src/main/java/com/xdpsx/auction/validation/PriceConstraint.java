package com.xdpsx.auction.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Documented
@Target({ ElementType.FIELD, ElementType.PARAMETER })
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = { PriceValidator.class })
public @interface PriceConstraint {
    String message() default "Price must greater than 0";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
