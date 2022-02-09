package org.createyourevent.app.web.rest;

import org.createyourevent.app.domain.EventComment;
import org.createyourevent.app.service.EventCommentExtensionService;
import org.createyourevent.app.service.EventCommentService;
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
 * REST controller for managing {@link org.createyourevent.domain.EventComment}.
 */
@RestController
@RequestMapping("/api")
public class EventCommentExtensionResource {

    private final Logger log = LoggerFactory.getLogger(EventCommentResource.class);

    private static final String ENTITY_NAME = "eventComment";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final EventCommentExtensionService eventCommentExtensionService;

    public EventCommentExtensionResource(EventCommentExtensionService eventCommentExtensionService) {
        this.eventCommentExtensionService = eventCommentExtensionService;
    }


    @GetMapping("/event-comments/{eventId}/getEventCommentByEventId")
    public List<EventComment> getEventCommentByEventId(@PathVariable Long eventId) {
        log.debug("REST request to get EventComment by Event ID");
        List<EventComment> eventComments = eventCommentExtensionService.findAllByEventId(eventId);
        return eventComments;
    }

    @GetMapping("/event-comments/{eventId}/{userId}/getEventCommentByEventIdAndUserId")
    public List<EventComment> getEventCommentByEventIdAndUserId(@PathVariable Long eventId, @PathVariable String userId) {
        log.debug("REST request to get EventComment by Event ID and User ID");
        List<EventComment> eventComments = eventCommentExtensionService.findAllByEventIdAndUserId(eventId, userId);
        return eventComments;
    }
}
