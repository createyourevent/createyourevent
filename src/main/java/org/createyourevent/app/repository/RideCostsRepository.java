package org.createyourevent.app.repository;

import org.createyourevent.app.domain.RideCosts;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the RideCosts entity.
 */
@SuppressWarnings("unused")
@Repository
public interface RideCostsRepository extends JpaRepository<RideCosts, Long> {}
