package org.createyourevent.app.repository;

import java.util.List;
import org.createyourevent.app.domain.FeeBalance;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the FeeBalance entity.
 */
@SuppressWarnings("unused")
@Repository
public interface FeeBalanceRepository extends JpaRepository<FeeBalance, Long> {
    @Query("select feeBalance from FeeBalance feeBalance where feeBalance.user.login = ?#{principal.preferredUsername}")
    List<FeeBalance> findByUserIsCurrentUser();
}
