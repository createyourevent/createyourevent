package org.createyourevent.app.service;

import java.util.Optional;
import org.createyourevent.app.domain.AdminFeesPrice;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link AdminFeesPrice}.
 */
public interface AdminFeesPriceService {
    /**
     * Save a adminFeesPrice.
     *
     * @param adminFeesPrice the entity to save.
     * @return the persisted entity.
     */
    AdminFeesPrice save(AdminFeesPrice adminFeesPrice);

    /**
     * Partially updates a adminFeesPrice.
     *
     * @param adminFeesPrice the entity to update partially.
     * @return the persisted entity.
     */
    Optional<AdminFeesPrice> partialUpdate(AdminFeesPrice adminFeesPrice);

    /**
     * Get all the adminFeesPrices.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<AdminFeesPrice> findAll(Pageable pageable);

    /**
     * Get the "id" adminFeesPrice.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<AdminFeesPrice> findOne(Long id);

    /**
     * Delete the "id" adminFeesPrice.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
