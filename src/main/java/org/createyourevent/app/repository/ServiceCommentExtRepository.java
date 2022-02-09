package org.createyourevent.app.repository;

import org.createyourevent.app.domain.ServiceComment;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data  repository for the ServiceComment entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ServiceCommentExtRepository extends JpaRepository<ServiceComment, Long> {

    List<ServiceComment> findAllByCreateYourEventServiceId(Long serviceId);
    List<ServiceComment> findAllByCreateYourEventServiceIdAndUserId(Long serviceId, String userId);
}
