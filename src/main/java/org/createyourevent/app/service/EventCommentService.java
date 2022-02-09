package org.createyourevent.app.service;

import java.util.Optional;
import org.createyourevent.app.domain.EventComment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link EventComment}.
 */
public interface EventCommentService {
    /**
     * Save a eventComment.
     *
     * @param eventComment the entity to save.
     * @return the persisted entity.
     */
    EventComment save(EventComment eventComment);

    /**
     * Partially updates a eventComment.
     *
     * @param eventComment the entity to update partially.
     * @return the persisted entity.
     */
    Optional<EventComment> partialUpdate(EventComment eventComment);

    /**
     * Get all the eventComments.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<EventComment> findAll(Pageable pageable);

    /**
     * Get the "id" eventComment.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<EventComment> findOne(Long id);

    /**
     * Delete the "id" eventComment.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
