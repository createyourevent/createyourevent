package org.createyourevent.app.service;

import java.util.Optional;
import org.createyourevent.app.domain.Bond;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link Bond}.
 */
public interface BondService {
    /**
     * Save a bond.
     *
     * @param bond the entity to save.
     * @return the persisted entity.
     */
    Bond save(Bond bond);

    /**
     * Partially updates a bond.
     *
     * @param bond the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Bond> partialUpdate(Bond bond);

    /**
     * Get all the bonds.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Bond> findAll(Pageable pageable);

    /**
     * Get the "id" bond.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Bond> findOne(Long id);

    /**
     * Delete the "id" bond.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
