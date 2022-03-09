package org.createyourevent.app.service.impl;

import java.util.List;
import java.util.Optional;
import org.createyourevent.app.domain.Building;
import org.createyourevent.app.repository.BuildingExtRepository;
import org.createyourevent.app.repository.BuildingRepository;
import org.createyourevent.app.service.BuildingExtService;
import org.createyourevent.app.service.BuildingService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Building}.
 */
@Service
@Transactional
public class BuildingExtServiceImpl implements BuildingExtService {

    private final Logger log = LoggerFactory.getLogger(BuildingServiceImpl.class);

    private final BuildingExtRepository buildingExtRepository;

    public BuildingExtServiceImpl(BuildingExtRepository buildingExtRepository) {
        this.buildingExtRepository = buildingExtRepository;
    }

    @Override
    public List<Building> findByUserIsCurrentUserAndActive() {
        return this.buildingExtRepository.findByUserIsCurrentUserAndActive();
    }

    @Override
    public Building findByOrganizationId(Long id) {
        return this.buildingExtRepository.findByOrganizationId(id);
    }
}
