package org.createyourevent.app.repository;

import org.createyourevent.app.domain.Location;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the Location entity.
 */
@SuppressWarnings("unused")
@Repository
public interface LocationExtensionRepository extends JpaRepository<Location, Long> {

    Location findByEventId(Long id);
}
