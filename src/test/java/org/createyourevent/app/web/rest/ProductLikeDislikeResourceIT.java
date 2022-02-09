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
import org.createyourevent.app.domain.ProductLikeDislike;
import org.createyourevent.app.repository.ProductLikeDislikeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link ProductLikeDislikeResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ProductLikeDislikeResourceIT {

    private static final Integer DEFAULT_LIKE = 1;
    private static final Integer UPDATED_LIKE = 2;

    private static final Integer DEFAULT_DISLIKE = 1;
    private static final Integer UPDATED_DISLIKE = 2;

    private static final ZonedDateTime DEFAULT_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_DATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String DEFAULT_COMMENT = "AAAAAAAAAA";
    private static final String UPDATED_COMMENT = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/product-like-dislikes";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ProductLikeDislikeRepository productLikeDislikeRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restProductLikeDislikeMockMvc;

    private ProductLikeDislike productLikeDislike;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ProductLikeDislike createEntity(EntityManager em) {
        ProductLikeDislike productLikeDislike = new ProductLikeDislike()
            .like(DEFAULT_LIKE)
            .dislike(DEFAULT_DISLIKE)
            .date(DEFAULT_DATE)
            .comment(DEFAULT_COMMENT);
        return productLikeDislike;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ProductLikeDislike createUpdatedEntity(EntityManager em) {
        ProductLikeDislike productLikeDislike = new ProductLikeDislike()
            .like(UPDATED_LIKE)
            .dislike(UPDATED_DISLIKE)
            .date(UPDATED_DATE)
            .comment(UPDATED_COMMENT);
        return productLikeDislike;
    }

    @BeforeEach
    public void initTest() {
        productLikeDislike = createEntity(em);
    }

    @Test
    @Transactional
    void createProductLikeDislike() throws Exception {
        int databaseSizeBeforeCreate = productLikeDislikeRepository.findAll().size();
        // Create the ProductLikeDislike
        restProductLikeDislikeMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(productLikeDislike))
            )
            .andExpect(status().isCreated());

        // Validate the ProductLikeDislike in the database
        List<ProductLikeDislike> productLikeDislikeList = productLikeDislikeRepository.findAll();
        assertThat(productLikeDislikeList).hasSize(databaseSizeBeforeCreate + 1);
        ProductLikeDislike testProductLikeDislike = productLikeDislikeList.get(productLikeDislikeList.size() - 1);
        assertThat(testProductLikeDislike.getLike()).isEqualTo(DEFAULT_LIKE);
        assertThat(testProductLikeDislike.getDislike()).isEqualTo(DEFAULT_DISLIKE);
        assertThat(testProductLikeDislike.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testProductLikeDislike.getComment()).isEqualTo(DEFAULT_COMMENT);
    }

    @Test
    @Transactional
    void createProductLikeDislikeWithExistingId() throws Exception {
        // Create the ProductLikeDislike with an existing ID
        productLikeDislike.setId(1L);

        int databaseSizeBeforeCreate = productLikeDislikeRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restProductLikeDislikeMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(productLikeDislike))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProductLikeDislike in the database
        List<ProductLikeDislike> productLikeDislikeList = productLikeDislikeRepository.findAll();
        assertThat(productLikeDislikeList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllProductLikeDislikes() throws Exception {
        // Initialize the database
        productLikeDislikeRepository.saveAndFlush(productLikeDislike);

        // Get all the productLikeDislikeList
        restProductLikeDislikeMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(productLikeDislike.getId().intValue())))
            .andExpect(jsonPath("$.[*].like").value(hasItem(DEFAULT_LIKE)))
            .andExpect(jsonPath("$.[*].dislike").value(hasItem(DEFAULT_DISLIKE)))
            .andExpect(jsonPath("$.[*].date").value(hasItem(sameInstant(DEFAULT_DATE))))
            .andExpect(jsonPath("$.[*].comment").value(hasItem(DEFAULT_COMMENT)));
    }

    @Test
    @Transactional
    void getProductLikeDislike() throws Exception {
        // Initialize the database
        productLikeDislikeRepository.saveAndFlush(productLikeDislike);

        // Get the productLikeDislike
        restProductLikeDislikeMockMvc
            .perform(get(ENTITY_API_URL_ID, productLikeDislike.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(productLikeDislike.getId().intValue()))
            .andExpect(jsonPath("$.like").value(DEFAULT_LIKE))
            .andExpect(jsonPath("$.dislike").value(DEFAULT_DISLIKE))
            .andExpect(jsonPath("$.date").value(sameInstant(DEFAULT_DATE)))
            .andExpect(jsonPath("$.comment").value(DEFAULT_COMMENT));
    }

    @Test
    @Transactional
    void getNonExistingProductLikeDislike() throws Exception {
        // Get the productLikeDislike
        restProductLikeDislikeMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewProductLikeDislike() throws Exception {
        // Initialize the database
        productLikeDislikeRepository.saveAndFlush(productLikeDislike);

        int databaseSizeBeforeUpdate = productLikeDislikeRepository.findAll().size();

        // Update the productLikeDislike
        ProductLikeDislike updatedProductLikeDislike = productLikeDislikeRepository.findById(productLikeDislike.getId()).get();
        // Disconnect from session so that the updates on updatedProductLikeDislike are not directly saved in db
        em.detach(updatedProductLikeDislike);
        updatedProductLikeDislike.like(UPDATED_LIKE).dislike(UPDATED_DISLIKE).date(UPDATED_DATE).comment(UPDATED_COMMENT);

        restProductLikeDislikeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedProductLikeDislike.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedProductLikeDislike))
            )
            .andExpect(status().isOk());

        // Validate the ProductLikeDislike in the database
        List<ProductLikeDislike> productLikeDislikeList = productLikeDislikeRepository.findAll();
        assertThat(productLikeDislikeList).hasSize(databaseSizeBeforeUpdate);
        ProductLikeDislike testProductLikeDislike = productLikeDislikeList.get(productLikeDislikeList.size() - 1);
        assertThat(testProductLikeDislike.getLike()).isEqualTo(UPDATED_LIKE);
        assertThat(testProductLikeDislike.getDislike()).isEqualTo(UPDATED_DISLIKE);
        assertThat(testProductLikeDislike.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testProductLikeDislike.getComment()).isEqualTo(UPDATED_COMMENT);
    }

    @Test
    @Transactional
    void putNonExistingProductLikeDislike() throws Exception {
        int databaseSizeBeforeUpdate = productLikeDislikeRepository.findAll().size();
        productLikeDislike.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProductLikeDislikeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, productLikeDislike.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(productLikeDislike))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProductLikeDislike in the database
        List<ProductLikeDislike> productLikeDislikeList = productLikeDislikeRepository.findAll();
        assertThat(productLikeDislikeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchProductLikeDislike() throws Exception {
        int databaseSizeBeforeUpdate = productLikeDislikeRepository.findAll().size();
        productLikeDislike.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProductLikeDislikeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(productLikeDislike))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProductLikeDislike in the database
        List<ProductLikeDislike> productLikeDislikeList = productLikeDislikeRepository.findAll();
        assertThat(productLikeDislikeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamProductLikeDislike() throws Exception {
        int databaseSizeBeforeUpdate = productLikeDislikeRepository.findAll().size();
        productLikeDislike.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProductLikeDislikeMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(productLikeDislike))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ProductLikeDislike in the database
        List<ProductLikeDislike> productLikeDislikeList = productLikeDislikeRepository.findAll();
        assertThat(productLikeDislikeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateProductLikeDislikeWithPatch() throws Exception {
        // Initialize the database
        productLikeDislikeRepository.saveAndFlush(productLikeDislike);

        int databaseSizeBeforeUpdate = productLikeDislikeRepository.findAll().size();

        // Update the productLikeDislike using partial update
        ProductLikeDislike partialUpdatedProductLikeDislike = new ProductLikeDislike();
        partialUpdatedProductLikeDislike.setId(productLikeDislike.getId());

        partialUpdatedProductLikeDislike.like(UPDATED_LIKE).dislike(UPDATED_DISLIKE);

        restProductLikeDislikeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedProductLikeDislike.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedProductLikeDislike))
            )
            .andExpect(status().isOk());

        // Validate the ProductLikeDislike in the database
        List<ProductLikeDislike> productLikeDislikeList = productLikeDislikeRepository.findAll();
        assertThat(productLikeDislikeList).hasSize(databaseSizeBeforeUpdate);
        ProductLikeDislike testProductLikeDislike = productLikeDislikeList.get(productLikeDislikeList.size() - 1);
        assertThat(testProductLikeDislike.getLike()).isEqualTo(UPDATED_LIKE);
        assertThat(testProductLikeDislike.getDislike()).isEqualTo(UPDATED_DISLIKE);
        assertThat(testProductLikeDislike.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testProductLikeDislike.getComment()).isEqualTo(DEFAULT_COMMENT);
    }

    @Test
    @Transactional
    void fullUpdateProductLikeDislikeWithPatch() throws Exception {
        // Initialize the database
        productLikeDislikeRepository.saveAndFlush(productLikeDislike);

        int databaseSizeBeforeUpdate = productLikeDislikeRepository.findAll().size();

        // Update the productLikeDislike using partial update
        ProductLikeDislike partialUpdatedProductLikeDislike = new ProductLikeDislike();
        partialUpdatedProductLikeDislike.setId(productLikeDislike.getId());

        partialUpdatedProductLikeDislike.like(UPDATED_LIKE).dislike(UPDATED_DISLIKE).date(UPDATED_DATE).comment(UPDATED_COMMENT);

        restProductLikeDislikeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedProductLikeDislike.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedProductLikeDislike))
            )
            .andExpect(status().isOk());

        // Validate the ProductLikeDislike in the database
        List<ProductLikeDislike> productLikeDislikeList = productLikeDislikeRepository.findAll();
        assertThat(productLikeDislikeList).hasSize(databaseSizeBeforeUpdate);
        ProductLikeDislike testProductLikeDislike = productLikeDislikeList.get(productLikeDislikeList.size() - 1);
        assertThat(testProductLikeDislike.getLike()).isEqualTo(UPDATED_LIKE);
        assertThat(testProductLikeDislike.getDislike()).isEqualTo(UPDATED_DISLIKE);
        assertThat(testProductLikeDislike.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testProductLikeDislike.getComment()).isEqualTo(UPDATED_COMMENT);
    }

    @Test
    @Transactional
    void patchNonExistingProductLikeDislike() throws Exception {
        int databaseSizeBeforeUpdate = productLikeDislikeRepository.findAll().size();
        productLikeDislike.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProductLikeDislikeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, productLikeDislike.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(productLikeDislike))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProductLikeDislike in the database
        List<ProductLikeDislike> productLikeDislikeList = productLikeDislikeRepository.findAll();
        assertThat(productLikeDislikeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchProductLikeDislike() throws Exception {
        int databaseSizeBeforeUpdate = productLikeDislikeRepository.findAll().size();
        productLikeDislike.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProductLikeDislikeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(productLikeDislike))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProductLikeDislike in the database
        List<ProductLikeDislike> productLikeDislikeList = productLikeDislikeRepository.findAll();
        assertThat(productLikeDislikeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamProductLikeDislike() throws Exception {
        int databaseSizeBeforeUpdate = productLikeDislikeRepository.findAll().size();
        productLikeDislike.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProductLikeDislikeMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(productLikeDislike))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ProductLikeDislike in the database
        List<ProductLikeDislike> productLikeDislikeList = productLikeDislikeRepository.findAll();
        assertThat(productLikeDislikeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteProductLikeDislike() throws Exception {
        // Initialize the database
        productLikeDislikeRepository.saveAndFlush(productLikeDislike);

        int databaseSizeBeforeDelete = productLikeDislikeRepository.findAll().size();

        // Delete the productLikeDislike
        restProductLikeDislikeMockMvc
            .perform(delete(ENTITY_API_URL_ID, productLikeDislike.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ProductLikeDislike> productLikeDislikeList = productLikeDislikeRepository.findAll();
        assertThat(productLikeDislikeList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
