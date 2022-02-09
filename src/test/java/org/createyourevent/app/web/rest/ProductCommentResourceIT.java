package org.createyourevent.app.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.createyourevent.app.web.rest.TestUtil.sameInstant;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.createyourevent.app.IntegrationTest;
import org.createyourevent.app.domain.ProductComment;
import org.createyourevent.app.repository.ProductCommentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link ProductCommentResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ProductCommentResourceIT {

    private static final String DEFAULT_COMMENT = "AAAAAAAAAA";
    private static final String UPDATED_COMMENT = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_DATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String ENTITY_API_URL = "/api/product-comments";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ProductCommentRepository productCommentRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restProductCommentMockMvc;

    private ProductComment productComment;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ProductComment createEntity(EntityManager em) {
        ProductComment productComment = new ProductComment().comment(DEFAULT_COMMENT).date(DEFAULT_DATE);
        return productComment;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ProductComment createUpdatedEntity(EntityManager em) {
        ProductComment productComment = new ProductComment().comment(UPDATED_COMMENT).date(UPDATED_DATE);
        return productComment;
    }

    @BeforeEach
    public void initTest() {
        productComment = createEntity(em);
    }

    @Test
    @Transactional
    void createProductComment() throws Exception {
        int databaseSizeBeforeCreate = productCommentRepository.findAll().size();
        // Create the ProductComment
        restProductCommentMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(productComment))
            )
            .andExpect(status().isCreated());

        // Validate the ProductComment in the database
        List<ProductComment> productCommentList = productCommentRepository.findAll();
        assertThat(productCommentList).hasSize(databaseSizeBeforeCreate + 1);
        ProductComment testProductComment = productCommentList.get(productCommentList.size() - 1);
        assertThat(testProductComment.getComment()).isEqualTo(DEFAULT_COMMENT);
        assertThat(testProductComment.getDate()).isEqualTo(DEFAULT_DATE);
    }

    @Test
    @Transactional
    void createProductCommentWithExistingId() throws Exception {
        // Create the ProductComment with an existing ID
        productComment.setId(1L);

        int databaseSizeBeforeCreate = productCommentRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restProductCommentMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(productComment))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProductComment in the database
        List<ProductComment> productCommentList = productCommentRepository.findAll();
        assertThat(productCommentList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllProductComments() throws Exception {
        // Initialize the database
        productCommentRepository.saveAndFlush(productComment);

        // Get all the productCommentList
        restProductCommentMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(productComment.getId().intValue())))
            .andExpect(jsonPath("$.[*].comment").value(hasItem(DEFAULT_COMMENT)))
            .andExpect(jsonPath("$.[*].date").value(hasItem(sameInstant(DEFAULT_DATE))));
    }

    @Test
    @Transactional
    void getProductComment() throws Exception {
        // Initialize the database
        productCommentRepository.saveAndFlush(productComment);

        // Get the productComment
        restProductCommentMockMvc
            .perform(get(ENTITY_API_URL_ID, productComment.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(productComment.getId().intValue()))
            .andExpect(jsonPath("$.comment").value(DEFAULT_COMMENT))
            .andExpect(jsonPath("$.date").value(sameInstant(DEFAULT_DATE)));
    }

    @Test
    @Transactional
    void getNonExistingProductComment() throws Exception {
        // Get the productComment
        restProductCommentMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewProductComment() throws Exception {
        // Initialize the database
        productCommentRepository.saveAndFlush(productComment);

        int databaseSizeBeforeUpdate = productCommentRepository.findAll().size();

        // Update the productComment
        ProductComment updatedProductComment = productCommentRepository.findById(productComment.getId()).get();
        // Disconnect from session so that the updates on updatedProductComment are not directly saved in db
        em.detach(updatedProductComment);
        updatedProductComment.comment(UPDATED_COMMENT).date(UPDATED_DATE);

        restProductCommentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedProductComment.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedProductComment))
            )
            .andExpect(status().isOk());

        // Validate the ProductComment in the database
        List<ProductComment> productCommentList = productCommentRepository.findAll();
        assertThat(productCommentList).hasSize(databaseSizeBeforeUpdate);
        ProductComment testProductComment = productCommentList.get(productCommentList.size() - 1);
        assertThat(testProductComment.getComment()).isEqualTo(UPDATED_COMMENT);
        assertThat(testProductComment.getDate()).isEqualTo(UPDATED_DATE);
    }

    @Test
    @Transactional
    void putNonExistingProductComment() throws Exception {
        int databaseSizeBeforeUpdate = productCommentRepository.findAll().size();
        productComment.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProductCommentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, productComment.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(productComment))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProductComment in the database
        List<ProductComment> productCommentList = productCommentRepository.findAll();
        assertThat(productCommentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchProductComment() throws Exception {
        int databaseSizeBeforeUpdate = productCommentRepository.findAll().size();
        productComment.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProductCommentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(productComment))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProductComment in the database
        List<ProductComment> productCommentList = productCommentRepository.findAll();
        assertThat(productCommentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamProductComment() throws Exception {
        int databaseSizeBeforeUpdate = productCommentRepository.findAll().size();
        productComment.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProductCommentMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(productComment))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ProductComment in the database
        List<ProductComment> productCommentList = productCommentRepository.findAll();
        assertThat(productCommentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateProductCommentWithPatch() throws Exception {
        // Initialize the database
        productCommentRepository.saveAndFlush(productComment);

        int databaseSizeBeforeUpdate = productCommentRepository.findAll().size();

        // Update the productComment using partial update
        ProductComment partialUpdatedProductComment = new ProductComment();
        partialUpdatedProductComment.setId(productComment.getId());

        partialUpdatedProductComment.date(UPDATED_DATE);

        restProductCommentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedProductComment.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedProductComment))
            )
            .andExpect(status().isOk());

        // Validate the ProductComment in the database
        List<ProductComment> productCommentList = productCommentRepository.findAll();
        assertThat(productCommentList).hasSize(databaseSizeBeforeUpdate);
        ProductComment testProductComment = productCommentList.get(productCommentList.size() - 1);
        assertThat(testProductComment.getComment()).isEqualTo(DEFAULT_COMMENT);
        assertThat(testProductComment.getDate()).isEqualTo(UPDATED_DATE);
    }

    @Test
    @Transactional
    void fullUpdateProductCommentWithPatch() throws Exception {
        // Initialize the database
        productCommentRepository.saveAndFlush(productComment);

        int databaseSizeBeforeUpdate = productCommentRepository.findAll().size();

        // Update the productComment using partial update
        ProductComment partialUpdatedProductComment = new ProductComment();
        partialUpdatedProductComment.setId(productComment.getId());

        partialUpdatedProductComment.comment(UPDATED_COMMENT).date(UPDATED_DATE);

        restProductCommentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedProductComment.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedProductComment))
            )
            .andExpect(status().isOk());

        // Validate the ProductComment in the database
        List<ProductComment> productCommentList = productCommentRepository.findAll();
        assertThat(productCommentList).hasSize(databaseSizeBeforeUpdate);
        ProductComment testProductComment = productCommentList.get(productCommentList.size() - 1);
        assertThat(testProductComment.getComment()).isEqualTo(UPDATED_COMMENT);
        assertThat(testProductComment.getDate()).isEqualTo(UPDATED_DATE);
    }

    @Test
    @Transactional
    void patchNonExistingProductComment() throws Exception {
        int databaseSizeBeforeUpdate = productCommentRepository.findAll().size();
        productComment.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProductCommentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, productComment.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(productComment))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProductComment in the database
        List<ProductComment> productCommentList = productCommentRepository.findAll();
        assertThat(productCommentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchProductComment() throws Exception {
        int databaseSizeBeforeUpdate = productCommentRepository.findAll().size();
        productComment.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProductCommentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(productComment))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProductComment in the database
        List<ProductComment> productCommentList = productCommentRepository.findAll();
        assertThat(productCommentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamProductComment() throws Exception {
        int databaseSizeBeforeUpdate = productCommentRepository.findAll().size();
        productComment.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProductCommentMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(productComment))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ProductComment in the database
        List<ProductComment> productCommentList = productCommentRepository.findAll();
        assertThat(productCommentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteProductComment() throws Exception {
        // Initialize the database
        productCommentRepository.saveAndFlush(productComment);

        int databaseSizeBeforeDelete = productCommentRepository.findAll().size();

        // Delete the productComment
        restProductCommentMockMvc
            .perform(delete(ENTITY_API_URL_ID, productComment.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ProductComment> productCommentList = productCommentRepository.findAll();
        assertThat(productCommentList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
