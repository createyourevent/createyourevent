package org.createyourevent.app.service;

import java.util.Optional;
import org.createyourevent.app.domain.Mp3;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link Mp3}.
 */
public interface Mp3Service {
    /**
     * Save a mp3.
     *
     * @param mp3 the entity to save.
     * @return the persisted entity.
     */
    Mp3 save(Mp3 mp3);

    /**
     * Partially updates a mp3.
     *
     * @param mp3 the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Mp3> partialUpdate(Mp3 mp3);

    /**
     * Get all the mp3s.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Mp3> findAll(Pageable pageable);

    /**
     * Get the "id" mp3.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Mp3> findOne(Long id);

    /**
     * Delete the "id" mp3.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
