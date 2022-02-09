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
import org.createyourevent.app.domain.FeeTransactionId;
import org.createyourevent.app.repository.FeeTransactionIdRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link FeeTransactionIdResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class FeeTransactionIdResourceIT {

    private static final String DEFAULT_TRANSACTION_ID = "AAAAAAAAAA";
    private static final String UPDATED_TRANSACTION_ID = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/fee-transaction-ids";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private FeeTransactionIdRepository feeTransactionIdRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restFeeTransactionIdMockMvc;

    private FeeTransactionId feeTransactionId;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static FeeTransactionId createEntity(EntityManager em) {
        FeeTransactionId feeTransactionId = new FeeTransactionId().transactionId(DEFAULT_TRANSACTION_ID);
        return feeTransactionId;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static FeeTransactionId createUpdatedEntity(EntityManager em) {
        FeeTransactionId feeTransactionId = new FeeTransactionId().transactionId(UPDATED_TRANSACTION_ID);
        return feeTransactionId;
    }

    @BeforeEach
    public void initTest() {
        feeTransactionId = createEntity(em);
    }

    @Test
    @Transactional
    void createFeeTransactionId() throws Exception {
        int databaseSizeBeforeCreate = feeTransactionIdRepository.findAll().size();
        // Create the FeeTransactionId
        restFeeTransactionIdMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(feeTransactionId))
            )
            .andExpect(status().isCreated());

        // Validate the FeeTransactionId in the database
        List<FeeTransactionId> feeTransactionIdList = feeTransactionIdRepository.findAll();
        assertThat(feeTransactionIdList).hasSize(databaseSizeBeforeCreate + 1);
        FeeTransactionId testFeeTransactionId = feeTransactionIdList.get(feeTransactionIdList.size() - 1);
        assertThat(testFeeTransactionId.getTransactionId()).isEqualTo(DEFAULT_TRANSACTION_ID);
    }

    @Test
    @Transactional
    void createFeeTransactionIdWithExistingId() throws Exception {
        // Create the FeeTransactionId with an existing ID
        feeTransactionId.setId(1L);

        int databaseSizeBeforeCreate = feeTransactionIdRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restFeeTransactionIdMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(feeTransactionId))
            )
            .andExpect(status().isBadRequest());

        // Validate the FeeTransactionId in the database
        List<FeeTransactionId> feeTransactionIdList = feeTransactionIdRepository.findAll();
        assertThat(feeTransactionIdList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllFeeTransactionIds() throws Exception {
        // Initialize the database
        feeTransactionIdRepository.saveAndFlush(feeTransactionId);

        // Get all the feeTransactionIdList
        restFeeTransactionIdMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(feeTransactionId.getId().intValue())))
            .andExpect(jsonPath("$.[*].transactionId").value(hasItem(DEFAULT_TRANSACTION_ID)));
    }

    @Test
    @Transactional
    void getFeeTransactionId() throws Exception {
        // Initialize the database
        feeTransactionIdRepository.saveAndFlush(feeTransactionId);

        // Get the feeTransactionId
        restFeeTransactionIdMockMvc
            .perform(get(ENTITY_API_URL_ID, feeTransactionId.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(feeTransactionId.getId().intValue()))
            .andExpect(jsonPath("$.transactionId").value(DEFAULT_TRANSACTION_ID));
    }

    @Test
    @Transactional
    void getNonExistingFeeTransactionId() throws Exception {
        // Get the feeTransactionId
        restFeeTransactionIdMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewFeeTransactionId() throws Exception {
        // Initialize the database
        feeTransactionIdRepository.saveAndFlush(feeTransactionId);

        int databaseSizeBeforeUpdate = feeTransactionIdRepository.findAll().size();

        // Update the feeTransactionId
        FeeTransactionId updatedFeeTransactionId = feeTransactionIdRepository.findById(feeTransactionId.getId()).get();
        // Disconnect from session so that the updates on updatedFeeTransactionId are not directly saved in db
        em.detach(updatedFeeTransactionId);
        updatedFeeTransactionId.transactionId(UPDATED_TRANSACTION_ID);

        restFeeTransactionIdMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedFeeTransactionId.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedFeeTransactionId))
            )
            .andExpect(status().isOk());

        // Validate the FeeTransactionId in the database
        List<FeeTransactionId> feeTransactionIdList = feeTransactionIdRepository.findAll();
        assertThat(feeTransactionIdList).hasSize(databaseSizeBeforeUpdate);
        FeeTransactionId testFeeTransactionId = feeTransactionIdList.get(feeTransactionIdList.size() - 1);
        assertThat(testFeeTransactionId.getTransactionId()).isEqualTo(UPDATED_TRANSACTION_ID);
    }

    @Test
    @Transactional
    void putNonExistingFeeTransactionId() throws Exception {
        int databaseSizeBeforeUpdate = feeTransactionIdRepository.findAll().size();
        feeTransactionId.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFeeTransactionIdMockMvc
            .perform(
                put(ENTITY_API_URL_ID, feeTransactionId.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(feeTransactionId))
            )
            .andExpect(status().isBadRequest());

        // Validate the FeeTransactionId in the database
        List<FeeTransactionId> feeTransactionIdList = feeTransactionIdRepository.findAll();
        assertThat(feeTransactionIdList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchFeeTransactionId() throws Exception {
        int databaseSizeBeforeUpdate = feeTransactionIdRepository.findAll().size();
        feeTransactionId.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFeeTransactionIdMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(feeTransactionId))
            )
            .andExpect(status().isBadRequest());

        // Validate the FeeTransactionId in the database
        List<FeeTransactionId> feeTransactionIdList = feeTransactionIdRepository.findAll();
        assertThat(feeTransactionIdList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamFeeTransactionId() throws Exception {
        int databaseSizeBeforeUpdate = feeTransactionIdRepository.findAll().size();
        feeTransactionId.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFeeTransactionIdMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(feeTransactionId))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the FeeTransactionId in the database
        List<FeeTransactionId> feeTransactionIdList = feeTransactionIdRepository.findAll();
        assertThat(feeTransactionIdList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateFeeTransactionIdWithPatch() throws Exception {
        // Initialize the database
        feeTransactionIdRepository.saveAndFlush(feeTransactionId);

        int databaseSizeBeforeUpdate = feeTransactionIdRepository.findAll().size();

        // Update the feeTransactionId using partial update
        FeeTransactionId partialUpdatedFeeTransactionId = new FeeTransactionId();
        partialUpdatedFeeTransactionId.setId(feeTransactionId.getId());

        partialUpdatedFeeTransactionId.transactionId(UPDATED_TRANSACTION_ID);

        restFeeTransactionIdMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFeeTransactionId.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFeeTransactionId))
            )
            .andExpect(status().isOk());

        // Validate the FeeTransactionId in the database
        List<FeeTransactionId> feeTransactionIdList = feeTransactionIdRepository.findAll();
        assertThat(feeTransactionIdList).hasSize(databaseSizeBeforeUpdate);
        FeeTransactionId testFeeTransactionId = feeTransactionIdList.get(feeTransactionIdList.size() - 1);
        assertThat(testFeeTransactionId.getTransactionId()).isEqualTo(UPDATED_TRANSACTION_ID);
    }

    @Test
    @Transactional
    void fullUpdateFeeTransactionIdWithPatch() throws Exception {
        // Initialize the database
        feeTransactionIdRepository.saveAndFlush(feeTransactionId);

        int databaseSizeBeforeUpdate = feeTransactionIdRepository.findAll().size();

        // Update the feeTransactionId using partial update
        FeeTransactionId partialUpdatedFeeTransactionId = new FeeTransactionId();
        partialUpdatedFeeTransactionId.setId(feeTransactionId.getId());

        partialUpdatedFeeTransactionId.transactionId(UPDATED_TRANSACTION_ID);

        restFeeTransactionIdMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFeeTransactionId.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFeeTransactionId))
            )
            .andExpect(status().isOk());

        // Validate the FeeTransactionId in the database
        List<FeeTransactionId> feeTransactionIdList = feeTransactionIdRepository.findAll();
        assertThat(feeTransactionIdList).hasSize(databaseSizeBeforeUpdate);
        FeeTransactionId testFeeTransactionId = feeTransactionIdList.get(feeTransactionIdList.size() - 1);
        assertThat(testFeeTransactionId.getTransactionId()).isEqualTo(UPDATED_TRANSACTION_ID);
    }

    @Test
    @Transactional
    void patchNonExistingFeeTransactionId() throws Exception {
        int databaseSizeBeforeUpdate = feeTransactionIdRepository.findAll().size();
        feeTransactionId.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFeeTransactionIdMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, feeTransactionId.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(feeTransactionId))
            )
            .andExpect(status().isBadRequest());

        // Validate the FeeTransactionId in the database
        List<FeeTransactionId> feeTransactionIdList = feeTransactionIdRepository.findAll();
        assertThat(feeTransactionIdList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchFeeTransactionId() throws Exception {
        int databaseSizeBeforeUpdate = feeTransactionIdRepository.findAll().size();
        feeTransactionId.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFeeTransactionIdMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(feeTransactionId))
            )
            .andExpect(status().isBadRequest());

        // Validate the FeeTransactionId in the database
        List<FeeTransactionId> feeTransactionIdList = feeTransactionIdRepository.findAll();
        assertThat(feeTransactionIdList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamFeeTransactionId() throws Exception {
        int databaseSizeBeforeUpdate = feeTransactionIdRepository.findAll().size();
        feeTransactionId.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFeeTransactionIdMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(feeTransactionId))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the FeeTransactionId in the database
        List<FeeTransactionId> feeTransactionIdList = feeTransactionIdRepository.findAll();
        assertThat(feeTransactionIdList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteFeeTransactionId() throws Exception {
        // Initialize the database
        feeTransactionIdRepository.saveAndFlush(feeTransactionId);

        int databaseSizeBeforeDelete = feeTransactionIdRepository.findAll().size();

        // Delete the feeTransactionId
        restFeeTransactionIdMockMvc
            .perform(delete(ENTITY_API_URL_ID, feeTransactionId.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<FeeTransactionId> feeTransactionIdList = feeTransactionIdRepository.findAll();
        assertThat(feeTransactionIdList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
