package org.createyourevent.app.service;

import java.util.Optional;
import org.createyourevent.app.domain.ShopLikeDislike;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link ShopLikeDislike}.
 */
public interface ShopLikeDislikeService {
    /**
     * Save a shopLikeDislike.
     *
     * @param shopLikeDislike the entity to save.
     * @return the persisted entity.
     */
    ShopLikeDislike save(ShopLikeDislike shopLikeDislike);

    /**
     * Partially updates a shopLikeDislike.
     *
     * @param shopLikeDislike the entity to update partially.
     * @return the persisted entity.
     */
    Optional<ShopLikeDislike> partialUpdate(ShopLikeDislike shopLikeDislike);

    /**
     * Get all the shopLikeDislikes.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<ShopLikeDislike> findAll(Pageable pageable);

    /**
     * Get the "id" shopLikeDislike.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<ShopLikeDislike> findOne(Long id);

    /**
     * Delete the "id" shopLikeDislike.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
