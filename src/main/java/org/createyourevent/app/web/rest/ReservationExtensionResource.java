package org.createyourevent.app.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;

import org.createyourevent.app.domain.Reservation;
import org.createyourevent.app.repository.ReservationRepository;
import org.createyourevent.app.service.ReservationExtensionService;
import org.createyourevent.app.web.rest.errors.BadRequestAlertException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import tech.jhipster.web.util.HeaderUtil;



/**
 * REST controller for managing {@link org.createyourevent.domain.Reservation}.
 */
@RestController
@RequestMapping("/api")
public class ReservationExtensionResource {

    private final Logger log = LoggerFactory.getLogger(ReservationResource.class);

    private static final String ENTITY_NAME = "reservation";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ReservationExtensionService reservationExtensionService;

    private final ReservationRepository reservationRepository;

    public ReservationExtensionResource(ReservationExtensionService reservationExtensionService, ReservationRepository reservationRepository) {
        this.reservationExtensionService = reservationExtensionService;
        this.reservationRepository = reservationRepository;
    }

    @GetMapping("/reservations/{userId}/{eventId}/getReservationByUserIdAndEventId")
    public List<Reservation> getReservationByUserIdAndEventId(@PathVariable String userId, @PathVariable Long eventId) {
        log.debug("REST request to get Reservation by userId and eventId ");
        List<Reservation> reservation = reservationExtensionService.findByUserIdAndEventId(userId, eventId);
        return reservation;
    }

    @GetMapping("/reservations/{eventId}/getReservationsByEventId")
    public List<Reservation> getReservationsByEventId(@PathVariable Long eventId) {
        log.debug("REST request to get Reservation by userId and eventId ");
        List<Reservation> reservations = reservationExtensionService.findAllByEventId(eventId);
        return reservations;
    }

    @GetMapping("/reservations/{userId}/getReservationsByUserId")
    public List<Reservation> getReservationsByUserId(@PathVariable String userId) {
        log.debug("REST request to get Reservations by userId ");
        List<Reservation> reservations = reservationExtensionService.findAllByUserId(userId);
        return reservations;
    }

    @GetMapping("/reservations/{userId}/getReservationsByUserIdAndBilled")
    public List<Reservation> getReservationsByUserIdAndBilled(@PathVariable String userId) {
        log.debug("REST request to get Reservations by userId and billed ");
        List<Reservation> reservations = reservationExtensionService.findAllByUserIdAndBilled(userId);
        return reservations;
    }

    @GetMapping("/reservations/{userId}/getReservationsByUserIdAndNotBilled")
    public List<Reservation> getReservationsByUserIdAndNotBilled(@PathVariable String userId) {
        log.debug("REST request to get Reservations by userId and not billed ");
        List<Reservation> reservations = reservationExtensionService.findAllByUserIdAndNotBilled(userId);
        return reservations;
    }



        /**
     * {@code POST  /reservations} : Create a new reservation.
     *
     * @param reservation the reservation to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new reservation, or with status {@code 400 (Bad Request)} if the reservation has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/reservations/ext")
    public ResponseEntity<Reservation> createReservation(@RequestBody Reservation reservation) throws URISyntaxException {
        log.debug("REST request to save Reservation : {}", reservation);
        if (reservation.getId() != null) {
            throw new BadRequestAlertException("A new reservation cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Reservation result = reservationExtensionService.save(reservation);
        return ResponseEntity
            .created(new URI("/api/reservations/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /reservations/:id} : Updates an existing reservation.
     *
     * @param id the id of the reservation to save.
     * @param reservation the reservation to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated reservation,
     * or with status {@code 400 (Bad Request)} if the reservation is not valid,
     * or with status {@code 500 (Internal Server Error)} if the reservation couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/reservations/{id}/ext")
    public ResponseEntity<Reservation> updateReservation(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Reservation reservation
    ) throws URISyntaxException {
        log.debug("REST request to update Reservation : {}, {}", id, reservation);
        if (reservation.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, reservation.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!reservationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Reservation result = reservationExtensionService.save(reservation);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, reservation.getId().toString()))
            .body(result);
    }

        /**
     * {@code DELETE  /reservations/:id} : delete the "id" reservation.
     *
     * @param id the id of the reservation to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/reservations/{id}/ext")
    public ResponseEntity<Void> deleteReservation(@PathVariable Long id) {
        log.debug("REST request to delete Reservation : {}", id);
        reservationExtensionService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }



}
