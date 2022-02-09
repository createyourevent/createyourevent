package org.createyourevent.app.web.rest;

import org.createyourevent.app.domain.Address;
import org.createyourevent.app.service.AddressExtensionService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;

import org.springframework.web.bind.annotation.*;

/**
 * REST controller for managing {@link org.createyourevent.domain.Address}.
 */
@RestController
@RequestMapping("/api")
public class AddressExtensionResource {

    private final Logger log = LoggerFactory.getLogger(AddressResource.class);


    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final AddressExtensionService addressExtensionService;

    public AddressExtensionResource(AddressExtensionService addressExtensionService) {
        this.addressExtensionService = addressExtensionService;
    }

    @GetMapping("/addresses/{id}/findByLocationId")
    public Address getAddress(@PathVariable Long id) {
        log.debug("REST request to get Address by locationId : {}", id);
        Address address = addressExtensionService.findByLocationId(id);
        return address;
    }
}
