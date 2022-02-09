package org.createyourevent.app.service;

import java.util.Optional;
import org.createyourevent.app.domain.EventStarRating;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link EventStarRating}.
 */
public interface EventStarRatingService {
    /**
     * Save a eventStarRating.
     *
     * @param eventStarRating the entity to save.
     * @return the persisted entity.
     */
    EventStarRating save(EventStarRating eventStarRating);

    /**
     * Partially updates a eventStarRating.
     *
     * @param eventStarRating the entity to update partially.
     * @return the persisted entity.
     */
    Optional<EventStarRating> partialUpdate(EventStarRating eventStarRating);

    /**
     * Get all the eventStarRatings.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<EventStarRating> findAll(Pageable pageable);

    /**
     * Get the "id" eventStarRating.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<EventStarRating> findOne(Long id);

    /**
     * Delete the "id" eventStarRating.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
