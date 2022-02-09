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
import org.createyourevent.app.domain.FeeTransactionEntry;
import org.createyourevent.app.domain.enumeration.FeeType;
import org.createyourevent.app.repository.FeeTransactionEntryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link FeeTransactionEntryResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class FeeTransactionEntryResourceIT {

    private static final FeeType DEFAULT_TYPE = FeeType.EVENT;
    private static final FeeType UPDATED_TYPE = FeeType.EVENTPRODUCTORDER;

    private static final Float DEFAULT_VALUE = 1F;
    private static final Float UPDATED_VALUE = 2F;

    private static final String ENTITY_API_URL = "/api/fee-transaction-entries";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private FeeTransactionEntryRepository feeTransactionEntryRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restFeeTransactionEntryMockMvc;

    private FeeTransactionEntry feeTransactionEntry;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static FeeTransactionEntry createEntity(EntityManager em) {
        FeeTransactionEntry feeTransactionEntry = new FeeTransactionEntry().type(DEFAULT_TYPE).value(DEFAULT_VALUE);
        return feeTransactionEntry;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static FeeTransactionEntry createUpdatedEntity(EntityManager em) {
        FeeTransactionEntry feeTransactionEntry = new FeeTransactionEntry().type(UPDATED_TYPE).value(UPDATED_VALUE);
        return feeTransactionEntry;
    }

    @BeforeEach
    public void initTest() {
        feeTransactionEntry = createEntity(em);
    }

    @Test
    @Transactional
    void createFeeTransactionEntry() throws Exception {
        int databaseSizeBeforeCreate = feeTransactionEntryRepository.findAll().size();
        // Create the FeeTransactionEntry
        restFeeTransactionEntryMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(feeTransactionEntry))
            )
            .andExpect(status().isCreated());

        // Validate the FeeTransactionEntry in the database
        List<FeeTransactionEntry> feeTransactionEntryList = feeTransactionEntryRepository.findAll();
        assertThat(feeTransactionEntryList).hasSize(databaseSizeBeforeCreate + 1);
        FeeTransactionEntry testFeeTransactionEntry = feeTransactionEntryList.get(feeTransactionEntryList.size() - 1);
        assertThat(testFeeTransactionEntry.getType()).isEqualTo(DEFAULT_TYPE);
        assertThat(testFeeTransactionEntry.getValue()).isEqualTo(DEFAULT_VALUE);
    }

    @Test
    @Transactional
    void createFeeTransactionEntryWithExistingId() throws Exception {
        // Create the FeeTransactionEntry with an existing ID
        feeTransactionEntry.setId(1L);

        int databaseSizeBeforeCreate = feeTransactionEntryRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restFeeTransactionEntryMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(feeTransactionEntry))
            )
            .andExpect(status().isBadRequest());

        // Validate the FeeTransactionEntry in the database
        List<FeeTransactionEntry> feeTransactionEntryList = feeTransactionEntryRepository.findAll();
        assertThat(feeTransactionEntryList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllFeeTransactionEntries() throws Exception {
        // Initialize the database
        feeTransactionEntryRepository.saveAndFlush(feeTransactionEntry);

        // Get all the feeTransactionEntryList
        restFeeTransactionEntryMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(feeTransactionEntry.getId().intValue())))
            .andExpect(jsonPath("$.[*].type").value(hasItem(DEFAULT_TYPE.toString())))
            .andExpect(jsonPath("$.[*].value").value(hasItem(DEFAULT_VALUE.doubleValue())));
    }

    @Test
    @Transactional
    void getFeeTransactionEntry() throws Exception {
        // Initialize the database
        feeTransactionEntryRepository.saveAndFlush(feeTransactionEntry);

        // Get the feeTransactionEntry
        restFeeTransactionEntryMockMvc
            .perform(get(ENTITY_API_URL_ID, feeTransactionEntry.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(feeTransactionEntry.getId().intValue()))
            .andExpect(jsonPath("$.type").value(DEFAULT_TYPE.toString()))
            .andExpect(jsonPath("$.value").value(DEFAULT_VALUE.doubleValue()));
    }

    @Test
    @Transactional
    void getNonExistingFeeTransactionEntry() throws Exception {
        // Get the feeTransactionEntry
        restFeeTransactionEntryMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewFeeTransactionEntry() throws Exception {
        // Initialize the database
        feeTransactionEntryRepository.saveAndFlush(feeTransactionEntry);

        int databaseSizeBeforeUpdate = feeTransactionEntryRepository.findAll().size();

        // Update the feeTransactionEntry
        FeeTransactionEntry updatedFeeTransactionEntry = feeTransactionEntryRepository.findById(feeTransactionEntry.getId()).get();
        // Disconnect from session so that the updates on updatedFeeTransactionEntry are not directly saved in db
        em.detach(updatedFeeTransactionEntry);
        updatedFeeTransactionEntry.type(UPDATED_TYPE).value(UPDATED_VALUE);

        restFeeTransactionEntryMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedFeeTransactionEntry.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedFeeTransactionEntry))
            )
            .andExpect(status().isOk());

        // Validate the FeeTransactionEntry in the database
        List<FeeTransactionEntry> feeTransactionEntryList = feeTransactionEntryRepository.findAll();
        assertThat(feeTransactionEntryList).hasSize(databaseSizeBeforeUpdate);
        FeeTransactionEntry testFeeTransactionEntry = feeTransactionEntryList.get(feeTransactionEntryList.size() - 1);
        assertThat(testFeeTransactionEntry.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testFeeTransactionEntry.getValue()).isEqualTo(UPDATED_VALUE);
    }

    @Test
    @Transactional
    void putNonExistingFeeTransactionEntry() throws Exception {
        int databaseSizeBeforeUpdate = feeTransactionEntryRepository.findAll().size();
        feeTransactionEntry.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFeeTransactionEntryMockMvc
            .perform(
                put(ENTITY_API_URL_ID, feeTransactionEntry.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(feeTransactionEntry))
            )
            .andExpect(status().isBadRequest());

        // Validate the FeeTransactionEntry in the database
        List<FeeTransactionEntry> feeTransactionEntryList = feeTransactionEntryRepository.findAll();
        assertThat(feeTransactionEntryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchFeeTransactionEntry() throws Exception {
        int databaseSizeBeforeUpdate = feeTransactionEntryRepository.findAll().size();
        feeTransactionEntry.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFeeTransactionEntryMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(feeTransactionEntry))
            )
            .andExpect(status().isBadRequest());

        // Validate the FeeTransactionEntry in the database
        List<FeeTransactionEntry> feeTransactionEntryList = feeTransactionEntryRepository.findAll();
        assertThat(feeTransactionEntryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamFeeTransactionEntry() throws Exception {
        int databaseSizeBeforeUpdate = feeTransactionEntryRepository.findAll().size();
        feeTransactionEntry.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFeeTransactionEntryMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(feeTransactionEntry))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the FeeTransactionEntry in the database
        List<FeeTransactionEntry> feeTransactionEntryList = feeTransactionEntryRepository.findAll();
        assertThat(feeTransactionEntryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateFeeTransactionEntryWithPatch() throws Exception {
        // Initialize the database
        feeTransactionEntryRepository.saveAndFlush(feeTransactionEntry);

        int databaseSizeBeforeUpdate = feeTransactionEntryRepository.findAll().size();

        // Update the feeTransactionEntry using partial update
        FeeTransactionEntry partialUpdatedFeeTransactionEntry = new FeeTransactionEntry();
        partialUpdatedFeeTransactionEntry.setId(feeTransactionEntry.getId());

        restFeeTransactionEntryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFeeTransactionEntry.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFeeTransactionEntry))
            )
            .andExpect(status().isOk());

        // Validate the FeeTransactionEntry in the database
        List<FeeTransactionEntry> feeTransactionEntryList = feeTransactionEntryRepository.findAll();
        assertThat(feeTransactionEntryList).hasSize(databaseSizeBeforeUpdate);
        FeeTransactionEntry testFeeTransactionEntry = feeTransactionEntryList.get(feeTransactionEntryList.size() - 1);
        assertThat(testFeeTransactionEntry.getType()).isEqualTo(DEFAULT_TYPE);
        assertThat(testFeeTransactionEntry.getValue()).isEqualTo(DEFAULT_VALUE);
    }

    @Test
    @Transactional
    void fullUpdateFeeTransactionEntryWithPatch() throws Exception {
        // Initialize the database
        feeTransactionEntryRepository.saveAndFlush(feeTransactionEntry);

        int databaseSizeBeforeUpdate = feeTransactionEntryRepository.findAll().size();

        // Update the feeTransactionEntry using partial update
        FeeTransactionEntry partialUpdatedFeeTransactionEntry = new FeeTransactionEntry();
        partialUpdatedFeeTransactionEntry.setId(feeTransactionEntry.getId());

        partialUpdatedFeeTransactionEntry.type(UPDATED_TYPE).value(UPDATED_VALUE);

        restFeeTransactionEntryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFeeTransactionEntry.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFeeTransactionEntry))
            )
            .andExpect(status().isOk());

        // Validate the FeeTransactionEntry in the database
        List<FeeTransactionEntry> feeTransactionEntryList = feeTransactionEntryRepository.findAll();
        assertThat(feeTransactionEntryList).hasSize(databaseSizeBeforeUpdate);
        FeeTransactionEntry testFeeTransactionEntry = feeTransactionEntryList.get(feeTransactionEntryList.size() - 1);
        assertThat(testFeeTransactionEntry.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testFeeTransactionEntry.getValue()).isEqualTo(UPDATED_VALUE);
    }

    @Test
    @Transactional
    void patchNonExistingFeeTransactionEntry() throws Exception {
        int databaseSizeBeforeUpdate = feeTransactionEntryRepository.findAll().size();
        feeTransactionEntry.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFeeTransactionEntryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, feeTransactionEntry.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(feeTransactionEntry))
            )
            .andExpect(status().isBadRequest());

        // Validate the FeeTransactionEntry in the database
        List<FeeTransactionEntry> feeTransactionEntryList = feeTransactionEntryRepository.findAll();
        assertThat(feeTransactionEntryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchFeeTransactionEntry() throws Exception {
        int databaseSizeBeforeUpdate = feeTransactionEntryRepository.findAll().size();
        feeTransactionEntry.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFeeTransactionEntryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(feeTransactionEntry))
            )
            .andExpect(status().isBadRequest());

        // Validate the FeeTransactionEntry in the database
        List<FeeTransactionEntry> feeTransactionEntryList = feeTransactionEntryRepository.findAll();
        assertThat(feeTransactionEntryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamFeeTransactionEntry() throws Exception {
        int databaseSizeBeforeUpdate = feeTransactionEntryRepository.findAll().size();
        feeTransactionEntry.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFeeTransactionEntryMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(feeTransactionEntry))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the FeeTransactionEntry in the database
        List<FeeTransactionEntry> feeTransactionEntryList = feeTransactionEntryRepository.findAll();
        assertThat(feeTransactionEntryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteFeeTransactionEntry() throws Exception {
        // Initialize the database
        feeTransactionEntryRepository.saveAndFlush(feeTransactionEntry);

        int databaseSizeBeforeDelete = feeTransactionEntryRepository.findAll().size();

        // Delete the feeTransactionEntry
        restFeeTransactionEntryMockMvc
            .perform(delete(ENTITY_API_URL_ID, feeTransactionEntry.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<FeeTransactionEntry> feeTransactionEntryList = feeTransactionEntryRepository.findAll();
        assertThat(feeTransactionEntryList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
