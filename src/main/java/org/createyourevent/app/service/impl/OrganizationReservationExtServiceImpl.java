package org.createyourevent.app.service.impl;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;
import org.createyourevent.app.domain.OrganizationReservation;
import org.createyourevent.app.repository.OrganizationReservationExtRepository;
import org.createyourevent.app.repository.OrganizationReservationRepository;
import org.createyourevent.app.service.OrganizationReservationExtService;
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
public class OrganizationReservationExtServiceImpl implements OrganizationReservationExtService {

    private final Logger log = LoggerFactory.getLogger(OrganizationReservationExtServiceImpl.class);

    private final OrganizationReservationExtRepository organizationReservationExtRepository;

    public OrganizationReservationExtServiceImpl(OrganizationReservationExtRepository organizationReservationExtRepository) {
        this.organizationReservationExtRepository = organizationReservationExtRepository;
    }

    @Override
    public List<OrganizationReservation> findByEventId(Long eventId) {
        List<OrganizationReservation> l = this.organizationReservationExtRepository.findAllByEventId(eventId);
        return l;
    }

    @Override
    public List<OrganizationReservation> findAllOrganizationReservationsWithDateFromRange(ZonedDateTime startTime,
            ZonedDateTime endTime) {
        return this.organizationReservationExtRepository.findAllOrganizationReservationsWithDateFromRange(startTime, endTime);
    }

    @Override
    public List<OrganizationReservation> findAllOrganizationReservationsWhereActiveTrueAndDateUntilSmallerAsNowAndUserId(String userId) {
                ZonedDateTime lt = ZonedDateTime.now();
                return this.organizationReservationExtRepository.findAllOrganizationReservationsWhereActiveTrueAndDateUntilSmallerAsNowAndUserId(lt, userId);
    }

    @Override
    public List<OrganizationReservation> findAllByOrganizationId(Long organizationId) {
        List<OrganizationReservation> l = this.organizationReservationExtRepository.findAllByOrganizationId(organizationId);
        return l;
    }

        @Override
    public List<OrganizationReservation> findAllByOrganizationUserId(String userId) {
        List<OrganizationReservation> l = this.organizationReservationExtRepository.findAllByOrganizationUserId(userId);
        return l;
    }

}
