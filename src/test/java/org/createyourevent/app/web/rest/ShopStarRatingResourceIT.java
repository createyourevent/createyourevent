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
import org.createyourevent.app.domain.ShopStarRating;
import org.createyourevent.app.repository.ShopStarRatingRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link ShopStarRatingResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ShopStarRatingResourceIT {

    private static final Integer DEFAULT_STARS = 1;
    private static final Integer UPDATED_STARS = 2;

    private static final ZonedDateTime DEFAULT_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_DATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String DEFAULT_COMMENT = "AAAAAAAAAA";
    private static final String UPDATED_COMMENT = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/shop-star-ratings";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ShopStarRatingRepository shopStarRatingRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restShopStarRatingMockMvc;

    private ShopStarRating shopStarRating;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ShopStarRating createEntity(EntityManager em) {
        ShopStarRating shopStarRating = new ShopStarRating().stars(DEFAULT_STARS).date(DEFAULT_DATE).comment(DEFAULT_COMMENT);
        return shopStarRating;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ShopStarRating createUpdatedEntity(EntityManager em) {
        ShopStarRating shopStarRating = new ShopStarRating().stars(UPDATED_STARS).date(UPDATED_DATE).comment(UPDATED_COMMENT);
        return shopStarRating;
    }

    @BeforeEach
    public void initTest() {
        shopStarRating = createEntity(em);
    }

    @Test
    @Transactional
    void createShopStarRating() throws Exception {
        int databaseSizeBeforeCreate = shopStarRatingRepository.findAll().size();
        // Create the ShopStarRating
        restShopStarRatingMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(shopStarRating))
            )
            .andExpect(status().isCreated());

        // Validate the ShopStarRating in the database
        List<ShopStarRating> shopStarRatingList = shopStarRatingRepository.findAll();
        assertThat(shopStarRatingList).hasSize(databaseSizeBeforeCreate + 1);
        ShopStarRating testShopStarRating = shopStarRatingList.get(shopStarRatingList.size() - 1);
        assertThat(testShopStarRating.getStars()).isEqualTo(DEFAULT_STARS);
        assertThat(testShopStarRating.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testShopStarRating.getComment()).isEqualTo(DEFAULT_COMMENT);
    }

    @Test
    @Transactional
    void createShopStarRatingWithExistingId() throws Exception {
        // Create the ShopStarRating with an existing ID
        shopStarRating.setId(1L);

        int databaseSizeBeforeCreate = shopStarRatingRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restShopStarRatingMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(shopStarRating))
            )
            .andExpect(status().isBadRequest());

        // Validate the ShopStarRating in the database
        List<ShopStarRating> shopStarRatingList = shopStarRatingRepository.findAll();
        assertThat(shopStarRatingList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllShopStarRatings() throws Exception {
        // Initialize the database
        shopStarRatingRepository.saveAndFlush(shopStarRating);

        // Get all the shopStarRatingList
        restShopStarRatingMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(shopStarRating.getId().intValue())))
            .andExpect(jsonPath("$.[*].stars").value(hasItem(DEFAULT_STARS)))
            .andExpect(jsonPath("$.[*].date").value(hasItem(sameInstant(DEFAULT_DATE))))
            .andExpect(jsonPath("$.[*].comment").value(hasItem(DEFAULT_COMMENT)));
    }

    @Test
    @Transactional
    void getShopStarRating() throws Exception {
        // Initialize the database
        shopStarRatingRepository.saveAndFlush(shopStarRating);

        // Get the shopStarRating
        restShopStarRatingMockMvc
            .perform(get(ENTITY_API_URL_ID, shopStarRating.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(shopStarRating.getId().intValue()))
            .andExpect(jsonPath("$.stars").value(DEFAULT_STARS))
            .andExpect(jsonPath("$.date").value(sameInstant(DEFAULT_DATE)))
            .andExpect(jsonPath("$.comment").value(DEFAULT_COMMENT));
    }

    @Test
    @Transactional
    void getNonExistingShopStarRating() throws Exception {
        // Get the shopStarRating
        restShopStarRatingMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewShopStarRating() throws Exception {
        // Initialize the database
        shopStarRatingRepository.saveAndFlush(shopStarRating);

        int databaseSizeBeforeUpdate = shopStarRatingRepository.findAll().size();

        // Update the shopStarRating
        ShopStarRating updatedShopStarRating = shopStarRatingRepository.findById(shopStarRating.getId()).get();
        // Disconnect from session so that the updates on updatedShopStarRating are not directly saved in db
        em.detach(updatedShopStarRating);
        updatedShopStarRating.stars(UPDATED_STARS).date(UPDATED_DATE).comment(UPDATED_COMMENT);

        restShopStarRatingMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedShopStarRating.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedShopStarRating))
            )
            .andExpect(status().isOk());

        // Validate the ShopStarRating in the database
        List<ShopStarRating> shopStarRatingList = shopStarRatingRepository.findAll();
        assertThat(shopStarRatingList).hasSize(databaseSizeBeforeUpdate);
        ShopStarRating testShopStarRating = shopStarRatingList.get(shopStarRatingList.size() - 1);
        assertThat(testShopStarRating.getStars()).isEqualTo(UPDATED_STARS);
        assertThat(testShopStarRating.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testShopStarRating.getComment()).isEqualTo(UPDATED_COMMENT);
    }

    @Test
    @Transactional
    void putNonExistingShopStarRating() throws Exception {
        int databaseSizeBeforeUpdate = shopStarRatingRepository.findAll().size();
        shopStarRating.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restShopStarRatingMockMvc
            .perform(
                put(ENTITY_API_URL_ID, shopStarRating.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(shopStarRating))
            )
            .andExpect(status().isBadRequest());

        // Validate the ShopStarRating in the database
        List<ShopStarRating> shopStarRatingList = shopStarRatingRepository.findAll();
        assertThat(shopStarRatingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchShopStarRating() throws Exception {
        int databaseSizeBeforeUpdate = shopStarRatingRepository.findAll().size();
        shopStarRating.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restShopStarRatingMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(shopStarRating))
            )
            .andExpect(status().isBadRequest());

        // Validate the ShopStarRating in the database
        List<ShopStarRating> shopStarRatingList = shopStarRatingRepository.findAll();
        assertThat(shopStarRatingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamShopStarRating() throws Exception {
        int databaseSizeBeforeUpdate = shopStarRatingRepository.findAll().size();
        shopStarRating.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restShopStarRatingMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(shopStarRating))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ShopStarRating in the database
        List<ShopStarRating> shopStarRatingList = shopStarRatingRepository.findAll();
        assertThat(shopStarRatingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateShopStarRatingWithPatch() throws Exception {
        // Initialize the database
        shopStarRatingRepository.saveAndFlush(shopStarRating);

        int databaseSizeBeforeUpdate = shopStarRatingRepository.findAll().size();

        // Update the shopStarRating using partial update
        ShopStarRating partialUpdatedShopStarRating = new ShopStarRating();
        partialUpdatedShopStarRating.setId(shopStarRating.getId());

        partialUpdatedShopStarRating.stars(UPDATED_STARS);

        restShopStarRatingMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedShopStarRating.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedShopStarRating))
            )
            .andExpect(status().isOk());

        // Validate the ShopStarRating in the database
        List<ShopStarRating> shopStarRatingList = shopStarRatingRepository.findAll();
        assertThat(shopStarRatingList).hasSize(databaseSizeBeforeUpdate);
        ShopStarRating testShopStarRating = shopStarRatingList.get(shopStarRatingList.size() - 1);
        assertThat(testShopStarRating.getStars()).isEqualTo(UPDATED_STARS);
        assertThat(testShopStarRating.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testShopStarRating.getComment()).isEqualTo(DEFAULT_COMMENT);
    }

    @Test
    @Transactional
    void fullUpdateShopStarRatingWithPatch() throws Exception {
        // Initialize the database
        shopStarRatingRepository.saveAndFlush(shopStarRating);

        int databaseSizeBeforeUpdate = shopStarRatingRepository.findAll().size();

        // Update the shopStarRating using partial update
        ShopStarRating partialUpdatedShopStarRating = new ShopStarRating();
        partialUpdatedShopStarRating.setId(shopStarRating.getId());

        partialUpdatedShopStarRating.stars(UPDATED_STARS).date(UPDATED_DATE).comment(UPDATED_COMMENT);

        restShopStarRatingMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedShopStarRating.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedShopStarRating))
            )
            .andExpect(status().isOk());

        // Validate the ShopStarRating in the database
        List<ShopStarRating> shopStarRatingList = shopStarRatingRepository.findAll();
        assertThat(shopStarRatingList).hasSize(databaseSizeBeforeUpdate);
        ShopStarRating testShopStarRating = shopStarRatingList.get(shopStarRatingList.size() - 1);
        assertThat(testShopStarRating.getStars()).isEqualTo(UPDATED_STARS);
        assertThat(testShopStarRating.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testShopStarRating.getComment()).isEqualTo(UPDATED_COMMENT);
    }

    @Test
    @Transactional
    void patchNonExistingShopStarRating() throws Exception {
        int databaseSizeBeforeUpdate = shopStarRatingRepository.findAll().size();
        shopStarRating.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restShopStarRatingMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, shopStarRating.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(shopStarRating))
            )
            .andExpect(status().isBadRequest());

        // Validate the ShopStarRating in the database
        List<ShopStarRating> shopStarRatingList = shopStarRatingRepository.findAll();
        assertThat(shopStarRatingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchShopStarRating() throws Exception {
        int databaseSizeBeforeUpdate = shopStarRatingRepository.findAll().size();
        shopStarRating.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restShopStarRatingMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(shopStarRating))
            )
            .andExpect(status().isBadRequest());

        // Validate the ShopStarRating in the database
        List<ShopStarRating> shopStarRatingList = shopStarRatingRepository.findAll();
        assertThat(shopStarRatingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamShopStarRating() throws Exception {
        int databaseSizeBeforeUpdate = shopStarRatingRepository.findAll().size();
        shopStarRating.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restShopStarRatingMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(shopStarRating))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ShopStarRating in the database
        List<ShopStarRating> shopStarRatingList = shopStarRatingRepository.findAll();
        assertThat(shopStarRatingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteShopStarRating() throws Exception {
        // Initialize the database
        shopStarRatingRepository.saveAndFlush(shopStarRating);

        int databaseSizeBeforeDelete = shopStarRatingRepository.findAll().size();

        // Delete the shopStarRating
        restShopStarRatingMockMvc
            .perform(delete(ENTITY_API_URL_ID, shopStarRating.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ShopStarRating> shopStarRatingList = shopStarRatingRepository.findAll();
        assertThat(shopStarRatingList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
