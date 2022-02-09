package org.createyourevent.app.service;

import java.util.Optional;
import org.createyourevent.app.domain.ShopComment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link ShopComment}.
 */
public interface ShopCommentService {
    /**
     * Save a shopComment.
     *
     * @param shopComment the entity to save.
     * @return the persisted entity.
     */
    ShopComment save(ShopComment shopComment);

    /**
     * Partially updates a shopComment.
     *
     * @param shopComment the entity to update partially.
     * @return the persisted entity.
     */
    Optional<ShopComment> partialUpdate(ShopComment shopComment);

    /**
     * Get all the shopComments.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<ShopComment> findAll(Pageable pageable);

    /**
     * Get the "id" shopComment.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<ShopComment> findOne(Long id);

    /**
     * Delete the "id" shopComment.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
