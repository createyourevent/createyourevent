package org.createyourevent.app.service;

import org.createyourevent.app.domain.ServiceLikeDislike;


import java.util.List;

/**
 * Service Interface for managing {@link ServiceLikeDislike}.
 */
public interface ServiceLikeDislikeExtService {

    List<ServiceLikeDislike> findAllByServiceId(Long serviceId);
    List<ServiceLikeDislike> findAllByServiceIdAndUserId(Long serviceId, String userId);
}
