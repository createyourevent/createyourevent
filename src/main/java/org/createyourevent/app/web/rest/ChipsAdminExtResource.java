package org.createyourevent.app.web.rest;

import org.createyourevent.app.service.ChipsAdminExtService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


/**
 * REST controller for managing {@link org.createyourevent.domain.ChipsAdmin}.
 */
@RestController
@RequestMapping("/api")
public class ChipsAdminExtResource {

    private final Logger log = LoggerFactory.getLogger(ChipsAdminExtResource.class);

    private static final String ENTITY_NAME = "chipsAdmin";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ChipsAdminExtService chipsAdminExtService;

    public ChipsAdminExtResource(ChipsAdminExtService chipsAdminExtService) {
        this.chipsAdminExtService = chipsAdminExtService;
    }

    /**
     * {@code DELETE  /chips-admins/:id} : delete the "id" chipsAdmin.
     *
     * @param id the id of the chipsAdmin to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/chips-admins/deleteAllFoundedChips")
    public void deleteAllFoundedChips() {
        log.debug("deleteAllFoundedChips()");
        chipsAdminExtService.deleteAllFoundedChips();
    }
}
