package org.createyourevent.app.repository;

import java.util.List;
import org.createyourevent.app.domain.Reservation;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Reservation entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    @Query("select reservation from Reservation reservation where reservation.user.login = ?#{principal.preferredUsername}")
    List<Reservation> findByUserIsCurrentUser();
}
