package org.createyourevent.app.service;

import java.util.List;
import java.util.Optional;
import org.createyourevent.app.domain.OrganizationComment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link OrganizationComment}.
 */
public interface OrganizationCommentExtService {
    List<OrganizationComment> findAllByOrganizationId(Long organizationId);
    List<OrganizationComment> findAllByOrganizationIdAndUserId(Long organizationId, String userId);
}
