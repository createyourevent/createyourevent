package org.createyourevent.app.service;

import java.util.Optional;
import org.createyourevent.app.domain.OrganizationLikeDislike;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link OrganizationLikeDislike}.
 */
public interface OrganizationLikeDislikeService {
    /**
     * Save a organizationLikeDislike.
     *
     * @param organizationLikeDislike the entity to save.
     * @return the persisted entity.
     */
    OrganizationLikeDislike save(OrganizationLikeDislike organizationLikeDislike);

    /**
     * Partially updates a organizationLikeDislike.
     *
     * @param organizationLikeDislike the entity to update partially.
     * @return the persisted entity.
     */
    Optional<OrganizationLikeDislike> partialUpdate(OrganizationLikeDislike organizationLikeDislike);

    /**
     * Get all the organizationLikeDislikes.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<OrganizationLikeDislike> findAll(Pageable pageable);

    /**
     * Get the "id" organizationLikeDislike.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<OrganizationLikeDislike> findOne(Long id);

    /**
     * Delete the "id" organizationLikeDislike.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
