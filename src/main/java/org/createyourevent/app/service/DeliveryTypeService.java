package org.createyourevent.app.service;

import java.util.Optional;
import org.createyourevent.app.domain.DeliveryType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link DeliveryType}.
 */
public interface DeliveryTypeService {
    /**
     * Save a deliveryType.
     *
     * @param deliveryType the entity to save.
     * @return the persisted entity.
     */
    DeliveryType save(DeliveryType deliveryType);

    /**
     * Partially updates a deliveryType.
     *
     * @param deliveryType the entity to update partially.
     * @return the persisted entity.
     */
    Optional<DeliveryType> partialUpdate(DeliveryType deliveryType);

    /**
     * Get all the deliveryTypes.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<DeliveryType> findAll(Pageable pageable);

    /**
     * Get the "id" deliveryType.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<DeliveryType> findOne(Long id);

    /**
     * Delete the "id" deliveryType.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
