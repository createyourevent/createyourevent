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
import org.createyourevent.app.domain.FeeBalance;
import org.createyourevent.app.domain.enumeration.FeeType;
import org.createyourevent.app.repository.FeeBalanceRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link FeeBalanceResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class FeeBalanceResourceIT {

    private static final ZonedDateTime DEFAULT_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_DATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final FeeType DEFAULT_TYPE = FeeType.EVENT;
    private static final FeeType UPDATED_TYPE = FeeType.EVENTPRODUCTORDER;

    private static final Float DEFAULT_TOTAL = 1F;
    private static final Float UPDATED_TOTAL = 2F;

    private static final String ENTITY_API_URL = "/api/fee-balances";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private FeeBalanceRepository feeBalanceRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restFeeBalanceMockMvc;

    private FeeBalance feeBalance;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static FeeBalance createEntity(EntityManager em) {
        FeeBalance feeBalance = new FeeBalance().date(DEFAULT_DATE).type(DEFAULT_TYPE).total(DEFAULT_TOTAL);
        return feeBalance;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static FeeBalance createUpdatedEntity(EntityManager em) {
        FeeBalance feeBalance = new FeeBalance().date(UPDATED_DATE).type(UPDATED_TYPE).total(UPDATED_TOTAL);
        return feeBalance;
    }

    @BeforeEach
    public void initTest() {
        feeBalance = createEntity(em);
    }

    @Test
    @Transactional
    void createFeeBalance() throws Exception {
        int databaseSizeBeforeCreate = feeBalanceRepository.findAll().size();
        // Create the FeeBalance
        restFeeBalanceMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(feeBalance))
            )
            .andExpect(status().isCreated());

        // Validate the FeeBalance in the database
        List<FeeBalance> feeBalanceList = feeBalanceRepository.findAll();
        assertThat(feeBalanceList).hasSize(databaseSizeBeforeCreate + 1);
        FeeBalance testFeeBalance = feeBalanceList.get(feeBalanceList.size() - 1);
        assertThat(testFeeBalance.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testFeeBalance.getType()).isEqualTo(DEFAULT_TYPE);
        assertThat(testFeeBalance.getTotal()).isEqualTo(DEFAULT_TOTAL);
    }

    @Test
    @Transactional
    void createFeeBalanceWithExistingId() throws Exception {
        // Create the FeeBalance with an existing ID
        feeBalance.setId(1L);

        int databaseSizeBeforeCreate = feeBalanceRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restFeeBalanceMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(feeBalance))
            )
            .andExpect(status().isBadRequest());

        // Validate the FeeBalance in the database
        List<FeeBalance> feeBalanceList = feeBalanceRepository.findAll();
        assertThat(feeBalanceList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllFeeBalances() throws Exception {
        // Initialize the database
        feeBalanceRepository.saveAndFlush(feeBalance);

        // Get all the feeBalanceList
        restFeeBalanceMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(feeBalance.getId().intValue())))
            .andExpect(jsonPath("$.[*].date").value(hasItem(sameInstant(DEFAULT_DATE))))
            .andExpect(jsonPath("$.[*].type").value(hasItem(DEFAULT_TYPE.toString())))
            .andExpect(jsonPath("$.[*].total").value(hasItem(DEFAULT_TOTAL.doubleValue())));
    }

    @Test
    @Transactional
    void getFeeBalance() throws Exception {
        // Initialize the database
        feeBalanceRepository.saveAndFlush(feeBalance);

        // Get the feeBalance
        restFeeBalanceMockMvc
            .perform(get(ENTITY_API_URL_ID, feeBalance.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(feeBalance.getId().intValue()))
            .andExpect(jsonPath("$.date").value(sameInstant(DEFAULT_DATE)))
            .andExpect(jsonPath("$.type").value(DEFAULT_TYPE.toString()))
            .andExpect(jsonPath("$.total").value(DEFAULT_TOTAL.doubleValue()));
    }

    @Test
    @Transactional
    void getNonExistingFeeBalance() throws Exception {
        // Get the feeBalance
        restFeeBalanceMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewFeeBalance() throws Exception {
        // Initialize the database
        feeBalanceRepository.saveAndFlush(feeBalance);

        int databaseSizeBeforeUpdate = feeBalanceRepository.findAll().size();

        // Update the feeBalance
        FeeBalance updatedFeeBalance = feeBalanceRepository.findById(feeBalance.getId()).get();
        // Disconnect from session so that the updates on updatedFeeBalance are not directly saved in db
        em.detach(updatedFeeBalance);
        updatedFeeBalance.date(UPDATED_DATE).type(UPDATED_TYPE).total(UPDATED_TOTAL);

        restFeeBalanceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedFeeBalance.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedFeeBalance))
            )
            .andExpect(status().isOk());

        // Validate the FeeBalance in the database
        List<FeeBalance> feeBalanceList = feeBalanceRepository.findAll();
        assertThat(feeBalanceList).hasSize(databaseSizeBeforeUpdate);
        FeeBalance testFeeBalance = feeBalanceList.get(feeBalanceList.size() - 1);
        assertThat(testFeeBalance.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testFeeBalance.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testFeeBalance.getTotal()).isEqualTo(UPDATED_TOTAL);
    }

    @Test
    @Transactional
    void putNonExistingFeeBalance() throws Exception {
        int databaseSizeBeforeUpdate = feeBalanceRepository.findAll().size();
        feeBalance.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFeeBalanceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, feeBalance.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(feeBalance))
            )
            .andExpect(status().isBadRequest());

        // Validate the FeeBalance in the database
        List<FeeBalance> feeBalanceList = feeBalanceRepository.findAll();
        assertThat(feeBalanceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchFeeBalance() throws Exception {
        int databaseSizeBeforeUpdate = feeBalanceRepository.findAll().size();
        feeBalance.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFeeBalanceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(feeBalance))
            )
            .andExpect(status().isBadRequest());

        // Validate the FeeBalance in the database
        List<FeeBalance> feeBalanceList = feeBalanceRepository.findAll();
        assertThat(feeBalanceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamFeeBalance() throws Exception {
        int databaseSizeBeforeUpdate = feeBalanceRepository.findAll().size();
        feeBalance.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFeeBalanceMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(feeBalance))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the FeeBalance in the database
        List<FeeBalance> feeBalanceList = feeBalanceRepository.findAll();
        assertThat(feeBalanceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateFeeBalanceWithPatch() throws Exception {
        // Initialize the database
        feeBalanceRepository.saveAndFlush(feeBalance);

        int databaseSizeBeforeUpdate = feeBalanceRepository.findAll().size();

        // Update the feeBalance using partial update
        FeeBalance partialUpdatedFeeBalance = new FeeBalance();
        partialUpdatedFeeBalance.setId(feeBalance.getId());

        partialUpdatedFeeBalance.date(UPDATED_DATE);

        restFeeBalanceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFeeBalance.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFeeBalance))
            )
            .andExpect(status().isOk());

        // Validate the FeeBalance in the database
        List<FeeBalance> feeBalanceList = feeBalanceRepository.findAll();
        assertThat(feeBalanceList).hasSize(databaseSizeBeforeUpdate);
        FeeBalance testFeeBalance = feeBalanceList.get(feeBalanceList.size() - 1);
        assertThat(testFeeBalance.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testFeeBalance.getType()).isEqualTo(DEFAULT_TYPE);
        assertThat(testFeeBalance.getTotal()).isEqualTo(DEFAULT_TOTAL);
    }

    @Test
    @Transactional
    void fullUpdateFeeBalanceWithPatch() throws Exception {
        // Initialize the database
        feeBalanceRepository.saveAndFlush(feeBalance);

        int databaseSizeBeforeUpdate = feeBalanceRepository.findAll().size();

        // Update the feeBalance using partial update
        FeeBalance partialUpdatedFeeBalance = new FeeBalance();
        partialUpdatedFeeBalance.setId(feeBalance.getId());

        partialUpdatedFeeBalance.date(UPDATED_DATE).type(UPDATED_TYPE).total(UPDATED_TOTAL);

        restFeeBalanceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFeeBalance.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFeeBalance))
            )
            .andExpect(status().isOk());

        // Validate the FeeBalance in the database
        List<FeeBalance> feeBalanceList = feeBalanceRepository.findAll();
        assertThat(feeBalanceList).hasSize(databaseSizeBeforeUpdate);
        FeeBalance testFeeBalance = feeBalanceList.get(feeBalanceList.size() - 1);
        assertThat(testFeeBalance.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testFeeBalance.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testFeeBalance.getTotal()).isEqualTo(UPDATED_TOTAL);
    }

    @Test
    @Transactional
    void patchNonExistingFeeBalance() throws Exception {
        int databaseSizeBeforeUpdate = feeBalanceRepository.findAll().size();
        feeBalance.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFeeBalanceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, feeBalance.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(feeBalance))
            )
            .andExpect(status().isBadRequest());

        // Validate the FeeBalance in the database
        List<FeeBalance> feeBalanceList = feeBalanceRepository.findAll();
        assertThat(feeBalanceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchFeeBalance() throws Exception {
        int databaseSizeBeforeUpdate = feeBalanceRepository.findAll().size();
        feeBalance.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFeeBalanceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(feeBalance))
            )
            .andExpect(status().isBadRequest());

        // Validate the FeeBalance in the database
        List<FeeBalance> feeBalanceList = feeBalanceRepository.findAll();
        assertThat(feeBalanceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamFeeBalance() throws Exception {
        int databaseSizeBeforeUpdate = feeBalanceRepository.findAll().size();
        feeBalance.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFeeBalanceMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(feeBalance))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the FeeBalance in the database
        List<FeeBalance> feeBalanceList = feeBalanceRepository.findAll();
        assertThat(feeBalanceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteFeeBalance() throws Exception {
        // Initialize the database
        feeBalanceRepository.saveAndFlush(feeBalance);

        int databaseSizeBeforeDelete = feeBalanceRepository.findAll().size();

        // Delete the feeBalance
        restFeeBalanceMockMvc
            .perform(delete(ENTITY_API_URL_ID, feeBalance.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<FeeBalance> feeBalanceList = feeBalanceRepository.findAll();
        assertThat(feeBalanceList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
