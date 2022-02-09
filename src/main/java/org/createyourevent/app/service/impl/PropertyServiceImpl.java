package org.createyourevent.app.service.impl;

import java.util.Optional;
import org.createyourevent.app.domain.Property;
import org.createyourevent.app.repository.PropertyRepository;
import org.createyourevent.app.service.PropertyService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Property}.
 */
@Service
@Transactional
public class PropertyServiceImpl implements PropertyService {

    private final Logger log = LoggerFactory.getLogger(PropertyServiceImpl.class);

    private final PropertyRepository propertyRepository;

    public PropertyServiceImpl(PropertyRepository propertyRepository) {
        this.propertyRepository = propertyRepository;
    }

    @Override
    public Property save(Property property) {
        log.debug("Request to save Property : {}", property);
        return propertyRepository.save(property);
    }

    @Override
    public Optional<Property> partialUpdate(Property property) {
        log.debug("Request to partially update Property : {}", property);

        return propertyRepository
            .findById(property.getId())
            .map(existingProperty -> {
                if (property.getKey() != null) {
                    existingProperty.setKey(property.getKey());
                }
                if (property.getValue() != null) {
                    existingProperty.setValue(property.getValue());
                }

                return existingProperty;
            })
            .map(propertyRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Property> findAll(Pageable pageable) {
        log.debug("Request to get all Properties");
        return propertyRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Property> findOne(Long id) {
        log.debug("Request to get Property : {}", id);
        return propertyRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Property : {}", id);
        propertyRepository.deleteById(id);
    }
}
