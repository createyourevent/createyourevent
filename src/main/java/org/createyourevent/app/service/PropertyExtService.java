package org.createyourevent.app.service;

import org.createyourevent.app.domain.Property;

/**
 * Service Interface for managing {@link Property}.
 */
public interface PropertyExtService {
    Property findByKey(String key);
}
