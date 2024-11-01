package com.xdpsx.auction.validation;

import com.xdpsx.auction.dto.auction.AuctionRequest;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.time.ZonedDateTime;

public class TimeValidator implements ConstraintValidator<TimeConstraint, AuctionRequest> {

    @Override
    public boolean isValid(AuctionRequest auctionRequest, ConstraintValidatorContext context) {
        if (auctionRequest == null) {
            return true;
        }

        ZonedDateTime startingTime = auctionRequest.getStartingTime();
        ZonedDateTime endingTime = auctionRequest.getEndingTime();

        if (startingTime != null && endingTime != null && endingTime.isBefore(startingTime)) {
            context.disableDefaultConstraintViolation();
            context.buildConstraintViolationWithTemplate("Ending time must be after starting time")
                    .addPropertyNode("endingTime")
                    .addConstraintViolation();
            return false;
        }

        return true;
    }
}
