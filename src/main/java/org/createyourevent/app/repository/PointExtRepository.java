package org.createyourevent.app.repository;

import java.util.Optional;

import org.createyourevent.app.domain.Point;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the Point entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PointExtRepository extends JpaRepository<Point, Long> {

    Point findByKey(String key);
}
