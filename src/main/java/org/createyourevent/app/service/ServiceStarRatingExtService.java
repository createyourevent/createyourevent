package org.createyourevent.app.service;

import org.createyourevent.app.domain.ServiceStarRating;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link ServiceStarRating}.
 */
public interface ServiceStarRatingExtService {

    List<ServiceStarRating> findByServiceId(Long serviceId);

    ServiceStarRating findByServiceIdAndUserId(Long serviceId, String userId);
}
