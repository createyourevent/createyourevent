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
import org.createyourevent.app.domain.ShopLikeDislike;
import org.createyourevent.app.repository.ShopLikeDislikeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link ShopLikeDislikeResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ShopLikeDislikeResourceIT {

    private static final Integer DEFAULT_LIKE = 1;
    private static final Integer UPDATED_LIKE = 2;

    private static final Integer DEFAULT_DISLIKE = 1;
    private static final Integer UPDATED_DISLIKE = 2;

    private static final ZonedDateTime DEFAULT_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_DATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String DEFAULT_COMMENT = "AAAAAAAAAA";
    private static final String UPDATED_COMMENT = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/shop-like-dislikes";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ShopLikeDislikeRepository shopLikeDislikeRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restShopLikeDislikeMockMvc;

    private ShopLikeDislike shopLikeDislike;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ShopLikeDislike createEntity(EntityManager em) {
        ShopLikeDislike shopLikeDislike = new ShopLikeDislike()
            .like(DEFAULT_LIKE)
            .dislike(DEFAULT_DISLIKE)
            .date(DEFAULT_DATE)
            .comment(DEFAULT_COMMENT);
        return shopLikeDislike;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ShopLikeDislike createUpdatedEntity(EntityManager em) {
        ShopLikeDislike shopLikeDislike = new ShopLikeDislike()
            .like(UPDATED_LIKE)
            .dislike(UPDATED_DISLIKE)
            .date(UPDATED_DATE)
            .comment(UPDATED_COMMENT);
        return shopLikeDislike;
    }

    @BeforeEach
    public void initTest() {
        shopLikeDislike = createEntity(em);
    }

    @Test
    @Transactional
    void createShopLikeDislike() throws Exception {
        int databaseSizeBeforeCreate = shopLikeDislikeRepository.findAll().size();
        // Create the ShopLikeDislike
        restShopLikeDislikeMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(shopLikeDislike))
            )
            .andExpect(status().isCreated());

        // Validate the ShopLikeDislike in the database
        List<ShopLikeDislike> shopLikeDislikeList = shopLikeDislikeRepository.findAll();
        assertThat(shopLikeDislikeList).hasSize(databaseSizeBeforeCreate + 1);
        ShopLikeDislike testShopLikeDislike = shopLikeDislikeList.get(shopLikeDislikeList.size() - 1);
        assertThat(testShopLikeDislike.getLike()).isEqualTo(DEFAULT_LIKE);
        assertThat(testShopLikeDislike.getDislike()).isEqualTo(DEFAULT_DISLIKE);
        assertThat(testShopLikeDislike.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testShopLikeDislike.getComment()).isEqualTo(DEFAULT_COMMENT);
    }

    @Test
    @Transactional
    void createShopLikeDislikeWithExistingId() throws Exception {
        // Create the ShopLikeDislike with an existing ID
        shopLikeDislike.setId(1L);

        int databaseSizeBeforeCreate = shopLikeDislikeRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restShopLikeDislikeMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(shopLikeDislike))
            )
            .andExpect(status().isBadRequest());

        // Validate the ShopLikeDislike in the database
        List<ShopLikeDislike> shopLikeDislikeList = shopLikeDislikeRepository.findAll();
        assertThat(shopLikeDislikeList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllShopLikeDislikes() throws Exception {
        // Initialize the database
        shopLikeDislikeRepository.saveAndFlush(shopLikeDislike);

        // Get all the shopLikeDislikeList
        restShopLikeDislikeMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(shopLikeDislike.getId().intValue())))
            .andExpect(jsonPath("$.[*].like").value(hasItem(DEFAULT_LIKE)))
            .andExpect(jsonPath("$.[*].dislike").value(hasItem(DEFAULT_DISLIKE)))
            .andExpect(jsonPath("$.[*].date").value(hasItem(sameInstant(DEFAULT_DATE))))
            .andExpect(jsonPath("$.[*].comment").value(hasItem(DEFAULT_COMMENT)));
    }

    @Test
    @Transactional
    void getShopLikeDislike() throws Exception {
        // Initialize the database
        shopLikeDislikeRepository.saveAndFlush(shopLikeDislike);

        // Get the shopLikeDislike
        restShopLikeDislikeMockMvc
            .perform(get(ENTITY_API_URL_ID, shopLikeDislike.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(shopLikeDislike.getId().intValue()))
            .andExpect(jsonPath("$.like").value(DEFAULT_LIKE))
            .andExpect(jsonPath("$.dislike").value(DEFAULT_DISLIKE))
            .andExpect(jsonPath("$.date").value(sameInstant(DEFAULT_DATE)))
            .andExpect(jsonPath("$.comment").value(DEFAULT_COMMENT));
    }

    @Test
    @Transactional
    void getNonExistingShopLikeDislike() throws Exception {
        // Get the shopLikeDislike
        restShopLikeDislikeMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewShopLikeDislike() throws Exception {
        // Initialize the database
        shopLikeDislikeRepository.saveAndFlush(shopLikeDislike);

        int databaseSizeBeforeUpdate = shopLikeDislikeRepository.findAll().size();

        // Update the shopLikeDislike
        ShopLikeDislike updatedShopLikeDislike = shopLikeDislikeRepository.findById(shopLikeDislike.getId()).get();
        // Disconnect from session so that the updates on updatedShopLikeDislike are not directly saved in db
        em.detach(updatedShopLikeDislike);
        updatedShopLikeDislike.like(UPDATED_LIKE).dislike(UPDATED_DISLIKE).date(UPDATED_DATE).comment(UPDATED_COMMENT);

        restShopLikeDislikeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedShopLikeDislike.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedShopLikeDislike))
            )
            .andExpect(status().isOk());

        // Validate the ShopLikeDislike in the database
        List<ShopLikeDislike> shopLikeDislikeList = shopLikeDislikeRepository.findAll();
        assertThat(shopLikeDislikeList).hasSize(databaseSizeBeforeUpdate);
        ShopLikeDislike testShopLikeDislike = shopLikeDislikeList.get(shopLikeDislikeList.size() - 1);
        assertThat(testShopLikeDislike.getLike()).isEqualTo(UPDATED_LIKE);
        assertThat(testShopLikeDislike.getDislike()).isEqualTo(UPDATED_DISLIKE);
        assertThat(testShopLikeDislike.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testShopLikeDislike.getComment()).isEqualTo(UPDATED_COMMENT);
    }

    @Test
    @Transactional
    void putNonExistingShopLikeDislike() throws Exception {
        int databaseSizeBeforeUpdate = shopLikeDislikeRepository.findAll().size();
        shopLikeDislike.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restShopLikeDislikeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, shopLikeDislike.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(shopLikeDislike))
            )
            .andExpect(status().isBadRequest());

        // Validate the ShopLikeDislike in the database
        List<ShopLikeDislike> shopLikeDislikeList = shopLikeDislikeRepository.findAll();
        assertThat(shopLikeDislikeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchShopLikeDislike() throws Exception {
        int databaseSizeBeforeUpdate = shopLikeDislikeRepository.findAll().size();
        shopLikeDislike.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restShopLikeDislikeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(shopLikeDislike))
            )
            .andExpect(status().isBadRequest());

        // Validate the ShopLikeDislike in the database
        List<ShopLikeDislike> shopLikeDislikeList = shopLikeDislikeRepository.findAll();
        assertThat(shopLikeDislikeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamShopLikeDislike() throws Exception {
        int databaseSizeBeforeUpdate = shopLikeDislikeRepository.findAll().size();
        shopLikeDislike.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restShopLikeDislikeMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(shopLikeDislike))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ShopLikeDislike in the database
        List<ShopLikeDislike> shopLikeDislikeList = shopLikeDislikeRepository.findAll();
        assertThat(shopLikeDislikeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateShopLikeDislikeWithPatch() throws Exception {
        // Initialize the database
        shopLikeDislikeRepository.saveAndFlush(shopLikeDislike);

        int databaseSizeBeforeUpdate = shopLikeDislikeRepository.findAll().size();

        // Update the shopLikeDislike using partial update
        ShopLikeDislike partialUpdatedShopLikeDislike = new ShopLikeDislike();
        partialUpdatedShopLikeDislike.setId(shopLikeDislike.getId());

        restShopLikeDislikeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedShopLikeDislike.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedShopLikeDislike))
            )
            .andExpect(status().isOk());

        // Validate the ShopLikeDislike in the database
        List<ShopLikeDislike> shopLikeDislikeList = shopLikeDislikeRepository.findAll();
        assertThat(shopLikeDislikeList).hasSize(databaseSizeBeforeUpdate);
        ShopLikeDislike testShopLikeDislike = shopLikeDislikeList.get(shopLikeDislikeList.size() - 1);
        assertThat(testShopLikeDislike.getLike()).isEqualTo(DEFAULT_LIKE);
        assertThat(testShopLikeDislike.getDislike()).isEqualTo(DEFAULT_DISLIKE);
        assertThat(testShopLikeDislike.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testShopLikeDislike.getComment()).isEqualTo(DEFAULT_COMMENT);
    }

    @Test
    @Transactional
    void fullUpdateShopLikeDislikeWithPatch() throws Exception {
        // Initialize the database
        shopLikeDislikeRepository.saveAndFlush(shopLikeDislike);

        int databaseSizeBeforeUpdate = shopLikeDislikeRepository.findAll().size();

        // Update the shopLikeDislike using partial update
        ShopLikeDislike partialUpdatedShopLikeDislike = new ShopLikeDislike();
        partialUpdatedShopLikeDislike.setId(shopLikeDislike.getId());

        partialUpdatedShopLikeDislike.like(UPDATED_LIKE).dislike(UPDATED_DISLIKE).date(UPDATED_DATE).comment(UPDATED_COMMENT);

        restShopLikeDislikeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedShopLikeDislike.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedShopLikeDislike))
            )
            .andExpect(status().isOk());

        // Validate the ShopLikeDislike in the database
        List<ShopLikeDislike> shopLikeDislikeList = shopLikeDislikeRepository.findAll();
        assertThat(shopLikeDislikeList).hasSize(databaseSizeBeforeUpdate);
        ShopLikeDislike testShopLikeDislike = shopLikeDislikeList.get(shopLikeDislikeList.size() - 1);
        assertThat(testShopLikeDislike.getLike()).isEqualTo(UPDATED_LIKE);
        assertThat(testShopLikeDislike.getDislike()).isEqualTo(UPDATED_DISLIKE);
        assertThat(testShopLikeDislike.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testShopLikeDislike.getComment()).isEqualTo(UPDATED_COMMENT);
    }

    @Test
    @Transactional
    void patchNonExistingShopLikeDislike() throws Exception {
        int databaseSizeBeforeUpdate = shopLikeDislikeRepository.findAll().size();
        shopLikeDislike.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restShopLikeDislikeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, shopLikeDislike.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(shopLikeDislike))
            )
            .andExpect(status().isBadRequest());

        // Validate the ShopLikeDislike in the database
        List<ShopLikeDislike> shopLikeDislikeList = shopLikeDislikeRepository.findAll();
        assertThat(shopLikeDislikeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchShopLikeDislike() throws Exception {
        int databaseSizeBeforeUpdate = shopLikeDislikeRepository.findAll().size();
        shopLikeDislike.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restShopLikeDislikeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(shopLikeDislike))
            )
            .andExpect(status().isBadRequest());

        // Validate the ShopLikeDislike in the database
        List<ShopLikeDislike> shopLikeDislikeList = shopLikeDislikeRepository.findAll();
        assertThat(shopLikeDislikeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamShopLikeDislike() throws Exception {
        int databaseSizeBeforeUpdate = shopLikeDislikeRepository.findAll().size();
        shopLikeDislike.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restShopLikeDislikeMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(shopLikeDislike))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ShopLikeDislike in the database
        List<ShopLikeDislike> shopLikeDislikeList = shopLikeDislikeRepository.findAll();
        assertThat(shopLikeDislikeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteShopLikeDislike() throws Exception {
        // Initialize the database
        shopLikeDislikeRepository.saveAndFlush(shopLikeDislike);

        int databaseSizeBeforeDelete = shopLikeDislikeRepository.findAll().size();

        // Delete the shopLikeDislike
        restShopLikeDislikeMockMvc
            .perform(delete(ENTITY_API_URL_ID, shopLikeDislike.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ShopLikeDislike> shopLikeDislikeList = shopLikeDislikeRepository.findAll();
        assertThat(shopLikeDislikeList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
