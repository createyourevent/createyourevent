package org.createyourevent.app.web.rest;

import org.createyourevent.app.domain.EventProductRatingComment;
import org.createyourevent.app.service.EventProductRatingCommentExtensionService;
import org.createyourevent.app.service.EventProductRatingCommentService;
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
 * REST controller for managing {@link org.createyourevent.domain.EventProductRatingComment}.
 */
@RestController
@RequestMapping("/api")
public class EventProductRatingCommentExtensionResource {

    private final Logger log = LoggerFactory.getLogger(EventProductRatingCommentResource.class);

    private static final String ENTITY_NAME = "eventProductRatingComment";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final EventProductRatingCommentExtensionService eventProductRatingCommentExtensionService;

    public EventProductRatingCommentExtensionResource(EventProductRatingCommentExtensionService eventProductRatingCommentExtensionService) {
        this.eventProductRatingCommentExtensionService = eventProductRatingCommentExtensionService;
    }

    @GetMapping("/event-product-rating-comments/{eventId}/{productId}")
    public List<EventProductRatingComment> getEventProductRatingComment(@PathVariable Long eventId, @PathVariable Long productId) {
        log.debug("REST request to get EventProductRatingComment by EventId and ProductId: {}");
        List<EventProductRatingComment> eventProductRatingExtensionComment = eventProductRatingCommentExtensionService.findAllByEventIdAndProductId(eventId, productId);
        return eventProductRatingExtensionComment;
    }
}
