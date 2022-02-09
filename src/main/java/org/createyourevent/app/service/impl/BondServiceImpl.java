package org.createyourevent.app.service.impl;

import java.util.Optional;
import org.createyourevent.app.domain.Bond;
import org.createyourevent.app.repository.BondRepository;
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
public class BondServiceImpl implements BondService {

    private final Logger log = LoggerFactory.getLogger(BondServiceImpl.class);

    private final BondRepository bondRepository;

    public BondServiceImpl(BondRepository bondRepository) {
        this.bondRepository = bondRepository;
    }

    @Override
    public Bond save(Bond bond) {
        log.debug("Request to save Bond : {}", bond);
        return bondRepository.save(bond);
    }

    @Override
    public Optional<Bond> partialUpdate(Bond bond) {
        log.debug("Request to partially update Bond : {}", bond);

        return bondRepository
            .findById(bond.getId())
            .map(existingBond -> {
                if (bond.getName() != null) {
                    existingBond.setName(bond.getName());
                }
                if (bond.getDescription() != null) {
                    existingBond.setDescription(bond.getDescription());
                }
                if (bond.getCode() != null) {
                    existingBond.setCode(bond.getCode());
                }
                if (bond.getPoints() != null) {
                    existingBond.setPoints(bond.getPoints());
                }
                if (bond.getCreationDate() != null) {
                    existingBond.setCreationDate(bond.getCreationDate());
                }
                if (bond.getRedemptionDate() != null) {
                    existingBond.setRedemptionDate(bond.getRedemptionDate());
                }

                return existingBond;
            })
            .map(bondRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Bond> findAll(Pageable pageable) {
        log.debug("Request to get all Bonds");
        return bondRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Bond> findOne(Long id) {
        log.debug("Request to get Bond : {}", id);
        return bondRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Bond : {}", id);
        bondRepository.deleteById(id);
    }
}
