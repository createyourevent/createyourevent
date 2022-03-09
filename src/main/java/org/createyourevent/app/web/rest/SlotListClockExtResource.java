package org.createyourevent.app.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.createyourevent.app.domain.SlotListClock;
import org.createyourevent.app.repository.SlotListClockExtRepository;
import org.createyourevent.app.service.SlotListClockExtService;
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
 * REST controller for managing {@link org.createyourevent.app.domain.SlotListClock}.
 */
@RestController
@RequestMapping("/api")
public class SlotListClockExtResource {

    private final Logger log = LoggerFactory.getLogger(SlotListClockExtResource.class);

    private static final String ENTITY_NAME = "slotListClock";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SlotListClockExtService slotListClockExtService;

    private final SlotListClockExtRepository slotListClockExtRepository;

    public SlotListClockExtResource(
        SlotListClockExtService slotListClockExtService,
        SlotListClockExtRepository slotListClockExtRepository
    ) {
        this.slotListClockExtService = slotListClockExtService;
        this.slotListClockExtRepository = slotListClockExtRepository;
    }

    /**
     * {@code DELETE  /slot-list-clocks/:id} : delete the "id" slotListClock.
     *
     * @param id the id of the slotListClock to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/slot-list-clocks/deleteAll")
    public void deleteSlotListClock() {
        log.debug("REST request to delete SlotListClock : {}");
        slotListClockExtService.deleteAll();
    }
}
