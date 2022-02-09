package org.createyourevent.app.service.impl;

import java.util.Optional;
import org.createyourevent.app.domain.Worksheet;
import org.createyourevent.app.repository.WorksheetRepository;
import org.createyourevent.app.service.WorksheetService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Worksheet}.
 */
@Service
@Transactional
public class WorksheetServiceImpl implements WorksheetService {

    private final Logger log = LoggerFactory.getLogger(WorksheetServiceImpl.class);

    private final WorksheetRepository worksheetRepository;

    public WorksheetServiceImpl(WorksheetRepository worksheetRepository) {
        this.worksheetRepository = worksheetRepository;
    }

    @Override
    public Worksheet save(Worksheet worksheet) {
        log.debug("Request to save Worksheet : {}", worksheet);
        return worksheetRepository.save(worksheet);
    }

    @Override
    public Optional<Worksheet> partialUpdate(Worksheet worksheet) {
        log.debug("Request to partially update Worksheet : {}", worksheet);

        return worksheetRepository
            .findById(worksheet.getId())
            .map(existingWorksheet -> {
                if (worksheet.getDescription() != null) {
                    existingWorksheet.setDescription(worksheet.getDescription());
                }
                if (worksheet.getStart() != null) {
                    existingWorksheet.setStart(worksheet.getStart());
                }
                if (worksheet.getEnd() != null) {
                    existingWorksheet.setEnd(worksheet.getEnd());
                }
                if (worksheet.getCostHour() != null) {
                    existingWorksheet.setCostHour(worksheet.getCostHour());
                }
                if (worksheet.getTotal() != null) {
                    existingWorksheet.setTotal(worksheet.getTotal());
                }
                if (worksheet.getBillingType() != null) {
                    existingWorksheet.setBillingType(worksheet.getBillingType());
                }
                if (worksheet.getUserType() != null) {
                    existingWorksheet.setUserType(worksheet.getUserType());
                }

                return existingWorksheet;
            })
            .map(worksheetRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Worksheet> findAll(Pageable pageable) {
        log.debug("Request to get all Worksheets");
        return worksheetRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Worksheet> findOne(Long id) {
        log.debug("Request to get Worksheet : {}", id);
        return worksheetRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Worksheet : {}", id);
        worksheetRepository.deleteById(id);
    }
}
