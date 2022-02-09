package org.createyourevent.app.service;

import java.util.Optional;
import org.createyourevent.app.domain.OrganizationComment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link OrganizationComment}.
 */
public interface OrganizationCommentService {
    /**
     * Save a organizationComment.
     *
     * @param organizationComment the entity to save.
     * @return the persisted entity.
     */
    OrganizationComment save(OrganizationComment organizationComment);

    /**
     * Partially updates a organizationComment.
     *
     * @param organizationComment the entity to update partially.
     * @return the persisted entity.
     */
    Optional<OrganizationComment> partialUpdate(OrganizationComment organizationComment);

    /**
     * Get all the organizationComments.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<OrganizationComment> findAll(Pageable pageable);

    /**
     * Get the "id" organizationComment.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<OrganizationComment> findOne(Long id);

    /**
     * Delete the "id" organizationComment.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
