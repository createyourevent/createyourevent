package org.createyourevent.app.service;

import java.util.List;
import java.util.Optional;
import org.createyourevent.app.domain.EventDetails;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link EventDetails}.
 */
public interface EventDetailsService {
    /**
     * Save a eventDetails.
     *
     * @param eventDetails the entity to save.
     * @return the persisted entity.
     */
    EventDetails save(EventDetails eventDetails);

    /**
     * Partially updates a eventDetails.
     *
     * @param eventDetails the entity to update partially.
     * @return the persisted entity.
     */
    Optional<EventDetails> partialUpdate(EventDetails eventDetails);

    /**
     * Get all the eventDetails.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<EventDetails> findAll(Pageable pageable);
    /**
     * Get all the EventDetails where Event is {@code null}.
     *
     * @return the {@link List} of entities.
     */
    List<EventDetails> findAllWhereEventIsNull();

    /**
     * Get the "id" eventDetails.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<EventDetails> findOne(Long id);

    /**
     * Delete the "id" eventDetails.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
