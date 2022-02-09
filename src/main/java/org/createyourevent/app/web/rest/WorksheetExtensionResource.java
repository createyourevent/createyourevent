package org.createyourevent.app.web.rest;

import org.createyourevent.app.domain.Worksheet;
import org.createyourevent.app.service.WorksheetExtensionService;
import org.createyourevent.app.service.WorksheetService;
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
 * REST controller for managing {@link org.createyourevent.domain.Worksheet}.
 */
@RestController
@RequestMapping("/api")
public class WorksheetExtensionResource {

    private final Logger log = LoggerFactory.getLogger(WorksheetResource.class);

    private static final String ENTITY_NAME = "worksheet";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final WorksheetExtensionService worksheetExtensionService;

    public WorksheetExtensionResource(WorksheetExtensionService worksheetExtensionService) {
        this.worksheetExtensionService = worksheetExtensionService;
    }

    @GetMapping("/worksheets/{id}/allByEventId")
    public List<Worksheet> getWorksheetsByEventId(@PathVariable Long id) {
        log.debug("REST request to get Worksheet : {}", id);
        List<Worksheet> worksheets = worksheetExtensionService.findAllByEventId(id);
        return worksheets;
    }
}
