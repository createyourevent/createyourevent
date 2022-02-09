package org.createyourevent.app.service;

import java.util.Optional;
import org.createyourevent.app.domain.Tags;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link Tags}.
 */
public interface TagsService {
    /**
     * Save a tags.
     *
     * @param tags the entity to save.
     * @return the persisted entity.
     */
    Tags save(Tags tags);

    /**
     * Partially updates a tags.
     *
     * @param tags the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Tags> partialUpdate(Tags tags);

    /**
     * Get all the tags.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Tags> findAll(Pageable pageable);

    /**
     * Get the "id" tags.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Tags> findOne(Long id);

    /**
     * Delete the "id" tags.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
