package org.createyourevent.app.service.impl;

import java.util.Optional;
import org.createyourevent.app.domain.FeeTransactionEntry;
import org.createyourevent.app.repository.FeeTransactionEntryRepository;
import org.createyourevent.app.service.FeeTransactionEntryService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link FeeTransactionEntry}.
 */
@Service
@Transactional
public class FeeTransactionEntryServiceImpl implements FeeTransactionEntryService {

    private final Logger log = LoggerFactory.getLogger(FeeTransactionEntryServiceImpl.class);

    private final FeeTransactionEntryRepository feeTransactionEntryRepository;

    public FeeTransactionEntryServiceImpl(FeeTransactionEntryRepository feeTransactionEntryRepository) {
        this.feeTransactionEntryRepository = feeTransactionEntryRepository;
    }

    @Override
    public FeeTransactionEntry save(FeeTransactionEntry feeTransactionEntry) {
        log.debug("Request to save FeeTransactionEntry : {}", feeTransactionEntry);
        return feeTransactionEntryRepository.save(feeTransactionEntry);
    }

    @Override
    public Optional<FeeTransactionEntry> partialUpdate(FeeTransactionEntry feeTransactionEntry) {
        log.debug("Request to partially update FeeTransactionEntry : {}", feeTransactionEntry);

        return feeTransactionEntryRepository
            .findById(feeTransactionEntry.getId())
            .map(existingFeeTransactionEntry -> {
                if (feeTransactionEntry.getType() != null) {
                    existingFeeTransactionEntry.setType(feeTransactionEntry.getType());
                }
                if (feeTransactionEntry.getValue() != null) {
                    existingFeeTransactionEntry.setValue(feeTransactionEntry.getValue());
                }

                return existingFeeTransactionEntry;
            })
            .map(feeTransactionEntryRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<FeeTransactionEntry> findAll(Pageable pageable) {
        log.debug("Request to get all FeeTransactionEntries");
        return feeTransactionEntryRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<FeeTransactionEntry> findOne(Long id) {
        log.debug("Request to get FeeTransactionEntry : {}", id);
        return feeTransactionEntryRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete FeeTransactionEntry : {}", id);
        feeTransactionEntryRepository.deleteById(id);
    }
}
