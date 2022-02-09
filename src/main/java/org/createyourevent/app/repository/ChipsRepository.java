package org.createyourevent.app.repository;

import org.createyourevent.app.domain.Chips;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Chips entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ChipsRepository extends JpaRepository<Chips, Long> {}
