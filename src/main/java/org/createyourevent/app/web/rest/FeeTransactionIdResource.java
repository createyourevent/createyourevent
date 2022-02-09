package org.createyourevent.app.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.StreamSupport;
import org.createyourevent.app.domain.FeeTransactionId;
import org.createyourevent.app.repository.FeeTransactionIdRepository;
import org.createyourevent.app.service.FeeTransactionIdService;
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
 * REST controller for managing {@link org.createyourevent.app.domain.FeeTransactionId}.
 */
@RestController
@RequestMapping("/api")
public class FeeTransactionIdResource {

    private final Logger log = LoggerFactory.getLogger(FeeTransactionIdResource.class);

    private static final String ENTITY_NAME = "feeTransactionId";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final FeeTransactionIdService feeTransactionIdService;

    private final FeeTransactionIdRepository feeTransactionIdRepository;

    public FeeTransactionIdResource(
        FeeTransactionIdService feeTransactionIdService,
        FeeTransactionIdRepository feeTransactionIdRepository
    ) {
        this.feeTransactionIdService = feeTransactionIdService;
        this.feeTransactionIdRepository = feeTransactionIdRepository;
    }

    /**
     * {@code POST  /fee-transaction-ids} : Create a new feeTransactionId.
     *
     * @param feeTransactionId the feeTransactionId to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new feeTransactionId, or with status {@code 400 (Bad Request)} if the feeTransactionId has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/fee-transaction-ids")
    public ResponseEntity<FeeTransactionId> createFeeTransactionId(@RequestBody FeeTransactionId feeTransactionId)
        throws URISyntaxException {
        log.debug("REST request to save FeeTransactionId : {}", feeTransactionId);
        if (feeTransactionId.getId() != null) {
            throw new BadRequestAlertException("A new feeTransactionId cannot already have an ID", ENTITY_NAME, "idexists");
        }
        FeeTransactionId result = feeTransactionIdService.save(feeTransactionId);
        return ResponseEntity
            .created(new URI("/api/fee-transaction-ids/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /fee-transaction-ids/:id} : Updates an existing feeTransactionId.
     *
     * @param id the id of the feeTransactionId to save.
     * @param feeTransactionId the feeTransactionId to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated feeTransactionId,
     * or with status {@code 400 (Bad Request)} if the feeTransactionId is not valid,
     * or with status {@code 500 (Internal Server Error)} if the feeTransactionId couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/fee-transaction-ids/{id}")
    public ResponseEntity<FeeTransactionId> updateFeeTransactionId(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody FeeTransactionId feeTransactionId
    ) throws URISyntaxException {
        log.debug("REST request to update FeeTransactionId : {}, {}", id, feeTransactionId);
        if (feeTransactionId.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, feeTransactionId.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!feeTransactionIdRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        FeeTransactionId result = feeTransactionIdService.save(feeTransactionId);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, feeTransactionId.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /fee-transaction-ids/:id} : Partial updates given fields of an existing feeTransactionId, field will ignore if it is null
     *
     * @param id the id of the feeTransactionId to save.
     * @param feeTransactionId the feeTransactionId to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated feeTransactionId,
     * or with status {@code 400 (Bad Request)} if the feeTransactionId is not valid,
     * or with status {@code 404 (Not Found)} if the feeTransactionId is not found,
     * or with status {@code 500 (Internal Server Error)} if the feeTransactionId couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/fee-transaction-ids/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<FeeTransactionId> partialUpdateFeeTransactionId(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody FeeTransactionId feeTransactionId
    ) throws URISyntaxException {
        log.debug("REST request to partial update FeeTransactionId partially : {}, {}", id, feeTransactionId);
        if (feeTransactionId.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, feeTransactionId.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!feeTransactionIdRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<FeeTransactionId> result = feeTransactionIdService.partialUpdate(feeTransactionId);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, feeTransactionId.getId().toString())
        );
    }

    /**
     * {@code GET  /fee-transaction-ids} : get all the feeTransactionIds.
     *
     * @param pageable the pagination information.
     * @param filter the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of feeTransactionIds in body.
     */
    @GetMapping("/fee-transaction-ids")
    public ResponseEntity<List<FeeTransactionId>> getAllFeeTransactionIds(
        Pageable pageable,
        @RequestParam(required = false) String filter
    ) {
        if ("feetransaction-is-null".equals(filter)) {
            log.debug("REST request to get all FeeTransactionIds where feeTransaction is null");
            return new ResponseEntity<>(feeTransactionIdService.findAllWhereFeeTransactionIsNull(), HttpStatus.OK);
        }
        log.debug("REST request to get a page of FeeTransactionIds");
        Page<FeeTransactionId> page = feeTransactionIdService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /fee-transaction-ids/:id} : get the "id" feeTransactionId.
     *
     * @param id the id of the feeTransactionId to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the feeTransactionId, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/fee-transaction-ids/{id}")
    public ResponseEntity<FeeTransactionId> getFeeTransactionId(@PathVariable Long id) {
        log.debug("REST request to get FeeTransactionId : {}", id);
        Optional<FeeTransactionId> feeTransactionId = feeTransactionIdService.findOne(id);
        return ResponseUtil.wrapOrNotFound(feeTransactionId);
    }

    /**
     * {@code DELETE  /fee-transaction-ids/:id} : delete the "id" feeTransactionId.
     *
     * @param id the id of the feeTransactionId to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/fee-transaction-ids/{id}")
    public ResponseEntity<Void> deleteFeeTransactionId(@PathVariable Long id) {
        log.debug("REST request to delete FeeTransactionId : {}", id);
        feeTransactionIdService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
