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
import org.createyourevent.app.domain.GiftShoppingCart;
import org.createyourevent.app.repository.GiftShoppingCartRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link GiftShoppingCartResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class GiftShoppingCartResourceIT {

    private static final ZonedDateTime DEFAULT_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_DATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final Integer DEFAULT_AMOUNT = 1;
    private static final Integer UPDATED_AMOUNT = 2;

    private static final String ENTITY_API_URL = "/api/gift-shopping-carts";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private GiftShoppingCartRepository giftShoppingCartRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restGiftShoppingCartMockMvc;

    private GiftShoppingCart giftShoppingCart;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static GiftShoppingCart createEntity(EntityManager em) {
        GiftShoppingCart giftShoppingCart = new GiftShoppingCart().date(DEFAULT_DATE).amount(DEFAULT_AMOUNT);
        return giftShoppingCart;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static GiftShoppingCart createUpdatedEntity(EntityManager em) {
        GiftShoppingCart giftShoppingCart = new GiftShoppingCart().date(UPDATED_DATE).amount(UPDATED_AMOUNT);
        return giftShoppingCart;
    }

    @BeforeEach
    public void initTest() {
        giftShoppingCart = createEntity(em);
    }

    @Test
    @Transactional
    void createGiftShoppingCart() throws Exception {
        int databaseSizeBeforeCreate = giftShoppingCartRepository.findAll().size();
        // Create the GiftShoppingCart
        restGiftShoppingCartMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(giftShoppingCart))
            )
            .andExpect(status().isCreated());

        // Validate the GiftShoppingCart in the database
        List<GiftShoppingCart> giftShoppingCartList = giftShoppingCartRepository.findAll();
        assertThat(giftShoppingCartList).hasSize(databaseSizeBeforeCreate + 1);
        GiftShoppingCart testGiftShoppingCart = giftShoppingCartList.get(giftShoppingCartList.size() - 1);
        assertThat(testGiftShoppingCart.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testGiftShoppingCart.getAmount()).isEqualTo(DEFAULT_AMOUNT);
    }

    @Test
    @Transactional
    void createGiftShoppingCartWithExistingId() throws Exception {
        // Create the GiftShoppingCart with an existing ID
        giftShoppingCart.setId(1L);

        int databaseSizeBeforeCreate = giftShoppingCartRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restGiftShoppingCartMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(giftShoppingCart))
            )
            .andExpect(status().isBadRequest());

        // Validate the GiftShoppingCart in the database
        List<GiftShoppingCart> giftShoppingCartList = giftShoppingCartRepository.findAll();
        assertThat(giftShoppingCartList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllGiftShoppingCarts() throws Exception {
        // Initialize the database
        giftShoppingCartRepository.saveAndFlush(giftShoppingCart);

        // Get all the giftShoppingCartList
        restGiftShoppingCartMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(giftShoppingCart.getId().intValue())))
            .andExpect(jsonPath("$.[*].date").value(hasItem(sameInstant(DEFAULT_DATE))))
            .andExpect(jsonPath("$.[*].amount").value(hasItem(DEFAULT_AMOUNT)));
    }

    @Test
    @Transactional
    void getGiftShoppingCart() throws Exception {
        // Initialize the database
        giftShoppingCartRepository.saveAndFlush(giftShoppingCart);

        // Get the giftShoppingCart
        restGiftShoppingCartMockMvc
            .perform(get(ENTITY_API_URL_ID, giftShoppingCart.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(giftShoppingCart.getId().intValue()))
            .andExpect(jsonPath("$.date").value(sameInstant(DEFAULT_DATE)))
            .andExpect(jsonPath("$.amount").value(DEFAULT_AMOUNT));
    }

    @Test
    @Transactional
    void getNonExistingGiftShoppingCart() throws Exception {
        // Get the giftShoppingCart
        restGiftShoppingCartMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewGiftShoppingCart() throws Exception {
        // Initialize the database
        giftShoppingCartRepository.saveAndFlush(giftShoppingCart);

        int databaseSizeBeforeUpdate = giftShoppingCartRepository.findAll().size();

        // Update the giftShoppingCart
        GiftShoppingCart updatedGiftShoppingCart = giftShoppingCartRepository.findById(giftShoppingCart.getId()).get();
        // Disconnect from session so that the updates on updatedGiftShoppingCart are not directly saved in db
        em.detach(updatedGiftShoppingCart);
        updatedGiftShoppingCart.date(UPDATED_DATE).amount(UPDATED_AMOUNT);

        restGiftShoppingCartMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedGiftShoppingCart.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedGiftShoppingCart))
            )
            .andExpect(status().isOk());

        // Validate the GiftShoppingCart in the database
        List<GiftShoppingCart> giftShoppingCartList = giftShoppingCartRepository.findAll();
        assertThat(giftShoppingCartList).hasSize(databaseSizeBeforeUpdate);
        GiftShoppingCart testGiftShoppingCart = giftShoppingCartList.get(giftShoppingCartList.size() - 1);
        assertThat(testGiftShoppingCart.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testGiftShoppingCart.getAmount()).isEqualTo(UPDATED_AMOUNT);
    }

    @Test
    @Transactional
    void putNonExistingGiftShoppingCart() throws Exception {
        int databaseSizeBeforeUpdate = giftShoppingCartRepository.findAll().size();
        giftShoppingCart.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restGiftShoppingCartMockMvc
            .perform(
                put(ENTITY_API_URL_ID, giftShoppingCart.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(giftShoppingCart))
            )
            .andExpect(status().isBadRequest());

        // Validate the GiftShoppingCart in the database
        List<GiftShoppingCart> giftShoppingCartList = giftShoppingCartRepository.findAll();
        assertThat(giftShoppingCartList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchGiftShoppingCart() throws Exception {
        int databaseSizeBeforeUpdate = giftShoppingCartRepository.findAll().size();
        giftShoppingCart.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGiftShoppingCartMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(giftShoppingCart))
            )
            .andExpect(status().isBadRequest());

        // Validate the GiftShoppingCart in the database
        List<GiftShoppingCart> giftShoppingCartList = giftShoppingCartRepository.findAll();
        assertThat(giftShoppingCartList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamGiftShoppingCart() throws Exception {
        int databaseSizeBeforeUpdate = giftShoppingCartRepository.findAll().size();
        giftShoppingCart.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGiftShoppingCartMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(giftShoppingCart))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the GiftShoppingCart in the database
        List<GiftShoppingCart> giftShoppingCartList = giftShoppingCartRepository.findAll();
        assertThat(giftShoppingCartList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateGiftShoppingCartWithPatch() throws Exception {
        // Initialize the database
        giftShoppingCartRepository.saveAndFlush(giftShoppingCart);

        int databaseSizeBeforeUpdate = giftShoppingCartRepository.findAll().size();

        // Update the giftShoppingCart using partial update
        GiftShoppingCart partialUpdatedGiftShoppingCart = new GiftShoppingCart();
        partialUpdatedGiftShoppingCart.setId(giftShoppingCart.getId());

        partialUpdatedGiftShoppingCart.date(UPDATED_DATE).amount(UPDATED_AMOUNT);

        restGiftShoppingCartMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedGiftShoppingCart.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedGiftShoppingCart))
            )
            .andExpect(status().isOk());

        // Validate the GiftShoppingCart in the database
        List<GiftShoppingCart> giftShoppingCartList = giftShoppingCartRepository.findAll();
        assertThat(giftShoppingCartList).hasSize(databaseSizeBeforeUpdate);
        GiftShoppingCart testGiftShoppingCart = giftShoppingCartList.get(giftShoppingCartList.size() - 1);
        assertThat(testGiftShoppingCart.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testGiftShoppingCart.getAmount()).isEqualTo(UPDATED_AMOUNT);
    }

    @Test
    @Transactional
    void fullUpdateGiftShoppingCartWithPatch() throws Exception {
        // Initialize the database
        giftShoppingCartRepository.saveAndFlush(giftShoppingCart);

        int databaseSizeBeforeUpdate = giftShoppingCartRepository.findAll().size();

        // Update the giftShoppingCart using partial update
        GiftShoppingCart partialUpdatedGiftShoppingCart = new GiftShoppingCart();
        partialUpdatedGiftShoppingCart.setId(giftShoppingCart.getId());

        partialUpdatedGiftShoppingCart.date(UPDATED_DATE).amount(UPDATED_AMOUNT);

        restGiftShoppingCartMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedGiftShoppingCart.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedGiftShoppingCart))
            )
            .andExpect(status().isOk());

        // Validate the GiftShoppingCart in the database
        List<GiftShoppingCart> giftShoppingCartList = giftShoppingCartRepository.findAll();
        assertThat(giftShoppingCartList).hasSize(databaseSizeBeforeUpdate);
        GiftShoppingCart testGiftShoppingCart = giftShoppingCartList.get(giftShoppingCartList.size() - 1);
        assertThat(testGiftShoppingCart.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testGiftShoppingCart.getAmount()).isEqualTo(UPDATED_AMOUNT);
    }

    @Test
    @Transactional
    void patchNonExistingGiftShoppingCart() throws Exception {
        int databaseSizeBeforeUpdate = giftShoppingCartRepository.findAll().size();
        giftShoppingCart.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restGiftShoppingCartMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, giftShoppingCart.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(giftShoppingCart))
            )
            .andExpect(status().isBadRequest());

        // Validate the GiftShoppingCart in the database
        List<GiftShoppingCart> giftShoppingCartList = giftShoppingCartRepository.findAll();
        assertThat(giftShoppingCartList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchGiftShoppingCart() throws Exception {
        int databaseSizeBeforeUpdate = giftShoppingCartRepository.findAll().size();
        giftShoppingCart.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGiftShoppingCartMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(giftShoppingCart))
            )
            .andExpect(status().isBadRequest());

        // Validate the GiftShoppingCart in the database
        List<GiftShoppingCart> giftShoppingCartList = giftShoppingCartRepository.findAll();
        assertThat(giftShoppingCartList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamGiftShoppingCart() throws Exception {
        int databaseSizeBeforeUpdate = giftShoppingCartRepository.findAll().size();
        giftShoppingCart.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGiftShoppingCartMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(giftShoppingCart))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the GiftShoppingCart in the database
        List<GiftShoppingCart> giftShoppingCartList = giftShoppingCartRepository.findAll();
        assertThat(giftShoppingCartList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteGiftShoppingCart() throws Exception {
        // Initialize the database
        giftShoppingCartRepository.saveAndFlush(giftShoppingCart);

        int databaseSizeBeforeDelete = giftShoppingCartRepository.findAll().size();

        // Delete the giftShoppingCart
        restGiftShoppingCartMockMvc
            .perform(delete(ENTITY_API_URL_ID, giftShoppingCart.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<GiftShoppingCart> giftShoppingCartList = giftShoppingCartRepository.findAll();
        assertThat(giftShoppingCartList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
