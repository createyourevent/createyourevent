package org.createyourevent.app.repository;

import java.util.List;
import org.createyourevent.app.domain.FeeTransaction;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the FeeTransaction entity.
 */
@SuppressWarnings("unused")
@Repository
public interface FeeTransactionRepository extends JpaRepository<FeeTransaction, Long> {
    @Query("select feeTransaction from FeeTransaction feeTransaction where feeTransaction.user.login = ?#{principal.preferredUsername}")
    List<FeeTransaction> findByUserIsCurrentUser();
}
