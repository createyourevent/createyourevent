package org.createyourevent.app.service;

import java.util.Optional;
import org.createyourevent.app.domain.ServiceStarRating;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link ServiceStarRating}.
 */
public interface ServiceStarRatingService {
    /**
     * Save a serviceStarRating.
     *
     * @param serviceStarRating the entity to save.
     * @return the persisted entity.
     */
    ServiceStarRating save(ServiceStarRating serviceStarRating);

    /**
     * Partially updates a serviceStarRating.
     *
     * @param serviceStarRating the entity to update partially.
     * @return the persisted entity.
     */
    Optional<ServiceStarRating> partialUpdate(ServiceStarRating serviceStarRating);

    /**
     * Get all the serviceStarRatings.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<ServiceStarRating> findAll(Pageable pageable);

    /**
     * Get the "id" serviceStarRating.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<ServiceStarRating> findOne(Long id);

    /**
     * Delete the "id" serviceStarRating.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
