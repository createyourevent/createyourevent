package org.createyourevent.app.service.impl;

import org.createyourevent.app.service.PointExtService;
import org.createyourevent.app.service.PointService;
import org.createyourevent.app.domain.Point;
import org.createyourevent.app.repository.PointExtRepository;
import org.createyourevent.app.repository.PointRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * Service Implementation for managing {@link Point}.
 */
@Service
@Transactional
public class PointExtServiceImpl implements PointExtService {

    private final Logger log = LoggerFactory.getLogger(PointServiceImpl.class);

    private final PointExtRepository pointExtRepository;

    public PointExtServiceImpl(PointExtRepository pointExtRepository) {
        this.pointExtRepository = pointExtRepository;
    }

    @Override
    public Point findByKey(String key) {
        return pointExtRepository.findByKey(key);
    }
}
