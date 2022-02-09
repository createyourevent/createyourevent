package org.createyourevent.app.web.rest;

import org.createyourevent.app.domain.UserPointAssociation;
import org.createyourevent.app.service.UserPointAssociationExtService;
import org.createyourevent.app.service.UserPointAssociationService;
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
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing {@link org.createyourevent.domain.UserPointAssociation}.
 */
@RestController
@RequestMapping("/api")
public class UserPointAssociationExtResource {

    private final Logger log = LoggerFactory.getLogger(UserPointAssociationExtResource.class);

    private static final String ENTITY_NAME = "userPointAssociation";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final UserPointAssociationExtService userPointAssociationExtService;

    public UserPointAssociationExtResource(UserPointAssociationExtService userPointAssociationExtService) {
        this.userPointAssociationExtService = userPointAssociationExtService;
    }



    /**
     * {@code GET  /user-point-associations} : get all the userPointAssociations.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of userPointAssociations in body.
     */
    @GetMapping("/user-point-associations/{userId}/getAllPointsFromUser")
    public List<UserPointAssociation> getAllUserPointAssociations(@PathVariable String userId) {
        log.debug("REST request to get a page of UserPointAssociations with userid");
        return userPointAssociationExtService.findByUsersId(userId);
    }

    @GetMapping("/user-point-associations/{userId}/findByUsersIdAndDateBetween")
    public List<UserPointAssociation> findByUsersIdAndDateBetween(@PathVariable String userId, @RequestParam String betweenStart, @RequestParam String betweenEnd) {
        log.debug("findByUsersIdAndDateBetween");
        ZonedDateTime s = ZonedDateTime.now();
        ZonedDateTime e = ZonedDateTime.now();
        try {
            s = ZonedDateTime.parse(java.net.URLDecoder.decode(betweenStart, "UTF-8"));
            e = ZonedDateTime.parse(java.net.URLDecoder.decode(betweenEnd, "UTF-8"));
        } catch (UnsupportedEncodingException x) {
            x.printStackTrace();
        }
        return userPointAssociationExtService.findByUsersIdAndDateBetween(userId, s, e);
    }

    @GetMapping("/user-point-associations/{userId}/{key}/findByUsersIdAndPointkeyAndDateBetween")
    public List<UserPointAssociation> findByUsersIdAndPointkeyAndDateBetween(@PathVariable String userId, @PathVariable String key, @RequestParam String betweenStart, @RequestParam String betweenEnd) {
        log.debug("findByUsersIdAndPointkeyAndDateBetween");
        ZonedDateTime s = ZonedDateTime.now();
        ZonedDateTime e = ZonedDateTime.now();
        try {
            s = ZonedDateTime.parse(java.net.URLDecoder.decode(betweenStart, "UTF-8"));
            e = ZonedDateTime.parse(java.net.URLDecoder.decode(betweenEnd, "UTF-8"));
        } catch (UnsupportedEncodingException x) {
            x.printStackTrace();
        }
        List<UserPointAssociation> r = userPointAssociationExtService.findByUsersIdAndPointkeyAndDateBetween(userId, key, s, e);
        return r;
    }

    @GetMapping("/user-point-associations/{userId}/{key}/findByUsersIdAndPointkey")
    public List<UserPointAssociation> findByUsersIdAndPointkey(@PathVariable String userId, @PathVariable String key) {
        log.debug("findByUsersIdAndPointkey");
        List<UserPointAssociation> r = userPointAssociationExtService.findByUsersIdAndPointkey(userId, key);
        return r;
    }
}
