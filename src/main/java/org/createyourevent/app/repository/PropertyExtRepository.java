package org.createyourevent.app.repository;

import java.util.List;

import org.createyourevent.app.domain.Property;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the Property entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PropertyExtRepository extends JpaRepository<Property, Long> {
    Property findByKey(String key);
}
