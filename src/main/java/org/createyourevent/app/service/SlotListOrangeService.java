package org.createyourevent.app.service;

import java.util.Optional;
import org.createyourevent.app.domain.SlotListOrange;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link SlotListOrange}.
 */
public interface SlotListOrangeService {
    /**
     * Save a slotListOrange.
     *
     * @param slotListOrange the entity to save.
     * @return the persisted entity.
     */
    SlotListOrange save(SlotListOrange slotListOrange);

    /**
     * Partially updates a slotListOrange.
     *
     * @param slotListOrange the entity to update partially.
     * @return the persisted entity.
     */
    Optional<SlotListOrange> partialUpdate(SlotListOrange slotListOrange);

    /**
     * Get all the slotListOranges.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<SlotListOrange> findAll(Pageable pageable);

    /**
     * Get the "id" slotListOrange.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<SlotListOrange> findOne(Long id);

    /**
     * Delete the "id" slotListOrange.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
