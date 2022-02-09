package org.createyourevent.app.repository;

import org.createyourevent.app.domain.EventServiceMapOrder;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the EventServiceMapOrder entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EventServiceMapOrderRepository extends JpaRepository<EventServiceMapOrder, Long> {}
