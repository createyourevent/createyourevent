package org.createyourevent.app.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.createyourevent.app.domain.Building;
import org.createyourevent.app.repository.BuildingExtRepository;
import org.createyourevent.app.repository.BuildingRepository;
import org.createyourevent.app.service.BuildingExtService;
import org.createyourevent.app.service.BuildingService;
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
 * REST controller for managing {@link org.createyourevent.app.domain.Building}.
 */
@RestController
@RequestMapping("/api")
public class BuildingExtResource {

    private final Logger log = LoggerFactory.getLogger(BuildingExtResource.class);

    private static final String ENTITY_NAME = "building";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final BuildingExtService buildingExtService;

    private final BuildingExtRepository buildingExtRepository;

    public BuildingExtResource(BuildingExtService buildingExtService, BuildingExtRepository buildingExtRepository) {
        this.buildingExtService = buildingExtService;
        this.buildingExtRepository = buildingExtRepository;
    }

    @GetMapping("/buildings/byUser/active")
    public List<Building> getAllClubsByUserAndActive() {
        log.debug("REST request to get a page of Buildings");
        List<Building> r = this.buildingExtService.findByUserIsCurrentUserAndActive();
        return r;
    }

    @GetMapping("/buildings/{id}/buildingByOrganizationId")
    public Building getClubByOrganizationId(@PathVariable Long id) {
        log.debug("REST request to get Building by organization id : {}", id);
        Building b = buildingExtRepository.findByOrganizationId(id);
        return b;
    }
}
