package org.createyourevent.app.service;

import java.util.Optional;
import org.createyourevent.app.domain.ServiceOffer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link ServiceOffer}.
 */
public interface ServiceOfferService {
    /**
     * Save a serviceOffer.
     *
     * @param serviceOffer the entity to save.
     * @return the persisted entity.
     */
    ServiceOffer save(ServiceOffer serviceOffer);

    /**
     * Partially updates a serviceOffer.
     *
     * @param serviceOffer the entity to update partially.
     * @return the persisted entity.
     */
    Optional<ServiceOffer> partialUpdate(ServiceOffer serviceOffer);

    /**
     * Get all the serviceOffers.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<ServiceOffer> findAll(Pageable pageable);

    /**
     * Get the "id" serviceOffer.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<ServiceOffer> findOne(Long id);

    /**
     * Delete the "id" serviceOffer.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
