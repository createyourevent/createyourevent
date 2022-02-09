package org.createyourevent.app.service;

import java.util.List;
import java.util.Optional;
import org.createyourevent.app.domain.Ticket;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link Ticket}.
 */
public interface TicketService {
    /**
     * Save a ticket.
     *
     * @param ticket the entity to save.
     * @return the persisted entity.
     */
    Ticket save(Ticket ticket);

    /**
     * Partially updates a ticket.
     *
     * @param ticket the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Ticket> partialUpdate(Ticket ticket);

    /**
     * Get all the tickets.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Ticket> findAll(Pageable pageable);
    /**
     * Get all the Ticket where Reservation is {@code null}.
     *
     * @return the {@link List} of entities.
     */
    List<Ticket> findAllWhereReservationIsNull();

    /**
     * Get the "id" ticket.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Ticket> findOne(Long id);

    /**
     * Delete the "id" ticket.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
