package org.createyourevent.app.service;

import org.createyourevent.app.domain.ServiceComment;

import java.util.List;

/**
 * Service Interface for managing {@link ServiceComment}.
 */
public interface ServiceCommentExtService {
    List<ServiceComment> findAllByServiceId(Long serviceId);
    List<ServiceComment> findAllByServiceIdAndUserId(Long serviceId, String userId);
}
