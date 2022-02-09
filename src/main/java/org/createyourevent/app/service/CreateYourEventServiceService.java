package org.createyourevent.app.service;

import java.util.Optional;
import org.createyourevent.app.domain.CreateYourEventService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link CreateYourEventService}.
 */
public interface CreateYourEventServiceService {
    /**
     * Save a createYourEventService.
     *
     * @param createYourEventService the entity to save.
     * @return the persisted entity.
     */
    CreateYourEventService save(CreateYourEventService createYourEventService);

    /**
     * Partially updates a createYourEventService.
     *
     * @param createYourEventService the entity to update partially.
     * @return the persisted entity.
     */
    Optional<CreateYourEventService> partialUpdate(CreateYourEventService createYourEventService);

    /**
     * Get all the createYourEventServices.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<CreateYourEventService> findAll(Pageable pageable);

    /**
     * Get the "id" createYourEventService.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<CreateYourEventService> findOne(Long id);

    /**
     * Delete the "id" createYourEventService.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
