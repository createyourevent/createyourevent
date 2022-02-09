package org.createyourevent.app.repository;

import org.createyourevent.app.domain.ServiceMap;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the ServiceMap entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ServiceMapRepository extends JpaRepository<ServiceMap, Long> {}
