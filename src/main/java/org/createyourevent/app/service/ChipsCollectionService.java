package org.createyourevent.app.service;

import java.util.Optional;
import org.createyourevent.app.domain.ChipsCollection;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link ChipsCollection}.
 */
public interface ChipsCollectionService {
    /**
     * Save a chipsCollection.
     *
     * @param chipsCollection the entity to save.
     * @return the persisted entity.
     */
    ChipsCollection save(ChipsCollection chipsCollection);

    /**
     * Partially updates a chipsCollection.
     *
     * @param chipsCollection the entity to update partially.
     * @return the persisted entity.
     */
    Optional<ChipsCollection> partialUpdate(ChipsCollection chipsCollection);

    /**
     * Get all the chipsCollections.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<ChipsCollection> findAll(Pageable pageable);

    /**
     * Get the "id" chipsCollection.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<ChipsCollection> findOne(Long id);

    /**
     * Delete the "id" chipsCollection.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
