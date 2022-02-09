package org.createyourevent.app.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.createyourevent.app.domain.OrganizationStarRating;
import org.createyourevent.app.repository.OrganizationStarRatingExtRepository;
import org.createyourevent.app.repository.OrganizationStarRatingRepository;
import org.createyourevent.app.service.OrganizationStarRatingExtService;
import org.createyourevent.app.service.OrganizationStarRatingService;
import org.createyourevent.app.web.rest.errors.BadRequestAlertException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link org.createyourevent.app.domain.OrganizationStarRating}.
 */
@RestController
@RequestMapping("/api")
public class OrganizationStarRatingExtResource {

    private final Logger log = LoggerFactory.getLogger(OrganizationStarRatingExtResource.class);

    private static final String ENTITY_NAME = "organizationStarRating";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final OrganizationStarRatingExtService organizationStarRatingExtService;

    private final OrganizationStarRatingExtRepository organizationStarRatingExtRepository;

    public OrganizationStarRatingExtResource(
        OrganizationStarRatingExtService organizationStarRatingExtService,
        OrganizationStarRatingExtRepository organizationStarRatingExtRepository
    ) {
        this.organizationStarRatingExtService = organizationStarRatingExtService;
        this.organizationStarRatingExtRepository = organizationStarRatingExtRepository;
    }

     /**
     * {@code GET  /organization-star-ratings} : get all the organizationStarRatings.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of organizationStarRatings in body.
     */
    @GetMapping("/organization-star-ratings/{organizationId}/findOrganizationStarRatingsByOrganizationId")
    public List<OrganizationStarRating> findOrganizationStarRatingsByOrganizationId(@PathVariable Long organizationId) {
        log.debug("REST request to get a all of OrganizationStarRatings by organizationid");
        List<OrganizationStarRating> all = organizationStarRatingExtService.findByOrganizationId(organizationId);
        return all;
    }

        /**
     * {@code GET  /organization-star-ratings} : get all the organizationStarRatings.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of organizationStarRatings in body.
     */
    @GetMapping("/organization-star-ratings/{organizationId}/{userId}/findOrganizationStarRatingsByOrganizationIdAndUserId")
    public OrganizationStarRating findOrganizationStarRatingsByOrganizationIdAndUserId(@PathVariable Long organizationId, @PathVariable String userId) {
        log.debug("REST request to get a all of OrganizationStarRatings by organizationid and userid");
        OrganizationStarRating one = organizationStarRatingExtService.findByOrganizationIdAndUserId(organizationId, userId);
        return one;
    }
}
