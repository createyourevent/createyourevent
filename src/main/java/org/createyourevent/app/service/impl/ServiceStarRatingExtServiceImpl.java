package org.createyourevent.app.service.impl;

import org.createyourevent.app.service.ServiceStarRatingExtService;
import org.createyourevent.app.service.ServiceStarRatingService;
import org.createyourevent.app.domain.ServiceStarRating;
import org.createyourevent.app.repository.ServiceStarRatingExtRepository;
import org.createyourevent.app.repository.ServiceStarRatingRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Service Implementation for managing {@link ServiceStarRating}.
 */
@Service
@Transactional
public class ServiceStarRatingExtServiceImpl implements ServiceStarRatingExtService {

    private final Logger log = LoggerFactory.getLogger(ServiceStarRatingExtServiceImpl.class);

    private final ServiceStarRatingExtRepository serviceStarRatingExtRepository;

    public ServiceStarRatingExtServiceImpl(ServiceStarRatingExtRepository serviceStarRatingExtRepository) {
        this.serviceStarRatingExtRepository = serviceStarRatingExtRepository;
    }

    @Override
    public List<ServiceStarRating> findByServiceId(Long serviceId) {
        log.debug("List<ServiceStarRating> findByServiceId(Long serviceId)");
        return serviceStarRatingExtRepository.findByServiceId(serviceId);
    }

    @Override
    public ServiceStarRating findByServiceIdAndUserId(Long serviceId, String userId) {
        log.debug("ServiceStarRating findByServiceIdAndUserId(Long serviceId, String userId)");
        return serviceStarRatingExtRepository.findByServiceIdAndUserId(serviceId, userId);
    }

}
