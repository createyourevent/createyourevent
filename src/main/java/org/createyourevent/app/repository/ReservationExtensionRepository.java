package org.createyourevent.app.repository;

import org.createyourevent.app.domain.Reservation;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data  repository for the Reservation entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ReservationExtensionRepository extends JpaRepository<Reservation, Long> {

    List<Reservation> findByUserIdAndEventId(String userId, Long eventId);
    List<Reservation> findAllByEventId(Long eventId);
    List<Reservation> findAllByUserId(String userId);

    @Query("select reservation from Reservation reservation where reservation.user.id = :userId and reservation.billed = true")
    List<Reservation> findAllByUserIdAndBilledTrue(@Param("userId") String userId);

    @Query("select reservation from Reservation reservation where reservation.user.id = :userId and reservation.billed = false")
    List<Reservation> findAllByUserIdAndBilledFalse(@Param("userId") String userId);
}
