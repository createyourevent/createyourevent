package org.createyourevent.app.service.impl;

import java.util.Optional;
import org.createyourevent.app.domain.FeeBalance;
import org.createyourevent.app.repository.FeeBalanceRepository;
import org.createyourevent.app.service.FeeBalanceService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link FeeBalance}.
 */
@Service
@Transactional
public class FeeBalanceServiceImpl implements FeeBalanceService {

    private final Logger log = LoggerFactory.getLogger(FeeBalanceServiceImpl.class);

    private final FeeBalanceRepository feeBalanceRepository;

    public FeeBalanceServiceImpl(FeeBalanceRepository feeBalanceRepository) {
        this.feeBalanceRepository = feeBalanceRepository;
    }

    @Override
    public FeeBalance save(FeeBalance feeBalance) {
        log.debug("Request to save FeeBalance : {}", feeBalance);
        return feeBalanceRepository.save(feeBalance);
    }

    @Override
    public Optional<FeeBalance> partialUpdate(FeeBalance feeBalance) {
        log.debug("Request to partially update FeeBalance : {}", feeBalance);

        return feeBalanceRepository
            .findById(feeBalance.getId())
            .map(existingFeeBalance -> {
                if (feeBalance.getDate() != null) {
                    existingFeeBalance.setDate(feeBalance.getDate());
                }
                if (feeBalance.getType() != null) {
                    existingFeeBalance.setType(feeBalance.getType());
                }
                if (feeBalance.getTotal() != null) {
                    existingFeeBalance.setTotal(feeBalance.getTotal());
                }

                return existingFeeBalance;
            })
            .map(feeBalanceRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<FeeBalance> findAll(Pageable pageable) {
        log.debug("Request to get all FeeBalances");
        return feeBalanceRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<FeeBalance> findOne(Long id) {
        log.debug("Request to get FeeBalance : {}", id);
        return feeBalanceRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete FeeBalance : {}", id);
        feeBalanceRepository.deleteById(id);
    }
}
