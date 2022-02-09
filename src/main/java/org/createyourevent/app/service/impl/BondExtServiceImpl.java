package org.createyourevent.app.service.impl;

import java.util.List;
import java.util.Optional;
import org.createyourevent.app.domain.Bond;
import org.createyourevent.app.repository.BondExtRepository;
import org.createyourevent.app.repository.BondRepository;
import org.createyourevent.app.service.BondExtService;
import org.createyourevent.app.service.BondService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Bond}.
 */
@Service
@Transactional
public class BondExtServiceImpl implements BondExtService {

    private final Logger log = LoggerFactory.getLogger(BondExtServiceImpl.class);

    private final BondExtRepository bondExtRepository;

    public BondExtServiceImpl(BondExtRepository bondExtRepository) {
        this.bondExtRepository = bondExtRepository;
    }

    @Override
    public List<Bond> findByCode(String code) {
        return bondExtRepository.findByCode(code);
    }


}
