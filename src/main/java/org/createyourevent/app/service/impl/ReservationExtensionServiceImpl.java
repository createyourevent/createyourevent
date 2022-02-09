package org.createyourevent.app.service.impl;

import org.createyourevent.app.service.ReservationExtensionService;
import org.createyourevent.app.config.FirebaseConfig;
import org.createyourevent.app.domain.Reservation;
import org.createyourevent.app.domain.ReservationFirestore;
import org.createyourevent.app.repository.ReservationExtensionRepository;
import org.createyourevent.app.repository.ReservationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.Optional;


/**
 * Service Implementation for managing {@link Reservation}.
 */
@Service
@Transactional
public class ReservationExtensionServiceImpl implements ReservationExtensionService {

    private final Logger log = LoggerFactory.getLogger(ReservationExtensionServiceImpl.class);

    private final ReservationExtensionRepository reservationExtensionRepository;

    private final ReservationRepository reservationRepository;


    public ReservationExtensionServiceImpl(ReservationExtensionRepository reservationExtensionRepository, ReservationRepository reservationRepository) {
        this.reservationExtensionRepository = reservationExtensionRepository;
        this.reservationRepository = reservationRepository;
    }


    @Override
    public List<Reservation> findByUserIdAndEventId(String userId, Long eventId) {
        log.debug("Request to get reservation by user and event");
        return reservationExtensionRepository.findByUserIdAndEventId(userId, eventId);
    }

    @Override
    public List<Reservation> findAllByEventId(Long eventId) {
        log.debug("Request to get reservations by event");
        return reservationExtensionRepository.findAllByEventId(eventId);
    }

    @Override
    public List<Reservation> findAllByUserId(String userId) {
        return reservationExtensionRepository.findAllByUserId(userId);
    }

    @Override
    public List<Reservation> findAllByUserIdAndBilled(String userId) {
        return reservationExtensionRepository.findAllByUserIdAndBilledTrue(userId);
    }

    @Override
    public List<Reservation> findAllByUserIdAndNotBilled(String userId) {
        return reservationExtensionRepository.findAllByUserIdAndBilledFalse(userId);
    }


    @Override
    public Reservation save(Reservation reservation) {
        log.debug("Request to save Reservation : {}", reservation);
        Reservation r = reservationRepository.save(reservation);
        return r;
    }

    @Override
    public Optional<Reservation> partialUpdate(Reservation reservation) {
        log.debug("Request to partially update Reservation : {}", reservation);


        return reservationRepository
            .findById(reservation.getId())
            .map(
                existingReservation -> {
                    if (reservation.getDate() != null) {
                        existingReservation.setDate(reservation.getDate());
                    }
                    if (reservation.getBilled() != null) {
                        existingReservation.setBilled(reservation.getBilled());
                    }
                    if (reservation.getAccessEvent() != null) {
                        existingReservation.setAccessEvent(reservation.getAccessEvent());
                    }
                    if (reservation.getAccessDate() != null) {
                        existingReservation.setAccessDate(reservation.getAccessDate());
                    }
                    if (reservation.getTdTxId() != null) {
                        existingReservation.setTdTxId(reservation.getTdTxId());
                    }

                    return existingReservation;
                }
            )
            .map(reservationRepository::save);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Reservation : {}", id);
        reservationRepository.deleteById(id);
    }

}
