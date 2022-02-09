package org.createyourevent.app.repository;

import java.util.List;
import org.createyourevent.app.domain.OrganizationReservation;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the OrganizationReservation entity.
 */
@SuppressWarnings("unused")
@Repository
public interface OrganizationReservationRepository extends JpaRepository<OrganizationReservation, Long> {
    @Query(
        "select organizationReservation from OrganizationReservation organizationReservation where organizationReservation.user.login = ?#{principal.preferredUsername}"
    )
    List<OrganizationReservation> findByUserIsCurrentUser();
}
