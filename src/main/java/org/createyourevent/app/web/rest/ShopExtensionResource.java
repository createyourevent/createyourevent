package org.createyourevent.app.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

import javax.validation.Valid;

import org.createyourevent.app.domain.Shop;
import org.createyourevent.app.domain.User;
import org.createyourevent.app.domain.enumeration.ProductType;
import org.createyourevent.app.service.ShopExtensionService;
import org.createyourevent.app.service.ShopService;
import org.createyourevent.app.service.UserService;
import org.createyourevent.app.web.rest.errors.BadRequestAlertException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import tech.jhipster.web.util.HeaderUtil;

@RestController
@RequestMapping("/api")
public class ShopExtensionResource {

    private final Logger log = LoggerFactory.getLogger(ShopExtensionResource.class);

    private static final String ENTITY_NAME = "shop";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ShopService shopService;

    private final UserService userService;

    private final ShopExtensionService shopExtensionService;

    public ShopExtensionResource(ShopService shopService, UserService userService, ShopExtensionService shopExtensionService) {
        this.shopService = shopService;
        this.userService = userService;
        this.shopExtensionService = shopExtensionService;
    }

    /**
     * {@code GET  /shops/:userId/active} : get the "userId" shop with active=true.
     *
     * @param userId the userId of the shop to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the shops, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/shops/user/active")
    public List<Shop> getShopsFromUserAndActiveShop() {
        log.debug("REST request to get Shop from user and active");
        List<Shop> shops = shopExtensionService.findByCurrentUser();
        return shops;
    }

    @GetMapping("/shops/{userId}/active")
    public List<Shop> getShopsFromUserIdAndActiveShop(@PathVariable String userId) {
        log.debug("REST request to get Shop from user and active");
        List<Shop> shops = shopExtensionService.findByUserIdAndActiveTrue(userId);
        return shops;
    }

       /**
     * {@code POST  /shops} : Create a new shop.
     *
     * @param shop the shop to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new shop, or with status {@code 400 (Bad Request)} if the shop has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/shops/user")
    public ResponseEntity<Shop> createShop(@Valid @RequestBody Shop shop) throws URISyntaxException {
        log.debug("REST request to save Shop : {}", shop);
        final Optional<User> isUser = userService.getUserWithAuthorities();
        if(!isUser.isPresent()) {
        log.error("User is not logged in");
        }
        final User user = isUser.get();
        shop.setUser(user);
        if (shop.getId() != null) {
            throw new BadRequestAlertException("A new shop cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Shop result = shopService.save(shop);
        return ResponseEntity.created(new URI("/api/shops/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

        /**
     * {@code GET  /shops/user/current} : get the "userId" shop with active=true.
     *
     * @param userId the userId of the shop to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the shops, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/shops/user/current")
    public List<Shop> getShopsFromActiveUser() {
        log.debug("REST request to get Shop from active user");
        List<Shop> shops = shopExtensionService.findByCurrentUser();
        return shops;
    }

    @GetMapping("/shops/{type}/producttype")
    public List<Shop> getShopsWithProductTypeAndActive(@PathVariable ProductType type) {
        log.debug("REST request to get Shop with product type");
        List<Shop> shops = shopExtensionService.findByProductTypeAndActiveTrue(type);
        return shops;
    }

    @GetMapping("/shops/active")
    public List<Shop> getShopsWithActiveTrue() {
        log.debug("REST request to get Shop with active=true");
        List<Shop> shops = shopExtensionService.findByActiveTrue();
        return shops;
    }

    @GetMapping("/shops/active/activeOwner")
    public List<Shop> getShopsWithActiveTrueAndActiveOwnerTrue() {
        log.debug("REST request to get Shop with active=true");
        List<Shop> shops = shopExtensionService.findByActiveTrueAndActiveOwnerTrue();
        return shops;
    }

}
