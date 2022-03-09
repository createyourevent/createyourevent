package org.createyourevent.app.repository;

import org.createyourevent.app.domain.SlotListPlum;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the SlotListPlum entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SlotListPlumExtRepository extends JpaRepository<SlotListPlum, Long> {
    @Override
    void deleteAll();
}
