package org.createyourevent.app.web.rest;

import org.createyourevent.app.domain.EventLikeDislike;
import org.createyourevent.app.service.EventLikeDislikeExtensionService;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;

import org.springframework.web.bind.annotation.*;


import java.util.List;


/**
 * REST controller for managing {@link org.createyourevent.domain.EventLikeDislike}.
 */
@RestController
@RequestMapping("/api")
public class EventLikeDislikeExtensionResource {

    private final Logger log = LoggerFactory.getLogger(EventLikeDislikeExtensionResource.class);

    private static final String ENTITY_NAME = "eventLikeDislike";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final EventLikeDislikeExtensionService eventLikeDislikeExtensionService;

    public EventLikeDislikeExtensionResource(EventLikeDislikeExtensionService eventLikeDislikeExtensionService) {
        this.eventLikeDislikeExtensionService = eventLikeDislikeExtensionService;
    }

    @GetMapping("/event-like-dislikes/{eventId}/getEventLikeDislikeByEventId")
    public List<EventLikeDislike> getEventLikeDislikeByEventId(@PathVariable Long eventId) {
        log.debug("REST request to get EventLikeDislike by Event ID : {}", eventId);
        List<EventLikeDislike> eventLikeDislikes = eventLikeDislikeExtensionService.findAllByEventId(eventId);
        return eventLikeDislikes;
    }

    @GetMapping("/event-like-dislikes/{eventId}/{userId}/getEventLikeDislikeByEventIdAndUserId")
    public List<EventLikeDislike> getEventLikeDislikeByEventIdAndUserId(@PathVariable Long eventId, @PathVariable String userId) {
        log.debug("REST request to get EventLikeDislike by Event ID and User ID");
        List<EventLikeDislike> eventLikeDislikes = eventLikeDislikeExtensionService.findAllByEventIdAndUserId(eventId, userId);
        return eventLikeDislikes;
    }
}
