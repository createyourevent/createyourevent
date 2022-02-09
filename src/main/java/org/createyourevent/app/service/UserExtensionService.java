package org.createyourevent.app.service;

import java.util.Optional;
import org.createyourevent.app.domain.UserExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link UserExtension}.
 */
public interface UserExtensionService {
    /**
     * Save a userExtension.
     *
     * @param userExtension the entity to save.
     * @return the persisted entity.
     */
    UserExtension save(UserExtension userExtension);

    /**
     * Partially updates a userExtension.
     *
     * @param userExtension the entity to update partially.
     * @return the persisted entity.
     */
    Optional<UserExtension> partialUpdate(UserExtension userExtension);

    /**
     * Get all the userExtensions.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<UserExtension> findAll(Pageable pageable);

    /**
     * Get the "id" userExtension.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<UserExtension> findOne(Long id);

    /**
     * Delete the "id" userExtension.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
