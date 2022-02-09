package org.createyourevent.app.service;

import java.util.Optional;
import org.createyourevent.app.domain.ServiceMap;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link ServiceMap}.
 */
public interface ServiceMapService {
    /**
     * Save a serviceMap.
     *
     * @param serviceMap the entity to save.
     * @return the persisted entity.
     */
    ServiceMap save(ServiceMap serviceMap);

    /**
     * Partially updates a serviceMap.
     *
     * @param serviceMap the entity to update partially.
     * @return the persisted entity.
     */
    Optional<ServiceMap> partialUpdate(ServiceMap serviceMap);

    /**
     * Get all the serviceMaps.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<ServiceMap> findAll(Pageable pageable);

    /**
     * Get the "id" serviceMap.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<ServiceMap> findOne(Long id);

    /**
     * Delete the "id" serviceMap.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
