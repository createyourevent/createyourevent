package org.createyourevent.app.web.rest;

import org.createyourevent.app.domain.EventServiceMapOrder;
import org.createyourevent.app.service.EventServiceMapOrderExtService;
import org.createyourevent.app.service.EventServiceMapOrderService;
import org.createyourevent.app.web.rest.errors.BadRequestAlertException;

import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.UnsupportedEncodingException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URLDecoder;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing {@link org.createyourevent.domain.EventServiceMapOrder}.
 */
@RestController
@RequestMapping("/api")
public class EventServiceMapOrderExtResource {

    private final Logger log = LoggerFactory.getLogger(EventServiceMapOrderResource.class);

    private static final String ENTITY_NAME = "eventServiceMapOrder";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final EventServiceMapOrderExtService eventServiceMapOrderExtService;

    public EventServiceMapOrderExtResource(EventServiceMapOrderExtService eventServiceMapOrderExtService) {
        this.eventServiceMapOrderExtService = eventServiceMapOrderExtService;
    }

    /**
     * {@code GET  /event-service-map-orders} : get all the eventServiceMapOrders.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of eventServiceMapOrders in body.
     */
    @GetMapping("/event-service-map-orders/{serviceMapId}/getAllEventServiceMapsOrdersByServiceMapId")
    public List<EventServiceMapOrder> getAllEventServiceMapOrders(@PathVariable Long serviceMapId) {
        log.debug("REST request to get a page of EventServiceMapOrders");
        List<EventServiceMapOrder> maps = this.eventServiceMapOrderExtService.findByServiceMapId(serviceMapId);
        return maps;
    }

        /**
     * {@code GET  /event-service-map-orders} : get all the eventServiceMapOrders.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of eventServiceMapOrders in body.
     */
    @GetMapping("/event-service-map-orders/{serviceMapId}/getAllEventServiceMapsOrdersByServiceMapIdAndEventConfirmed")
    public List<EventServiceMapOrder> getAllEventServiceMapsOrdersByServiceMapIdAndEventConfirmed(@PathVariable Long serviceMapId) {
        log.debug("REST request to get a page of EventServiceMapOrders");
        List<EventServiceMapOrder> maps = this.eventServiceMapOrderExtService.findByServiceMapId(serviceMapId);
        List<EventServiceMapOrder> mapsConfirmed = new ArrayList<EventServiceMapOrder>();
        for(EventServiceMapOrder s : maps) {
            if(s.getEvent().getActive() && s.getEvent().getDefinitelyConfirmed()) {
                mapsConfirmed.add(s);
            }
        }
        return mapsConfirmed;
    }


        /**
     * {@code GET  /event-service-map-orders} : get all the eventServiceMapOrders.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of eventServiceMapOrders in body.
     */
    @GetMapping("/event-service-map-orders/{eventId}/getAllEventServiceMapsOrdersByEventId")
    public List<EventServiceMapOrder> getAllEventServiceMapOrdersByEventId(@PathVariable Long eventId) {
        log.debug("REST request to get a page of EventServiceMapOrders");
        List<EventServiceMapOrder> maps = this.eventServiceMapOrderExtService.findByEventId(eventId);
        return maps;
    }



    @GetMapping("/event-service-map-orders/findAllEventServiceMapOrdersWithDateRange")
    public List<EventServiceMapOrder> findAllEventServiceMapOrdersWithDateRange(@RequestParam String betweenStart, @RequestParam String betweenEnd ) {
        log.debug("REST request to get Event which is public and active and date after...");
        ZonedDateTime s = ZonedDateTime.now();
        ZonedDateTime e = ZonedDateTime.now();
        try {
            s = ZonedDateTime.parse(java.net.URLDecoder.decode(betweenStart, "UTF-8"));
            e = ZonedDateTime.parse(java.net.URLDecoder.decode(betweenEnd, "UTF-8"));
        } catch (UnsupportedEncodingException x) {
            x.printStackTrace();
        }
        List<EventServiceMapOrder> orders = this.eventServiceMapOrderExtService.findAllEventServiceMapOrdersWithDateRange(s, e);
        return orders;
    }

    @GetMapping("/event-service-map-orders/findAllEventServiceMapOrdersWithDateRangeAndServiceMapId/{serviceMapId}")
    public List<EventServiceMapOrder> findAllEventServiceMapOrdersWithDateRangeAndServiceMapId(@PathVariable Long serviceMapId, @RequestParam String betweenStart, @RequestParam String betweenEnd ) {
        log.debug("REST request to get Event which is public and active and date after...");
        ZonedDateTime s = ZonedDateTime.now();
        ZonedDateTime e = ZonedDateTime.now();
        try {
            s = ZonedDateTime.parse(java.net.URLDecoder.decode(betweenStart, "UTF-8"));
            e = ZonedDateTime.parse(java.net.URLDecoder.decode(betweenEnd, "UTF-8"));
        } catch (UnsupportedEncodingException x) {
            x.printStackTrace();
        }
        List<EventServiceMapOrder> orders = this.eventServiceMapOrderExtService.findAllEventServiceMapOrdersWithDateRangeAndServiceMapId(serviceMapId, s, e);
        return orders;
    }


