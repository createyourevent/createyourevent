package org.createyourevent.app.service;

import java.util.Optional;
import org.createyourevent.app.domain.FeeTransactionEntry;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link FeeTransactionEntry}.
 */
public interface FeeTransactionEntryService {
    /**
     * Save a feeTransactionEntry.
     *
     * @param feeTransactionEntry the entity to save.
     * @return the persisted entity.
     */
    FeeTransactionEntry save(FeeTransactionEntry feeTransactionEntry);

    /**
     * Partially updates a feeTransactionEntry.
     *
     * @param feeTransactionEntry the entity to update partially.
     * @return the persisted entity.
     */
    Optional<FeeTransactionEntry> partialUpdate(FeeTransactionEntry feeTransactionEntry);

    /**
     * Get all the feeTransactionEntries.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<FeeTransactionEntry> findAll(Pageable pageable);

    /**
     * Get the "id" feeTransactionEntry.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<FeeTransactionEntry> findOne(Long id);

    /**
     * Delete the "id" feeTransactionEntry.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
