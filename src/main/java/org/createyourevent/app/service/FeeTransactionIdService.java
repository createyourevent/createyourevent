package org.createyourevent.app.service;

import java.util.List;
import java.util.Optional;
import org.createyourevent.app.domain.FeeTransactionId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link FeeTransactionId}.
 */
public interface FeeTransactionIdService {
    /**
     * Save a feeTransactionId.
     *
     * @param feeTransactionId the entity to save.
     * @return the persisted entity.
     */
    FeeTransactionId save(FeeTransactionId feeTransactionId);

    /**
     * Partially updates a feeTransactionId.
     *
     * @param feeTransactionId the entity to update partially.
     * @return the persisted entity.
     */
    Optional<FeeTransactionId> partialUpdate(FeeTransactionId feeTransactionId);

    /**
     * Get all the feeTransactionIds.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<FeeTransactionId> findAll(Pageable pageable);
    /**
     * Get all the FeeTransactionId where FeeTransaction is {@code null}.
     *
     * @return the {@link List} of entities.
     */
    List<FeeTransactionId> findAllWhereFeeTransactionIsNull();

    /**
     * Get the "id" feeTransactionId.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<FeeTransactionId> findOne(Long id);

    /**
     * Delete the "id" feeTransactionId.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
