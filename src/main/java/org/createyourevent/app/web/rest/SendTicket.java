package org.createyourevent.app.web.rest;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.createyourevent.app.domain.Reservation;
import org.createyourevent.app.service.MailService;
import org.createyourevent.app.service.ReservationService;
import org.createyourevent.app.util.PdfGenaratorUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring5.SpringTemplateEngine;

@RestController
@RequestMapping("/api/send-ticket")
public class SendTicket {

    private final Logger log = LoggerFactory.getLogger(SendTicket.class);

    private final MailService mailService;
    private final ReservationService reservationService;

    @Autowired
    private SpringTemplateEngine templateEngine;

    public SendTicket(MailService mailService, ReservationService reservationService) {
        this.mailService = mailService;
        this.reservationService = reservationService;
    }


    @PostMapping(value = "/{reservationId}/{loc}/uploadPdf")
    public void sendPdf(@RequestParam("file") MultipartFile formData, @PathVariable Long reservationId, @RequestParam String mail, @PathVariable String loc) {
        log.debug("sendPdf " + formData);
        String filePath = "/tmp";
        File f1 = new File(filePath+"/ticket-" + reservationId + "-" + mail + ".pdf");
        try {
            formData.transferTo(f1);
            Reservation reservation = this.reservationService.findOne(reservationId).get();
            String subject = "Ticket für " + reservation.getEvent().getName();

            String l = loc;
            Locale locale = Locale.forLanguageTag(l);
            Context context = new Context(locale);
            context.setVariable("eventname", reservation.getEvent().getName());

            String html = templateEngine.process("mailticket", context);
            String text = html;
            String to = mail;
            String path = f1.getAbsolutePath();
            mailService.sendMessageWithAttachment(to, subject, text, path);
            f1.delete();
        } catch (IllegalStateException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
