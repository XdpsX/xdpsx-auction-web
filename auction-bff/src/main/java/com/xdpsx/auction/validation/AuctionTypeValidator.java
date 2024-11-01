package com.xdpsx.auction.validation;

import com.xdpsx.auction.dto.auction.AuctionRequest;
import com.xdpsx.auction.model.enums.AuctionType;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.math.BigDecimal;

public class AuctionTypeValidator implements ConstraintValidator<AuctionTypeConstraint, AuctionRequest> {

    @Override
    public boolean isValid(AuctionRequest auctionRequest, ConstraintValidatorContext context) {
        if (auctionRequest == null) {
            return true;
        }

        AuctionType auctionType = auctionRequest.getAuctionType();
        BigDecimal stepPrice = auctionRequest.getStepPrice();

        if (auctionType == AuctionType.SEALED_BID && stepPrice != null) {
            addConstraintViolation(context, "Step price must be null for SEALED_BID", "stepPrice");
            return false;
        } else if (auctionType == AuctionType.ENGLISH && stepPrice == null) {
            addConstraintViolation(context, "Step price must not be null for ENGLISH", "stepPrice");
            return false;
        }

        return true;
    }

    private void addConstraintViolation(ConstraintValidatorContext context, String message, String property) {
        context.disableDefaultConstraintViolation();
        context.buildConstraintViolationWithTemplate(message)
                .addPropertyNode(property)
                .addConstraintViolation();
    }
}
