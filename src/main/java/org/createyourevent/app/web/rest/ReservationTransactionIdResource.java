package org.createyourevent.app.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.StreamSupport;
import org.createyourevent.app.domain.ReservationTransactionId;
import org.createyourevent.app.repository.ReservationTransactionIdRepository;
import org.createyourevent.app.service.ReservationTransactionIdService;
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
 * REST controller for managing {@link org.createyourevent.app.domain.ReservationTransactionId}.
 */
@RestController
@RequestMapping("/api")
public class ReservationTransactionIdResource {

    private final Logger log = LoggerFactory.getLogger(ReservationTransactionIdResource.class);

    private static final String ENTITY_NAME = "reservationTransactionId";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ReservationTransactionIdService reservationTransactionIdService;

    private final ReservationTransactionIdRepository reservationTransactionIdRepository;

    public ReservationTransactionIdResource(
        ReservationTransactionIdService reservationTransactionIdService,
        ReservationTransactionIdRepository reservationTransactionIdRepository
    ) {
        this.reservationTransactionIdService = reservationTransactionIdService;
        this.reservationTransactionIdRepository = reservationTransactionIdRepository;
    }

    /**
     * {@code POST  /reservation-transaction-ids} : Create a new reservationTransactionId.
     *
     * @param reservationTransactionId the reservationTransactionId to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new reservationTransactionId, or with status {@code 400 (Bad Request)} if the reservationTransactionId has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/reservation-transaction-ids")
    public ResponseEntity<ReservationTransactionId> createReservationTransactionId(
        @RequestBody ReservationTransactionId reservationTransactionId
    ) throws URISyntaxException {
        log.debug("REST request to save ReservationTransactionId : {}", reservationTransactionId);
        if (reservationTransactionId.getId() != null) {
            throw new BadRequestAlertException("A new reservationTransactionId cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ReservationTransactionId result = reservationTransactionIdService.save(reservationTransactionId);
        return ResponseEntity
            .created(new URI("/api/reservation-transaction-ids/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /reservation-transaction-ids/:id} : Updates an existing reservationTransactionId.
     *
     * @param id the id of the reservationTransactionId to save.
     * @param reservationTransactionId the reservationTransactionId to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated reservationTransactionId,
     * or with status {@code 400 (Bad Request)} if the reservationTransactionId is not valid,
     * or with status {@code 500 (Internal Server Error)} if the reservationTransactionId couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/reservation-transaction-ids/{id}")
    public ResponseEntity<ReservationTransactionId> updateReservationTransactionId(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ReservationTransactionId reservationTransactionId
    ) throws URISyntaxException {
        log.debug("REST request to update ReservationTransactionId : {}, {}", id, reservationTransactionId);
        if (reservationTransactionId.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, reservationTransactionId.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!reservationTransactionIdRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ReservationTransactionId result = reservationTransactionIdService.save(reservationTransactionId);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, reservationTransactionId.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /reservation-transaction-ids/:id} : Partial updates given fields of an existing reservationTransactionId, field will ignore if it is null
     *
     * @param id the id of the reservationTransactionId to save.
     * @param reservationTransactionId the reservationTransactionId to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated reservationTransactionId,
     * or with status {@code 400 (Bad Request)} if the reservationTransactionId is not valid,
     * or with status {@code 404 (Not Found)} if the reservationTransactionId is not found,
     * or with status {@code 500 (Internal Server Error)} if the reservationTransactionId couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/reservation-transaction-ids/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ReservationTransactionId> partialUpdateReservationTransactionId(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ReservationTransactionId reservationTransactionId
    ) throws URISyntaxException {
        log.debug("REST request to partial update ReservationTransactionId partially : {}, {}", id, reservationTransactionId);
        if (reservationTransactionId.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, reservationTransactionId.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!reservationTransactionIdRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ReservationTransactionId> result = reservationTransactionIdService.partialUpdate(reservationTransactionId);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, reservationTransactionId.getId().toString())
        );
    }

    /**
     * {@code GET  /reservation-transaction-ids} : get all the reservationTransactionIds.
     *
     * @param pageable the pagination information.
     * @param filter the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of reservationTransactionIds in body.
     */
    @GetMapping("/reservation-transaction-ids")
    public ResponseEntity<List<ReservationTransactionId>> getAllReservationTransactionIds(
        Pageable pageable,
        @RequestParam(required = false) String filter
    ) {
        if ("reservation-is-null".equals(filter)) {
            log.debug("REST request to get all ReservationTransactionIds where reservation is null");
            return new ResponseEntity<>(reservationTransactionIdService.findAllWhereReservationIsNull(), HttpStatus.OK);
        }
        log.debug("REST request to get a page of ReservationTransactionIds");
        Page<ReservationTransactionId> page = reservationTransactionIdService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /reservation-transaction-ids/:id} : get the "id" reservationTransactionId.
     *
     * @param id the id of the reservationTransactionId to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the reservationTransactionId, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/reservation-transaction-ids/{id}")
    public ResponseEntity<ReservationTransactionId> getReservationTransactionId(@PathVariable Long id) {
        log.debug("REST request to get ReservationTransactionId : {}", id);
        Optional<ReservationTransactionId> reservationTransactionId = reservationTransactionIdService.findOne(id);
        return ResponseUtil.wrapOrNotFound(reservationTransactionId);
    }

    /**
     * {@code DELETE  /reservation-transaction-ids/:id} : delete the "id" reservationTransactionId.
     *
     * @param id the id of the reservationTransactionId to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/reservation-transaction-ids/{id}")
    public ResponseEntity<Void> deleteReservationTransactionId(@PathVariable Long id) {
        log.debug("REST request to delete ReservationTransactionId : {}", id);
        reservationTransactionIdService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
