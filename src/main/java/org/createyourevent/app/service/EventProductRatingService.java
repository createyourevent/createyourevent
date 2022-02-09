package org.createyourevent.app.service;

import java.util.Optional;
import org.createyourevent.app.domain.EventProductRating;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link EventProductRating}.
 */
public interface EventProductRatingService {
    /**
     * Save a eventProductRating.
     *
     * @param eventProductRating the entity to save.
     * @return the persisted entity.
     */
    EventProductRating save(EventProductRating eventProductRating);

    /**
     * Partially updates a eventProductRating.
     *
     * @param eventProductRating the entity to update partially.
     * @return the persisted entity.
     */
    Optional<EventProductRating> partialUpdate(EventProductRating eventProductRating);

    /**
     * Get all the eventProductRatings.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<EventProductRating> findAll(Pageable pageable);

    /**
     * Get the "id" eventProductRating.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<EventProductRating> findOne(Long id);

    /**
     * Delete the "id" eventProductRating.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
