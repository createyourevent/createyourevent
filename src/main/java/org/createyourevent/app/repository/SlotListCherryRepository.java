package org.createyourevent.app.repository;

import org.createyourevent.app.domain.SlotListCherry;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the SlotListCherry entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SlotListCherryRepository extends JpaRepository<SlotListCherry, Long> {}
