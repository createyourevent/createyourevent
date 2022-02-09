package org.createyourevent.app.service;

import org.createyourevent.app.domain.Location;


/**
 * Service Interface for managing {@link Location}.
 */
public interface LocationExtensionService {

    Location findByEventId(Long id);
}
