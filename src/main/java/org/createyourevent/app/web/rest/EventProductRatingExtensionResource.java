package org.createyourevent.app.web.rest;

import java.util.List;

import org.createyourevent.app.domain.EventProductRating;
import org.createyourevent.app.service.EventProductRatingExtensionService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;


/**
 * REST controller for managing {@link org.createyourevent.domain.EventProductRating}.
 */
@RestController
@RequestMapping("/api")
public class EventProductRatingExtensionResource {

    private final Logger log = LoggerFactory.getLogger(EventProductRatingResource.class);

    private static final String ENTITY_NAME = "eventProductRating";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final EventProductRatingExtensionService eventProductRatingExtensionService;

    public EventProductRatingExtensionResource(EventProductRatingExtensionService eventProductRatingExtensionService) {
        this.eventProductRatingExtensionService = eventProductRatingExtensionService;
    }

    @GetMapping("/event-product-ratings/{eventId}/{productId}")
    public List<EventProductRating> getEventProductRatingByEventAndProduct(@PathVariable Long eventId, @PathVariable Long productId) {
        log.debug("REST request to get EventProductRating by event and product.");
        List<EventProductRating> eventProductRating = eventProductRatingExtensionService.findAllByEventIdAndProductId(eventId, productId);
        return eventProductRating;
    }

    @GetMapping("/event-product-ratings/{eventId}/{productId}/{userId}")
    public EventProductRating getEventProductRatingByAllVars(@PathVariable Long eventId, @PathVariable Long productId, @PathVariable String userId) {
        log.debug("REST request to get EventProductRating by all Relations.");
        EventProductRating eventProductRating = eventProductRatingExtensionService.findByEventIdAndProductIdAndUserId(eventId, productId, userId);
        return eventProductRating;
    }
}
