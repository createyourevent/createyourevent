package org.createyourevent.app.web.rest;

import org.createyourevent.app.domain.Gift;
import org.createyourevent.app.service.GiftExtService;
import org.createyourevent.app.service.GiftService;
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

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing {@link org.createyourevent.domain.Gift}.
 */
@RestController
@RequestMapping("/api")
public class GiftExtResource {

    private final Logger log = LoggerFactory.getLogger(GiftExtResource.class);

    private static final String ENTITY_NAME = "gift";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final GiftExtService giftExtService;

    public GiftExtResource(GiftExtService giftExtService) {
        this.giftExtService = giftExtService;
    }



    /**
     * {@code GET  /gifts} : get all the gifts.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of gifts in body.
     */
    @GetMapping("/gifts/active")
    public List<Gift> getAllGiftsByActiveTrue() {
        log.debug("REST request to get a page of Gifts which are active");
        List<Gift> gifts = giftExtService.findByActiveTrue();
        return gifts;
    }
}
