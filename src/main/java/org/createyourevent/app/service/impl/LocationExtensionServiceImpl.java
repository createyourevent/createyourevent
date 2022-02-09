package org.createyourevent.app.service.impl;

import org.createyourevent.app.service.LocationExtensionService;
import org.createyourevent.app.domain.Location;
import org.createyourevent.app.repository.LocationExtensionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Location}.
 */
@Service
@Transactional
public class LocationExtensionServiceImpl implements LocationExtensionService {

    private final Logger log = LoggerFactory.getLogger(LocationServiceImpl.class);

    private final LocationExtensionRepository locationExtensionRepository;

    public LocationExtensionServiceImpl(LocationExtensionRepository locationExtensionRepository) {
        this.locationExtensionRepository = locationExtensionRepository;
    }

    @Override
    public Location findByEventId(Long id) {
        log.debug("Request to get Location by EventId: {}", id);
        return locationExtensionRepository.findByEventId(id);
    }
}
