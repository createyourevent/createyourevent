package org.createyourevent.app.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.createyourevent.app.domain.ProductComment;
import org.createyourevent.app.repository.ProductCommentRepository;
import org.createyourevent.app.service.ProductCommentService;
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
 * REST controller for managing {@link org.createyourevent.app.domain.ProductComment}.
 */
@RestController
@RequestMapping("/api")
public class ProductCommentResource {

    private final Logger log = LoggerFactory.getLogger(ProductCommentResource.class);

    private static final String ENTITY_NAME = "productComment";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ProductCommentService productCommentService;

    private final ProductCommentRepository productCommentRepository;

    public ProductCommentResource(ProductCommentService productCommentService, ProductCommentRepository productCommentRepository) {
        this.productCommentService = productCommentService;
        this.productCommentRepository = productCommentRepository;
    }

    /**
     * {@code POST  /product-comments} : Create a new productComment.
     *
     * @param productComment the productComment to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new productComment, or with status {@code 400 (Bad Request)} if the productComment has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/product-comments")
    public ResponseEntity<ProductComment> createProductComment(@RequestBody ProductComment productComment) throws URISyntaxException {
        log.debug("REST request to save ProductComment : {}", productComment);
        if (productComment.getId() != null) {
            throw new BadRequestAlertException("A new productComment cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ProductComment result = productCommentService.save(productComment);
        return ResponseEntity
            .created(new URI("/api/product-comments/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /product-comments/:id} : Updates an existing productComment.
     *
     * @param id the id of the productComment to save.
     * @param productComment the productComment to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated productComment,
     * or with status {@code 400 (Bad Request)} if the productComment is not valid,
     * or with status {@code 500 (Internal Server Error)} if the productComment couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/product-comments/{id}")
    public ResponseEntity<ProductComment> updateProductComment(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ProductComment productComment
    ) throws URISyntaxException {
        log.debug("REST request to update ProductComment : {}, {}", id, productComment);
        if (productComment.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, productComment.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!productCommentRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ProductComment result = productCommentService.save(productComment);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, productComment.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /product-comments/:id} : Partial updates given fields of an existing productComment, field will ignore if it is null
     *
     * @param id the id of the productComment to save.
     * @param productComment the productComment to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated productComment,
     * or with status {@code 400 (Bad Request)} if the productComment is not valid,
     * or with status {@code 404 (Not Found)} if the productComment is not found,
     * or with status {@code 500 (Internal Server Error)} if the productComment couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/product-comments/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ProductComment> partialUpdateProductComment(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ProductComment productComment
    ) throws URISyntaxException {
        log.debug("REST request to partial update ProductComment partially : {}, {}", id, productComment);
        if (productComment.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, productComment.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!productCommentRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ProductComment> result = productCommentService.partialUpdate(productComment);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, productComment.getId().toString())
        );
    }

    /**
     * {@code GET  /product-comments} : get all the productComments.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of productComments in body.
     */
    @GetMapping("/product-comments")
    public ResponseEntity<List<ProductComment>> getAllProductComments(Pageable pageable) {
        log.debug("REST request to get a page of ProductComments");
        Page<ProductComment> page = productCommentService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /product-comments/:id} : get the "id" productComment.
     *
     * @param id the id of the productComment to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the productComment, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/product-comments/{id}")
    public ResponseEntity<ProductComment> getProductComment(@PathVariable Long id) {
        log.debug("REST request to get ProductComment : {}", id);
        Optional<ProductComment> productComment = productCommentService.findOne(id);
        return ResponseUtil.wrapOrNotFound(productComment);
    }

    /**
     * {@code DELETE  /product-comments/:id} : delete the "id" productComment.
     *
     * @param id the id of the productComment to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/product-comments/{id}")
    public ResponseEntity<Void> deleteProductComment(@PathVariable Long id) {
        log.debug("REST request to delete ProductComment : {}", id);
        productCommentService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
