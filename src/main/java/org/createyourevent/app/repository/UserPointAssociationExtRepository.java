package org.createyourevent.app.repository;

import org.createyourevent.app.domain.UserPointAssociation;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.ZonedDateTime;
import java.util.List;

/**
 * Spring Data  repository for the UserPointAssociation entity.
 */
@SuppressWarnings("unused")
@Repository
public interface UserPointAssociationExtRepository extends JpaRepository<UserPointAssociation, Long> {

    List<UserPointAssociation> findByUsersId(String userId);

    @Query("select upa from UserPointAssociation upa where upa.users.id = :userId and upa.date >= :betweenStart and upa.date <= :betweenEnd")
    List<UserPointAssociation> findByUsersIdAndDateBetween(@Param("userId") String userId, @Param("betweenStart") ZonedDateTime betweenStart, @Param("betweenEnd") ZonedDateTime betweenEnd);

    @Query("select upa from UserPointAssociation upa where upa.users.id = :userId and upa.date >= :betweenStart and upa.date <= :betweenEnd and upa.points.key = :key")
    List<UserPointAssociation> findByUsersIdAndPointkeyAndDateBetween(@Param("userId") String userId, @Param("key") String key,  @Param("betweenStart") ZonedDateTime betweenStart, @Param("betweenEnd") ZonedDateTime betweenEnd);

    @Query("select upa from UserPointAssociation upa where upa.users.id = :userId and upa.points.key = :key")
    List<UserPointAssociation> findByUsersIdAndPointkey(@Param("userId") String userId, @Param("key") String key);
}
