package org.createyourevent.app.service.impl;

import java.util.Optional;
import org.createyourevent.app.domain.CreateYourEventService;
import org.createyourevent.app.repository.CreateYourEventServiceRepository;
import org.createyourevent.app.service.CreateYourEventServiceService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link CreateYourEventService}.
 */
@Service
@Transactional
public class CreateYourEventServiceServiceImpl implements CreateYourEventServiceService {

    private final Logger log = LoggerFactory.getLogger(CreateYourEventServiceServiceImpl.class);

    private final CreateYourEventServiceRepository createYourEventServiceRepository;

    public CreateYourEventServiceServiceImpl(CreateYourEventServiceRepository createYourEventServiceRepository) {
        this.createYourEventServiceRepository = createYourEventServiceRepository;
    }

    @Override
    public CreateYourEventService save(CreateYourEventService createYourEventService) {
        log.debug("Request to save CreateYourEventService : {}", createYourEventService);
        return createYourEventServiceRepository.save(createYourEventService);
    }

    @Override
    public Optional<CreateYourEventService> partialUpdate(CreateYourEventService createYourEventService) {
        log.debug("Request to partially update CreateYourEventService : {}", createYourEventService);

        return createYourEventServiceRepository
            .findById(createYourEventService.getId())
            .map(existingCreateYourEventService -> {
                if (createYourEventService.getName() != null) {
                    existingCreateYourEventService.setName(createYourEventService.getName());
                }
                if (createYourEventService.getLogo() != null) {
                    existingCreateYourEventService.setLogo(createYourEventService.getLogo());
                }
                if (createYourEventService.getLogoContentType() != null) {
                    existingCreateYourEventService.setLogoContentType(createYourEventService.getLogoContentType());
                }
                if (createYourEventService.getActive() != null) {
                    existingCreateYourEventService.setActive(createYourEventService.getActive());
                }
                if (createYourEventService.getActiveOwner() != null) {
                    existingCreateYourEventService.setActiveOwner(createYourEventService.getActiveOwner());
                }
                if (createYourEventService.getDescription() != null) {
                    existingCreateYourEventService.setDescription(createYourEventService.getDescription());
                }
                if (createYourEventService.getAddress() != null) {
                    existingCreateYourEventService.setAddress(createYourEventService.getAddress());
                }
                if (createYourEventService.getMotto() != null) {
                    existingCreateYourEventService.setMotto(createYourEventService.getMotto());
                }
                if (createYourEventService.getPhone() != null) {
                    existingCreateYourEventService.setPhone(createYourEventService.getPhone());
                }
                if (createYourEventService.getWebAddress() != null) {
                    existingCreateYourEventService.setWebAddress(createYourEventService.getWebAddress());
                }
                if (createYourEventService.getCategory() != null) {
                    existingCreateYourEventService.setCategory(createYourEventService.getCategory());
                }

                return existingCreateYourEventService;
            })
            .map(createYourEventServiceRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CreateYourEventService> findAll(Pageable pageable) {
        log.debug("Request to get all CreateYourEventServices");
        return createYourEventServiceRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<CreateYourEventService> findOne(Long id) {
        log.debug("Request to get CreateYourEventService : {}", id);
        return createYourEventServiceRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete CreateYourEventService : {}", id);
        createYourEventServiceRepository.deleteById(id);
    }
}
