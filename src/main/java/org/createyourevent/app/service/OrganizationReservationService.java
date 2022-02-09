package org.createyourevent.app.service;

import java.util.List;
import java.util.Optional;
import org.createyourevent.app.domain.OrganizationReservation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link OrganizationReservation}.
 */
public interface OrganizationReservationService {
    /**
     * Save a organizationReservation.
     *
     * @param organizationReservation the entity to save.
     * @return the persisted entity.
     */
    OrganizationReservation save(OrganizationReservation organizationReservation);

    /**
     * Partially updates a organizationReservation.
     *
     * @param organizationReservation the entity to update partially.
     * @return the persisted entity.
     */
    Optional<OrganizationReservation> partialUpdate(OrganizationReservation organizationReservation);

    /**
     * Get all the organizationReservations.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<OrganizationReservation> findAll(Pageable pageable);
    /**
     * Get all the OrganizationReservation where FeeTransaction is {@code null}.
     *
     * @return the {@link List} of entities.
     */
    List<OrganizationReservation> findAllWhereFeeTransactionIsNull();

    /**
     * Get the "id" organizationReservation.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<OrganizationReservation> findOne(Long id);

    /**
     * Delete the "id" organizationReservation.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
