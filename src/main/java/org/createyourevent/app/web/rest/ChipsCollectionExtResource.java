package org.createyourevent.app.web.rest;

import org.createyourevent.app.domain.ChipsCollection;
import org.createyourevent.app.service.ChipsCollectionExtService;
import org.createyourevent.app.service.ChipsCollectionService;
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

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing {@link org.createyourevent.domain.ChipsCollection}.
 */
@RestController
@RequestMapping("/api")
public class ChipsCollectionExtResource {

    private final Logger log = LoggerFactory.getLogger(ChipsCollectionExtResource.class);

    private static final String ENTITY_NAME = "chipsCollection";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ChipsCollectionExtService chipsCollectionExtService;

    public ChipsCollectionExtResource(ChipsCollectionExtService chipsCollectionExtService) {
        this.chipsCollectionExtService = chipsCollectionExtService;
    }


    @GetMapping("/chips-collections/{userId}/findChipsCollectionByUserId")
    public ChipsCollection findChipsCollectionByUserId(@PathVariable String userId) {
        log.debug("findChipsCollectionByUserId");
        ChipsCollection chipsCollection = chipsCollectionExtService.findChipsCollectionByUserId(userId);
        return chipsCollection;
    }
}
