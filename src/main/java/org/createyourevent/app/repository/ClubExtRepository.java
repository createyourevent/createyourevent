package org.createyourevent.app.repository;

import java.util.List;
import org.createyourevent.app.domain.Club;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Club entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ClubExtRepository extends JpaRepository<Club, Long> {
    @Query("select club from Club club where club.user.login = ?#{principal.preferredUsername} and club.organization.active = true")
    List<Club> findByUserIsCurrentUserAndActive();

    Club findByOrganizationId(Long id);
}
