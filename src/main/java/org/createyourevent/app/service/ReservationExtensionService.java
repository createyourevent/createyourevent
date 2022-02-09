package org.createyourevent.app.service;

import java.util.List;
import java.util.Optional;

import org.createyourevent.app.domain.Reservation;


/**
 * Service Interface for managing {@link Reservation}.
 */
public interface ReservationExtensionService {

    List<Reservation> findByUserIdAndEventId(String userId, Long eventId);

    List<Reservation> findAllByEventId(Long eventId);

    List<Reservation> findAllByUserId(String userId);

    List<Reservation> findAllByUserIdAndBilled(String userId);

    List<Reservation> findAllByUserIdAndNotBilled(String userId);

    Reservation save(Reservation reservation);

    Optional<Reservation> partialUpdate(Reservation reservation);

    void delete(Long id);
}
