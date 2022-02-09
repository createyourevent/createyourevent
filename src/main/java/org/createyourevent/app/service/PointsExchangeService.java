package org.createyourevent.app.service;

import java.util.Optional;
import org.createyourevent.app.domain.PointsExchange;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link PointsExchange}.
 */
public interface PointsExchangeService {
    /**
     * Save a pointsExchange.
     *
     * @param pointsExchange the entity to save.
     * @return the persisted entity.
     */
    PointsExchange save(PointsExchange pointsExchange);

    /**
     * Partially updates a pointsExchange.
     *
     * @param pointsExchange the entity to update partially.
     * @return the persisted entity.
     */
    Optional<PointsExchange> partialUpdate(PointsExchange pointsExchange);

    /**
     * Get all the pointsExchanges.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<PointsExchange> findAll(Pageable pageable);

    /**
     * Get the "id" pointsExchange.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<PointsExchange> findOne(Long id);

    /**
     * Delete the "id" pointsExchange.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
