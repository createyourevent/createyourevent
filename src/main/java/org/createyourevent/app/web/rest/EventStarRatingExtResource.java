package org.createyourevent.app.web.rest;

import org.createyourevent.app.domain.EventStarRating;
import org.createyourevent.app.service.EventStarRatingExtService;
import org.createyourevent.app.service.EventStarRatingService;
import org.createyourevent.app.web.rest.errors.BadRequestAlertException;

import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing {@link org.createyourevent.domain.EventStarRating}.
 */
@RestController
@RequestMapping("/api")
public class EventStarRatingExtResource {

    private final Logger log = LoggerFactory.getLogger(EventStarRatingExtResource.class);

    private static final String ENTITY_NAME = "eventStarRating";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final EventStarRatingExtService eventStarRatingExtService;

    public EventStarRatingExtResource(EventStarRatingExtService eventStarRatingExtService) {
        this.eventStarRatingExtService = eventStarRatingExtService;
    }

    @GetMapping("/event-star-ratings/{eventId}/{userId}/getEventStarRatingByEventAndUser")
    public List<EventStarRating> getEventStarRatingByEventAndUser(@PathVariable Long eventId, @PathVariable String userId) {
        log.debug("REST request to get EventStarRating by event and user.");
        List<EventStarRating> eventStarRating = eventStarRatingExtService.findAllEventStarRatingByEventIdAndUserId(eventId, userId);
        return eventStarRating;
    }

    @GetMapping("/event-star-ratings/{eventId}/getEventStarRatingByEvent")
    public List<EventStarRating> getEventStarRatingByEvent(@PathVariable Long eventId) {
        log.debug("REST request to get EventStarRating by event.");
        List<EventStarRating> eventStarRating = eventStarRatingExtService.findAllEventStarRatingByEventId(eventId);
        return eventStarRating;
    }

    @GetMapping("/event-star-ratings/{userId}/getEventStarRatingByUser")
    public List<EventStarRating> getEventStarRatingByUser(@PathVariable String userId) {
        log.debug("REST request to get EventStarRating by user.");
        List<EventStarRating> eventStarRating = eventStarRatingExtService.findAllEventStarRatingByUserId(userId);
        return eventStarRating;
    }

    @GetMapping("/event-star-ratings/{stars}/findAllWhereStarsBiggerAs")
    public List<EventStarRating> findAllWhereStarsBiggerAs(@PathVariable Integer stars) {
        log.debug("REST request to get EventStarRating where stars >= :stars...");
        List<EventStarRating> eventStarRating = eventStarRatingExtService.findAllWhereStarsBiggerAs(stars);
        return eventStarRating;
    }
}
