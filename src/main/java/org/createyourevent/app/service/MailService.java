package org.createyourevent.app.service;

public interface MailService {
    void sendMessageWithAttachment(String to, String subject, String text, String pathToAttachment);
    void sendSimpleMessage(String to, String subject, String text) ;
}
