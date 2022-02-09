package org.createyourevent.app.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.createyourevent.app.domain.Chips;
import org.createyourevent.app.repository.ChipsRepository;
import org.createyourevent.app.service.ChipsService;
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
 * REST controller for managing {@link org.createyourevent.app.domain.Chips}.
 */
@RestController
@RequestMapping("/api")
public class ChipsResource {

    private final Logger log = LoggerFactory.getLogger(ChipsResource.class);

    private static final String ENTITY_NAME = "chips";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ChipsService chipsService;

    private final ChipsRepository chipsRepository;

    public ChipsResource(ChipsService chipsService, ChipsRepository chipsRepository) {
        this.chipsService = chipsService;
        this.chipsRepository = chipsRepository;
    }

    /**
     * {@code POST  /chips} : Create a new chips.
     *
     * @param chips the chips to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new chips, or with status {@code 400 (Bad Request)} if the chips has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/chips")
    public ResponseEntity<Chips> createChips(@RequestBody Chips chips) throws URISyntaxException {
        log.debug("REST request to save Chips : {}", chips);
        if (chips.getId() != null) {
            throw new BadRequestAlertException("A new chips cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Chips result = chipsService.save(chips);
        return ResponseEntity
            .created(new URI("/api/chips/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /chips/:id} : Updates an existing chips.
     *
     * @param id the id of the chips to save.
     * @param chips the chips to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated chips,
     * or with status {@code 400 (Bad Request)} if the chips is not valid,
     * or with status {@code 500 (Internal Server Error)} if the chips couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/chips/{id}")
    public ResponseEntity<Chips> updateChips(@PathVariable(value = "id", required = false) final Long id, @RequestBody Chips chips)
        throws URISyntaxException {
        log.debug("REST request to update Chips : {}, {}", id, chips);
        if (chips.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, chips.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!chipsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Chips result = chipsService.save(chips);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, chips.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /chips/:id} : Partial updates given fields of an existing chips, field will ignore if it is null
     *
     * @param id the id of the chips to save.
     * @param chips the chips to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated chips,
     * or with status {@code 400 (Bad Request)} if the chips is not valid,
     * or with status {@code 404 (Not Found)} if the chips is not found,
     * or with status {@code 500 (Internal Server Error)} if the chips couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/chips/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Chips> partialUpdateChips(@PathVariable(value = "id", required = false) final Long id, @RequestBody Chips chips)
        throws URISyntaxException {
        log.debug("REST request to partial update Chips partially : {}, {}", id, chips);
        if (chips.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, chips.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!chipsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Chips> result = chipsService.partialUpdate(chips);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, chips.getId().toString())
        );
    }

    /**
     * {@code GET  /chips} : get all the chips.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of chips in body.
     */
    @GetMapping("/chips")
    public ResponseEntity<List<Chips>> getAllChips(Pageable pageable) {
        log.debug("REST request to get a page of Chips");
        Page<Chips> page = chipsService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /chips/:id} : get the "id" chips.
     *
     * @param id the id of the chips to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the chips, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/chips/{id}")
    public ResponseEntity<Chips> getChips(@PathVariable Long id) {
        log.debug("REST request to get Chips : {}", id);
        Optional<Chips> chips = chipsService.findOne(id);
        return ResponseUtil.wrapOrNotFound(chips);
    }

    /**
     * {@code DELETE  /chips/:id} : delete the "id" chips.
     *
     * @param id the id of the chips to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/chips/{id}")
    public ResponseEntity<Void> deleteChips(@PathVariable Long id) {
        log.debug("REST request to delete Chips : {}", id);
        chipsService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
