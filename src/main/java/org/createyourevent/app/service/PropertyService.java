package org.createyourevent.app.service;

import java.util.Optional;
import org.createyourevent.app.domain.Property;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link Property}.
 */
public interface PropertyService {
    /**
     * Save a property.
     *
     * @param property the entity to save.
     * @return the persisted entity.
     */
    Property save(Property property);

    /**
     * Partially updates a property.
     *
     * @param property the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Property> partialUpdate(Property property);

    /**
     * Get all the properties.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Property> findAll(Pageable pageable);

    /**
     * Get the "id" property.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Property> findOne(Long id);

    /**
     * Delete the "id" property.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
