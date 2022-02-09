package org.createyourevent.app.repository;

import org.createyourevent.app.domain.EventDetails;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the EventDetails entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EventDetailsRepository extends JpaRepository<EventDetails, Long> {}
