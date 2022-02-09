package org.createyourevent.app.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.createyourevent.app.domain.GiftShoppingCart;
import org.createyourevent.app.repository.GiftShoppingCartRepository;
import org.createyourevent.app.service.GiftShoppingCartService;
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
 * REST controller for managing {@link org.createyourevent.app.domain.GiftShoppingCart}.
 */
@RestController
@RequestMapping("/api")
public class GiftShoppingCartResource {

    private final Logger log = LoggerFactory.getLogger(GiftShoppingCartResource.class);

    private static final String ENTITY_NAME = "giftShoppingCart";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final GiftShoppingCartService giftShoppingCartService;

    private final GiftShoppingCartRepository giftShoppingCartRepository;

    public GiftShoppingCartResource(
        GiftShoppingCartService giftShoppingCartService,
        GiftShoppingCartRepository giftShoppingCartRepository
    ) {
        this.giftShoppingCartService = giftShoppingCartService;
        this.giftShoppingCartRepository = giftShoppingCartRepository;
    }

    /**
     * {@code POST  /gift-shopping-carts} : Create a new giftShoppingCart.
     *
     * @param giftShoppingCart the giftShoppingCart to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new giftShoppingCart, or with status {@code 400 (Bad Request)} if the giftShoppingCart has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/gift-shopping-carts")
    public ResponseEntity<GiftShoppingCart> createGiftShoppingCart(@RequestBody GiftShoppingCart giftShoppingCart)
        throws URISyntaxException {
        log.debug("REST request to save GiftShoppingCart : {}", giftShoppingCart);
        if (giftShoppingCart.getId() != null) {
            throw new BadRequestAlertException("A new giftShoppingCart cannot already have an ID", ENTITY_NAME, "idexists");
        }
        GiftShoppingCart result = giftShoppingCartService.save(giftShoppingCart);
        return ResponseEntity
            .created(new URI("/api/gift-shopping-carts/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /gift-shopping-carts/:id} : Updates an existing giftShoppingCart.
     *
     * @param id the id of the giftShoppingCart to save.
     * @param giftShoppingCart the giftShoppingCart to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated giftShoppingCart,
     * or with status {@code 400 (Bad Request)} if the giftShoppingCart is not valid,
     * or with status {@code 500 (Internal Server Error)} if the giftShoppingCart couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/gift-shopping-carts/{id}")
    public ResponseEntity<GiftShoppingCart> updateGiftShoppingCart(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody GiftShoppingCart giftShoppingCart
    ) throws URISyntaxException {
        log.debug("REST request to update GiftShoppingCart : {}, {}", id, giftShoppingCart);
        if (giftShoppingCart.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, giftShoppingCart.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!giftShoppingCartRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        GiftShoppingCart result = giftShoppingCartService.save(giftShoppingCart);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, giftShoppingCart.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /gift-shopping-carts/:id} : Partial updates given fields of an existing giftShoppingCart, field will ignore if it is null
     *
     * @param id the id of the giftShoppingCart to save.
     * @param giftShoppingCart the giftShoppingCart to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated giftShoppingCart,
     * or with status {@code 400 (Bad Request)} if the giftShoppingCart is not valid,
     * or with status {@code 404 (Not Found)} if the giftShoppingCart is not found,
     * or with status {@code 500 (Internal Server Error)} if the giftShoppingCart couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/gift-shopping-carts/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<GiftShoppingCart> partialUpdateGiftShoppingCart(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody GiftShoppingCart giftShoppingCart
    ) throws URISyntaxException {
        log.debug("REST request to partial update GiftShoppingCart partially : {}, {}", id, giftShoppingCart);
        if (giftShoppingCart.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, giftShoppingCart.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!giftShoppingCartRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<GiftShoppingCart> result = giftShoppingCartService.partialUpdate(giftShoppingCart);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, giftShoppingCart.getId().toString())
        );
    }

    /**
     * {@code GET  /gift-shopping-carts} : get all the giftShoppingCarts.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of giftShoppingCarts in body.
     */
    @GetMapping("/gift-shopping-carts")
    public ResponseEntity<List<GiftShoppingCart>> getAllGiftShoppingCarts(Pageable pageable) {
        log.debug("REST request to get a page of GiftShoppingCarts");
        Page<GiftShoppingCart> page = giftShoppingCartService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /gift-shopping-carts/:id} : get the "id" giftShoppingCart.
     *
     * @param id the id of the giftShoppingCart to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the giftShoppingCart, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/gift-shopping-carts/{id}")
    public ResponseEntity<GiftShoppingCart> getGiftShoppingCart(@PathVariable Long id) {
        log.debug("REST request to get GiftShoppingCart : {}", id);
        Optional<GiftShoppingCart> giftShoppingCart = giftShoppingCartService.findOne(id);
        return ResponseUtil.wrapOrNotFound(giftShoppingCart);
    }

    /**
     * {@code DELETE  /gift-shopping-carts/:id} : delete the "id" giftShoppingCart.
     *
     * @param id the id of the giftShoppingCart to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/gift-shopping-carts/{id}")
    public ResponseEntity<Void> deleteGiftShoppingCart(@PathVariable Long id) {
        log.debug("REST request to delete GiftShoppingCart : {}", id);
        giftShoppingCartService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
