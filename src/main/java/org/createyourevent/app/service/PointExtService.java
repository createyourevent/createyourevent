package org.createyourevent.app.service;

import org.createyourevent.app.domain.Point;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

/**
 * Service Interface for managing {@link Point}.
 */
public interface PointExtService {
    Point findByKey(String key);
}
