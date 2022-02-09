package org.createyourevent.app.service;

import java.util.Optional;
import org.createyourevent.app.domain.EventProductRatingComment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link EventProductRatingComment}.
 */
public interface EventProductRatingCommentService {
    /**
     * Save a eventProductRatingComment.
     *
     * @param eventProductRatingComment the entity to save.
     * @return the persisted entity.
     */
    EventProductRatingComment save(EventProductRatingComment eventProductRatingComment);

    /**
     * Partially updates a eventProductRatingComment.
     *
     * @param eventProductRatingComment the entity to update partially.
     * @return the persisted entity.
     */
    Optional<EventProductRatingComment> partialUpdate(EventProductRatingComment eventProductRatingComment);

    /**
     * Get all the eventProductRatingComments.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<EventProductRatingComment> findAll(Pageable pageable);

    /**
     * Get the "id" eventProductRatingComment.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<EventProductRatingComment> findOne(Long id);

    /**
     * Delete the "id" eventProductRatingComment.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
