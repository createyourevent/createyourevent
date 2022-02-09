package org.createyourevent.app.service.impl;

import java.util.Optional;
import org.createyourevent.app.domain.FeeTransaction;
import org.createyourevent.app.repository.FeeTransactionRepository;
import org.createyourevent.app.service.FeeTransactionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link FeeTransaction}.
 */
@Service
@Transactional
public class FeeTransactionServiceImpl implements FeeTransactionService {

    private final Logger log = LoggerFactory.getLogger(FeeTransactionServiceImpl.class);

    private final FeeTransactionRepository feeTransactionRepository;

    public FeeTransactionServiceImpl(FeeTransactionRepository feeTransactionRepository) {
        this.feeTransactionRepository = feeTransactionRepository;
    }

    @Override
    public FeeTransaction save(FeeTransaction feeTransaction) {
        log.debug("Request to save FeeTransaction : {}", feeTransaction);
        return feeTransactionRepository.save(feeTransaction);
    }

    @Override
    public Optional<FeeTransaction> partialUpdate(FeeTransaction feeTransaction) {
        log.debug("Request to partially update FeeTransaction : {}", feeTransaction);

        return feeTransactionRepository
            .findById(feeTransaction.getId())
            .map(existingFeeTransaction -> {
                if (feeTransaction.getDate() != null) {
                    existingFeeTransaction.setDate(feeTransaction.getDate());
                }

                return existingFeeTransaction;
            })
            .map(feeTransactionRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<FeeTransaction> findAll(Pageable pageable) {
        log.debug("Request to get all FeeTransactions");
        return feeTransactionRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<FeeTransaction> findOne(Long id) {
        log.debug("Request to get FeeTransaction : {}", id);
        return feeTransactionRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete FeeTransaction : {}", id);
        feeTransactionRepository.deleteById(id);
    }
}
