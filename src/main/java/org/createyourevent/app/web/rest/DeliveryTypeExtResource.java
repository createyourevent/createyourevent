package org.createyourevent.app.web.rest;

import org.createyourevent.app.domain.DeliveryType;
import org.createyourevent.app.service.DeliveryTypeExtService;
import org.createyourevent.app.service.DeliveryTypeService;
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
 * REST controller for managing {@link org.createyourevent.domain.DeliveryType}.
 */
@RestController
@RequestMapping("/api")
public class DeliveryTypeExtResource {

    private final Logger log = LoggerFactory.getLogger(DeliveryTypeExtResource.class);

    private static final String ENTITY_NAME = "deliveryType";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final DeliveryTypeExtService deliveryTypeExtService;

    public DeliveryTypeExtResource(DeliveryTypeExtService deliveryTypeExtService) {
        this.deliveryTypeExtService = deliveryTypeExtService;
    }


    /**
     * {@code GET  /product-purchase-types/:id} : get the "id" deliveryType.
     *
     * @param id the id of the deliveryType to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the deliveryType, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/delivery-types/{id}/findDeliveryTypeByProductId")
    public List<DeliveryType> findDeliveryTypeByProductId(@PathVariable Long id) {
        log.debug("REST request to get DeliveryType : {}", id);
        List<DeliveryType> deliveryType = deliveryTypeExtService.findDeliveryTypeByProductId(id);
        return deliveryType;
    }

    @DeleteMapping("/delivery-types/{id}/deleteByProductId")
    public void deleteDeliveryType(@PathVariable Long id) {
        log.debug("REST request to delete DeliveryType by ProductId: {}", id);
        deliveryTypeExtService.deleteDeliveryTypeByProductId(id);
    }
}
