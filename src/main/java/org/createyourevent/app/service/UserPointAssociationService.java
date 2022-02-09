package org.createyourevent.app.service;

import java.util.Optional;
import org.createyourevent.app.domain.UserPointAssociation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link UserPointAssociation}.
 */
public interface UserPointAssociationService {
    /**
     * Save a userPointAssociation.
     *
     * @param userPointAssociation the entity to save.
     * @return the persisted entity.
     */
    UserPointAssociation save(UserPointAssociation userPointAssociation);

    /**
     * Partially updates a userPointAssociation.
     *
     * @param userPointAssociation the entity to update partially.
     * @return the persisted entity.
     */
    Optional<UserPointAssociation> partialUpdate(UserPointAssociation userPointAssociation);

    /**
     * Get all the userPointAssociations.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<UserPointAssociation> findAll(Pageable pageable);

    /**
     * Get the "id" userPointAssociation.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<UserPointAssociation> findOne(Long id);

    /**
     * Delete the "id" userPointAssociation.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
