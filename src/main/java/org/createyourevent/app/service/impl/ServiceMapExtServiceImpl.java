package org.createyourevent.app.service.impl;

import org.createyourevent.app.service.ServiceMapExtService;
import org.createyourevent.app.service.ServiceMapService;
import org.createyourevent.app.domain.EventServiceMapOrder;
import org.createyourevent.app.domain.ServiceMap;
import org.createyourevent.app.repository.ServiceMapExtRepository;
import org.createyourevent.app.repository.ServiceMapRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Service Implementation for managing {@link ServiceMap}.
 */
@Service
@Transactional
public class ServiceMapExtServiceImpl implements ServiceMapExtService {

    private final Logger log = LoggerFactory.getLogger(ServiceMapServiceImpl.class);

    private final ServiceMapExtRepository serviceMapExtRepository;

    public ServiceMapExtServiceImpl(ServiceMapExtRepository serviceMapExtRepository) {
        this.serviceMapExtRepository = serviceMapExtRepository;
    }

    @Override
    public List<ServiceMap> findByCreateYourEventServiceId(Long serviceId) {
        log.debug("List<ServiceMap> findByCreateYourEventServiceId(Long serviceId)");
        List<ServiceMap> sm = this.serviceMapExtRepository.findByCreateYourEventServiceId(serviceId);
        return sm;
    }


}
