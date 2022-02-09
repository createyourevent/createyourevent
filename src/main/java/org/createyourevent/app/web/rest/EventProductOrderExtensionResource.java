package org.createyourevent.app.web.rest;

import org.createyourevent.app.domain.EventProductOrder;
import org.createyourevent.app.service.EventProductOrderExtensionService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.format.annotation.DateTimeFormat.ISO;
import org.springframework.web.bind.annotation.*;

import liquibase.pro.packaged.s;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * REST controller for managing
 * {@link org.createyourevent.domain.EventProductOrder}.
 */
@RestController
@RequestMapping("/api")
public class EventProductOrderExtensionResource {

    private final Logger log = LoggerFactory.getLogger(EventProductOrderResource.class);

    private static final String ENTITY_NAME = "eventProductOrder";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final EventProductOrderExtensionService eventProductOrderExtensionService;

    public EventProductOrderExtensionResource(EventProductOrderExtensionService eventProductOrderExtensionService) {
        this.eventProductOrderExtensionService = eventProductOrderExtensionService;
    }

    @GetMapping("/event-product-orders/{id}/getProductsByEvent")
    public List<EventProductOrder> getProductsWithEventId(@PathVariable Long id) {
        log.debug("REST request to get EventProductOrder : {}", id);
        List<EventProductOrder> eventProductOrder = eventProductOrderExtensionService.findAllByEventId(id);
        return eventProductOrder;
    }

    @GetMapping("/event-product-orders/{id}/getEventProductOrderByProduct")
    public List<EventProductOrder> getEventProductOrdersWithProductId(@PathVariable Long id) {
        log.debug("REST request to get EventProductOrder by ProductId : {}", id);
        List<EventProductOrder> eventProductOrder = eventProductOrderExtensionService.findAllByProductId(id);
        return eventProductOrder ;
    }

    @GetMapping("/event-product-orders/{productId}/{userId}/getByProductAndUser")
    public EventProductOrder getProductsWithEventIdAndUserId(@PathVariable Long productId, @PathVariable String userId) {
        log.debug("REST request to get EventProductOrder by ProductId and UserId");
        EventProductOrder eventProductOrder = eventProductOrderExtensionService.findByProductIdAndUserId(productId,
                userId);
        return eventProductOrder;
    }

    @GetMapping("/event-product-orders/{dateStartFrom}/{dateStartUntil}/findAllByDateStartBetween")
    public List<EventProductOrder> findAllByDateStartBetween(@PathVariable ZonedDateTime dateStartFrom,
            @PathVariable ZonedDateTime dateStartUntil) {
        log.debug("Rest: List<ProductReservation> findAllByDateStartBetween(Date dateStartFrom, Date dateStartUntil)");
        List<EventProductOrder> result = eventProductOrderExtensionService.findAllByDateFromBetween(dateStartFrom,
                dateStartUntil);
        return result;
    }

