package org.createyourevent.app.service.impl;

import org.createyourevent.app.service.ServiceOfferExtService;
import org.createyourevent.app.service.ServiceOfferService;
import org.createyourevent.app.domain.ServiceOffer;
import org.createyourevent.app.repository.ServiceOfferExtRepository;
import org.createyourevent.app.repository.ServiceOfferRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Service Implementation for managing {@link ServiceOffer}.
 */
@Service
@Transactional
public class ServiceOfferExtServiceImpl implements ServiceOfferExtService {

    private final Logger log = LoggerFactory.getLogger(ServiceOfferServiceImpl.class);

    private final ServiceOfferExtRepository serviceOfferExtRepository;

    public ServiceOfferExtServiceImpl(ServiceOfferExtRepository serviceOfferExtRepository) {
        this.serviceOfferExtRepository = serviceOfferExtRepository;
    }

    @Override
    public List<ServiceOffer> findByServiceMapsId(Long serviceMapId) {
        log.debug("List<ServiceOffer> findByServiceMapsId(Long serviceMapId)");
        return serviceOfferExtRepository.findByServiceMapsId(serviceMapId);
    }


}
