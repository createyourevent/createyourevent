package org.createyourevent.app.service.impl;

import java.util.Optional;
import org.createyourevent.app.domain.UserExtension;
import org.createyourevent.app.repository.UserExtensionRepository;
import org.createyourevent.app.service.UserExtensionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link UserExtension}.
 */
@Service
@Transactional
public class UserExtensionServiceImpl implements UserExtensionService {

    private final Logger log = LoggerFactory.getLogger(UserExtensionServiceImpl.class);

    private final UserExtensionRepository userExtensionRepository;

    public UserExtensionServiceImpl(UserExtensionRepository userExtensionRepository) {
        this.userExtensionRepository = userExtensionRepository;
    }

    @Override
    public UserExtension save(UserExtension userExtension) {
        log.debug("Request to save UserExtension : {}", userExtension);
        return userExtensionRepository.save(userExtension);
    }

    @Override
    public Optional<UserExtension> partialUpdate(UserExtension userExtension) {
        log.debug("Request to partially update UserExtension : {}", userExtension);

        return userExtensionRepository
            .findById(userExtension.getId())
            .map(existingUserExtension -> {
                if (userExtension.getAddress() != null) {
                    existingUserExtension.setAddress(userExtension.getAddress());
                }
                if (userExtension.getPhone() != null) {
                    existingUserExtension.setPhone(userExtension.getPhone());
                }
                if (userExtension.getLoggedIn() != null) {
                    existingUserExtension.setLoggedIn(userExtension.getLoggedIn());
                }
                if (userExtension.getPoints() != null) {
                    existingUserExtension.setPoints(userExtension.getPoints());
                }

                return existingUserExtension;
            })
            .map(userExtensionRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<UserExtension> findAll(Pageable pageable) {
        log.debug("Request to get all UserExtensions");
        return userExtensionRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<UserExtension> findOne(Long id) {
        log.debug("Request to get UserExtension : {}", id);
        return userExtensionRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete UserExtension : {}", id);
        userExtensionRepository.deleteById(id);
    }
}
