package org.createyourevent.app.service.impl;

import java.util.Optional;
import org.createyourevent.app.domain.Reservation;
import org.createyourevent.app.repository.ReservationRepository;
import org.createyourevent.app.service.ReservationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Reservation}.
 */
@Service
@Transactional
public class ReservationServiceImpl implements ReservationService {

    private final Logger log = LoggerFactory.getLogger(ReservationServiceImpl.class);

    private final ReservationRepository reservationRepository;

    public ReservationServiceImpl(ReservationRepository reservationRepository) {
        this.reservationRepository = reservationRepository;
    }

    @Override
    public Reservation save(Reservation reservation) {
        log.debug("Request to save Reservation : {}", reservation);
        return reservationRepository.save(reservation);
    }

    @Override
    public Optional<Reservation> partialUpdate(Reservation reservation) {
        log.debug("Request to partially update Reservation : {}", reservation);

        return reservationRepository
            .findById(reservation.getId())
            .map(existingReservation -> {
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
            })
            .map(reservationRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Reservation> findAll(Pageable pageable) {
        log.debug("Request to get all Reservations");
        return reservationRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Reservation> findOne(Long id) {
        log.debug("Request to get Reservation : {}", id);
        return reservationRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Reservation : {}", id);
        reservationRepository.deleteById(id);
    }
}
