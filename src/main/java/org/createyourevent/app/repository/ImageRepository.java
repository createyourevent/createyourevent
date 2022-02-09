package org.createyourevent.app.repository;

import java.util.List;
import org.createyourevent.app.domain.Image;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Image entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ImageRepository extends JpaRepository<Image, Long> {
    @Query("select image from Image image where image.user.login = ?#{principal.preferredUsername}")
    List<Image> findByUserIsCurrentUser();
}
