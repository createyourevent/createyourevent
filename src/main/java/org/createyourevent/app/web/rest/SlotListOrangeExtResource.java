package org.createyourevent.app.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.createyourevent.app.domain.SlotListOrange;
import org.createyourevent.app.repository.SlotListOrangeExtRepository;
import org.createyourevent.app.service.SlotListOrangeExtService;
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
 * REST controller for managing {@link org.createyourevent.app.domain.SlotListOrange}.
 */
@RestController
@RequestMapping("/api")
public class SlotListOrangeExtResource {

    private final Logger log = LoggerFactory.getLogger(SlotListOrangeExtResource.class);

    private static final String ENTITY_NAME = "slotListOrange";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SlotListOrangeExtService slotListOrangeExtService;

    private final SlotListOrangeExtRepository slotListOrangeExtRepository;

    public SlotListOrangeExtResource(
        SlotListOrangeExtService slotListOrangeExtService,
        SlotListOrangeExtRepository slotListOrangeExtRepository
    ) {
        this.slotListOrangeExtService = slotListOrangeExtService;
        this.slotListOrangeExtRepository = slotListOrangeExtRepository;
    }

    /**
     * {@code DELETE  /slot-list-oranges/:id} : delete the "id" slotListOrange.
     *
     * @param id the id of the slotListOrange to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/slot-list-oranges/deleteAll")
    public void deleteSlotListOrange() {
        log.debug("REST request to deleteAll SlotListOrange : {}");
        slotListOrangeExtService.deleteAll();
    }
}
