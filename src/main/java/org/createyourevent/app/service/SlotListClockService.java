package org.createyourevent.app.service;

import java.util.Optional;
import org.createyourevent.app.domain.SlotListClock;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link SlotListClock}.
 */
public interface SlotListClockService {
    /**
     * Save a slotListClock.
     *
     * @param slotListClock the entity to save.
     * @return the persisted entity.
     */
    SlotListClock save(SlotListClock slotListClock);

    /**
     * Partially updates a slotListClock.
     *
     * @param slotListClock the entity to update partially.
     * @return the persisted entity.
     */
    Optional<SlotListClock> partialUpdate(SlotListClock slotListClock);

    /**
     * Get all the slotListClocks.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<SlotListClock> findAll(Pageable pageable);

    /**
     * Get the "id" slotListClock.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<SlotListClock> findOne(Long id);

    /**
     * Delete the "id" slotListClock.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
