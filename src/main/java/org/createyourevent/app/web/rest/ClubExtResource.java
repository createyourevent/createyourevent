package org.createyourevent.app.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.createyourevent.app.domain.Club;
import org.createyourevent.app.repository.ClubExtRepository;
import org.createyourevent.app.repository.ClubRepository;
import org.createyourevent.app.service.ClubExtService;
import org.createyourevent.app.service.ClubService;
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
 * REST controller for managing {@link org.createyourevent.app.domain.Club}.
 */
@RestController
@RequestMapping("/api")
public class ClubExtResource {

    private final Logger log = LoggerFactory.getLogger(ClubExtResource.class);

    private static final String ENTITY_NAME = "club";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ClubExtService clubExtService;

    private final ClubExtRepository clubExtRepository;

    public ClubExtResource(ClubExtService clubExtService, ClubExtRepository clubExtRepository) {
        this.clubExtService = clubExtService;
        this.clubExtRepository = clubExtRepository;
    }

    @GetMapping("/clubs/byUser/active")
    public List<Club> getAllClubsByUserAndActive() {
        log.debug("REST request to get a page of Clubs");
        List<Club> r = this.clubExtService.findByUserIsCurrentUserAndActive();
        return r;
    }

    @GetMapping("/clubs/{id}/clubByOrganizationId")
    public Club getClubByOrganizationId(@PathVariable Long id) {
        log.debug("REST request to get Club by organization id : {}", id);
        Club club = clubExtRepository.findByOrganizationId(id);
        return club;
    }
}
