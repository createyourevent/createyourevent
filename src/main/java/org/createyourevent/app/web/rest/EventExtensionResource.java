package org.createyourevent.app.web.rest;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.time.ZonedDateTime;
import java.util.List;

import org.createyourevent.app.domain.Event;
import org.createyourevent.app.service.EventExtensionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class EventExtensionResource {

    private final Logger log = LoggerFactory.getLogger(ShopExtensionResource.class);

    private static final String ENTITY_NAME = "event";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final EventExtensionService eventExtensionService;

    public EventExtensionResource(EventExtensionService eventExtensionService) {
        this.eventExtensionService = eventExtensionService;
    }

    @GetMapping("/events/public/active/user")
    public List<Event> findByUserIdAndActiveTrueAndPrivateOrPublic() {
        log.debug("REST request to get Event which is public and active");
        List<Event> events = eventExtensionService.findByUserIdAndActiveTrueAndPrivateOrPublic();
        return events;
    }

    @GetMapping("/events/user/active/{userId}")
    public List<Event> getEventsFromUserAndActive(@PathVariable String userId) {
        log.debug("REST request to get Event from user and active");
        List<Event> events = eventExtensionService.findByUserIdAndActiveTrue(userId);
        return events;
    }

    @GetMapping("/events/public/active")
    public List<Event> findByPrivateOrPublicAndActiveTrue() {
        log.debug("REST request to get Event which is public and active");
        List<Event> events = eventExtensionService.findByPrivateOrPublicAndActiveTrue();
        return events;
    }

    @GetMapping("/events/dateEnd/public/active")
    public List<Event> findByPrivateOrPublicAndActiveTrueAndDateEndAfter(@RequestParam String date) {
        log.debug("REST request to get Event which is public and active and date after...");
        ZonedDateTime f = ZonedDateTime.now();
        try {
            f = ZonedDateTime.parse(java.net.URLDecoder.decode(date, "UTF-8"));
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        List<Event> events = eventExtensionService.findByPrivateOrPublicAndActiveTrueAndDateEndAfter(f);
        return events;
    }

    @GetMapping("/events/dateEnd/befor/public/active")
    public List<Event> findByPrivateOrPublicAndActiveTrueAndDateEndBefor(@RequestParam String dateEnd) {
        log.debug("REST request to get Event which is public and active and date befor..");
        ZonedDateTime f = ZonedDateTime.now();
        try {
            f = ZonedDateTime.parse(java.net.URLDecoder.decode(dateEnd, "UTF-8"));
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        List<Event> events = eventExtensionService.findByPrivateOrPublicAndActiveTrueAndDateEndBefor(f);
        return events;
    }



    @GetMapping("/events/between/public/active")
    public List<Event> findByPrivateOrPublicAndActiveTrueAndDateStartBetween(@RequestParam String betweenStart, @RequestParam String betweenEnd ) {
        log.debug("REST request to get Event which is public and active and date after...");
        ZonedDateTime s = ZonedDateTime.now();
        ZonedDateTime e = ZonedDateTime.now();
        try {
            s = ZonedDateTime.parse(java.net.URLDecoder.decode(betweenStart, "UTF-8"));
            e = ZonedDateTime.parse(java.net.URLDecoder.decode(betweenEnd, "UTF-8"));
        } catch (UnsupportedEncodingException x) {
            x.printStackTrace();
        }
        List<Event> events = eventExtensionService.findByPrivateOrPublicAndActiveTrueAndDateStartBetween(s, e);
        return events;
    }


    @GetMapping("/events/dateBefor/active/notBilled")
    public List<Event> findAllByActiveTrueAndBilledFalseAndDateEndBefor(@RequestParam String date) {
        log.debug("REST request to get Event which is public and active and date after...");
        ZonedDateTime f = ZonedDateTime.now();
        try {
            f = ZonedDateTime.parse(java.net.URLDecoder.decode(date, "UTF-8"));
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        List<Event> events = eventExtensionService.findAllByActiveTrueAndBilledFalseAndDateEndBefor(f);
        return events;
    }

    @GetMapping("/events/dateBefor/active/notBilled/{userId}")
    public List<Event> findAllByActiveTrueAndBilledFalseAndDateEndBefor(@RequestParam String date, @PathVariable String userId) {
        log.debug("REST request to get Event which is public and active and date after...");
        ZonedDateTime f = ZonedDateTime.now();
        try {
            f = ZonedDateTime.parse(java.net.URLDecoder.decode(date, "UTF-8"));
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        List<Event> events = eventExtensionService.findAllByActiveTrueAndBilledFalseAndDateEndBeforAndUserId(f, userId);
        return events;
    }

    @GetMapping("/events/dateBefor/active/billed/{userId}")
    public List<Event> findAllByActiveTrueAndBilledTrueAndDateEndBefor(@RequestParam String date, @PathVariable String userId) {
        log.debug("REST request to get Event which is public and active and billed and date after...");
        ZonedDateTime f = ZonedDateTime.now();
        try {
            f = ZonedDateTime.parse(java.net.URLDecoder.decode(date, "UTF-8"));
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        List<Event> events = eventExtensionService.findAllByActiveTrueAndBilledTrueAndDateEndBeforAndUserId(f, userId);
        return events;
    }


    @GetMapping("/events/dateBefor/active/{userId}")
    public List<Event> findAllByActiveTrueAndDateEndBefor(@RequestParam String date, @PathVariable String userId) {
        log.debug("REST request to get Event which is public and active and billed and date after...");
        ZonedDateTime f = ZonedDateTime.now();
        try {
            f = ZonedDateTime.parse(java.net.URLDecoder.decode(date, "UTF-8"));
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        List<Event> events = eventExtensionService.findAllByActiveTrueAndDateEndBeforAndUserId(f, userId);
        return events;
    }

    @GetMapping("/events/dateAfter/active/{userId}")
    public List<Event> findAllByActiveTrueAndDateEndAfter(@RequestParam String date, @PathVariable String userId) {
        log.debug("REST request to get Event which is public and active and billed and date after...");
        ZonedDateTime f = ZonedDateTime.now();
        try {
            f = ZonedDateTime.parse(java.net.URLDecoder.decode(date, "UTF-8"));
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        List<Event> events = eventExtensionService.findAllByActiveTrueAndDateEndAfterAndUserId(f, userId);
        return events;
    }

    @GetMapping("/events/findById/{id}")
    public Event findByEventId(@PathVariable Long id) {
        log.debug("findByEventId()");
        Event e = eventExtensionService.findByEventId(id);
        return e;
    }
}
