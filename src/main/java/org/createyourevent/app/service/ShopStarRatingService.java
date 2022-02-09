package org.createyourevent.app.service;

import java.util.Optional;
import org.createyourevent.app.domain.ShopStarRating;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link ShopStarRating}.
 */
public interface ShopStarRatingService {
    /**
     * Save a shopStarRating.
     *
     * @param shopStarRating the entity to save.
     * @return the persisted entity.
     */
    ShopStarRating save(ShopStarRating shopStarRating);

    /**
     * Partially updates a shopStarRating.
     *
     * @param shopStarRating the entity to update partially.
     * @return the persisted entity.
     */
    Optional<ShopStarRating> partialUpdate(ShopStarRating shopStarRating);

    /**
     * Get all the shopStarRatings.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<ShopStarRating> findAll(Pageable pageable);

    /**
     * Get the "id" shopStarRating.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<ShopStarRating> findOne(Long id);

    /**
     * Delete the "id" shopStarRating.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
