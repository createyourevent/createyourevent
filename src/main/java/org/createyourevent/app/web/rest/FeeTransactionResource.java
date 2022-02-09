package org.createyourevent.app.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.createyourevent.app.domain.FeeTransaction;
import org.createyourevent.app.repository.FeeTransactionRepository;
import org.createyourevent.app.service.FeeTransactionService;
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
 * REST controller for managing {@link org.createyourevent.app.domain.FeeTransaction}.
 */
@RestController
@RequestMapping("/api")
public class FeeTransactionResource {

    private final Logger log = LoggerFactory.getLogger(FeeTransactionResource.class);

    private static final String ENTITY_NAME = "feeTransaction";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final FeeTransactionService feeTransactionService;

    private final FeeTransactionRepository feeTransactionRepository;

    public FeeTransactionResource(FeeTransactionService feeTransactionService, FeeTransactionRepository feeTransactionRepository) {
        this.feeTransactionService = feeTransactionService;
        this.feeTransactionRepository = feeTransactionRepository;
    }

    /**
     * {@code POST  /fee-transactions} : Create a new feeTransaction.
     *
     * @param feeTransaction the feeTransaction to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new feeTransaction, or with status {@code 400 (Bad Request)} if the feeTransaction has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/fee-transactions")
    public ResponseEntity<FeeTransaction> createFeeTransaction(@RequestBody FeeTransaction feeTransaction) throws URISyntaxException {
        log.debug("REST request to save FeeTransaction : {}", feeTransaction);
        if (feeTransaction.getId() != null) {
            throw new BadRequestAlertException("A new feeTransaction cannot already have an ID", ENTITY_NAME, "idexists");
        }
        FeeTransaction result = feeTransactionService.save(feeTransaction);
        return ResponseEntity
            .created(new URI("/api/fee-transactions/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /fee-transactions/:id} : Updates an existing feeTransaction.
     *
     * @param id the id of the feeTransaction to save.
     * @param feeTransaction the feeTransaction to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated feeTransaction,
     * or with status {@code 400 (Bad Request)} if the feeTransaction is not valid,
     * or with status {@code 500 (Internal Server Error)} if the feeTransaction couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/fee-transactions/{id}")
    public ResponseEntity<FeeTransaction> updateFeeTransaction(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody FeeTransaction feeTransaction
    ) throws URISyntaxException {
        log.debug("REST request to update FeeTransaction : {}, {}", id, feeTransaction);
        if (feeTransaction.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, feeTransaction.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!feeTransactionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        FeeTransaction result = feeTransactionService.save(feeTransaction);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, feeTransaction.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /fee-transactions/:id} : Partial updates given fields of an existing feeTransaction, field will ignore if it is null
     *
     * @param id the id of the feeTransaction to save.
     * @param feeTransaction the feeTransaction to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated feeTransaction,
     * or with status {@code 400 (Bad Request)} if the feeTransaction is not valid,
     * or with status {@code 404 (Not Found)} if the feeTransaction is not found,
     * or with status {@code 500 (Internal Server Error)} if the feeTransaction couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/fee-transactions/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<FeeTransaction> partialUpdateFeeTransaction(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody FeeTransaction feeTransaction
    ) throws URISyntaxException {
        log.debug("REST request to partial update FeeTransaction partially : {}, {}", id, feeTransaction);
        if (feeTransaction.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, feeTransaction.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!feeTransactionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<FeeTransaction> result = feeTransactionService.partialUpdate(feeTransaction);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, feeTransaction.getId().toString())
        );
    }

    /**
     * {@code GET  /fee-transactions} : get all the feeTransactions.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of feeTransactions in body.
     */
    @GetMapping("/fee-transactions")
    public ResponseEntity<List<FeeTransaction>> getAllFeeTransactions(Pageable pageable) {
        log.debug("REST request to get a page of FeeTransactions");
        Page<FeeTransaction> page = feeTransactionService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /fee-transactions/:id} : get the "id" feeTransaction.
     *
     * @param id the id of the feeTransaction to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the feeTransaction, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/fee-transactions/{id}")
    public ResponseEntity<FeeTransaction> getFeeTransaction(@PathVariable Long id) {
        log.debug("REST request to get FeeTransaction : {}", id);
        Optional<FeeTransaction> feeTransaction = feeTransactionService.findOne(id);
        return ResponseUtil.wrapOrNotFound(feeTransaction);
    }

    /**
     * {@code DELETE  /fee-transactions/:id} : delete the "id" feeTransaction.
     *
     * @param id the id of the feeTransaction to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/fee-transactions/{id}")
    public ResponseEntity<Void> deleteFeeTransaction(@PathVariable Long id) {
        log.debug("REST request to delete FeeTransaction : {}", id);
        feeTransactionService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
