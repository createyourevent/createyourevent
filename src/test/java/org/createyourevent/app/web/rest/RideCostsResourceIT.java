package org.createyourevent.app.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.createyourevent.app.IntegrationTest;
import org.createyourevent.app.domain.RideCosts;
import org.createyourevent.app.repository.RideCostsRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link RideCostsResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class RideCostsResourceIT {

    private static final Float DEFAULT_PRICE_PER_KILOMETRE = 1F;
    private static final Float UPDATED_PRICE_PER_KILOMETRE = 2F;

    private static final String ENTITY_API_URL = "/api/ride-costs";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private RideCostsRepository rideCostsRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restRideCostsMockMvc;

    private RideCosts rideCosts;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static RideCosts createEntity(EntityManager em) {
        RideCosts rideCosts = new RideCosts().pricePerKilometre(DEFAULT_PRICE_PER_KILOMETRE);
        return rideCosts;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static RideCosts createUpdatedEntity(EntityManager em) {
        RideCosts rideCosts = new RideCosts().pricePerKilometre(UPDATED_PRICE_PER_KILOMETRE);
        return rideCosts;
    }

    @BeforeEach
    public void initTest() {
        rideCosts = createEntity(em);
    }

    @Test
    @Transactional
    void createRideCosts() throws Exception {
        int databaseSizeBeforeCreate = rideCostsRepository.findAll().size();
        // Create the RideCosts
        restRideCostsMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(rideCosts))
            )
            .andExpect(status().isCreated());

        // Validate the RideCosts in the database
        List<RideCosts> rideCostsList = rideCostsRepository.findAll();
        assertThat(rideCostsList).hasSize(databaseSizeBeforeCreate + 1);
        RideCosts testRideCosts = rideCostsList.get(rideCostsList.size() - 1);
        assertThat(testRideCosts.getPricePerKilometre()).isEqualTo(DEFAULT_PRICE_PER_KILOMETRE);
    }

    @Test
    @Transactional
    void createRideCostsWithExistingId() throws Exception {
        // Create the RideCosts with an existing ID
        rideCosts.setId(1L);

        int databaseSizeBeforeCreate = rideCostsRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restRideCostsMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(rideCosts))
            )
            .andExpect(status().isBadRequest());

        // Validate the RideCosts in the database
        List<RideCosts> rideCostsList = rideCostsRepository.findAll();
        assertThat(rideCostsList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkPricePerKilometreIsRequired() throws Exception {
        int databaseSizeBeforeTest = rideCostsRepository.findAll().size();
        // set the field null
        rideCosts.setPricePerKilometre(null);

        // Create the RideCosts, which fails.

        restRideCostsMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(rideCosts))
            )
            .andExpect(status().isBadRequest());

        List<RideCosts> rideCostsList = rideCostsRepository.findAll();
        assertThat(rideCostsList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllRideCosts() throws Exception {
        // Initialize the database
        rideCostsRepository.saveAndFlush(rideCosts);

        // Get all the rideCostsList
        restRideCostsMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(rideCosts.getId().intValue())))
            .andExpect(jsonPath("$.[*].pricePerKilometre").value(hasItem(DEFAULT_PRICE_PER_KILOMETRE.doubleValue())));
    }

    @Test
    @Transactional
    void getRideCosts() throws Exception {
        // Initialize the database
        rideCostsRepository.saveAndFlush(rideCosts);

        // Get the rideCosts
        restRideCostsMockMvc
            .perform(get(ENTITY_API_URL_ID, rideCosts.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(rideCosts.getId().intValue()))
            .andExpect(jsonPath("$.pricePerKilometre").value(DEFAULT_PRICE_PER_KILOMETRE.doubleValue()));
    }

    @Test
    @Transactional
    void getNonExistingRideCosts() throws Exception {
        // Get the rideCosts
        restRideCostsMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewRideCosts() throws Exception {
        // Initialize the database
        rideCostsRepository.saveAndFlush(rideCosts);

        int databaseSizeBeforeUpdate = rideCostsRepository.findAll().size();

        // Update the rideCosts
        RideCosts updatedRideCosts = rideCostsRepository.findById(rideCosts.getId()).get();
        // Disconnect from session so that the updates on updatedRideCosts are not directly saved in db
        em.detach(updatedRideCosts);
        updatedRideCosts.pricePerKilometre(UPDATED_PRICE_PER_KILOMETRE);

        restRideCostsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedRideCosts.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedRideCosts))
            )
            .andExpect(status().isOk());

        // Validate the RideCosts in the database
        List<RideCosts> rideCostsList = rideCostsRepository.findAll();
        assertThat(rideCostsList).hasSize(databaseSizeBeforeUpdate);
        RideCosts testRideCosts = rideCostsList.get(rideCostsList.size() - 1);
        assertThat(testRideCosts.getPricePerKilometre()).isEqualTo(UPDATED_PRICE_PER_KILOMETRE);
    }

    @Test
    @Transactional
    void putNonExistingRideCosts() throws Exception {
        int databaseSizeBeforeUpdate = rideCostsRepository.findAll().size();
        rideCosts.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restRideCostsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, rideCosts.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(rideCosts))
            )
            .andExpect(status().isBadRequest());

        // Validate the RideCosts in the database
        List<RideCosts> rideCostsList = rideCostsRepository.findAll();
        assertThat(rideCostsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchRideCosts() throws Exception {
        int databaseSizeBeforeUpdate = rideCostsRepository.findAll().size();
        rideCosts.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRideCostsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(rideCosts))
            )
            .andExpect(status().isBadRequest());

        // Validate the RideCosts in the database
        List<RideCosts> rideCostsList = rideCostsRepository.findAll();
        assertThat(rideCostsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamRideCosts() throws Exception {
        int databaseSizeBeforeUpdate = rideCostsRepository.findAll().size();
        rideCosts.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRideCostsMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(rideCosts))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the RideCosts in the database
        List<RideCosts> rideCostsList = rideCostsRepository.findAll();
        assertThat(rideCostsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateRideCostsWithPatch() throws Exception {
        // Initialize the database
        rideCostsRepository.saveAndFlush(rideCosts);

        int databaseSizeBeforeUpdate = rideCostsRepository.findAll().size();

        // Update the rideCosts using partial update
        RideCosts partialUpdatedRideCosts = new RideCosts();
        partialUpdatedRideCosts.setId(rideCosts.getId());

        restRideCostsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedRideCosts.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedRideCosts))
            )
            .andExpect(status().isOk());

        // Validate the RideCosts in the database
        List<RideCosts> rideCostsList = rideCostsRepository.findAll();
        assertThat(rideCostsList).hasSize(databaseSizeBeforeUpdate);
        RideCosts testRideCosts = rideCostsList.get(rideCostsList.size() - 1);
        assertThat(testRideCosts.getPricePerKilometre()).isEqualTo(DEFAULT_PRICE_PER_KILOMETRE);
    }

    @Test
    @Transactional
    void fullUpdateRideCostsWithPatch() throws Exception {
        // Initialize the database
        rideCostsRepository.saveAndFlush(rideCosts);

        int databaseSizeBeforeUpdate = rideCostsRepository.findAll().size();

        // Update the rideCosts using partial update
        RideCosts partialUpdatedRideCosts = new RideCosts();
        partialUpdatedRideCosts.setId(rideCosts.getId());

        partialUpdatedRideCosts.pricePerKilometre(UPDATED_PRICE_PER_KILOMETRE);

        restRideCostsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedRideCosts.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedRideCosts))
            )
            .andExpect(status().isOk());

        // Validate the RideCosts in the database
        List<RideCosts> rideCostsList = rideCostsRepository.findAll();
        assertThat(rideCostsList).hasSize(databaseSizeBeforeUpdate);
        RideCosts testRideCosts = rideCostsList.get(rideCostsList.size() - 1);
        assertThat(testRideCosts.getPricePerKilometre()).isEqualTo(UPDATED_PRICE_PER_KILOMETRE);
    }

    @Test
    @Transactional
    void patchNonExistingRideCosts() throws Exception {
        int databaseSizeBeforeUpdate = rideCostsRepository.findAll().size();
        rideCosts.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restRideCostsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, rideCosts.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(rideCosts))
            )
            .andExpect(status().isBadRequest());

        // Validate the RideCosts in the database
        List<RideCosts> rideCostsList = rideCostsRepository.findAll();
        assertThat(rideCostsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchRideCosts() throws Exception {
        int databaseSizeBeforeUpdate = rideCostsRepository.findAll().size();
        rideCosts.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRideCostsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(rideCosts))
            )
            .andExpect(status().isBadRequest());

        // Validate the RideCosts in the database
        List<RideCosts> rideCostsList = rideCostsRepository.findAll();
        assertThat(rideCostsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamRideCosts() throws Exception {
        int databaseSizeBeforeUpdate = rideCostsRepository.findAll().size();
        rideCosts.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRideCostsMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(rideCosts))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the RideCosts in the database
        List<RideCosts> rideCostsList = rideCostsRepository.findAll();
        assertThat(rideCostsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteRideCosts() throws Exception {
        // Initialize the database
        rideCostsRepository.saveAndFlush(rideCosts);

        int databaseSizeBeforeDelete = rideCostsRepository.findAll().size();

        // Delete the rideCosts
        restRideCostsMockMvc
            .perform(delete(ENTITY_API_URL_ID, rideCosts.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<RideCosts> rideCostsList = rideCostsRepository.findAll();
        assertThat(rideCostsList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
