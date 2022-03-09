package org.createyourevent.app.repository;

import org.createyourevent.app.domain.SlotListOrange;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the SlotListOrange entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SlotListOrangeRepository extends JpaRepository<SlotListOrange, Long> {}
