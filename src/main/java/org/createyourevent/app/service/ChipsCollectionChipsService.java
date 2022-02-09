package org.createyourevent.app.service;

import java.util.Optional;
import org.createyourevent.app.domain.ChipsCollectionChips;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link ChipsCollectionChips}.
 */
public interface ChipsCollectionChipsService {
    /**
     * Save a chipsCollectionChips.
     *
     * @param chipsCollectionChips the entity to save.
     * @return the persisted entity.
     */
    ChipsCollectionChips save(ChipsCollectionChips chipsCollectionChips);

    /**
     * Partially updates a chipsCollectionChips.
     *
     * @param chipsCollectionChips the entity to update partially.
     * @return the persisted entity.
     */
    Optional<ChipsCollectionChips> partialUpdate(ChipsCollectionChips chipsCollectionChips);

    /**
     * Get all the chipsCollectionChips.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<ChipsCollectionChips> findAll(Pageable pageable);

    /**
     * Get the "id" chipsCollectionChips.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<ChipsCollectionChips> findOne(Long id);

    /**
     * Delete the "id" chipsCollectionChips.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
