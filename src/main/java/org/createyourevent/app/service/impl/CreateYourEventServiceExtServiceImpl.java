package org.createyourevent.app.service.impl;

import org.createyourevent.app.service.CreateYourEventServiceExtService;
import org.createyourevent.app.domain.CreateYourEventService;
import org.createyourevent.app.domain.ServiceMap;
import org.createyourevent.app.repository.CreateYourEventServiceExtRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service Implementation for managing {@link CreateYourEventService}.
 */
@Service
@Transactional
public class CreateYourEventServiceExtServiceImpl implements CreateYourEventServiceExtService {

    private final Logger log = LoggerFactory.getLogger(CreateYourEventServiceServiceImpl.class);

    private final CreateYourEventServiceExtRepository createYourEventServiceExtRepository;

    public CreateYourEventServiceExtServiceImpl(
            CreateYourEventServiceExtRepository createYourEventServiceExtRepository) {
        this.createYourEventServiceExtRepository = createYourEventServiceExtRepository;
    }

    @Override
    public List<CreateYourEventService> findByUserIdAndActiveTrue(String userId) {
        log.debug("List<CreateYourEventService> findByUserIdAndActiveTrue(String userId)");
        return this.createYourEventServiceExtRepository.findByUserIdAndActiveTrue(userId);
    }

    @Override
    public List<CreateYourEventService> findByActiveTrue() {
        log.debug(" List<CreateYourEventService> findByActiveTrue()");
        return this.createYourEventServiceExtRepository.findByActiveTrue();
    }

    @Override
    public List<CreateYourEventService> findByActiveTrueAndActiveOwnerTrue() {
        log.debug(" List<CreateYourEventService> findByActiveTrueAndActiveOwner()");
        return this.createYourEventServiceExtRepository.findByActiveTrueAndActiveOwnerTrue();
    }

    @Override
    public List<CreateYourEventService> findByActiveTrueAndActiveOwnerTrueAndServiceMaps(ServiceMap serviceMap) {
        return this.createYourEventServiceExtRepository.findByActiveTrueAndActiveOwnerTrueAndServiceMaps(serviceMap);
    }


}
