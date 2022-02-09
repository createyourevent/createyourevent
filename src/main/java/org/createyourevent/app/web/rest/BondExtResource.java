package org.createyourevent.app.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.createyourevent.app.domain.Bond;
import org.createyourevent.app.repository.BondExtRepository;
import org.createyourevent.app.repository.BondRepository;
import org.createyourevent.app.service.BondExtService;
import org.createyourevent.app.service.BondService;
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
 * REST controller for managing {@link org.createyourevent.app.domain.Bond}.
 */
@RestController
@RequestMapping("/api")
public class BondExtResource {

    private final Logger log = LoggerFactory.getLogger(BondExtResource.class);

    private static final String ENTITY_NAME = "bond";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final BondExtService bondExtService;

    private final BondExtRepository bondExtRepository;

    public BondExtResource(BondExtService bondExtService, BondExtRepository bondExtRepository) {
        this.bondExtService = bondExtService;
        this.bondExtRepository = bondExtRepository;
    }



    /**
     * {@code GET  /bonds} : get all the bonds.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of bonds in body.
     */
    @GetMapping("/bonds/findByCode/{code}")
    public List<Bond> getAllBonds(@PathVariable String code) {
        log.debug("REST request to get a page of Bonds by code");
        List<Bond> l = bondExtService.findByCode(code);
        return l;
    }


}
