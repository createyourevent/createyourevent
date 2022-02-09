package org.createyourevent.app.service.impl;

import org.createyourevent.app.service.PropertyExtService;
import org.createyourevent.app.service.PropertyService;
import org.createyourevent.app.domain.Property;
import org.createyourevent.app.repository.PropertyExtRepository;
import org.createyourevent.app.repository.PropertyRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Service Implementation for managing {@link Property}.
 */
@Service
@Transactional
public class PropertyExtServiceImpl implements PropertyExtService {

    private final Logger log = LoggerFactory.getLogger(PropertyServiceImpl.class);

    private final PropertyExtRepository propertyExtRepository;

    public PropertyExtServiceImpl(PropertyExtRepository propertyExtRepository) {
        this.propertyExtRepository = propertyExtRepository;
    }

    @Override
    public Property findByKey(String key) {
        log.debug("propertyExtRepository.findByKey(key);");
        return propertyExtRepository.findByKey(key);
    }


}
