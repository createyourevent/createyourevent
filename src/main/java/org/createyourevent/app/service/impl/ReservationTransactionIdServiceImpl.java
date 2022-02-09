package org.createyourevent.app.service.impl;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
import org.createyourevent.app.domain.ReservationTransactionId;
import org.createyourevent.app.repository.ReservationTransactionIdRepository;
import org.createyourevent.app.service.ReservationTransactionIdService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link ReservationTransactionId}.
 */
@Service
@Transactional
public class ReservationTransactionIdServiceImpl implements ReservationTransactionIdService {

    private final Logger log = LoggerFactory.getLogger(ReservationTransactionIdServiceImpl.class);

    private final ReservationTransactionIdRepository reservationTransactionIdRepository;

    public ReservationTransactionIdServiceImpl(ReservationTransactionIdRepository reservationTransactionIdRepository) {
        this.reservationTransactionIdRepository = reservationTransactionIdRepository;
    }

    @Override
    public ReservationTransactionId save(ReservationTransactionId reservationTransactionId) {
        log.debug("Request to save ReservationTransactionId : {}", reservationTransactionId);
        return reservationTransactionIdRepository.save(reservationTransactionId);
    }

    @Override
    public Optional<ReservationTransactionId> partialUpdate(ReservationTransactionId reservationTransactionId) {
        log.debug("Request to partially update ReservationTransactionId : {}", reservationTransactionId);

        return reservationTransactionIdRepository
            .findById(reservationTransactionId.getId())
            .map(existingReservationTransactionId -> {
                if (reservationTransactionId.getTransactionDepositId() != null) {
                    existingReservationTransactionId.setTransactionDepositId(reservationTransactionId.getTransactionDepositId());
                }
                if (reservationTransactionId.getTransactionId() != null) {
                    existingReservationTransactionId.setTransactionId(reservationTransactionId.getTransactionId());
                }

                return existingReservationTransactionId;
            })
            .map(reservationTransactionIdRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ReservationTransactionId> findAll(Pageable pageable) {
        log.debug("Request to get all ReservationTransactionIds");
        return reservationTransactionIdRepository.findAll(pageable);
    }

    /**
     *  Get all the reservationTransactionIds where Reservation is {@code null}.
     *  @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<ReservationTransactionId> findAllWhereReservationIsNull() {
        log.debug("Request to get all reservationTransactionIds where Reservation is null");
        return StreamSupport
            .stream(reservationTransactionIdRepository.findAll().spliterator(), false)
            .filter(reservationTransactionId -> reservationTransactionId.getReservation() == null)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<ReservationTransactionId> findOne(Long id) {
        log.debug("Request to get ReservationTransactionId : {}", id);
        return reservationTransactionIdRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete ReservationTransactionId : {}", id);
        reservationTransactionIdRepository.deleteById(id);
    }
}
