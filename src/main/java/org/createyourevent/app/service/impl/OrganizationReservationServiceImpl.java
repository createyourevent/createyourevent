package org.createyourevent.app.service.impl;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
import org.createyourevent.app.domain.OrganizationReservation;
import org.createyourevent.app.repository.OrganizationReservationRepository;
import org.createyourevent.app.service.OrganizationReservationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link OrganizationReservation}.
 */
@Service
@Transactional
public class OrganizationReservationServiceImpl implements OrganizationReservationService {

    private final Logger log = LoggerFactory.getLogger(OrganizationReservationServiceImpl.class);

    private final OrganizationReservationRepository organizationReservationRepository;

    public OrganizationReservationServiceImpl(OrganizationReservationRepository organizationReservationRepository) {
        this.organizationReservationRepository = organizationReservationRepository;
    }

    @Override
    public OrganizationReservation save(OrganizationReservation organizationReservation) {
        log.debug("Request to save OrganizationReservation : {}", organizationReservation);
        return organizationReservationRepository.save(organizationReservation);
    }

    @Override
    public Optional<OrganizationReservation> partialUpdate(OrganizationReservation organizationReservation) {
        log.debug("Request to partially update OrganizationReservation : {}", organizationReservation);

        return organizationReservationRepository
            .findById(organizationReservation.getId())
            .map(existingOrganizationReservation -> {
                if (organizationReservation.getDate() != null) {
                    existingOrganizationReservation.setDate(organizationReservation.getDate());
                }
                if (organizationReservation.getDateFrom() != null) {
                    existingOrganizationReservation.setDateFrom(organizationReservation.getDateFrom());
                }
                if (organizationReservation.getDateUntil() != null) {
                    existingOrganizationReservation.setDateUntil(organizationReservation.getDateUntil());
                }
                if (organizationReservation.getSeen() != null) {
                    existingOrganizationReservation.setSeen(organizationReservation.getSeen());
                }
                if (organizationReservation.getApproved() != null) {
                    existingOrganizationReservation.setApproved(organizationReservation.getApproved());
                }
                if (organizationReservation.getTotal() != null) {
                    existingOrganizationReservation.setTotal(organizationReservation.getTotal());
                }
                if (organizationReservation.getFeeBilled() != null) {
                    existingOrganizationReservation.setFeeBilled(organizationReservation.getFeeBilled());
                }

                return existingOrganizationReservation;
            })
            .map(organizationReservationRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<OrganizationReservation> findAll(Pageable pageable) {
        log.debug("Request to get all OrganizationReservations");
        return organizationReservationRepository.findAll(pageable);
    }

    /**
     *  Get all the organizationReservations where FeeTransaction is {@code null}.
     *  @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<OrganizationReservation> findAllWhereFeeTransactionIsNull() {
        log.debug("Request to get all organizationReservations where FeeTransaction is null");
        return StreamSupport
            .stream(organizationReservationRepository.findAll().spliterator(), false)
            .filter(organizationReservation -> organizationReservation.getFeeTransaction() == null)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<OrganizationReservation> findOne(Long id) {
        log.debug("Request to get OrganizationReservation : {}", id);
        return organizationReservationRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete OrganizationReservation : {}", id);
        organizationReservationRepository.deleteById(id);
    }
}
