package org.createyourevent.app.repository;

import java.time.ZonedDateTime;
import java.util.List;

import org.createyourevent.app.domain.EventServiceMapOrder;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the EventServiceMapOrder entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EventServiceMapOrderExtRepository extends JpaRepository<EventServiceMapOrder, Long> {

    List<EventServiceMapOrder> findByServiceMapId(Long serviceMapId);

    @Query("select eventServiceMapOrder from EventServiceMapOrder eventServiceMapOrder where eventServiceMapOrder.serviceMap.id = :serviceMapId and eventServiceMapOrder.billed = false and eventServiceMapOrder.event.dateEnd < :now")
    List<EventServiceMapOrder> findByServiceMapIdAndBilledFalseAndDateEndSmallerThen(@Param("serviceMapId") Long serviceMapId, @Param("now") ZonedDateTime now);


    @Query("select eventServiceMapOrder from EventServiceMapOrder eventServiceMapOrder where eventServiceMapOrder.serviceMap.id = :serviceMapId and eventServiceMapOrder.event.dateEnd < :now")
    List<EventServiceMapOrder> findByServiceMapIdAndDateEndSmallerThen(@Param("serviceMapId") Long serviceMapId, @Param("now") ZonedDateTime now);

    @Query("select eventServiceMapOrder from EventServiceMapOrder eventServiceMapOrder where eventServiceMapOrder.serviceMap.id = :serviceMapId and eventServiceMapOrder.billed = true and eventServiceMapOrder.event.dateEnd < :now")
    List<EventServiceMapOrder> findByServiceMapIdAndBilledTrueAndDateEndSmallerThen(@Param("serviceMapId") Long serviceMapId, @Param("now") ZonedDateTime now);

    List<EventServiceMapOrder> findByEventId(Long eventId);

    @Query("select eventServiceMapOrder from EventServiceMapOrder eventServiceMapOrder where eventServiceMapOrder.dateUntil < :now")
    List<EventServiceMapOrder> findAllByDateUntilLessGreaterThanNow(@Param("now") ZonedDateTime now);

    @Query("select o from EventServiceMapOrder o where :startTime between o.dateFrom and o.dateUntil or :endTime between o.dateFrom and o.dateUntil or :startTime < o.dateFrom and :endTime > o.dateUntil")
    List<EventServiceMapOrder> findAllEventServiceMapOrdersWithDateFromRange(@Param("startTime") ZonedDateTime startTime, @Param("endTime") ZonedDateTime endTime);

    @Query("select distinct o from EventServiceMapOrder o where (( o.serviceMap.id = :serviceMapId ) and (( :startTime between o.dateFrom and o.dateUntil ) or ( :endTime between o.dateFrom and o.dateUntil ) or ( :startTime < o.dateFrom and :endTime > o.dateUntil )))")
    List<EventServiceMapOrder> findAllEventServiceMapOrdersWithDateFromRangeAndServiceMapId(@Param("serviceMapId") Long serviceMapId, @Param("startTime") ZonedDateTime startTime, @Param("endTime") ZonedDateTime endTime);


    @Query("select o from EventServiceMapOrder o where (( o.event.id = :eventId ) and (( :startTime between o.dateFrom and o.dateUntil ) or ( :endTime between o.dateFrom and o.dateUntil ) or ( :startTime < o.dateFrom and :endTime > o.dateUntil )))")
    List<EventServiceMapOrder> findAllEventServiceMapOrdersWithDateFromRangeAndEventId( @Param("eventId") Long eventId, @Param("startTime") ZonedDateTime startTime, @Param("endTime") ZonedDateTime endTime);

    @Query("select eventServiceMapOrder from EventServiceMapOrder eventServiceMapOrder where eventServiceMapOrder.event.dateEnd < :now")
    List<EventServiceMapOrder> findByEventDateEndSmallerThen( @Param("now") ZonedDateTime now);
}
