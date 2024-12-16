package com.xdpsx.auction.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.math.BigDecimal;

public class PriceValidator implements ConstraintValidator<PriceConstraint, BigDecimal> {

    @Override
    public boolean isValid(BigDecimal price, ConstraintValidatorContext constraintValidatorContext) {
        if (price != null){
            return price.compareTo(new BigDecimal(0)) > 0;
        }
        return true;
    }
}
