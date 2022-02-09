package org.createyourevent.app.service.impl;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
import org.createyourevent.app.domain.FeeTransactionId;
import org.createyourevent.app.repository.FeeTransactionIdRepository;
import org.createyourevent.app.service.FeeTransactionIdService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link FeeTransactionId}.
 */
@Service
@Transactional
public class FeeTransactionIdServiceImpl implements FeeTransactionIdService {

    private final Logger log = LoggerFactory.getLogger(FeeTransactionIdServiceImpl.class);

    private final FeeTransactionIdRepository feeTransactionIdRepository;

    public FeeTransactionIdServiceImpl(FeeTransactionIdRepository feeTransactionIdRepository) {
        this.feeTransactionIdRepository = feeTransactionIdRepository;
    }

    @Override
    public FeeTransactionId save(FeeTransactionId feeTransactionId) {
        log.debug("Request to save FeeTransactionId : {}", feeTransactionId);
        return feeTransactionIdRepository.save(feeTransactionId);
    }

    @Override
    public Optional<FeeTransactionId> partialUpdate(FeeTransactionId feeTransactionId) {
        log.debug("Request to partially update FeeTransactionId : {}", feeTransactionId);

        return feeTransactionIdRepository
            .findById(feeTransactionId.getId())
            .map(existingFeeTransactionId -> {
                if (feeTransactionId.getTransactionId() != null) {
                    existingFeeTransactionId.setTransactionId(feeTransactionId.getTransactionId());
                }

                return existingFeeTransactionId;
            })
            .map(feeTransactionIdRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<FeeTransactionId> findAll(Pageable pageable) {
        log.debug("Request to get all FeeTransactionIds");
        return feeTransactionIdRepository.findAll(pageable);
    }

    /**
     *  Get all the feeTransactionIds where FeeTransaction is {@code null}.
     *  @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<FeeTransactionId> findAllWhereFeeTransactionIsNull() {
        log.debug("Request to get all feeTransactionIds where FeeTransaction is null");
        return StreamSupport
            .stream(feeTransactionIdRepository.findAll().spliterator(), false)
            .filter(feeTransactionId -> feeTransactionId.getFeeTransaction() == null)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<FeeTransactionId> findOne(Long id) {
        log.debug("Request to get FeeTransactionId : {}", id);
        return feeTransactionIdRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete FeeTransactionId : {}", id);
        feeTransactionIdRepository.deleteById(id);
    }
}
