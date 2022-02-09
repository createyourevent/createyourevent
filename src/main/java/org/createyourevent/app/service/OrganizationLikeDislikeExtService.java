package org.createyourevent.app.service;

import java.util.List;
import java.util.Optional;
import org.createyourevent.app.domain.OrganizationLikeDislike;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link OrganizationLikeDislike}.
 */
public interface OrganizationLikeDislikeExtService {
    List<OrganizationLikeDislike> findAllByOrganizationId(Long organizationId);
    List<OrganizationLikeDislike> findAllByOrganizationIdAndUserId(Long organizationId, String userId);
}
