package org.createyourevent.app.service.impl;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
import org.createyourevent.app.domain.RideCosts;
import org.createyourevent.app.repository.RideCostsRepository;
import org.createyourevent.app.service.RideCostsService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link RideCosts}.
 */
@Service
@Transactional
public class RideCostsServiceImpl implements RideCostsService {

    private final Logger log = LoggerFactory.getLogger(RideCostsServiceImpl.class);

    private final RideCostsRepository rideCostsRepository;

    public RideCostsServiceImpl(RideCostsRepository rideCostsRepository) {
        this.rideCostsRepository = rideCostsRepository;
    }

    @Override
    public RideCosts save(RideCosts rideCosts) {
        log.debug("Request to save RideCosts : {}", rideCosts);
        return rideCostsRepository.save(rideCosts);
    }

    @Override
    public Optional<RideCosts> partialUpdate(RideCosts rideCosts) {
        log.debug("Request to partially update RideCosts : {}", rideCosts);

        return rideCostsRepository
            .findById(rideCosts.getId())
            .map(existingRideCosts -> {
                if (rideCosts.getPricePerKilometre() != null) {
                    existingRideCosts.setPricePerKilometre(rideCosts.getPricePerKilometre());
                }

                return existingRideCosts;
            })
            .map(rideCostsRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<RideCosts> findAll(Pageable pageable) {
        log.debug("Request to get all RideCosts");
        return rideCostsRepository.findAll(pageable);
    }

    /**
     *  Get all the rideCosts where ServiceMap is {@code null}.
     *  @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<RideCosts> findAllWhereServiceMapIsNull() {
        log.debug("Request to get all rideCosts where ServiceMap is null");
        return StreamSupport
            .stream(rideCostsRepository.findAll().spliterator(), false)
            .filter(rideCosts -> rideCosts.getServiceMap() == null)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<RideCosts> findOne(Long id) {
        log.debug("Request to get RideCosts : {}", id);
        return rideCostsRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete RideCosts : {}", id);
        rideCostsRepository.deleteById(id);
    }
}
