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
import org.createyourevent.app.domain.ProductStarRating;
import org.createyourevent.app.repository.ProductStarRatingRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link ProductStarRatingResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ProductStarRatingResourceIT {

    private static final Integer DEFAULT_STARS = 1;
    private static final Integer UPDATED_STARS = 2;

    private static final ZonedDateTime DEFAULT_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_DATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String DEFAULT_COMMENT = "AAAAAAAAAA";
    private static final String UPDATED_COMMENT = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/product-star-ratings";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ProductStarRatingRepository productStarRatingRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restProductStarRatingMockMvc;

    private ProductStarRating productStarRating;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ProductStarRating createEntity(EntityManager em) {
        ProductStarRating productStarRating = new ProductStarRating().stars(DEFAULT_STARS).date(DEFAULT_DATE).comment(DEFAULT_COMMENT);
        return productStarRating;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ProductStarRating createUpdatedEntity(EntityManager em) {
        ProductStarRating productStarRating = new ProductStarRating().stars(UPDATED_STARS).date(UPDATED_DATE).comment(UPDATED_COMMENT);
        return productStarRating;
    }

    @BeforeEach
    public void initTest() {
        productStarRating = createEntity(em);
    }

    @Test
    @Transactional
    void createProductStarRating() throws Exception {
        int databaseSizeBeforeCreate = productStarRatingRepository.findAll().size();
        // Create the ProductStarRating
        restProductStarRatingMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(productStarRating))
            )
            .andExpect(status().isCreated());

        // Validate the ProductStarRating in the database
        List<ProductStarRating> productStarRatingList = productStarRatingRepository.findAll();
        assertThat(productStarRatingList).hasSize(databaseSizeBeforeCreate + 1);
        ProductStarRating testProductStarRating = productStarRatingList.get(productStarRatingList.size() - 1);
        assertThat(testProductStarRating.getStars()).isEqualTo(DEFAULT_STARS);
        assertThat(testProductStarRating.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testProductStarRating.getComment()).isEqualTo(DEFAULT_COMMENT);
    }

    @Test
    @Transactional
    void createProductStarRatingWithExistingId() throws Exception {
        // Create the ProductStarRating with an existing ID
        productStarRating.setId(1L);

        int databaseSizeBeforeCreate = productStarRatingRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restProductStarRatingMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(productStarRating))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProductStarRating in the database
        List<ProductStarRating> productStarRatingList = productStarRatingRepository.findAll();
        assertThat(productStarRatingList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllProductStarRatings() throws Exception {
        // Initialize the database
        productStarRatingRepository.saveAndFlush(productStarRating);

        // Get all the productStarRatingList
        restProductStarRatingMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(productStarRating.getId().intValue())))
            .andExpect(jsonPath("$.[*].stars").value(hasItem(DEFAULT_STARS)))
            .andExpect(jsonPath("$.[*].date").value(hasItem(sameInstant(DEFAULT_DATE))))
            .andExpect(jsonPath("$.[*].comment").value(hasItem(DEFAULT_COMMENT)));
    }

    @Test
    @Transactional
    void getProductStarRating() throws Exception {
        // Initialize the database
        productStarRatingRepository.saveAndFlush(productStarRating);

        // Get the productStarRating
        restProductStarRatingMockMvc
            .perform(get(ENTITY_API_URL_ID, productStarRating.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(productStarRating.getId().intValue()))
            .andExpect(jsonPath("$.stars").value(DEFAULT_STARS))
            .andExpect(jsonPath("$.date").value(sameInstant(DEFAULT_DATE)))
            .andExpect(jsonPath("$.comment").value(DEFAULT_COMMENT));
    }

    @Test
    @Transactional
    void getNonExistingProductStarRating() throws Exception {
        // Get the productStarRating
        restProductStarRatingMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewProductStarRating() throws Exception {
        // Initialize the database
        productStarRatingRepository.saveAndFlush(productStarRating);

        int databaseSizeBeforeUpdate = productStarRatingRepository.findAll().size();

        // Update the productStarRating
        ProductStarRating updatedProductStarRating = productStarRatingRepository.findById(productStarRating.getId()).get();
        // Disconnect from session so that the updates on updatedProductStarRating are not directly saved in db
        em.detach(updatedProductStarRating);
        updatedProductStarRating.stars(UPDATED_STARS).date(UPDATED_DATE).comment(UPDATED_COMMENT);

        restProductStarRatingMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedProductStarRating.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedProductStarRating))
            )
            .andExpect(status().isOk());

        // Validate the ProductStarRating in the database
        List<ProductStarRating> productStarRatingList = productStarRatingRepository.findAll();
        assertThat(productStarRatingList).hasSize(databaseSizeBeforeUpdate);
        ProductStarRating testProductStarRating = productStarRatingList.get(productStarRatingList.size() - 1);
        assertThat(testProductStarRating.getStars()).isEqualTo(UPDATED_STARS);
        assertThat(testProductStarRating.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testProductStarRating.getComment()).isEqualTo(UPDATED_COMMENT);
    }

    @Test
    @Transactional
    void putNonExistingProductStarRating() throws Exception {
        int databaseSizeBeforeUpdate = productStarRatingRepository.findAll().size();
        productStarRating.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProductStarRatingMockMvc
            .perform(
                put(ENTITY_API_URL_ID, productStarRating.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(productStarRating))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProductStarRating in the database
        List<ProductStarRating> productStarRatingList = productStarRatingRepository.findAll();
        assertThat(productStarRatingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchProductStarRating() throws Exception {
        int databaseSizeBeforeUpdate = productStarRatingRepository.findAll().size();
        productStarRating.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProductStarRatingMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(productStarRating))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProductStarRating in the database
        List<ProductStarRating> productStarRatingList = productStarRatingRepository.findAll();
        assertThat(productStarRatingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamProductStarRating() throws Exception {
        int databaseSizeBeforeUpdate = productStarRatingRepository.findAll().size();
        productStarRating.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProductStarRatingMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(productStarRating))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ProductStarRating in the database
        List<ProductStarRating> productStarRatingList = productStarRatingRepository.findAll();
        assertThat(productStarRatingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateProductStarRatingWithPatch() throws Exception {
        // Initialize the database
        productStarRatingRepository.saveAndFlush(productStarRating);

        int databaseSizeBeforeUpdate = productStarRatingRepository.findAll().size();

        // Update the productStarRating using partial update
        ProductStarRating partialUpdatedProductStarRating = new ProductStarRating();
        partialUpdatedProductStarRating.setId(productStarRating.getId());

        partialUpdatedProductStarRating.stars(UPDATED_STARS).date(UPDATED_DATE).comment(UPDATED_COMMENT);

        restProductStarRatingMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedProductStarRating.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedProductStarRating))
            )
            .andExpect(status().isOk());

        // Validate the ProductStarRating in the database
        List<ProductStarRating> productStarRatingList = productStarRatingRepository.findAll();
        assertThat(productStarRatingList).hasSize(databaseSizeBeforeUpdate);
        ProductStarRating testProductStarRating = productStarRatingList.get(productStarRatingList.size() - 1);
        assertThat(testProductStarRating.getStars()).isEqualTo(UPDATED_STARS);
        assertThat(testProductStarRating.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testProductStarRating.getComment()).isEqualTo(UPDATED_COMMENT);
    }

    @Test
    @Transactional
    void fullUpdateProductStarRatingWithPatch() throws Exception {
        // Initialize the database
        productStarRatingRepository.saveAndFlush(productStarRating);

        int databaseSizeBeforeUpdate = productStarRatingRepository.findAll().size();

        // Update the productStarRating using partial update
        ProductStarRating partialUpdatedProductStarRating = new ProductStarRating();
        partialUpdatedProductStarRating.setId(productStarRating.getId());

        partialUpdatedProductStarRating.stars(UPDATED_STARS).date(UPDATED_DATE).comment(UPDATED_COMMENT);

        restProductStarRatingMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedProductStarRating.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedProductStarRating))
            )
            .andExpect(status().isOk());

        // Validate the ProductStarRating in the database
        List<ProductStarRating> productStarRatingList = productStarRatingRepository.findAll();
        assertThat(productStarRatingList).hasSize(databaseSizeBeforeUpdate);
        ProductStarRating testProductStarRating = productStarRatingList.get(productStarRatingList.size() - 1);
        assertThat(testProductStarRating.getStars()).isEqualTo(UPDATED_STARS);
        assertThat(testProductStarRating.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testProductStarRating.getComment()).isEqualTo(UPDATED_COMMENT);
    }

    @Test
    @Transactional
    void patchNonExistingProductStarRating() throws Exception {
        int databaseSizeBeforeUpdate = productStarRatingRepository.findAll().size();
        productStarRating.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProductStarRatingMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, productStarRating.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(productStarRating))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProductStarRating in the database
        List<ProductStarRating> productStarRatingList = productStarRatingRepository.findAll();
        assertThat(productStarRatingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchProductStarRating() throws Exception {
        int databaseSizeBeforeUpdate = productStarRatingRepository.findAll().size();
        productStarRating.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProductStarRatingMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(productStarRating))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProductStarRating in the database
        List<ProductStarRating> productStarRatingList = productStarRatingRepository.findAll();
        assertThat(productStarRatingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamProductStarRating() throws Exception {
        int databaseSizeBeforeUpdate = productStarRatingRepository.findAll().size();
        productStarRating.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProductStarRatingMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(productStarRating))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ProductStarRating in the database
        List<ProductStarRating> productStarRatingList = productStarRatingRepository.findAll();
        assertThat(productStarRatingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteProductStarRating() throws Exception {
        // Initialize the database
        productStarRatingRepository.saveAndFlush(productStarRating);

        int databaseSizeBeforeDelete = productStarRatingRepository.findAll().size();

        // Delete the productStarRating
        restProductStarRatingMockMvc
            .perform(delete(ENTITY_API_URL_ID, productStarRating.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ProductStarRating> productStarRatingList = productStarRatingRepository.findAll();
        assertThat(productStarRatingList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
