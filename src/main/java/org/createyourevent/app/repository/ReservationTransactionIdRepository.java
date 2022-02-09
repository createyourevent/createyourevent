package org.createyourevent.app.repository;

import org.createyourevent.app.domain.ReservationTransactionId;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the ReservationTransactionId entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ReservationTransactionIdRepository extends JpaRepository<ReservationTransactionId, Long> {}
