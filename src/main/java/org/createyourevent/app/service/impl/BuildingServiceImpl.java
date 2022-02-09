package org.createyourevent.app.service.impl;

import java.util.Optional;
import org.createyourevent.app.domain.Building;
import org.createyourevent.app.repository.BuildingRepository;
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
public class BuildingServiceImpl implements BuildingService {

    private final Logger log = LoggerFactory.getLogger(BuildingServiceImpl.class);

    private final BuildingRepository buildingRepository;

    public BuildingServiceImpl(BuildingRepository buildingRepository) {
        this.buildingRepository = buildingRepository;
    }

    @Override
    public Building save(Building building) {
        log.debug("Request to save Building : {}", building);
        return buildingRepository.save(building);
    }

    @Override
    public Optional<Building> partialUpdate(Building building) {
        log.debug("Request to partially update Building : {}", building);

        return buildingRepository
            .findById(building.getId())
            .map(existingBuilding -> {
                if (building.getSurface() != null) {
                    existingBuilding.setSurface(building.getSurface());
                }

                return existingBuilding;
            })
            .map(buildingRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Building> findAll(Pageable pageable) {
        log.debug("Request to get all Buildings");
        return buildingRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Building> findOne(Long id) {
        log.debug("Request to get Building : {}", id);
        return buildingRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Building : {}", id);
        buildingRepository.deleteById(id);
    }
}
