package org.createyourevent.app.service;

import java.util.Optional;
import org.createyourevent.app.domain.SlotListCherry;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link SlotListCherry}.
 */
public interface SlotListCherryService {
    /**
     * Save a slotListCherry.
     *
     * @param slotListCherry the entity to save.
     * @return the persisted entity.
     */
    SlotListCherry save(SlotListCherry slotListCherry);

    /**
     * Partially updates a slotListCherry.
     *
     * @param slotListCherry the entity to update partially.
     * @return the persisted entity.
     */
    Optional<SlotListCherry> partialUpdate(SlotListCherry slotListCherry);

    /**
     * Get all the slotListCherries.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<SlotListCherry> findAll(Pageable pageable);

    /**
     * Get the "id" slotListCherry.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<SlotListCherry> findOne(Long id);

    /**
     * Delete the "id" slotListCherry.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
