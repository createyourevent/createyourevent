package org.createyourevent.app.service.impl;

import org.createyourevent.app.service.ChipsAdminExtService;
import org.createyourevent.app.service.ChipsAdminService;
import org.createyourevent.app.domain.ChipsAdmin;
import org.createyourevent.app.repository.ChipsAdminExtRepository;
import org.createyourevent.app.repository.ChipsAdminRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * Service Implementation for managing {@link ChipsAdmin}.
 */
@Service
@Transactional
public class ChipsAdminExtServiceImpl implements ChipsAdminExtService {

    private final Logger log = LoggerFactory.getLogger(ChipsAdminExtServiceImpl.class);

    private final ChipsAdminExtRepository chipsAdminExtRepository;

    public ChipsAdminExtServiceImpl(ChipsAdminExtRepository chipsAdminExtRepository) {
        this.chipsAdminExtRepository = chipsAdminExtRepository;
    }

    @Override
    public void deleteAllFoundedChips() {
        log.debug("deleteAllFoundedChips()");
        chipsAdminExtRepository.deleteAllFoundedChips();
    }


}
