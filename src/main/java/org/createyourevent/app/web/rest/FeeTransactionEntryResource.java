package org.createyourevent.app.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.createyourevent.app.domain.FeeTransactionEntry;
import org.createyourevent.app.repository.FeeTransactionEntryRepository;
import org.createyourevent.app.service.FeeTransactionEntryService;
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
 * REST controller for managing {@link org.createyourevent.app.domain.FeeTransactionEntry}.
 */
@RestController
@RequestMapping("/api")
public class FeeTransactionEntryResource {

    private final Logger log = LoggerFactory.getLogger(FeeTransactionEntryResource.class);

    private static final String ENTITY_NAME = "feeTransactionEntry";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final FeeTransactionEntryService feeTransactionEntryService;

    private final FeeTransactionEntryRepository feeTransactionEntryRepository;

    public FeeTransactionEntryResource(
        FeeTransactionEntryService feeTransactionEntryService,
        FeeTransactionEntryRepository feeTransactionEntryRepository
    ) {
        this.feeTransactionEntryService = feeTransactionEntryService;
        this.feeTransactionEntryRepository = feeTransactionEntryRepository;
    }

    /**
     * {@code POST  /fee-transaction-entries} : Create a new feeTransactionEntry.
     *
     * @param feeTransactionEntry the feeTransactionEntry to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new feeTransactionEntry, or with status {@code 400 (Bad Request)} if the feeTransactionEntry has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/fee-transaction-entries")
    public ResponseEntity<FeeTransactionEntry> createFeeTransactionEntry(@RequestBody FeeTransactionEntry feeTransactionEntry)
        throws URISyntaxException {
        log.debug("REST request to save FeeTransactionEntry : {}", feeTransactionEntry);
        if (feeTransactionEntry.getId() != null) {
            throw new BadRequestAlertException("A new feeTransactionEntry cannot already have an ID", ENTITY_NAME, "idexists");
        }
        FeeTransactionEntry result = feeTransactionEntryService.save(feeTransactionEntry);
        return ResponseEntity
            .created(new URI("/api/fee-transaction-entries/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /fee-transaction-entries/:id} : Updates an existing feeTransactionEntry.
     *
     * @param id the id of the feeTransactionEntry to save.
     * @param feeTransactionEntry the feeTransactionEntry to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated feeTransactionEntry,
     * or with status {@code 400 (Bad Request)} if the feeTransactionEntry is not valid,
     * or with status {@code 500 (Internal Server Error)} if the feeTransactionEntry couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/fee-transaction-entries/{id}")
    public ResponseEntity<FeeTransactionEntry> updateFeeTransactionEntry(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody FeeTransactionEntry feeTransactionEntry
    ) throws URISyntaxException {
        log.debug("REST request to update FeeTransactionEntry : {}, {}", id, feeTransactionEntry);
        if (feeTransactionEntry.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, feeTransactionEntry.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!feeTransactionEntryRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        FeeTransactionEntry result = feeTransactionEntryService.save(feeTransactionEntry);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, feeTransactionEntry.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /fee-transaction-entries/:id} : Partial updates given fields of an existing feeTransactionEntry, field will ignore if it is null
     *
     * @param id the id of the feeTransactionEntry to save.
     * @param feeTransactionEntry the feeTransactionEntry to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated feeTransactionEntry,
     * or with status {@code 400 (Bad Request)} if the feeTransactionEntry is not valid,
     * or with status {@code 404 (Not Found)} if the feeTransactionEntry is not found,
     * or with status {@code 500 (Internal Server Error)} if the feeTransactionEntry couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/fee-transaction-entries/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<FeeTransactionEntry> partialUpdateFeeTransactionEntry(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody FeeTransactionEntry feeTransactionEntry
    ) throws URISyntaxException {
        log.debug("REST request to partial update FeeTransactionEntry partially : {}, {}", id, feeTransactionEntry);
        if (feeTransactionEntry.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, feeTransactionEntry.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!feeTransactionEntryRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<FeeTransactionEntry> result = feeTransactionEntryService.partialUpdate(feeTransactionEntry);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, feeTransactionEntry.getId().toString())
        );
    }

    /**
     * {@code GET  /fee-transaction-entries} : get all the feeTransactionEntries.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of feeTransactionEntries in body.
     */
    @GetMapping("/fee-transaction-entries")
    public ResponseEntity<List<FeeTransactionEntry>> getAllFeeTransactionEntries(Pageable pageable) {
        log.debug("REST request to get a page of FeeTransactionEntries");
        Page<FeeTransactionEntry> page = feeTransactionEntryService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /fee-transaction-entries/:id} : get the "id" feeTransactionEntry.
     *
     * @param id the id of the feeTransactionEntry to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the feeTransactionEntry, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/fee-transaction-entries/{id}")
    public ResponseEntity<FeeTransactionEntry> getFeeTransactionEntry(@PathVariable Long id) {
        log.debug("REST request to get FeeTransactionEntry : {}", id);
        Optional<FeeTransactionEntry> feeTransactionEntry = feeTransactionEntryService.findOne(id);
        return ResponseUtil.wrapOrNotFound(feeTransactionEntry);
    }

    /**
     * {@code DELETE  /fee-transaction-entries/:id} : delete the "id" feeTransactionEntry.
     *
     * @param id the id of the feeTransactionEntry to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/fee-transaction-entries/{id}")
    public ResponseEntity<Void> deleteFeeTransactionEntry(@PathVariable Long id) {
        log.debug("REST request to delete FeeTransactionEntry : {}", id);
        feeTransactionEntryService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
