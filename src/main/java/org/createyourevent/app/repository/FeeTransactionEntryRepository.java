package org.createyourevent.app.repository;

import org.createyourevent.app.domain.FeeTransactionEntry;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the FeeTransactionEntry entity.
 */
@SuppressWarnings("unused")
@Repository
public interface FeeTransactionEntryRepository extends JpaRepository<FeeTransactionEntry, Long> {}
