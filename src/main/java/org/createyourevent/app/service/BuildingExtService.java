package org.createyourevent.app.service;

import java.util.List;
import java.util.Optional;
import org.createyourevent.app.domain.Building;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link Building}.
 */
public interface BuildingExtService {
    List<Building> findByUserIsCurrentUserAndActive();
    Building findByOrganizationId(Long id);
}
