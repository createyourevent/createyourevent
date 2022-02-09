package org.createyourevent.app.service;

import java.util.Optional;
import org.createyourevent.app.domain.ServiceComment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link ServiceComment}.
 */
public interface ServiceCommentService {
    /**
     * Save a serviceComment.
     *
     * @param serviceComment the entity to save.
     * @return the persisted entity.
     */
    ServiceComment save(ServiceComment serviceComment);

    /**
     * Partially updates a serviceComment.
     *
     * @param serviceComment the entity to update partially.
     * @return the persisted entity.
     */
    Optional<ServiceComment> partialUpdate(ServiceComment serviceComment);

    /**
     * Get all the serviceComments.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<ServiceComment> findAll(Pageable pageable);

    /**
     * Get the "id" serviceComment.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<ServiceComment> findOne(Long id);

    /**
     * Delete the "id" serviceComment.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
