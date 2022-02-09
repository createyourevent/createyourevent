package org.createyourevent.app.repository;

import java.util.List;
import org.createyourevent.app.domain.ProductLikeDislike;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the ProductLikeDislike entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ProductLikeDislikeRepository extends JpaRepository<ProductLikeDislike, Long> {
    @Query(
        "select productLikeDislike from ProductLikeDislike productLikeDislike where productLikeDislike.user.login = ?#{principal.preferredUsername}"
    )
    List<ProductLikeDislike> findByUserIsCurrentUser();
}
