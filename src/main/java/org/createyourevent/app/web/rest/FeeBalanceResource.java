package org.createyourevent.app.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.createyourevent.app.domain.FeeBalance;
import org.createyourevent.app.repository.FeeBalanceRepository;
import org.createyourevent.app.service.FeeBalanceService;
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
 * REST controller for managing {@link org.createyourevent.app.domain.FeeBalance}.
 */
@RestController
@RequestMapping("/api")
public class FeeBalanceResource {

    private final Logger log = LoggerFactory.getLogger(FeeBalanceResource.class);

    private static final String ENTITY_NAME = "feeBalance";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final FeeBalanceService feeBalanceService;

    private final FeeBalanceRepository feeBalanceRepository;

    public FeeBalanceResource(FeeBalanceService feeBalanceService, FeeBalanceRepository feeBalanceRepository) {
        this.feeBalanceService = feeBalanceService;
        this.feeBalanceRepository = feeBalanceRepository;
    }

    /**
     * {@code POST  /fee-balances} : Create a new feeBalance.
     *
     * @param feeBalance the feeBalance to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new feeBalance, or with status {@code 400 (Bad Request)} if the feeBalance has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/fee-balances")
    public ResponseEntity<FeeBalance> createFeeBalance(@RequestBody FeeBalance feeBalance) throws URISyntaxException {
        log.debug("REST request to save FeeBalance : {}", feeBalance);
        if (feeBalance.getId() != null) {
            throw new BadRequestAlertException("A new feeBalance cannot already have an ID", ENTITY_NAME, "idexists");
        }
        FeeBalance result = feeBalanceService.save(feeBalance);
        return ResponseEntity
            .created(new URI("/api/fee-balances/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /fee-balances/:id} : Updates an existing feeBalance.
     *
     * @param id the id of the feeBalance to save.
     * @param feeBalance the feeBalance to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated feeBalance,
     * or with status {@code 400 (Bad Request)} if the feeBalance is not valid,
     * or with status {@code 500 (Internal Server Error)} if the feeBalance couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/fee-balances/{id}")
    public ResponseEntity<FeeBalance> updateFeeBalance(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody FeeBalance feeBalance
    ) throws URISyntaxException {
        log.debug("REST request to update FeeBalance : {}, {}", id, feeBalance);
        if (feeBalance.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, feeBalance.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!feeBalanceRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        FeeBalance result = feeBalanceService.save(feeBalance);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, feeBalance.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /fee-balances/:id} : Partial updates given fields of an existing feeBalance, field will ignore if it is null
     *
     * @param id the id of the feeBalance to save.
     * @param feeBalance the feeBalance to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated feeBalance,
     * or with status {@code 400 (Bad Request)} if the feeBalance is not valid,
     * or with status {@code 404 (Not Found)} if the feeBalance is not found,
     * or with status {@code 500 (Internal Server Error)} if the feeBalance couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/fee-balances/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<FeeBalance> partialUpdateFeeBalance(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody FeeBalance feeBalance
    ) throws URISyntaxException {
        log.debug("REST request to partial update FeeBalance partially : {}, {}", id, feeBalance);
        if (feeBalance.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, feeBalance.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!feeBalanceRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<FeeBalance> result = feeBalanceService.partialUpdate(feeBalance);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, feeBalance.getId().toString())
        );
    }

    /**
     * {@code GET  /fee-balances} : get all the feeBalances.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of feeBalances in body.
     */
    @GetMapping("/fee-balances")
    public ResponseEntity<List<FeeBalance>> getAllFeeBalances(Pageable pageable) {
        log.debug("REST request to get a page of FeeBalances");
        Page<FeeBalance> page = feeBalanceService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /fee-balances/:id} : get the "id" feeBalance.
     *
     * @param id the id of the feeBalance to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the feeBalance, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/fee-balances/{id}")
    public ResponseEntity<FeeBalance> getFeeBalance(@PathVariable Long id) {
        log.debug("REST request to get FeeBalance : {}", id);
        Optional<FeeBalance> feeBalance = feeBalanceService.findOne(id);
        return ResponseUtil.wrapOrNotFound(feeBalance);
    }

    /**
     * {@code DELETE  /fee-balances/:id} : delete the "id" feeBalance.
     *
     * @param id the id of the feeBalance to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/fee-balances/{id}")
    public ResponseEntity<Void> deleteFeeBalance(@PathVariable Long id) {
        log.debug("REST request to delete FeeBalance : {}", id);
        feeBalanceService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
