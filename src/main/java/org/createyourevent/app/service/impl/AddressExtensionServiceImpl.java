package org.createyourevent.app.service.impl;

import org.createyourevent.app.service.AddressExtensionService;
import org.createyourevent.app.domain.Address;
import org.createyourevent.app.repository.AddressExtensionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


/**
 * Service Implementation for managing {@link Address}.
 */
@Service
@Transactional
public class AddressExtensionServiceImpl implements AddressExtensionService {

    private final Logger log = LoggerFactory.getLogger(AddressExtensionServiceImpl.class);

    private final AddressExtensionRepository addressExtensionRepository;

    public AddressExtensionServiceImpl(AddressExtensionRepository addressExtensionRepository) {
        this.addressExtensionRepository = addressExtensionRepository;
    }

    @Override
    public Address findByLocationId(Long id) {
        log.debug("Request to get Address by Location id", id);
        return addressExtensionRepository.findByLocationId(id);
    }
}
