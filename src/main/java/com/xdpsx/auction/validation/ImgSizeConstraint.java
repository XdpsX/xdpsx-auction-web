package com.xdpsx.auction.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Documented
@Target({ ElementType.FIELD })
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = { ImgSizeValidator.class })
public @interface ImgSizeConstraint {
    String message() default "Invalid image size";
    int minWidth();
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
