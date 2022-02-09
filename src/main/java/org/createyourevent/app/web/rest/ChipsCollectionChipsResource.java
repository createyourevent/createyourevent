package org.createyourevent.app.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.createyourevent.app.domain.ChipsCollectionChips;
import org.createyourevent.app.repository.ChipsCollectionChipsRepository;
import org.createyourevent.app.service.ChipsCollectionChipsService;
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
 * REST controller for managing {@link org.createyourevent.app.domain.ChipsCollectionChips}.
 */
@RestController
@RequestMapping("/api")
public class ChipsCollectionChipsResource {

    private final Logger log = LoggerFactory.getLogger(ChipsCollectionChipsResource.class);

    private static final String ENTITY_NAME = "chipsCollectionChips";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ChipsCollectionChipsService chipsCollectionChipsService;

    private final ChipsCollectionChipsRepository chipsCollectionChipsRepository;

    public ChipsCollectionChipsResource(
        ChipsCollectionChipsService chipsCollectionChipsService,
        ChipsCollectionChipsRepository chipsCollectionChipsRepository
    ) {
        this.chipsCollectionChipsService = chipsCollectionChipsService;
        this.chipsCollectionChipsRepository = chipsCollectionChipsRepository;
    }

    /**
     * {@code POST  /chips-collection-chips} : Create a new chipsCollectionChips.
     *
     * @param chipsCollectionChips the chipsCollectionChips to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new chipsCollectionChips, or with status {@code 400 (Bad Request)} if the chipsCollectionChips has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/chips-collection-chips")
    public ResponseEntity<ChipsCollectionChips> createChipsCollectionChips(@RequestBody ChipsCollectionChips chipsCollectionChips)
        throws URISyntaxException {
        log.debug("REST request to save ChipsCollectionChips : {}", chipsCollectionChips);
        if (chipsCollectionChips.getId() != null) {
            throw new BadRequestAlertException("A new chipsCollectionChips cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ChipsCollectionChips result = chipsCollectionChipsService.save(chipsCollectionChips);
        return ResponseEntity
            .created(new URI("/api/chips-collection-chips/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /chips-collection-chips/:id} : Updates an existing chipsCollectionChips.
     *
     * @param id the id of the chipsCollectionChips to save.
     * @param chipsCollectionChips the chipsCollectionChips to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated chipsCollectionChips,
     * or with status {@code 400 (Bad Request)} if the chipsCollectionChips is not valid,
     * or with status {@code 500 (Internal Server Error)} if the chipsCollectionChips couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/chips-collection-chips/{id}")
    public ResponseEntity<ChipsCollectionChips> updateChipsCollectionChips(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ChipsCollectionChips chipsCollectionChips
    ) throws URISyntaxException {
        log.debug("REST request to update ChipsCollectionChips : {}, {}", id, chipsCollectionChips);
        if (chipsCollectionChips.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, chipsCollectionChips.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!chipsCollectionChipsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ChipsCollectionChips result = chipsCollectionChipsService.save(chipsCollectionChips);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, chipsCollectionChips.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /chips-collection-chips/:id} : Partial updates given fields of an existing chipsCollectionChips, field will ignore if it is null
     *
     * @param id the id of the chipsCollectionChips to save.
     * @param chipsCollectionChips the chipsCollectionChips to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated chipsCollectionChips,
     * or with status {@code 400 (Bad Request)} if the chipsCollectionChips is not valid,
     * or with status {@code 404 (Not Found)} if the chipsCollectionChips is not found,
     * or with status {@code 500 (Internal Server Error)} if the chipsCollectionChips couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/chips-collection-chips/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ChipsCollectionChips> partialUpdateChipsCollectionChips(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ChipsCollectionChips chipsCollectionChips
    ) throws URISyntaxException {
        log.debug("REST request to partial update ChipsCollectionChips partially : {}, {}", id, chipsCollectionChips);
        if (chipsCollectionChips.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, chipsCollectionChips.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!chipsCollectionChipsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ChipsCollectionChips> result = chipsCollectionChipsService.partialUpdate(chipsCollectionChips);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, chipsCollectionChips.getId().toString())
        );
    }

    /**
     * {@code GET  /chips-collection-chips} : get all the chipsCollectionChips.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of chipsCollectionChips in body.
     */
    @GetMapping("/chips-collection-chips")
    public ResponseEntity<List<ChipsCollectionChips>> getAllChipsCollectionChips(Pageable pageable) {
        log.debug("REST request to get a page of ChipsCollectionChips");
        Page<ChipsCollectionChips> page = chipsCollectionChipsService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /chips-collection-chips/:id} : get the "id" chipsCollectionChips.
     *
     * @param id the id of the chipsCollectionChips to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the chipsCollectionChips, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/chips-collection-chips/{id}")
    public ResponseEntity<ChipsCollectionChips> getChipsCollectionChips(@PathVariable Long id) {
        log.debug("REST request to get ChipsCollectionChips : {}", id);
        Optional<ChipsCollectionChips> chipsCollectionChips = chipsCollectionChipsService.findOne(id);
        return ResponseUtil.wrapOrNotFound(chipsCollectionChips);
    }

    /**
     * {@code DELETE  /chips-collection-chips/:id} : delete the "id" chipsCollectionChips.
     *
     * @param id the id of the chipsCollectionChips to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/chips-collection-chips/{id}")
    public ResponseEntity<Void> deleteChipsCollectionChips(@PathVariable Long id) {
        log.debug("REST request to delete ChipsCollectionChips : {}", id);
        chipsCollectionChipsService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
