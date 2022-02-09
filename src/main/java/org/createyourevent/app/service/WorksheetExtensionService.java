package org.createyourevent.app.service;

import java.util.List;

import org.createyourevent.app.domain.Worksheet;


/**
 * Service Interface for managing {@link Worksheet}.
 */
public interface WorksheetExtensionService {

    List<Worksheet> findAllByEventId(Long id);

}
