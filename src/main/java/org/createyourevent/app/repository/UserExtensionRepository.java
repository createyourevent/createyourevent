package org.createyourevent.app.repository;

import java.util.List;
import org.createyourevent.app.domain.UserExtension;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the UserExtension entity.
 */
@SuppressWarnings("unused")
@Repository
public interface UserExtensionRepository extends JpaRepository<UserExtension, Long> {
    @Query("select userExtension from UserExtension userExtension where userExtension.user.login = ?#{principal.preferredUsername}")
    List<UserExtension> findByUserIsCurrentUser();
}
