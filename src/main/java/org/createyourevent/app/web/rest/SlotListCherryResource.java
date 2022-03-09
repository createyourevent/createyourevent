package org.createyourevent.app.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.createyourevent.app.domain.SlotListCherry;
import org.createyourevent.app.repository.SlotListCherryRepository;
import org.createyourevent.app.service.SlotListCherryService;
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
 * REST controller for managing {@link org.createyourevent.app.domain.SlotListCherry}.
 */
@RestController
@RequestMapping("/api")
public class SlotListCherryResource {

    private final Logger log = LoggerFactory.getLogger(SlotListCherryResource.class);

    private static final String ENTITY_NAME = "slotListCherry";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SlotListCherryService slotListCherryService;

    private final SlotListCherryRepository slotListCherryRepository;

    public SlotListCherryResource(SlotListCherryService slotListCherryService, SlotListCherryRepository slotListCherryRepository) {
        this.slotListCherryService = slotListCherryService;
        this.slotListCherryRepository = slotListCherryRepository;
    }

    /**
     * {@code POST  /slot-list-cherries} : Create a new slotListCherry.
     *
     * @param slotListCherry the slotListCherry to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new slotListCherry, or with status {@code 400 (Bad Request)} if the slotListCherry has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/slot-list-cherries")
    public ResponseEntity<SlotListCherry> createSlotListCherry(@RequestBody SlotListCherry slotListCherry) throws URISyntaxException {
        log.debug("REST request to save SlotListCherry : {}", slotListCherry);
        if (slotListCherry.getId() != null) {
            throw new BadRequestAlertException("A new slotListCherry cannot already have an ID", ENTITY_NAME, "idexists");
        }
        SlotListCherry result = slotListCherryService.save(slotListCherry);
        return ResponseEntity
            .created(new URI("/api/slot-list-cherries/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /slot-list-cherries/:id} : Updates an existing slotListCherry.
     *
     * @param id the id of the slotListCherry to save.
     * @param slotListCherry the slotListCherry to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated slotListCherry,
     * or with status {@code 400 (Bad Request)} if the slotListCherry is not valid,
     * or with status {@code 500 (Internal Server Error)} if the slotListCherry couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/slot-list-cherries/{id}")
    public ResponseEntity<SlotListCherry> updateSlotListCherry(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody SlotListCherry slotListCherry
    ) throws URISyntaxException {
        log.debug("REST request to update SlotListCherry : {}, {}", id, slotListCherry);
        if (slotListCherry.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, slotListCherry.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!slotListCherryRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        SlotListCherry result = slotListCherryService.save(slotListCherry);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, slotListCherry.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /slot-list-cherries/:id} : Partial updates given fields of an existing slotListCherry, field will ignore if it is null
     *
     * @param id the id of the slotListCherry to save.
     * @param slotListCherry the slotListCherry to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated slotListCherry,
     * or with status {@code 400 (Bad Request)} if the slotListCherry is not valid,
     * or with status {@code 404 (Not Found)} if the slotListCherry is not found,
     * or with status {@code 500 (Internal Server Error)} if the slotListCherry couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/slot-list-cherries/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<SlotListCherry> partialUpdateSlotListCherry(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody SlotListCherry slotListCherry
    ) throws URISyntaxException {
        log.debug("REST request to partial update SlotListCherry partially : {}, {}", id, slotListCherry);
        if (slotListCherry.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, slotListCherry.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!slotListCherryRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<SlotListCherry> result = slotListCherryService.partialUpdate(slotListCherry);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, slotListCherry.getId().toString())
        );
    }

    /**
     * {@code GET  /slot-list-cherries} : get all the slotListCherries.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of slotListCherries in body.
     */
    @GetMapping("/slot-list-cherries")
    public ResponseEntity<List<SlotListCherry>> getAllSlotListCherries(Pageable pageable) {
        log.debug("REST request to get a page of SlotListCherries");
        Page<SlotListCherry> page = slotListCherryService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /slot-list-cherries/:id} : get the "id" slotListCherry.
     *
     * @param id the id of the slotListCherry to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the slotListCherry, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/slot-list-cherries/{id}")
    public ResponseEntity<SlotListCherry> getSlotListCherry(@PathVariable Long id) {
        log.debug("REST request to get SlotListCherry : {}", id);
        Optional<SlotListCherry> slotListCherry = slotListCherryService.findOne(id);
        return ResponseUtil.wrapOrNotFound(slotListCherry);
    }

    /**
     * {@code DELETE  /slot-list-cherries/:id} : delete the "id" slotListCherry.
     *
     * @param id the id of the slotListCherry to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/slot-list-cherries/{id}")
    public ResponseEntity<Void> deleteSlotListCherry(@PathVariable Long id) {
        log.debug("REST request to delete SlotListCherry : {}", id);
        slotListCherryService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
