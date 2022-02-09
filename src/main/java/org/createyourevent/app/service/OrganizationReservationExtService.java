package org.createyourevent.app.service;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;
import org.createyourevent.app.domain.OrganizationReservation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link OrganizationReservation}.
 */
public interface OrganizationReservationExtService {
    List<OrganizationReservation> findByEventId(Long eventId);
    List<OrganizationReservation> findAllOrganizationReservationsWithDateFromRange(ZonedDateTime startTime, ZonedDateTime endTime);
    List<OrganizationReservation> findAllOrganizationReservationsWhereActiveTrueAndDateUntilSmallerAsNowAndUserId(String userId);
    List<OrganizationReservation> findAllByOrganizationId(Long organizationId);
    List<OrganizationReservation> findAllByOrganizationUserId(String userId);
}
