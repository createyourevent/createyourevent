package org.createyourevent.app.service;

import org.createyourevent.app.domain.CreateYourEventService;
import org.createyourevent.app.domain.ServiceMap;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link CreateYourEventService}.
 */
public interface CreateYourEventServiceExtService {

    List<CreateYourEventService> findByUserIdAndActiveTrue(String userId);
    List<CreateYourEventService> findByActiveTrue();
    List<CreateYourEventService> findByActiveTrueAndActiveOwnerTrue();
    List<CreateYourEventService> findByActiveTrueAndActiveOwnerTrueAndServiceMaps(ServiceMap serviceMap);
}
