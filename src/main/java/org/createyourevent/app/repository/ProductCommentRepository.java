package org.createyourevent.app.repository;

import java.util.List;
import org.createyourevent.app.domain.ProductComment;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the ProductComment entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ProductCommentRepository extends JpaRepository<ProductComment, Long> {
    @Query("select productComment from ProductComment productComment where productComment.user.login = ?#{principal.preferredUsername}")
    List<ProductComment> findByUserIsCurrentUser();
}
