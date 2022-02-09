package org.createyourevent.app.repository;

import java.util.List;
import org.createyourevent.app.domain.Organization;
import org.createyourevent.app.domain.enumeration.OrganizationType;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Organization entity.
 */
@SuppressWarnings("unused")
@Repository
public interface OrganizationExtRepository extends JpaRepository<Organization, Long> {
    @Query("select organization from Organization organization where organization.active = true and organization.activeOwner = true")
    List<Organization> findByActiveAndActiveOwner();

    List<Organization> findByUserIdAndActiveTrue(@Param("userId") String userId);

    // @Query(nativeQuery = true, value = "select * from createyourevent.organization s where s.active = true and s.user_id = :userId ORDER BY s.name")
    // List<Organization> findByUserIdAndActiveTrue(@Param("userId") String userId);


    @Query("select organization from Organization organization where organization.user.login = ?#{principal.preferredUsername} and organization.active = true")
    List<Organization> findByCurrentUserAndActive();


    List<Organization> findByOrganizationType(OrganizationType productType);

    List<Organization> findByOrganizationTypeAndActiveTrueAndActiveOwnerTrue(OrganizationType productType);

    List<Organization> findByUserId(String userId);

    List<Organization> findByActiveTrue();

    @Query("select organization from Organization organization where organization.activeOwner = true and organization.active = true")
    List<Organization> findByActiveTrueAndActiveOwnerTrue();
}