    @GetMapping("/event-service-map-orders/findAllEventServiceMapOrdersWithDateRangeAndEventId/{eventId}")
    public List<EventServiceMapOrder> findAllEventServiceMapOrdersWithDateRangeAndEventId( @PathVariable Long eventId, @RequestParam String betweenStart, @RequestParam String betweenEnd ) {
        log.debug("REST request to get Event which is public and active and date after...");
        ZonedDateTime s = ZonedDateTime.now();
        ZonedDateTime e = ZonedDateTime.now();
        try {
            s = ZonedDateTime.parse(java.net.URLDecoder.decode(betweenStart, "UTF-8"));
            e = ZonedDateTime.parse(java.net.URLDecoder.decode(betweenEnd, "UTF-8"));
        } catch (UnsupportedEncodingException x) {
            x.printStackTrace();
        }
        List<EventServiceMapOrder> orders = this.eventServiceMapOrderExtService.findAllEventServiceMapOrdersWithDateFromRangeAndEventId( eventId, s, e);
        return orders;
    }

    @GetMapping("/event-service-map-orders/findAllEventServiceMapOrdersByDateUntilLessGreaterThanNow")
    public List<EventServiceMapOrder> findAllEventServiceMapOrdersByDateUntilLessGreaterThanNow(@RequestParam String now) {
        log.debug("REST request to get Event which is public and active and date after...");
        ZonedDateTime s = ZonedDateTime.now();
        try {
            s = ZonedDateTime.parse(java.net.URLDecoder.decode(now, "UTF-8"));
        } catch (UnsupportedEncodingException x) {
            x.printStackTrace();
        }
        List<EventServiceMapOrder> orders = this.eventServiceMapOrderExtService.findAllEventServiceMapOrdersByDateUntilLessGreaterThanNow(s);
        return orders;
    }

    @GetMapping("/event-service-map-orders/{serviceMapId}/findEventServiceMapOrdersByServiceMapIdAndBilledFalseAndDateEndSmallerThen")
    public List<EventServiceMapOrder> findEventServiceMapOrdersByServiceMapIdAndBilledFalseAndDateEndSmallerThen(@PathVariable Long serviceMapId, @RequestParam String now) {
        log.debug("REST request to servicemaporder by servicemapid and billed = false and dateEnd smalleer than now");
        ZonedDateTime s = ZonedDateTime.now();
        try {
            s = ZonedDateTime.parse(java.net.URLDecoder.decode(now, "UTF-8"));
        } catch (UnsupportedEncodingException x) {
            x.printStackTrace();
        }
        List<EventServiceMapOrder> orders = this.eventServiceMapOrderExtService.findByServiceMapIdAndDateEndSmallerThen(serviceMapId, s);
        return orders;
    }

    @GetMapping("/event-service-map-orders/{serviceMapId}/findEventServiceMapOrdersByServiceMapIdAndDateEndSmallerThen")
    public List<EventServiceMapOrder> findEventServiceMapOrdersByServiceMapIdAndDateEndSmallerThen(@PathVariable Long serviceMapId, @RequestParam String now) {
        log.debug("REST request to servicemaporder by servicemapid and billed = false and dateEnd smalleer than now");
        ZonedDateTime s = ZonedDateTime.now();
        try {
            s = ZonedDateTime.parse(java.net.URLDecoder.decode(now, "UTF-8"));
        } catch (UnsupportedEncodingException x) {
            x.printStackTrace();
        }
        List<EventServiceMapOrder> orders = this.eventServiceMapOrderExtService.findByServiceMapIdAndBilledFalseAndDateEndSmallerThen(serviceMapId, s);
        return orders;
    }

    @GetMapping("/event-service-map-orders/{serviceMapId}/findEventServiceMapOrdersByServiceMapIdAndBilledTrueAndDateEndSmallerThen")
    public List<EventServiceMapOrder> findEventServiceMapOrdersByServiceMapIdAndBilledTrueAndDateEndSmallerThen(@PathVariable Long serviceMapId, @RequestParam String now) {
        log.debug("REST request to servicemaporder by servicemapid and billed = false and dateEnd smalleer than now");
        ZonedDateTime s = ZonedDateTime.now();
        try {
            s = ZonedDateTime.parse(java.net.URLDecoder.decode(now, "UTF-8"));
        } catch (UnsupportedEncodingException x) {
            x.printStackTrace();
        }
        List<EventServiceMapOrder> orders = this.eventServiceMapOrderExtService.findByServiceMapIdAndBilledTrueAndDateEndSmallerThen(serviceMapId, s);
        return orders;
    }


    @GetMapping("/event-service-map-orders/findEventServiceMapOrdersByEventDateEndSmallerThenNow")
    public List<EventServiceMapOrder> findByEvenDateEndSmallerThen() {
        log.debug("REST request to servicemaporder by servicemapid and billed = false and dateEnd smalleer than now");
        ZonedDateTime s = ZonedDateTime.now();
        List<EventServiceMapOrder> orders = this.eventServiceMapOrderExtService.findByEventDateEndSmallerThen(s);
        return orders;
    }
}

