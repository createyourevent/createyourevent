package org.createyourevent.app.web.rest;


import java.time.LocalDateTime;
import java.util.List;

import org.createyourevent.app.domain.EventProductOrder;
import org.createyourevent.app.domain.EventServiceMapOrder;
import org.createyourevent.app.domain.enumeration.PriceType;
import org.createyourevent.app.domain.enumeration.RentStatus;
import org.createyourevent.app.service.EventProductOrderExtensionService;
import org.createyourevent.app.service.EventProductOrderService;
import org.createyourevent.app.service.EventServiceMapOrderExtService;
import org.createyourevent.app.service.EventServiceMapOrderService;
// import org.createyourevent.app.service.MailService;
import org.createyourevent.app.service.ProductService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class ReservationSchedulerBot {

    private final Logger log = LoggerFactory.getLogger(ReservationSchedulerBot.class);
    private final EventProductOrderService eventProductOrderService;
    private final EventProductOrderExtensionService eventProductOrderExtensionService;
    private final ProductService productService;
    private final EventServiceMapOrderService eventServiceMapOrderService;
    private final EventServiceMapOrderExtService eventServiceMapOrderExtService;
    // private final MailService mailService;

    public ReservationSchedulerBot(EventProductOrderService eventProductOrderService, EventProductOrderExtensionService eventProductOrderExtensionService, ProductService productService, EventServiceMapOrderService eventServiceMapOrderService, EventServiceMapOrderExtService eventServiceMapOrderExtService) {
        this.eventProductOrderService = eventProductOrderService;
        this.eventProductOrderExtensionService = eventProductOrderExtensionService;
        this.productService = productService;
        this.eventServiceMapOrderService = eventServiceMapOrderService;
        // this.mailService = mailService;
        this.eventServiceMapOrderExtService = eventServiceMapOrderExtService;
    }

    //@Scheduled(cron = "0 1 * * * ?")
    public void confirmReservations() {
        log.debug("confirmReservations()");
        List<EventProductOrder> eventProductOrders = this.eventProductOrderExtensionService.findAll();

        for(EventProductOrder eventProductOrder: eventProductOrders) {
            if(eventProductOrder.getProduct().getPriceType() == PriceType.RENT) {
                LocalDateTime now = LocalDateTime.now();
                LocalDateTime dateReservation = LocalDateTime.of(eventProductOrder.getDateFrom().getYear(), eventProductOrder.getDateFrom().getMonth() , eventProductOrder.getDateFrom().getDayOfMonth(), eventProductOrder.getDateFrom().getHour(), eventProductOrder.getDateFrom().getMinute(), eventProductOrder.getDateFrom().getSecond());
                if((now.isAfter(dateReservation) || now.isEqual(dateReservation)) && eventProductOrder.getStatus() == RentStatus.BOOKED) {
                    log.debug("eventProductOrder.getProduct().getStock():s" + eventProductOrder.getProduct().getStock());
                    eventProductOrder.setStatus(RentStatus.RENTED);
                    eventProductOrder.getProduct().setStock(eventProductOrder.getProduct().getStock() - eventProductOrder.getAmount());
                    this.productService.save(eventProductOrder.getProduct());
                    this.eventProductOrderService.save(eventProductOrder);
                    log.debug("eventProductOrder.getProduct().getStock():" + eventProductOrder.getProduct().getStock());
                }
            }
        }
    }

    //@Scheduled(cron = "0 1 * * * ?")
    public void backReservations() {
        log.debug("backReservations()");
        List<EventProductOrder> eventProductOrders = this.eventProductOrderExtensionService.findAll();

        for(EventProductOrder eventProductOrder: eventProductOrders) {
            if(eventProductOrder.getProduct().getPriceType() == PriceType.RENT) {
                LocalDateTime now = LocalDateTime.now();
                LocalDateTime dateReservation = LocalDateTime.of(eventProductOrder.getDateUntil().getYear(), eventProductOrder.getDateUntil().getMonth() , eventProductOrder.getDateUntil().getDayOfMonth(), eventProductOrder.getDateUntil().getHour(), eventProductOrder.getDateUntil().getMinute(), eventProductOrder.getDateUntil().getSecond());
                if((now.isAfter(dateReservation) || now.isEqual(dateReservation)) && eventProductOrder.getStatus() == RentStatus.RENTED) {
                    log.debug("eventProductOrder.getProduct().getStock():s" + eventProductOrder.getProduct().getStock());
                    eventProductOrder.setStatus(RentStatus.BACK);
                    eventProductOrder.getProduct().setStock(eventProductOrder.getProduct().getStock() + eventProductOrder.getAmount());
                    this.productService.save(eventProductOrder.getProduct());
                    this.eventProductOrderService.save(eventProductOrder);
                    log.debug("eventProductOrder.getProduct().getStock():" + eventProductOrder.getProduct().getStock());
                }
            }
        }
    }

    //@Scheduled(cron = "0 0 10 * * *")
    public void mailApprovment() {
        log.debug("mailApprovment()");
        List<EventProductOrder> eventProductOrders = this.eventProductOrderExtensionService.findAll();
        List<EventServiceMapOrder> eventServiceMapOrders = this.eventServiceMapOrderExtService.findAll();

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime twoWeeks = now.plusDays(21);


        for(EventProductOrder epo : eventProductOrders) {
            LocalDateTime eventStart = epo.getEvent().getDateStart().toLocalDateTime();
            if(epo.getEvent().getDateStart().toLocalDateTime().isAfter(now) && eventStart.isAfter(twoWeeks) && (epo.getApproved() == null || !epo.getApproved())) {
                // mailService.sendApprovmentMail(epo.getUser(), epo.getEvent(), epo);
            }
        }

        for(EventServiceMapOrder epo : eventServiceMapOrders) {
            LocalDateTime eventStart = epo.getEvent().getDateStart().toLocalDateTime();
            if(epo.getEvent().getDateStart().toLocalDateTime().isAfter(now) && eventStart.isAfter(twoWeeks) && !epo.getApproved()) {
                // mailService.sendApprovmentMail(epo.getServiceMap().getCreateYourEventService().getUser(), epo.getEvent(), epo);
            }
        }
    }
}
