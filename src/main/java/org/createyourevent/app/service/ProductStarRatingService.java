package org.createyourevent.app.service;

import java.util.Optional;
import org.createyourevent.app.domain.ProductStarRating;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link ProductStarRating}.
 */
public interface ProductStarRatingService {
    /**
     * Save a productStarRating.
     *
     * @param productStarRating the entity to save.
     * @return the persisted entity.
     */
    ProductStarRating save(ProductStarRating productStarRating);

    /**
     * Partially updates a productStarRating.
     *
     * @param productStarRating the entity to update partially.
     * @return the persisted entity.
     */
    Optional<ProductStarRating> partialUpdate(ProductStarRating productStarRating);

    /**
     * Get all the productStarRatings.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<ProductStarRating> findAll(Pageable pageable);

    /**
     * Get the "id" productStarRating.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<ProductStarRating> findOne(Long id);

    /**
     * Delete the "id" productStarRating.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
