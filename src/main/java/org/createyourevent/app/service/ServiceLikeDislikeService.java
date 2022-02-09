package org.createyourevent.app.service;

import java.util.Optional;
import org.createyourevent.app.domain.ServiceLikeDislike;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link ServiceLikeDislike}.
 */
public interface ServiceLikeDislikeService {
    /**
     * Save a serviceLikeDislike.
     *
     * @param serviceLikeDislike the entity to save.
     * @return the persisted entity.
     */
    ServiceLikeDislike save(ServiceLikeDislike serviceLikeDislike);

    /**
     * Partially updates a serviceLikeDislike.
     *
     * @param serviceLikeDislike the entity to update partially.
     * @return the persisted entity.
     */
    Optional<ServiceLikeDislike> partialUpdate(ServiceLikeDislike serviceLikeDislike);

    /**
     * Get all the serviceLikeDislikes.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<ServiceLikeDislike> findAll(Pageable pageable);

    /**
     * Get the "id" serviceLikeDislike.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<ServiceLikeDislike> findOne(Long id);

    /**
     * Delete the "id" serviceLikeDislike.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
