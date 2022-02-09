package org.createyourevent.app.repository;

import java.util.List;
import org.createyourevent.app.domain.Worksheet;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Worksheet entity.
 */
@SuppressWarnings("unused")
@Repository
public interface WorksheetRepository extends JpaRepository<Worksheet, Long> {
    @Query("select worksheet from Worksheet worksheet where worksheet.user.login = ?#{principal.preferredUsername}")
    List<Worksheet> findByUserIsCurrentUser();
}
