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
import org.createyourevent.app.domain.FeeTransaction;
import org.createyourevent.app.repository.FeeTransactionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link FeeTransactionResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class FeeTransactionResourceIT {

    private static final ZonedDateTime DEFAULT_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_DATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String ENTITY_API_URL = "/api/fee-transactions";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private FeeTransactionRepository feeTransactionRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restFeeTransactionMockMvc;

    private FeeTransaction feeTransaction;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static FeeTransaction createEntity(EntityManager em) {
        FeeTransaction feeTransaction = new FeeTransaction().date(DEFAULT_DATE);
        return feeTransaction;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static FeeTransaction createUpdatedEntity(EntityManager em) {
        FeeTransaction feeTransaction = new FeeTransaction().date(UPDATED_DATE);
        return feeTransaction;
    }

    @BeforeEach
    public void initTest() {
        feeTransaction = createEntity(em);
    }

    @Test
    @Transactional
    void createFeeTransaction() throws Exception {
        int databaseSizeBeforeCreate = feeTransactionRepository.findAll().size();
        // Create the FeeTransaction
        restFeeTransactionMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(feeTransaction))
            )
            .andExpect(status().isCreated());

        // Validate the FeeTransaction in the database
        List<FeeTransaction> feeTransactionList = feeTransactionRepository.findAll();
        assertThat(feeTransactionList).hasSize(databaseSizeBeforeCreate + 1);
        FeeTransaction testFeeTransaction = feeTransactionList.get(feeTransactionList.size() - 1);
        assertThat(testFeeTransaction.getDate()).isEqualTo(DEFAULT_DATE);
    }

    @Test
    @Transactional
    void createFeeTransactionWithExistingId() throws Exception {
        // Create the FeeTransaction with an existing ID
        feeTransaction.setId(1L);

        int databaseSizeBeforeCreate = feeTransactionRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restFeeTransactionMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(feeTransaction))
            )
            .andExpect(status().isBadRequest());

        // Validate the FeeTransaction in the database
        List<FeeTransaction> feeTransactionList = feeTransactionRepository.findAll();
        assertThat(feeTransactionList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllFeeTransactions() throws Exception {
        // Initialize the database
        feeTransactionRepository.saveAndFlush(feeTransaction);

        // Get all the feeTransactionList
        restFeeTransactionMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(feeTransaction.getId().intValue())))
            .andExpect(jsonPath("$.[*].date").value(hasItem(sameInstant(DEFAULT_DATE))));
    }

    @Test
    @Transactional
    void getFeeTransaction() throws Exception {
        // Initialize the database
        feeTransactionRepository.saveAndFlush(feeTransaction);

        // Get the feeTransaction
        restFeeTransactionMockMvc
            .perform(get(ENTITY_API_URL_ID, feeTransaction.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(feeTransaction.getId().intValue()))
            .andExpect(jsonPath("$.date").value(sameInstant(DEFAULT_DATE)));
    }

    @Test
    @Transactional
    void getNonExistingFeeTransaction() throws Exception {
        // Get the feeTransaction
        restFeeTransactionMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewFeeTransaction() throws Exception {
        // Initialize the database
        feeTransactionRepository.saveAndFlush(feeTransaction);

        int databaseSizeBeforeUpdate = feeTransactionRepository.findAll().size();

        // Update the feeTransaction
        FeeTransaction updatedFeeTransaction = feeTransactionRepository.findById(feeTransaction.getId()).get();
        // Disconnect from session so that the updates on updatedFeeTransaction are not directly saved in db
        em.detach(updatedFeeTransaction);
        updatedFeeTransaction.date(UPDATED_DATE);

        restFeeTransactionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedFeeTransaction.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedFeeTransaction))
            )
            .andExpect(status().isOk());

        // Validate the FeeTransaction in the database
        List<FeeTransaction> feeTransactionList = feeTransactionRepository.findAll();
        assertThat(feeTransactionList).hasSize(databaseSizeBeforeUpdate);
        FeeTransaction testFeeTransaction = feeTransactionList.get(feeTransactionList.size() - 1);
        assertThat(testFeeTransaction.getDate()).isEqualTo(UPDATED_DATE);
    }

    @Test
    @Transactional
    void putNonExistingFeeTransaction() throws Exception {
        int databaseSizeBeforeUpdate = feeTransactionRepository.findAll().size();
        feeTransaction.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFeeTransactionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, feeTransaction.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(feeTransaction))
            )
            .andExpect(status().isBadRequest());

        // Validate the FeeTransaction in the database
        List<FeeTransaction> feeTransactionList = feeTransactionRepository.findAll();
        assertThat(feeTransactionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchFeeTransaction() throws Exception {
        int databaseSizeBeforeUpdate = feeTransactionRepository.findAll().size();
        feeTransaction.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFeeTransactionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(feeTransaction))
            )
            .andExpect(status().isBadRequest());

        // Validate the FeeTransaction in the database
        List<FeeTransaction> feeTransactionList = feeTransactionRepository.findAll();
        assertThat(feeTransactionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamFeeTransaction() throws Exception {
        int databaseSizeBeforeUpdate = feeTransactionRepository.findAll().size();
        feeTransaction.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFeeTransactionMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(feeTransaction))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the FeeTransaction in the database
        List<FeeTransaction> feeTransactionList = feeTransactionRepository.findAll();
        assertThat(feeTransactionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateFeeTransactionWithPatch() throws Exception {
        // Initialize the database
        feeTransactionRepository.saveAndFlush(feeTransaction);

        int databaseSizeBeforeUpdate = feeTransactionRepository.findAll().size();

        // Update the feeTransaction using partial update
        FeeTransaction partialUpdatedFeeTransaction = new FeeTransaction();
        partialUpdatedFeeTransaction.setId(feeTransaction.getId());

        restFeeTransactionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFeeTransaction.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFeeTransaction))
            )
            .andExpect(status().isOk());

        // Validate the FeeTransaction in the database
        List<FeeTransaction> feeTransactionList = feeTransactionRepository.findAll();
        assertThat(feeTransactionList).hasSize(databaseSizeBeforeUpdate);
        FeeTransaction testFeeTransaction = feeTransactionList.get(feeTransactionList.size() - 1);
        assertThat(testFeeTransaction.getDate()).isEqualTo(DEFAULT_DATE);
    }

    @Test
    @Transactional
    void fullUpdateFeeTransactionWithPatch() throws Exception {
        // Initialize the database
        feeTransactionRepository.saveAndFlush(feeTransaction);

        int databaseSizeBeforeUpdate = feeTransactionRepository.findAll().size();

        // Update the feeTransaction using partial update
        FeeTransaction partialUpdatedFeeTransaction = new FeeTransaction();
        partialUpdatedFeeTransaction.setId(feeTransaction.getId());

        partialUpdatedFeeTransaction.date(UPDATED_DATE);

        restFeeTransactionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFeeTransaction.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFeeTransaction))
            )
            .andExpect(status().isOk());

        // Validate the FeeTransaction in the database
        List<FeeTransaction> feeTransactionList = feeTransactionRepository.findAll();
        assertThat(feeTransactionList).hasSize(databaseSizeBeforeUpdate);
        FeeTransaction testFeeTransaction = feeTransactionList.get(feeTransactionList.size() - 1);
        assertThat(testFeeTransaction.getDate()).isEqualTo(UPDATED_DATE);
    }

    @Test
    @Transactional
    void patchNonExistingFeeTransaction() throws Exception {
        int databaseSizeBeforeUpdate = feeTransactionRepository.findAll().size();
        feeTransaction.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFeeTransactionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, feeTransaction.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(feeTransaction))
            )
            .andExpect(status().isBadRequest());

        // Validate the FeeTransaction in the database
        List<FeeTransaction> feeTransactionList = feeTransactionRepository.findAll();
        assertThat(feeTransactionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchFeeTransaction() throws Exception {
        int databaseSizeBeforeUpdate = feeTransactionRepository.findAll().size();
        feeTransaction.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFeeTransactionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(feeTransaction))
            )
            .andExpect(status().isBadRequest());

        // Validate the FeeTransaction in the database
        List<FeeTransaction> feeTransactionList = feeTransactionRepository.findAll();
        assertThat(feeTransactionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamFeeTransaction() throws Exception {
        int databaseSizeBeforeUpdate = feeTransactionRepository.findAll().size();
        feeTransaction.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFeeTransactionMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(feeTransaction))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the FeeTransaction in the database
        List<FeeTransaction> feeTransactionList = feeTransactionRepository.findAll();
        assertThat(feeTransactionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteFeeTransaction() throws Exception {
        // Initialize the database
        feeTransactionRepository.saveAndFlush(feeTransaction);

        int databaseSizeBeforeDelete = feeTransactionRepository.findAll().size();

        // Delete the feeTransaction
        restFeeTransactionMockMvc
            .perform(delete(ENTITY_API_URL_ID, feeTransaction.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<FeeTransaction> feeTransactionList = feeTransactionRepository.findAll();
        assertThat(feeTransactionList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
