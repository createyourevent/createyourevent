package org.createyourevent.app.service;

import java.util.Optional;
import org.createyourevent.app.domain.OrganizationStarRating;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link OrganizationStarRating}.
 */
public interface OrganizationStarRatingService {
    /**
     * Save a organizationStarRating.
     *
     * @param organizationStarRating the entity to save.
     * @return the persisted entity.
     */
    OrganizationStarRating save(OrganizationStarRating organizationStarRating);

    /**
     * Partially updates a organizationStarRating.
     *
     * @param organizationStarRating the entity to update partially.
     * @return the persisted entity.
     */
    Optional<OrganizationStarRating> partialUpdate(OrganizationStarRating organizationStarRating);

    /**
     * Get all the organizationStarRatings.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<OrganizationStarRating> findAll(Pageable pageable);

    /**
     * Get the "id" organizationStarRating.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<OrganizationStarRating> findOne(Long id);

    /**
     * Delete the "id" organizationStarRating.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
