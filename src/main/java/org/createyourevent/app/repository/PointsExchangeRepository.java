package org.createyourevent.app.repository;

import org.createyourevent.app.domain.PointsExchange;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the PointsExchange entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PointsExchangeRepository extends JpaRepository<PointsExchange, Long> {}
