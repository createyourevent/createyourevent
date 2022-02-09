package org.createyourevent.app.service;

import java.util.List;
import java.util.Optional;
import org.createyourevent.app.domain.ReservationTransactionId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link ReservationTransactionId}.
 */
public interface ReservationTransactionIdService {
    /**
     * Save a reservationTransactionId.
     *
     * @param reservationTransactionId the entity to save.
     * @return the persisted entity.
     */
    ReservationTransactionId save(ReservationTransactionId reservationTransactionId);

    /**
     * Partially updates a reservationTransactionId.
     *
     * @param reservationTransactionId the entity to update partially.
     * @return the persisted entity.
     */
    Optional<ReservationTransactionId> partialUpdate(ReservationTransactionId reservationTransactionId);

    /**
     * Get all the reservationTransactionIds.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<ReservationTransactionId> findAll(Pageable pageable);
    /**
     * Get all the ReservationTransactionId where Reservation is {@code null}.
     *
     * @return the {@link List} of entities.
     */
    List<ReservationTransactionId> findAllWhereReservationIsNull();

    /**
     * Get the "id" reservationTransactionId.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<ReservationTransactionId> findOne(Long id);

    /**
     * Delete the "id" reservationTransactionId.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
