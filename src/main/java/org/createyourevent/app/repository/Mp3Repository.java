package org.createyourevent.app.repository;

import java.util.List;
import org.createyourevent.app.domain.Mp3;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Mp3 entity.
 */
@SuppressWarnings("unused")
@Repository
public interface Mp3Repository extends JpaRepository<Mp3, Long> {
    @Query("select mp3 from Mp3 mp3 where mp3.user.login = ?#{principal.preferredUsername}")
    List<Mp3> findByUserIsCurrentUser();
}
