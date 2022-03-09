package org.createyourevent.app.service;

import java.util.Optional;
import org.createyourevent.app.domain.SlotListPlum;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link SlotListPlum}.
 */
public interface SlotListPlumService {
    /**
     * Save a slotListPlum.
     *
     * @param slotListPlum the entity to save.
     * @return the persisted entity.
     */
    SlotListPlum save(SlotListPlum slotListPlum);

    /**
     * Partially updates a slotListPlum.
     *
     * @param slotListPlum the entity to update partially.
     * @return the persisted entity.
     */
    Optional<SlotListPlum> partialUpdate(SlotListPlum slotListPlum);

    /**
     * Get all the slotListPlums.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<SlotListPlum> findAll(Pageable pageable);

    /**
     * Get the "id" slotListPlum.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<SlotListPlum> findOne(Long id);

    /**
     * Delete the "id" slotListPlum.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
