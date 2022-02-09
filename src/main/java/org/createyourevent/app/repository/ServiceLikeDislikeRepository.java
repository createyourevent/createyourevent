package org.createyourevent.app.repository;

import java.util.List;
import org.createyourevent.app.domain.ServiceLikeDislike;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the ServiceLikeDislike entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ServiceLikeDislikeRepository extends JpaRepository<ServiceLikeDislike, Long> {
    @Query(
        "select serviceLikeDislike from ServiceLikeDislike serviceLikeDislike where serviceLikeDislike.user.login = ?#{principal.preferredUsername}"
    )
    List<ServiceLikeDislike> findByUserIsCurrentUser();
}
