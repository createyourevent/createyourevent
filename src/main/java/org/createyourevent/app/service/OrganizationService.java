package org.createyourevent.app.service;

import java.util.List;
import java.util.Optional;
import org.createyourevent.app.domain.Organization;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link Organization}.
 */
public interface OrganizationService {
    /**
     * Save a organization.
     *
     * @param organization the entity to save.
     * @return the persisted entity.
     */
    Organization save(Organization organization);

    /**
     * Partially updates a organization.
     *
     * @param organization the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Organization> partialUpdate(Organization organization);

    /**
     * Get all the organizations.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Organization> findAll(Pageable pageable);
    /**
     * Get all the Organization where Restaurant is {@code null}.
     *
     * @return the {@link List} of entities.
     */
    List<Organization> findAllWhereRestaurantIsNull();
    /**
     * Get all the Organization where Hotel is {@code null}.
     *
     * @return the {@link List} of entities.
     */
    List<Organization> findAllWhereHotelIsNull();
    /**
     * Get all the Organization where Club is {@code null}.
     *
     * @return the {@link List} of entities.
     */
    List<Organization> findAllWhereClubIsNull();
    /**
     * Get all the Organization where Building is {@code null}.
     *
     * @return the {@link List} of entities.
     */
    List<Organization> findAllWhereBuildingIsNull();

    /**
     * Get the "id" organization.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Organization> findOne(Long id);

    /**
     * Delete the "id" organization.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
