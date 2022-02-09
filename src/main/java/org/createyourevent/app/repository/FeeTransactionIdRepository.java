package org.createyourevent.app.repository;

import org.createyourevent.app.domain.FeeTransactionId;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the FeeTransactionId entity.
 */
@SuppressWarnings("unused")
@Repository
public interface FeeTransactionIdRepository extends JpaRepository<FeeTransactionId, Long> {}
