package org.createyourevent.app.repository;

import java.time.ZonedDateTime;
import java.util.List;
import org.createyourevent.app.domain.OrganizationReservation;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the OrganizationReservation entity.
 */
@SuppressWarnings("unused")
@Repository
public interface OrganizationReservationExtRepository extends JpaRepository<OrganizationReservation, Long> {

    @Query("select o from OrganizationReservation o where o.event.id = :eventId")
    List<OrganizationReservation> findAllByEventId(@Param("eventId") Long eventId);

    @Query("select o from OrganizationReservation o where :startTime between o.dateFrom and o.dateUntil or :endTime between o.dateFrom and o.dateUntil or :startTime < o.dateFrom and :endTime > o.dateUntil")
    List<OrganizationReservation> findAllOrganizationReservationsWithDateFromRange(@Param("startTime") ZonedDateTime startTime, @Param("endTime") ZonedDateTime endTime);

    @Query("select o from OrganizationReservation o where o.organization.active = true and o.dateUntil < :now and o.user.id = :userId")
    List<OrganizationReservation> findAllOrganizationReservationsWhereActiveTrueAndDateUntilSmallerAsNowAndUserId(@Param("now") ZonedDateTime now, @Param("userId") String userId);

    @Query("select o from OrganizationReservation o where o.organization.id = :organizationId")
    List<OrganizationReservation> findAllByOrganizationId(@Param("organizationId") Long organizationId);

    @Query("select o from OrganizationReservation o where o.organization.user.id = :userId")
    List<OrganizationReservation> findAllByOrganizationUserId(@Param("userId") String userId);

}
