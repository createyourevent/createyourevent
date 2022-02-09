package org.createyourevent.app.service;

import java.util.List;
import java.util.Optional;
import org.createyourevent.app.domain.OrganizationStarRating;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link OrganizationStarRating}.
 */
public interface OrganizationStarRatingExtService {
    List<OrganizationStarRating> findByOrganizationId(Long organizationId);
    OrganizationStarRating findByOrganizationIdAndUserId(Long organizationId, String userId);
}
