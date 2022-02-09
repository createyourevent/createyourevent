package org.createyourevent.app.service;

import java.time.ZonedDateTime;
import java.util.List;

import org.createyourevent.app.domain.EventServiceMapOrder;
import org.createyourevent.app.domain.ServiceMap;

/**
 * Service Interface for managing {@link ServiceMap}.
 */
public interface ServiceMapExtService {

    List<ServiceMap> findByCreateYourEventServiceId(Long serviceId);
}
