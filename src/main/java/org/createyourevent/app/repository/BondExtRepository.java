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
public interface BondExtRepository extends JpaRepository<Bond, Long> {
    List<Bond> findByCode(String code);
}
