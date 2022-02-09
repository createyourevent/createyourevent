package org.createyourevent.app.service;

import java.util.Optional;
import org.createyourevent.app.domain.FeeBalance;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link FeeBalance}.
 */
public interface FeeBalanceService {
    /**
     * Save a feeBalance.
     *
     * @param feeBalance the entity to save.
     * @return the persisted entity.
     */
    FeeBalance save(FeeBalance feeBalance);

    /**
     * Partially updates a feeBalance.
     *
     * @param feeBalance the entity to update partially.
     * @return the persisted entity.
     */
    Optional<FeeBalance> partialUpdate(FeeBalance feeBalance);

    /**
     * Get all the feeBalances.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<FeeBalance> findAll(Pageable pageable);

    /**
     * Get the "id" feeBalance.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<FeeBalance> findOne(Long id);

    /**
     * Delete the "id" feeBalance.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
