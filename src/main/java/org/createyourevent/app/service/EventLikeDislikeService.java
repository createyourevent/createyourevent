package org.createyourevent.app.service;

import java.util.Optional;
import org.createyourevent.app.domain.EventLikeDislike;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link EventLikeDislike}.
 */
public interface EventLikeDislikeService {
    /**
     * Save a eventLikeDislike.
     *
     * @param eventLikeDislike the entity to save.
     * @return the persisted entity.
     */
    EventLikeDislike save(EventLikeDislike eventLikeDislike);

    /**
     * Partially updates a eventLikeDislike.
     *
     * @param eventLikeDislike the entity to update partially.
     * @return the persisted entity.
     */
    Optional<EventLikeDislike> partialUpdate(EventLikeDislike eventLikeDislike);

    /**
     * Get all the eventLikeDislikes.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<EventLikeDislike> findAll(Pageable pageable);

    /**
     * Get the "id" eventLikeDislike.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<EventLikeDislike> findOne(Long id);

    /**
     * Delete the "id" eventLikeDislike.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
