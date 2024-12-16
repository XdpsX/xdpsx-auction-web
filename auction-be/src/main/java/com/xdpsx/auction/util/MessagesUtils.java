package com.xdpsx.auction.util;

import org.slf4j.helpers.FormattingTuple;
import org.slf4j.helpers.MessageFormatter;
import org.springframework.context.i18n.LocaleContextHolder;

import java.util.MissingResourceException;
import java.util.ResourceBundle;

public class MessagesUtils {
//    static ResourceBundle messageBundle =
//            ResourceBundle.getBundle("i18n.messages", LocaleContextHolder.getLocale());

    public static String getMessage(String errorCode, Object... var2) {
        ResourceBundle messageBundle = ResourceBundle.getBundle("i18n.messages", LocaleContextHolder.getLocale());
        String message;
        try {
            message = messageBundle.getString(errorCode);
        } catch (MissingResourceException ex) {
            // case message_code is not defined.
            message = errorCode;
        }
        FormattingTuple formattingTuple = MessageFormatter.arrayFormat(message, var2);
        return formattingTuple.getMessage();
    }
}
