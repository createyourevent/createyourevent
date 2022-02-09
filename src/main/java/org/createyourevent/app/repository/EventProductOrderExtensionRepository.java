package org.createyourevent.app.repository;

import java.time.ZonedDateTime;
import java.util.Date;
import java.util.List;

import org.createyourevent.app.domain.EventProductOrder;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the EventProductOrder entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EventProductOrderExtensionRepository extends JpaRepository<EventProductOrder, Long> {

    @Query("select epo, p, s, u from EventProductOrder epo join epo.product p join p.shop s join s.user u where epo.event.id = :eventId")
    List<EventProductOrder> findAllByEventId(@Param("eventId") Long eventId);

    @Query("select epo, e, p, u from EventProductOrder epo join epo.event e join epo.product p join epo.user u where p.id = :productId order by coalesce(u.id, e.name)")
    List<EventProductOrder> findAllByProductId(@Param("productId") Long productId);

    EventProductOrder findByProductIdAndUserId(Long productId, String userId);
    List<EventProductOrder> findAll();
    List<EventProductOrder> findAllByShopId(Long shopId);

    List<EventProductOrder> findAllByDateFromBetween(ZonedDateTime dateStartFrom, ZonedDateTime dateStartUntil);
    List<EventProductOrder> findAllByProductIdAndDateFromBetween(Long productId, ZonedDateTime dateStartFrom, ZonedDateTime dateStartUntil);
    List<EventProductOrder> findAllByProductIdAndDateUntilBetween(Long productId, ZonedDateTime dateStartFrom, ZonedDateTime dateStartUntil);

    @Query("select epo from EventProductOrder epo where epo.product.id = :id and epo.dateFrom <= :dateFrom and epo.dateUntil >= :dateUntil")
    List<EventProductOrder> findAllWithProductIdAndDateFromGreaterThenAndDateUntilSmallerThen(@Param("id") Long id, @Param("dateFrom") ZonedDateTime dateFrom, @Param("dateUntil") ZonedDateTime dateUntil);

    @Query("select epo from EventProductOrder epo where epo.event.dateEnd < :now")
    List<EventProductOrder> findAllByDateGreaterThen(@Param("now") ZonedDateTime now);

    @Query("select epo from EventProductOrder epo where epo.shop.id = :shopId and billed = false and epo.event.dateEnd < :now")
    List<EventProductOrder> findAllByShopIdAndBilledFalseAndDateStartSmallerThen(@Param("shopId") Long shopId, @Param("now") ZonedDateTime now);

    @Query("select epo from EventProductOrder epo where epo.shop.id = :shopId and billed = true and epo.event.dateEnd < :now")
    List<EventProductOrder> findAllByShopIdAndBilledTrueAndDateStartSmallerThen(@Param("shopId") Long shopId, @Param("now") ZonedDateTime now);


    @Query("select epo from EventProductOrder epo where epo.shop.id = :shopId and epo.event.dateEnd < :now")
    List<EventProductOrder> findAllByShopIdAndDateStartSmallerThen(@Param("shopId") Long shopId, @Param("now") ZonedDateTime now);


    @Query("select epo from EventProductOrder epo where epo.dateFrom between :startTime AND :endTime AND epo.dateUntil between :startTime AND :endTime")
    List<EventProductOrder> findAllEventProductOrdersWithDateFromRange(@Param("startTime") ZonedDateTime startTime, @Param("endTime") ZonedDateTime endTime);

    @Query("select epo from EventProductOrder epo where epo.dateFrom <= :startTime AND epo.dateUntil between :startTime AND :endTime")
    List<EventProductOrder> findAllEventProductOrdersWithDateFromSmallerThenAndDateUntilBetween(@Param("startTime") ZonedDateTime startTime, @Param("endTime") ZonedDateTime endTime);

    @Query("select epo from EventProductOrder epo where epo.dateFrom between :startTime AND :endTime AND epo.dateUntil >= :endTime")
    List<EventProductOrder> findAllEventProductOrdersWithDateFromBetweenAndDateUntilBiggerThen(@Param("startTime") ZonedDateTime startTime, @Param("endTime") ZonedDateTime endTime);

    @Query(nativeQuery = true, value = "select * from createyourevent.event_product_order epo where epo.date_from <= :startTime AND epo.date_until >= :endTime AND HOUR(TIMEDIFF(:startTime, epo.date_until))<=1 AND HOUR(TIMEDIFF(:endTime, epo.date_from))>=1")
    List<EventProductOrder> findAllEventProductOrdersWithDateFromSmallerThenAndDateUntilBiggerThenAndOnSameTimeRange(@Param("startTime") ZonedDateTime startTime, @Param("endTime") ZonedDateTime endTime);
}
