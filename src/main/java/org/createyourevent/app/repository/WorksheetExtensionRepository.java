package org.createyourevent.app.repository;

import org.createyourevent.app.domain.Worksheet;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data  repository for the Worksheet entity.
 */
@SuppressWarnings("unused")
@Repository
public interface WorksheetExtensionRepository extends JpaRepository<Worksheet, Long> {

    List<Worksheet> findAllByEventId(Long id);
}
