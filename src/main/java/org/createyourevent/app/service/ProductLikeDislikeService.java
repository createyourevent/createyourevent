package org.createyourevent.app.service;

import java.util.Optional;
import org.createyourevent.app.domain.ProductLikeDislike;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link ProductLikeDislike}.
 */
public interface ProductLikeDislikeService {
    /**
     * Save a productLikeDislike.
     *
     * @param productLikeDislike the entity to save.
     * @return the persisted entity.
     */
    ProductLikeDislike save(ProductLikeDislike productLikeDislike);

    /**
     * Partially updates a productLikeDislike.
     *
     * @param productLikeDislike the entity to update partially.
     * @return the persisted entity.
     */
    Optional<ProductLikeDislike> partialUpdate(ProductLikeDislike productLikeDislike);

    /**
     * Get all the productLikeDislikes.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<ProductLikeDislike> findAll(Pageable pageable);

    /**
     * Get the "id" productLikeDislike.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<ProductLikeDislike> findOne(Long id);

    /**
     * Delete the "id" productLikeDislike.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