    @GetMapping("/event-product-orders/{productId}/findAllByProductIdAndDateStartBetween")
    public List<EventProductOrder> findAllByProductIdAndDateStartBetween(@PathVariable Long productId,
            @RequestParam String dateStartFrom, @RequestParam String dateStartUntil) {
        log.debug(
                "Rest: List<ProductReservation> findAllByProductIdAndDateStartBetween(Long productId, Date dateStartFrom, Date dateStartUntil)");
        ZonedDateTime f = ZonedDateTime.now();
        ZonedDateTime u = ZonedDateTime.now();
        try {
            f = ZonedDateTime.parse(java.net.URLDecoder.decode(dateStartFrom, "UTF-8"));
            u = ZonedDateTime.parse(java.net.URLDecoder.decode(dateStartUntil, "UTF-8"));
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        List<EventProductOrder> result = eventProductOrderExtensionService.findAllByProductIdAndDateFromBetween(productId, f, u);
        return result;
    }

    @GetMapping("/event-product-orders/{id}/getEventProductOrdersByShopId")
    public List<EventProductOrder> getProductsWithShopId(@PathVariable Long id) {
        log.debug("REST request to get EventProductOrder with shop-id : {}", id);
        List<EventProductOrder> eventProductOrder = eventProductOrderExtensionService.findAllByShopId(id);
        return eventProductOrder;
    }

    @GetMapping("/event-product-orders/{productId}/findAllWithProductIdAndDateFromGreaterThenAndDateUntilSmallerThen")
    public List<EventProductOrder> findAllWithProductIdAndDateFromGreaterThenAndDateUntilSmallerThen(@PathVariable Long productId,
            @RequestParam String dateStartFrom, @RequestParam String dateStartUntil) {
        log.debug(
                "Rest: List<ProductReservation> findAllByProductIdAndDateStartBetween(Long productId, Date dateStartFrom, Date dateStartUntil)");
        ZonedDateTime f = ZonedDateTime.now();
        ZonedDateTime u = ZonedDateTime.now();
        try {
            f = ZonedDateTime.parse(java.net.URLDecoder.decode(dateStartFrom, "UTF-8"));
            u = ZonedDateTime.parse(java.net.URLDecoder.decode(dateStartUntil, "UTF-8"));
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        List<EventProductOrder> result = eventProductOrderExtensionService.findAllWithProductIdAndDateFromGreaterThenAndDateUntilSmallerThen(productId, f, u);
        return result;
    }

    @GetMapping("/event-product-orders/{productId}/findAllByProductIdAndDateUntilBetween")
    public List<EventProductOrder> findAllByProductIdAndDateUntilBetween(@PathVariable Long productId,
            @RequestParam String dateStartFrom, @RequestParam String dateStartUntil) {
        log.debug(
                "Rest: List<ProductReservation> findAllByProductIdAndDateStartBetween(Long productId, Date dateStartFrom, Date dateStartUntil)");
        ZonedDateTime f = ZonedDateTime.now();
        ZonedDateTime u = ZonedDateTime.now();
        try {
            f = ZonedDateTime.parse(java.net.URLDecoder.decode(dateStartFrom, "UTF-8"));
            u = ZonedDateTime.parse(java.net.URLDecoder.decode(dateStartUntil, "UTF-8"));
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        List<EventProductOrder> result = eventProductOrderExtensionService.findAllByProductIdAndDateUntilBetween(productId, f, u);
        return result;
    }


    @GetMapping("/event-product-orders/findAllEventProductOrderByDateGreaterThen")
    public List<EventProductOrder> findAllEventProductOrderByDateGreaterThen(@RequestParam String now) {
        log.debug("REST request to get Event which is public and active and date after...");
        ZonedDateTime s = ZonedDateTime.now();
        try {
            s = ZonedDateTime.parse(java.net.URLDecoder.decode(now, "UTF-8"));
        } catch (UnsupportedEncodingException x) {
            x.printStackTrace();
        }
        List<EventProductOrder> orders = this.eventProductOrderExtensionService.findAllEventProductOrderByDateGreaterThen(s);
        return orders;
    }


    @GetMapping("/event-product-orders/{shopId}/findAllEventProductOrderByShopIdAndBilledFalseAndDateStartSmallerThen")
    public List<EventProductOrder> findAllByShopIdAndBilledFalseAndDateStartSmallerThen(@PathVariable Long shopId, @RequestParam String now) {
        log.debug("Rest: List<ProductReservation> findAllByDateStartBetween(Date dateStartFrom, Date dateStartUntil)");
        ZonedDateTime s = ZonedDateTime.now();
        try {
            s = ZonedDateTime.parse(java.net.URLDecoder.decode(now, "UTF-8"));
        } catch (UnsupportedEncodingException x) {
            x.printStackTrace();
        }
        List<EventProductOrder> result = eventProductOrderExtensionService.findAllByShopIdAndBilledFalseAndDateStartSmallerThen(shopId, s);
        return result;
    }

    @GetMapping("/event-product-orders/{shopId}/findAllEventProductOrderByShopIdAndBilledTrueAndDateStartSmallerThen")
    public List<EventProductOrder> findAllByShopIdAndBilledTrueAndDateStartSmallerThen(@PathVariable Long shopId, @RequestParam String now) {
        log.debug("Rest: List<ProductReservation> findAllByDateStartBetween(Date dateStartFrom, Date dateStartUntil)");
        ZonedDateTime s = ZonedDateTime.now();
        try {
            s = ZonedDateTime.parse(java.net.URLDecoder.decode(now, "UTF-8"));
        } catch (UnsupportedEncodingException x) {
            x.printStackTrace();
        }
        List<EventProductOrder> result = eventProductOrderExtensionService.findAllByShopIdAndBilledTrueAndDateStartSmallerThen(shopId, s);
        return result;
    }

    @GetMapping("/event-product-orders/{shopId}/findAllEventProductOrderByShopIdAndDateStartSmallerThen")
    public List<EventProductOrder> findAllByShopIdAndDateStartSmallerThen(@PathVariable Long shopId, @RequestParam String now) {
        log.debug("Rest: List<ProductReservation> findAllByDateStartBetween(Date dateStartFrom, Date dateStartUntil)");
        ZonedDateTime s = ZonedDateTime.now();
        try {
            s = ZonedDateTime.parse(java.net.URLDecoder.decode(now, "UTF-8"));
        } catch (UnsupportedEncodingException x) {
            x.printStackTrace();
        }
        List<EventProductOrder> result = eventProductOrderExtensionService.findAllByShopIdAndDateStartSmallerThen(shopId, s);
        return result;
    }


    //-------------------------------------------------------------------------------------------------------------------------------------------------//

    @GetMapping("/event-product-orders/findAllEventProductOrdersWithDateFromRange")
    public List<EventProductOrder> findAllEventProductOrdersWithDateFromRange(@RequestParam String dateStart, @RequestParam String dateEnd) {
        log.debug(
                "List<EventProductOrder> findAllEventProductOrdersWithDateFromRange(ZonedDateTime startTime, ZonedDateTime endTime)");
        ZonedDateTime f = ZonedDateTime.now();
        ZonedDateTime u = ZonedDateTime.now();
        try {
            f = ZonedDateTime.parse(java.net.URLDecoder.decode(dateStart, "UTF-8"));
            u = ZonedDateTime.parse(java.net.URLDecoder.decode(dateEnd, "UTF-8"));
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        List<EventProductOrder> result = eventProductOrderExtensionService.findAllEventProductOrdersWithDateFromRange(f, u);
        return result;
    }

    @GetMapping("/event-product-orders/findAllEventProductOrdersWithDateFromSmallerThenAndDateUntilBetween")
    public List<EventProductOrder> findAllEventProductOrdersWithDateFromSmallerThenAndDateUntilBetween(@RequestParam String dateStart, @RequestParam String dateEnd) {
        log.debug(
                "List<EventProductOrder> findAllEventProductOrdersWithDateFromSmallerThenAndDateUntilBetween(ZonedDateTime startTime, ZonedDateTime endTime)");
        ZonedDateTime f = ZonedDateTime.now();
        ZonedDateTime u = ZonedDateTime.now();
        try {
            f = ZonedDateTime.parse(java.net.URLDecoder.decode(dateStart, "UTF-8"));
            u = ZonedDateTime.parse(java.net.URLDecoder.decode(dateEnd, "UTF-8"));
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        List<EventProductOrder> result = eventProductOrderExtensionService.findAllEventProductOrdersWithDateFromSmallerThenAndDateUntilBetween(f, u);
        return result;
    }

    @GetMapping("/event-product-orders/findAllEventProductOrdersWithDateFromBetweenAndDateUntilBiggerThen")
    public List<EventProductOrder> findAllEventProductOrdersWithDateFromBetweenAndDateUntilBiggerThen(@RequestParam String dateStart, @RequestParam String dateEnd) {
        log.debug(
                "List<EventProductOrder> findAllEventProductOrdersWithDateFromBetweenAndDateUntilBiggerThen(ZonedDateTime startTime, ZonedDateTime endTime)");
        ZonedDateTime f = ZonedDateTime.now();
        ZonedDateTime u = ZonedDateTime.now();
        try {
            f = ZonedDateTime.parse(java.net.URLDecoder.decode(dateStart, "UTF-8"));
            u = ZonedDateTime.parse(java.net.URLDecoder.decode(dateEnd, "UTF-8"));
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        List<EventProductOrder> result = eventProductOrderExtensionService.findAllEventProductOrdersWithDateFromBetweenAndDateUntilBiggerThen(f, u);
        return result;
    }

    @GetMapping("/event-product-orders/findAllEventProductOrdersWithDateFromSmallerThenAndDateUntilBiggerThenAndOnSameTimeRange")
    public List<EventProductOrder> findAllEventProductOrdersWithDateFromSmallerThenAndDateUntilBiggerThenAndOnSameTimeRange(@RequestParam String dateStart, @RequestParam String dateEnd) {
        log.debug(
                "List<EventProductOrder> findAllEventProductOrdersWithDateFromSmallerThenAndDateUntilBiggerThenAndOnSameTimeRange(ZonedDateTime startTime, ZonedDateTime endTime)");
        ZonedDateTime f = ZonedDateTime.now();
        ZonedDateTime u = ZonedDateTime.now();
        try {
            f = ZonedDateTime.parse(java.net.URLDecoder.decode(dateStart, "UTF-8"));
            u = ZonedDateTime.parse(java.net.URLDecoder.decode(dateEnd, "UTF-8"));
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        List<EventProductOrder> result = eventProductOrderExtensionService.findAllEventProductOrdersWithDateFromSmallerThenAndDateUntilBiggerThenAndOnSameTimeRange(f, u);
        return result;
    }



}
