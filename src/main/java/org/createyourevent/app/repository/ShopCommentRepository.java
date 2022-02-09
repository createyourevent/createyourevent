package org.createyourevent.app.repository;

import java.util.List;
import org.createyourevent.app.domain.ShopComment;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the ShopComment entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ShopCommentRepository extends JpaRepository<ShopComment, Long> {
    @Query("select shopComment from ShopComment shopComment where shopComment.user.login = ?#{principal.preferredUsername}")
    List<ShopComment> findByUserIsCurrentUser();
}
