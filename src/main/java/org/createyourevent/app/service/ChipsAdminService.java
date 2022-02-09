package org.createyourevent.app.service;

import java.util.Optional;
import org.createyourevent.app.domain.ChipsAdmin;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link ChipsAdmin}.
 */
public interface ChipsAdminService {
    /**
     * Save a chipsAdmin.
     *
     * @param chipsAdmin the entity to save.
     * @return the persisted entity.
     */
    ChipsAdmin save(ChipsAdmin chipsAdmin);

    /**
     * Partially updates a chipsAdmin.
     *
     * @param chipsAdmin the entity to update partially.
     * @return the persisted entity.
     */
    Optional<ChipsAdmin> partialUpdate(ChipsAdmin chipsAdmin);

    /**
     * Get all the chipsAdmins.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<ChipsAdmin> findAll(Pageable pageable);

    /**
     * Get the "id" chipsAdmin.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<ChipsAdmin> findOne(Long id);

    /**
     * Delete the "id" chipsAdmin.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
