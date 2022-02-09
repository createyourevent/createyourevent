package org.createyourevent.app.service.impl;

import java.util.Optional;
import org.createyourevent.app.domain.PointsExchange;
import org.createyourevent.app.repository.PointsExchangeRepository;
import org.createyourevent.app.service.PointsExchangeService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link PointsExchange}.
 */
@Service
@Transactional
public class PointsExchangeServiceImpl implements PointsExchangeService {

    private final Logger log = LoggerFactory.getLogger(PointsExchangeServiceImpl.class);

    private final PointsExchangeRepository pointsExchangeRepository;

    public PointsExchangeServiceImpl(PointsExchangeRepository pointsExchangeRepository) {
        this.pointsExchangeRepository = pointsExchangeRepository;
    }

    @Override
    public PointsExchange save(PointsExchange pointsExchange) {
        log.debug("Request to save PointsExchange : {}", pointsExchange);
        return pointsExchangeRepository.save(pointsExchange);
    }

    @Override
    public Optional<PointsExchange> partialUpdate(PointsExchange pointsExchange) {
        log.debug("Request to partially update PointsExchange : {}", pointsExchange);

        return pointsExchangeRepository
            .findById(pointsExchange.getId())
            .map(existingPointsExchange -> {
                if (pointsExchange.getPointsTotal() != null) {
                    existingPointsExchange.setPointsTotal(pointsExchange.getPointsTotal());
                }
                if (pointsExchange.getBondPointsTotal() != null) {
                    existingPointsExchange.setBondPointsTotal(pointsExchange.getBondPointsTotal());
                }

                return existingPointsExchange;
            })
            .map(pointsExchangeRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PointsExchange> findAll(Pageable pageable) {
        log.debug("Request to get all PointsExchanges");
        return pointsExchangeRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<PointsExchange> findOne(Long id) {
        log.debug("Request to get PointsExchange : {}", id);
        return pointsExchangeRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete PointsExchange : {}", id);
        pointsExchangeRepository.deleteById(id);
    }
}
