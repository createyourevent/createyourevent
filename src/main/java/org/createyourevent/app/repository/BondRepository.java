package org.createyourevent.app.repository;

import java.util.List;
import org.createyourevent.app.domain.Bond;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Bond entity.
 */
@SuppressWarnings("unused")
@Repository
public interface BondRepository extends JpaRepository<Bond, Long> {
    @Query("select bond from Bond bond where bond.user.login = ?#{principal.preferredUsername}")
    List<Bond> findByUserIsCurrentUser();
}
