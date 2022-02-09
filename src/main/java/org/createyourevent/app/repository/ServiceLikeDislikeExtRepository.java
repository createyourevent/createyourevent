package org.createyourevent.app.repository;

import org.createyourevent.app.domain.ServiceLikeDislike;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data  repository for the ServiceLikeDislike entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ServiceLikeDislikeExtRepository extends JpaRepository<ServiceLikeDislike, Long> {

    List<ServiceLikeDislike> findAllByCreateYourEventServiceId(Long serviceId);
    List<ServiceLikeDislike> findAllByCreateYourEventServiceIdAndUserId(Long serviceId, String userId);
}
