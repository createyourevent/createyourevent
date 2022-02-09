package org.createyourevent.app.service;

import java.util.Optional;
import org.createyourevent.app.domain.Gift;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link Gift}.
 */
public interface GiftService {
    /**
     * Save a gift.
     *
     * @param gift the entity to save.
     * @return the persisted entity.
     */
    Gift save(Gift gift);

    /**
     * Partially updates a gift.
     *
     * @param gift the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Gift> partialUpdate(Gift gift);

    /**
     * Get all the gifts.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Gift> findAll(Pageable pageable);

    /**
     * Get the "id" gift.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Gift> findOne(Long id);

    /**
     * Delete the "id" gift.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
