package org.createyourevent.app.web.rest;

import java.io.UnsupportedEncodingException;
import java.net.URI;
import java.net.URISyntaxException;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.createyourevent.app.domain.OrganizationReservation;
import org.createyourevent.app.repository.OrganizationReservationExtRepository;
import org.createyourevent.app.repository.OrganizationReservationRepository;
import org.createyourevent.app.service.OrganizationReservationExtService;
import org.createyourevent.app.service.OrganizationReservationService;
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
 * REST controller for managing {@link org.createyourevent.app.domain.OrganizationReservation}.
 */
@RestController
@RequestMapping("/api")
public class OrganizationReservationExtResource {

    private final Logger log = LoggerFactory.getLogger(OrganizationReservationExtResource.class);

    private static final String ENTITY_NAME = "organizationReservation";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final OrganizationReservationExtService organizationReservationExtService;

    private final OrganizationReservationExtRepository organizationReservationExtRepository;

    public OrganizationReservationExtResource(
        OrganizationReservationExtService organizationReservationExtService,
        OrganizationReservationExtRepository organizationReservationExtRepository
    ) {
        this.organizationReservationExtService = organizationReservationExtService;
        this.organizationReservationExtRepository = organizationReservationExtRepository;
    }



    /**
     * {@code GET  /organization-reservations} : get all the organizationReservations.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of organizationReservations in body.
     */
    @GetMapping("/organization-reservations/{eventId}/findOrganizationReservationsByEventId")
    public List<OrganizationReservation> getAllOrganizationReservationsByEventId(@PathVariable Long eventId) {
        log.debug("REST request to get a page of OrganizationReservations by eventId");
        return this.organizationReservationExtService.findByEventId(eventId);
    }

    @GetMapping("/organization-reservations/{organizationId}/findOrganizationReservationsByOrganizationId")
    public List<OrganizationReservation> getAllOrganizationReservationsByOrganizationId(@PathVariable Long organizationId) {
        log.debug("REST request to get a page of OrganizationReservations by organizationId");
        return this.organizationReservationExtService.findAllByOrganizationId(organizationId);
    }

    @GetMapping("/organization-reservations/findAllIOrganizationReservationsWithDateRange")
    public List<OrganizationReservation> findAllOrganizationReservationsWithDateRange(@RequestParam String betweenStart, @RequestParam String betweenEnd ) {
        log.debug("REST request to get Organizationreservation which is public and active and date after...");
        ZonedDateTime s = ZonedDateTime.now();
        ZonedDateTime e = ZonedDateTime.now();
        try {
            s = ZonedDateTime.parse(java.net.URLDecoder.decode(betweenStart, "UTF-8"));
            e = ZonedDateTime.parse(java.net.URLDecoder.decode(betweenEnd, "UTF-8"));
        } catch (UnsupportedEncodingException x) {
            x.printStackTrace();
        }
        List<OrganizationReservation> orders = this.organizationReservationExtService.findAllOrganizationReservationsWithDateFromRange(s,e);
            return orders;
    }

    @GetMapping("/organization-reservations/{userId}/byActiveTrueAndUserIdAndDateUntilSmallerThanNow")
    public List<OrganizationReservation> byActiveTrueAndUserIdAndDateUntilSmallerThanNow(@PathVariable String userId) {
        log.debug("REST request to get a page of OrganizationReservations by byActiveTrueAndUserIdAndDateUntilSmallerThanNow");
        List<OrganizationReservation> l = this.organizationReservationExtService.findAllOrganizationReservationsWhereActiveTrueAndDateUntilSmallerAsNowAndUserId(userId);
        return l;
    }


    @GetMapping("/organization-reservations/{userId}/findOrganizationReservationsByOrganizationWithUserId")
    public List<OrganizationReservation> getAllOrganizationReservationsByOrganizationWidthUserId(@PathVariable String userId) {
        log.debug("REST request to get a page of OrganizationReservations by organization with userId");
        return this.organizationReservationExtService.findAllByOrganizationUserId(userId);
    }

}
