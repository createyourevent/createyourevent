package org.createyourevent.app.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.createyourevent.app.domain.Hotel;
import org.createyourevent.app.repository.HotelExtRepository;
import org.createyourevent.app.repository.HotelRepository;
import org.createyourevent.app.service.HotelExtService;
import org.createyourevent.app.service.HotelService;
import org.createyourevent.app.web.rest.errors.BadRequestAlertException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link org.createyourevent.app.domain.Hotel}.
 */
@RestController
@RequestMapping("/api")
public class HotelExtResource {

    private final Logger log = LoggerFactory.getLogger(HotelExtResource.class);

    private static final String ENTITY_NAME = "hotel";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final HotelExtService hotelExtService;

    private final HotelExtRepository hotelExtRepository;

    public HotelExtResource(HotelExtService hotelExtService, HotelExtRepository hotelExtRepository) {
        this.hotelExtService = hotelExtService;
        this.hotelExtRepository = hotelExtRepository;
    }


    @GetMapping("/hotels/byUser/active")
    public List<Hotel> getAllHotelsByUserAndActive() {
        log.debug("REST request to get a page of Hotels");
        List<Hotel> r = this.hotelExtService.findByUserIsCurrentUserAndActive();
        return r;
    }

    @GetMapping("/hotels/{id}/hotelByOrganizationId")
    public Hotel getHotelByOrganizationId(@PathVariable Long id) {
        log.debug("REST request to get Hotel : {}", id);
        Hotel hotel = hotelExtService.findByOrganizationId(id);
        return hotel;
    }
}
