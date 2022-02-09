package org.createyourevent.app.service;

import org.createyourevent.app.domain.Address;


/**
 * Service Interface for managing {@link Address}.
 */
public interface AddressExtensionService {
    Address findByLocationId(Long id);
}
