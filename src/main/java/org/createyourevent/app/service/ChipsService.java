package org.createyourevent.app.service;

import java.util.Optional;
import org.createyourevent.app.domain.Chips;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link Chips}.
 */
public interface ChipsService {
    /**
     * Save a chips.
     *
     * @param chips the entity to save.
     * @return the persisted entity.
     */
    Chips save(Chips chips);

    /**
     * Partially updates a chips.
     *
     * @param chips the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Chips> partialUpdate(Chips chips);

    /**
     * Get all the chips.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Chips> findAll(Pageable pageable);

    /**
     * Get the "id" chips.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Chips> findOne(Long id);

    /**
     * Delete the "id" chips.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
