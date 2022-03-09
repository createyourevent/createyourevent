package org.createyourevent.app.repository;

import org.createyourevent.app.domain.SlotListClock;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the SlotListClock entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SlotListClockRepository extends JpaRepository<SlotListClock, Long> {}
