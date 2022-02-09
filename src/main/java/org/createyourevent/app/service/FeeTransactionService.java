package org.createyourevent.app.service;

import java.util.Optional;
import org.createyourevent.app.domain.FeeTransaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link FeeTransaction}.
 */
public interface FeeTransactionService {
    /**
     * Save a feeTransaction.
     *
     * @param feeTransaction the entity to save.
     * @return the persisted entity.
     */
    FeeTransaction save(FeeTransaction feeTransaction);

    /**
     * Partially updates a feeTransaction.
     *
     * @param feeTransaction the entity to update partially.
     * @return the persisted entity.
     */
    Optional<FeeTransaction> partialUpdate(FeeTransaction feeTransaction);

    /**
     * Get all the feeTransactions.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<FeeTransaction> findAll(Pageable pageable);

    /**
     * Get the "id" feeTransaction.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<FeeTransaction> findOne(Long id);

    /**
     * Delete the "id" feeTransaction.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
