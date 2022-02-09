package org.createyourevent.app.service;

import java.util.List;
import java.util.Optional;
import org.createyourevent.app.domain.RideCosts;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link RideCosts}.
 */
public interface RideCostsService {
    /**
     * Save a rideCosts.
     *
     * @param rideCosts the entity to save.
     * @return the persisted entity.
     */
    RideCosts save(RideCosts rideCosts);

    /**
     * Partially updates a rideCosts.
     *
     * @param rideCosts the entity to update partially.
     * @return the persisted entity.
     */
    Optional<RideCosts> partialUpdate(RideCosts rideCosts);

    /**
     * Get all the rideCosts.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<RideCosts> findAll(Pageable pageable);
    /**
     * Get all the RideCosts where ServiceMap is {@code null}.
     *
     * @return the {@link List} of entities.
     */
    List<RideCosts> findAllWhereServiceMapIsNull();

    /**
     * Get the "id" rideCosts.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<RideCosts> findOne(Long id);

    /**
     * Delete the "id" rideCosts.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
