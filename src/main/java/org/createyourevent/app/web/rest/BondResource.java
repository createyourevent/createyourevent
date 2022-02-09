package org.createyourevent.app.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.createyourevent.app.domain.Bond;
import org.createyourevent.app.repository.BondRepository;
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
public class BondResource {

    private final Logger log = LoggerFactory.getLogger(BondResource.class);

    private static final String ENTITY_NAME = "bond";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final BondService bondService;

    private final BondRepository bondRepository;

    public BondResource(BondService bondService, BondRepository bondRepository) {
        this.bondService = bondService;
        this.bondRepository = bondRepository;
    }

    /**
     * {@code POST  /bonds} : Create a new bond.
     *
     * @param bond the bond to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new bond, or with status {@code 400 (Bad Request)} if the bond has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/bonds")
    public ResponseEntity<Bond> createBond(@RequestBody Bond bond) throws URISyntaxException {
        log.debug("REST request to save Bond : {}", bond);
        if (bond.getId() != null) {
            throw new BadRequestAlertException("A new bond cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Bond result = bondService.save(bond);
        return ResponseEntity
            .created(new URI("/api/bonds/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /bonds/:id} : Updates an existing bond.
     *
     * @param id the id of the bond to save.
     * @param bond the bond to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated bond,
     * or with status {@code 400 (Bad Request)} if the bond is not valid,
     * or with status {@code 500 (Internal Server Error)} if the bond couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/bonds/{id}")
    public ResponseEntity<Bond> updateBond(@PathVariable(value = "id", required = false) final Long id, @RequestBody Bond bond)
        throws URISyntaxException {
        log.debug("REST request to update Bond : {}, {}", id, bond);
        if (bond.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, bond.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!bondRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Bond result = bondService.save(bond);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, bond.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /bonds/:id} : Partial updates given fields of an existing bond, field will ignore if it is null
     *
     * @param id the id of the bond to save.
     * @param bond the bond to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated bond,
     * or with status {@code 400 (Bad Request)} if the bond is not valid,
     * or with status {@code 404 (Not Found)} if the bond is not found,
     * or with status {@code 500 (Internal Server Error)} if the bond couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/bonds/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Bond> partialUpdateBond(@PathVariable(value = "id", required = false) final Long id, @RequestBody Bond bond)
        throws URISyntaxException {
        log.debug("REST request to partial update Bond partially : {}, {}", id, bond);
        if (bond.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, bond.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!bondRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Bond> result = bondService.partialUpdate(bond);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, bond.getId().toString())
        );
    }

    /**
     * {@code GET  /bonds} : get all the bonds.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of bonds in body.
     */
    @GetMapping("/bonds")
    public ResponseEntity<List<Bond>> getAllBonds(Pageable pageable) {
        log.debug("REST request to get a page of Bonds");
        Page<Bond> page = bondService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /bonds/:id} : get the "id" bond.
     *
     * @param id the id of the bond to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the bond, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/bonds/{id}")
    public ResponseEntity<Bond> getBond(@PathVariable Long id) {
        log.debug("REST request to get Bond : {}", id);
        Optional<Bond> bond = bondService.findOne(id);
        return ResponseUtil.wrapOrNotFound(bond);
    }

    /**
     * {@code DELETE  /bonds/:id} : delete the "id" bond.
     *
     * @param id the id of the bond to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/bonds/{id}")
    public ResponseEntity<Void> deleteBond(@PathVariable Long id) {
        log.debug("REST request to delete Bond : {}", id);
        bondService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
