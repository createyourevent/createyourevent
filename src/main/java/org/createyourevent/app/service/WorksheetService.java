package org.createyourevent.app.service;

import java.util.Optional;
import org.createyourevent.app.domain.Worksheet;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link Worksheet}.
 */
public interface WorksheetService {
    /**
     * Save a worksheet.
     *
     * @param worksheet the entity to save.
     * @return the persisted entity.
     */
    Worksheet save(Worksheet worksheet);

    /**
     * Partially updates a worksheet.
     *
     * @param worksheet the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Worksheet> partialUpdate(Worksheet worksheet);

    /**
     * Get all the worksheets.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Worksheet> findAll(Pageable pageable);

    /**
     * Get the "id" worksheet.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Worksheet> findOne(Long id);

    /**
     * Delete the "id" worksheet.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
