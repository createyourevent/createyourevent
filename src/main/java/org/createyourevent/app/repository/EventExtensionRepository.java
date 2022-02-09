package org.createyourevent.app.repository;

import java.time.ZonedDateTime;
import java.util.List;

import org.createyourevent.app.domain.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface EventExtensionRepository extends JpaRepository<Event, Long> {

    List<Event> findByUserIdAndActiveTrue(String userId);

    @Query("select event from Event event where event.privateOrPublic = 'public' and event.active = true")
    List<Event> findByPrivateOrPublicAndActiveTrue();


    @Query("select event from Event event where event.user.login = ?#{principal.username} and event.active = true and event.privateOrPublic = 'public'")
    List<Event> findByUserIdAndActiveTrueAndPrivateOrPublic();

    @Query("select distinct event from Event event left join fetch event.reservedUsers where event.privateOrPublic = 'public' and event.active = true and event.dateEnd >= :now order by event.dateStart")
    List<Event> findAllByPrivateOrPublicAndActiveTrueAndDateEndAfter(@Param("now") ZonedDateTime now);

    @Query(nativeQuery = true, value = "select * from createyourevent.event e where e.private_or_public = 'public' and e.active = 1 and e.date_end >= :now order by event.date_start and rand() limit 75")
    List<Event> findAllByPrivateOrPublicAndActiveTrueAndDateEndAfterRandomly(@Param("now") ZonedDateTime now);

    @Query("select event from Event event where event.active = true and event.billed = false and event.dateEnd <= :now")
    List<Event> findAllByActiveTrueAndBilledFalseAndDateEndBefor(@Param("now") ZonedDateTime now);

    @Query("select event from Event event where event.privateOrPublic = 'public' and event.active = true and event.dateEnd <= :now order by event.dateStart")
    List<Event> findByPrivateOrPublicAndActiveTrueAndDateEndBefor(@Param("now") ZonedDateTime now);


    @Query("select event from Event event where event.privateOrPublic = 'public' and event.active = true and event.dateStart >= :betweenStart and event.dateStart <= :betweenEnd")
    List<Event> findByPrivateOrPublicAndActiveTrueAndDateStartBetween(@Param("betweenStart") ZonedDateTime betweenStart, @Param("betweenEnd") ZonedDateTime betweenEnd);

    @Query("select event from Event event where event.privateOrPublic = 'public' and event.active = true and event.user.id = :userId")
    List<Event> findByPrivateOrPublicAndActiveTrueandUserId (@Param("userId") String userId);


    List<Event> findAll();

    @Query("select event from Event event left join fetch event.user left join fetch event.location where event.id = :id")
    Event findByEventId(@Param("id") Long id);

    @Query("select event from Event event where event.user.id = :userId and event.active = true and event.billed = false and event.dateEnd <= :now")
    List<Event> findAllByActiveTrueAndBilledFalseAndDateEndBeforAndUserId(@Param("now") ZonedDateTime now, @Param("userId") String userId);

    @Query("select event from Event event where event.user.id = :userId and event.active = true and event.billed = true and event.dateEnd <= :now")
    List<Event> findAllByActiveTrueAndBilledTrueAndDateEndBeforAndUserId(@Param("now") ZonedDateTime now, @Param("userId") String userId);

    @Query("select event from Event event where event.user.id = :userId and event.active = true and event.dateEnd <= :now")
    List<Event> findAllByActiveTrueAndDateEndBeforAndUserId(@Param("now") ZonedDateTime now, @Param("userId") String userId);

    @Query("select event from Event event where event.user.id = :userId and event.active = true and event.dateEnd >= :now")
    List<Event> findAllByActiveTrueAndDateEndAfterAndUserId(@Param("now") ZonedDateTime now, @Param("userId") String userId);
}
