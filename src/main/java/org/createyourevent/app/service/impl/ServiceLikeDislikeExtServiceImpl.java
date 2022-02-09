package org.createyourevent.app.service.impl;

import org.createyourevent.app.service.ServiceLikeDislikeExtService;
import org.createyourevent.app.domain.ServiceLikeDislike;
import org.createyourevent.app.repository.ServiceLikeDislikeExtRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service Implementation for managing {@link ServiceLikeDislike}.
 */
@Service
@Transactional
public class ServiceLikeDislikeExtServiceImpl implements ServiceLikeDislikeExtService {

    private final Logger log = LoggerFactory.getLogger(ServiceLikeDislikeExtServiceImpl.class);

    private final ServiceLikeDislikeExtRepository serviceLikeDislikeExtRepository;

    public ServiceLikeDislikeExtServiceImpl(ServiceLikeDislikeExtRepository serviceLikeDislikeExtRepository) {
        this.serviceLikeDislikeExtRepository = serviceLikeDislikeExtRepository;
    }

    @Override
    public List<ServiceLikeDislike> findAllByServiceId(Long serviceId) {
        log.debug("List<ServiceLikeDislike> findAllByServiceId(Long serviceId)");
        return serviceLikeDislikeExtRepository.findAllByCreateYourEventServiceId(serviceId);
    }

    @Override
    public List<ServiceLikeDislike> findAllByServiceIdAndUserId(Long serviceId, String userId) {
        log.debug("List<ServiceLikeDislike> findAllByServiceIdAndUserId(Long serviceId, String userId)");
        return serviceLikeDislikeExtRepository.findAllByCreateYourEventServiceIdAndUserId(serviceId, userId);
    }

}
