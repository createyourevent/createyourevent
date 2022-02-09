package org.createyourevent.app.service.impl;

import org.createyourevent.app.service.WorksheetExtensionService;
import org.createyourevent.app.service.WorksheetService;
import org.createyourevent.app.domain.Worksheet;
import org.createyourevent.app.repository.WorksheetExtensionRepository;
import org.createyourevent.app.repository.WorksheetRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Service Implementation for managing {@link Worksheet}.
 */
@Service
@Transactional
public class WorksheetExtensionServiceImpl implements WorksheetExtensionService {

    private final Logger log = LoggerFactory.getLogger(WorksheetServiceImpl.class);

    private final WorksheetExtensionRepository worksheetExtensionRepository;

    public WorksheetExtensionServiceImpl(WorksheetExtensionRepository worksheetExtensionRepository) {
        this.worksheetExtensionRepository = worksheetExtensionRepository;
    }

    @Override
    public List<Worksheet> findAllByEventId(Long id) {
        log.debug("findAllWorksheetByEventId");
        return worksheetExtensionRepository.findAllByEventId(id);
    }


}
