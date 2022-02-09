package org.createyourevent.app.repository;

import org.createyourevent.app.domain.ServiceStarRating;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data  repository for the ServiceStarRating entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ServiceStarRatingExtRepository extends JpaRepository<ServiceStarRating, Long> {
    List<ServiceStarRating> findByServiceId(Long serviceId);

    ServiceStarRating findByServiceIdAndUserId(Long serviceId, String userId);
}
