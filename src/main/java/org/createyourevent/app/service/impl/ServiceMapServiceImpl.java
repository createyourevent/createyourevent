package org.createyourevent.app.service.impl;

import java.util.Optional;
import org.createyourevent.app.domain.ServiceMap;
import org.createyourevent.app.repository.ServiceMapRepository;
import org.createyourevent.app.service.ServiceMapService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link ServiceMap}.
 */
@Service
@Transactional
public class ServiceMapServiceImpl implements ServiceMapService {

    private final Logger log = LoggerFactory.getLogger(ServiceMapServiceImpl.class);

    private final ServiceMapRepository serviceMapRepository;

    public ServiceMapServiceImpl(ServiceMapRepository serviceMapRepository) {
        this.serviceMapRepository = serviceMapRepository;
    }

    @Override
    public ServiceMap save(ServiceMap serviceMap) {
        log.debug("Request to save ServiceMap : {}", serviceMap);
        return serviceMapRepository.save(serviceMap);
    }

    @Override
    public Optional<ServiceMap> partialUpdate(ServiceMap serviceMap) {
        log.debug("Request to partially update ServiceMap : {}", serviceMap);

        return serviceMapRepository
            .findById(serviceMap.getId())
            .map(existingServiceMap -> {
                if (serviceMap.getTitle() != null) {
                    existingServiceMap.setTitle(serviceMap.getTitle());
                }

                return existingServiceMap;
            })
            .map(serviceMapRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ServiceMap> findAll(Pageable pageable) {
        log.debug("Request to get all ServiceMaps");
        return serviceMapRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<ServiceMap> findOne(Long id) {
        log.debug("Request to get ServiceMap : {}", id);
        return serviceMapRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete ServiceMap : {}", id);
        serviceMapRepository.deleteById(id);
    }
}
