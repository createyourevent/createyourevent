package org.createyourevent.app.service.impl;

import java.util.Optional;
import org.createyourevent.app.domain.ChipsAdmin;
import org.createyourevent.app.repository.ChipsAdminRepository;
import org.createyourevent.app.service.ChipsAdminService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link ChipsAdmin}.
 */
@Service
@Transactional
public class ChipsAdminServiceImpl implements ChipsAdminService {

    private final Logger log = LoggerFactory.getLogger(ChipsAdminServiceImpl.class);

    private final ChipsAdminRepository chipsAdminRepository;

    public ChipsAdminServiceImpl(ChipsAdminRepository chipsAdminRepository) {
        this.chipsAdminRepository = chipsAdminRepository;
    }

    @Override
    public ChipsAdmin save(ChipsAdmin chipsAdmin) {
        log.debug("Request to save ChipsAdmin : {}", chipsAdmin);
        return chipsAdminRepository.save(chipsAdmin);
    }

    @Override
    public Optional<ChipsAdmin> partialUpdate(ChipsAdmin chipsAdmin) {
        log.debug("Request to partially update ChipsAdmin : {}", chipsAdmin);

        return chipsAdminRepository
            .findById(chipsAdmin.getId())
            .map(existingChipsAdmin -> {
                if (chipsAdmin.getGameActive() != null) {
                    existingChipsAdmin.setGameActive(chipsAdmin.getGameActive());
                }

                return existingChipsAdmin;
            })
            .map(chipsAdminRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ChipsAdmin> findAll(Pageable pageable) {
        log.debug("Request to get all ChipsAdmins");
        return chipsAdminRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<ChipsAdmin> findOne(Long id) {
        log.debug("Request to get ChipsAdmin : {}", id);
        return chipsAdminRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete ChipsAdmin : {}", id);
        chipsAdminRepository.deleteById(id);
    }
}
