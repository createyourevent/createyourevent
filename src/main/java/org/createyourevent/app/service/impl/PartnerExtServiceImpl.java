package org.createyourevent.app.service.impl;

import org.createyourevent.app.service.PartnerExtService;
import org.createyourevent.app.domain.Partner;
import org.createyourevent.app.repository.PartnerExtRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service Implementation for managing {@link Partner}.
 */
@Service
@Transactional
public class PartnerExtServiceImpl implements PartnerExtService {

    private final Logger log = LoggerFactory.getLogger(PartnerServiceImpl.class);

    private final PartnerExtRepository partnerExtRepository;

    public PartnerExtServiceImpl(PartnerExtRepository partnerExtRepository) {
        this.partnerExtRepository = partnerExtRepository;
    }

    @Override
    public List<Partner> findByPartnerActive() {
        log.debug("List<Partner> findByPartnerActive()");
        return partnerExtRepository.findByActive();
    }


}
