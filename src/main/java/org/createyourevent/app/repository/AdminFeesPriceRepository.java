package org.createyourevent.app.repository;

import org.createyourevent.app.domain.AdminFeesPrice;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the AdminFeesPrice entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AdminFeesPriceRepository extends JpaRepository<AdminFeesPrice, Long> {}
