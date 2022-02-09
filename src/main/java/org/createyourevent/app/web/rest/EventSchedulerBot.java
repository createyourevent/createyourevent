package org.createyourevent.app.web.rest;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

import org.createyourevent.app.domain.Event;
import org.createyourevent.app.domain.EventComment;
import org.createyourevent.app.domain.EventLikeDislike;
import org.createyourevent.app.domain.EventProductOrder;
import org.createyourevent.app.domain.Product;
import org.createyourevent.app.domain.enumeration.EventStatus;
import org.createyourevent.app.service.EventCommentExtensionService;
import org.createyourevent.app.service.EventCommentService;
import org.createyourevent.app.service.EventExtensionService;
import org.createyourevent.app.service.EventLikeDislikeExtensionService;
import org.createyourevent.app.service.EventLikeDislikeService;
import org.createyourevent.app.service.EventProductOrderExtensionService;
import org.createyourevent.app.service.EventProductOrderService;
import org.createyourevent.app.service.EventService;
import org.createyourevent.app.service.ProductService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class EventSchedulerBot {

    private final Logger log = LoggerFactory.getLogger(EventSchedulerBot.class);
    private final EventExtensionService eventExtensionService;
    private final EventService eventService;
    private final EventProductOrderExtensionService eventProductOrderExtensionService;
    private final ProductService productService;
    private final EventProductOrderService eventProductOrderService;
    private final EventCommentExtensionService eventCommentExtensionService;
    private final EventCommentService eventCommentService;
    private final EventLikeDislikeExtensionService eventLikeDislikeExtensionService;
    private final EventLikeDislikeService eventLikeDislikeService;

    public EventSchedulerBot(EventExtensionService eventExtensionService,
                             EventService eventService,
                             EventProductOrderExtensionService eventProductOrderExtensionService,
                             ProductService productService,
                             EventProductOrderService eventProductOrderService,
                             EventCommentExtensionService eventCommentExtensionService,
                             EventCommentService eventCommentService,
                             EventLikeDislikeExtensionService eventLikeDislikeExtensionService,
                             EventLikeDislikeService eventLikeDislikeService) {
        this.eventExtensionService = eventExtensionService;
        this.eventService = eventService;
        this.eventProductOrderExtensionService = eventProductOrderExtensionService;
        this.productService = productService;
        this.eventProductOrderService = eventProductOrderService;
        this.eventCommentExtensionService = eventCommentExtensionService;
        this.eventCommentService = eventCommentService;
        this.eventLikeDislikeExtensionService = eventLikeDislikeExtensionService;
        this.eventLikeDislikeService = eventLikeDislikeService;
    }

    // @Scheduled(cron = "0 55 * * * ?")
    public void confirmEventsWith3Days() {

       List<Event> events = eventExtensionService.findAll();

       for (Event event : events) {
           log.debug("Event: " + event.getDateStart());

            LocalDateTime now = LocalDateTime.now();
            LocalDateTime ldt1 = LocalDateTime.of(event.getDateStart().getYear(), event.getDateStart().getMonth() , event.getDateStart().getDayOfMonth(), event.getDateStart().getHour(), event.getDateStart().getMinute(), event.getDateStart().getSecond());
            Duration d1 = Duration.between(now, ldt1);
            Duration d2 = Duration.ofDays(7);
            Duration d3 = Duration.ofDays(5);

            if (d1.compareTo(d2) <= 0) {
                if(event.getStatus() != EventStatus.DEFINITELY) {
                    event.setStatus(EventStatus.DEFINITELY);
                    eventService.save(event);
                }
            }

            if (d1.compareTo(d3) <= 0  && !event.getDefinitelyConfirmed()) {

                List<EventProductOrder> eventProductOrders = eventProductOrderExtensionService.findAllByEventId(event.getId());
                for(EventProductOrder order: eventProductOrders) {
                    Product product = order.getProduct();
                    product.setStock(product.getStock() + order.getAmount());
                    productService.save(product);
                }
                List<EventComment> eventComments = eventCommentExtensionService.findAllByEventId(event.getId());
                for(EventComment eventComment : eventComments) {
                    eventCommentService.delete(eventComment.getId());
                }
                List<EventLikeDislike> eventLikeDislikes = eventLikeDislikeExtensionService.findAllByEventId(event.getId());
                for(EventLikeDislike eventLikeDislike : eventLikeDislikes) {
                    eventLikeDislikeService.delete(eventLikeDislike.getId());
                }

                eventService.delete(event.getId());
            }

       }
    }

}
