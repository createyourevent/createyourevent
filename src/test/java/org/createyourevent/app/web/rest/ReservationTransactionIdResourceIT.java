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
import org.createyourevent.app.domain.ReservationTransactionId;
import org.createyourevent.app.repository.ReservationTransactionIdRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link ReservationTransactionIdResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ReservationTransactionIdResourceIT {

    private static final String DEFAULT_TRANSACTION_DEPOSIT_ID = "AAAAAAAAAA";
    private static final String UPDATED_TRANSACTION_DEPOSIT_ID = "BBBBBBBBBB";

    private static final String DEFAULT_TRANSACTION_ID = "AAAAAAAAAA";
    private static final String UPDATED_TRANSACTION_ID = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/reservation-transaction-ids";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ReservationTransactionIdRepository reservationTransactionIdRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restReservationTransactionIdMockMvc;

    private ReservationTransactionId reservationTransactionId;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ReservationTransactionId createEntity(EntityManager em) {
        ReservationTransactionId reservationTransactionId = new ReservationTransactionId()
            .transactionDepositId(DEFAULT_TRANSACTION_DEPOSIT_ID)
            .transactionId(DEFAULT_TRANSACTION_ID);
        return reservationTransactionId;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ReservationTransactionId createUpdatedEntity(EntityManager em) {
        ReservationTransactionId reservationTransactionId = new ReservationTransactionId()
            .transactionDepositId(UPDATED_TRANSACTION_DEPOSIT_ID)
            .transactionId(UPDATED_TRANSACTION_ID);
        return reservationTransactionId;
    }

    @BeforeEach
    public void initTest() {
        reservationTransactionId = createEntity(em);
    }

    @Test
    @Transactional
    void createReservationTransactionId() throws Exception {
        int databaseSizeBeforeCreate = reservationTransactionIdRepository.findAll().size();
        // Create the ReservationTransactionId
        restReservationTransactionIdMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(reservationTransactionId))
            )
            .andExpect(status().isCreated());

        // Validate the ReservationTransactionId in the database
        List<ReservationTransactionId> reservationTransactionIdList = reservationTransactionIdRepository.findAll();
        assertThat(reservationTransactionIdList).hasSize(databaseSizeBeforeCreate + 1);
        ReservationTransactionId testReservationTransactionId = reservationTransactionIdList.get(reservationTransactionIdList.size() - 1);
        assertThat(testReservationTransactionId.getTransactionDepositId()).isEqualTo(DEFAULT_TRANSACTION_DEPOSIT_ID);
        assertThat(testReservationTransactionId.getTransactionId()).isEqualTo(DEFAULT_TRANSACTION_ID);
    }

    @Test
    @Transactional
    void createReservationTransactionIdWithExistingId() throws Exception {
        // Create the ReservationTransactionId with an existing ID
        reservationTransactionId.setId(1L);

        int databaseSizeBeforeCreate = reservationTransactionIdRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restReservationTransactionIdMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(reservationTransactionId))
            )
            .andExpect(status().isBadRequest());

        // Validate the ReservationTransactionId in the database
        List<ReservationTransactionId> reservationTransactionIdList = reservationTransactionIdRepository.findAll();
        assertThat(reservationTransactionIdList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllReservationTransactionIds() throws Exception {
        // Initialize the database
        reservationTransactionIdRepository.saveAndFlush(reservationTransactionId);

        // Get all the reservationTransactionIdList
        restReservationTransactionIdMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(reservationTransactionId.getId().intValue())))
            .andExpect(jsonPath("$.[*].transactionDepositId").value(hasItem(DEFAULT_TRANSACTION_DEPOSIT_ID)))
            .andExpect(jsonPath("$.[*].transactionId").value(hasItem(DEFAULT_TRANSACTION_ID)));
    }

    @Test
    @Transactional
    void getReservationTransactionId() throws Exception {
        // Initialize the database
        reservationTransactionIdRepository.saveAndFlush(reservationTransactionId);

        // Get the reservationTransactionId
        restReservationTransactionIdMockMvc
            .perform(get(ENTITY_API_URL_ID, reservationTransactionId.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(reservationTransactionId.getId().intValue()))
            .andExpect(jsonPath("$.transactionDepositId").value(DEFAULT_TRANSACTION_DEPOSIT_ID))
            .andExpect(jsonPath("$.transactionId").value(DEFAULT_TRANSACTION_ID));
    }

    @Test
    @Transactional
    void getNonExistingReservationTransactionId() throws Exception {
        // Get the reservationTransactionId
        restReservationTransactionIdMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewReservationTransactionId() throws Exception {
        // Initialize the database
        reservationTransactionIdRepository.saveAndFlush(reservationTransactionId);

        int databaseSizeBeforeUpdate = reservationTransactionIdRepository.findAll().size();

        // Update the reservationTransactionId
        ReservationTransactionId updatedReservationTransactionId = reservationTransactionIdRepository
            .findById(reservationTransactionId.getId())
            .get();
        // Disconnect from session so that the updates on updatedReservationTransactionId are not directly saved in db
        em.detach(updatedReservationTransactionId);
        updatedReservationTransactionId.transactionDepositId(UPDATED_TRANSACTION_DEPOSIT_ID).transactionId(UPDATED_TRANSACTION_ID);

        restReservationTransactionIdMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedReservationTransactionId.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedReservationTransactionId))
            )
            .andExpect(status().isOk());

        // Validate the ReservationTransactionId in the database
        List<ReservationTransactionId> reservationTransactionIdList = reservationTransactionIdRepository.findAll();
        assertThat(reservationTransactionIdList).hasSize(databaseSizeBeforeUpdate);
        ReservationTransactionId testReservationTransactionId = reservationTransactionIdList.get(reservationTransactionIdList.size() - 1);
        assertThat(testReservationTransactionId.getTransactionDepositId()).isEqualTo(UPDATED_TRANSACTION_DEPOSIT_ID);
        assertThat(testReservationTransactionId.getTransactionId()).isEqualTo(UPDATED_TRANSACTION_ID);
    }

    @Test
    @Transactional
    void putNonExistingReservationTransactionId() throws Exception {
        int databaseSizeBeforeUpdate = reservationTransactionIdRepository.findAll().size();
        reservationTransactionId.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restReservationTransactionIdMockMvc
            .perform(
                put(ENTITY_API_URL_ID, reservationTransactionId.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(reservationTransactionId))
            )
            .andExpect(status().isBadRequest());

        // Validate the ReservationTransactionId in the database
        List<ReservationTransactionId> reservationTransactionIdList = reservationTransactionIdRepository.findAll();
        assertThat(reservationTransactionIdList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchReservationTransactionId() throws Exception {
        int databaseSizeBeforeUpdate = reservationTransactionIdRepository.findAll().size();
        reservationTransactionId.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restReservationTransactionIdMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(reservationTransactionId))
            )
            .andExpect(status().isBadRequest());

        // Validate the ReservationTransactionId in the database
        List<ReservationTransactionId> reservationTransactionIdList = reservationTransactionIdRepository.findAll();
        assertThat(reservationTransactionIdList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamReservationTransactionId() throws Exception {
        int databaseSizeBeforeUpdate = reservationTransactionIdRepository.findAll().size();
        reservationTransactionId.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restReservationTransactionIdMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(reservationTransactionId))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ReservationTransactionId in the database
        List<ReservationTransactionId> reservationTransactionIdList = reservationTransactionIdRepository.findAll();
        assertThat(reservationTransactionIdList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateReservationTransactionIdWithPatch() throws Exception {
        // Initialize the database
        reservationTransactionIdRepository.saveAndFlush(reservationTransactionId);

        int databaseSizeBeforeUpdate = reservationTransactionIdRepository.findAll().size();

        // Update the reservationTransactionId using partial update
        ReservationTransactionId partialUpdatedReservationTransactionId = new ReservationTransactionId();
        partialUpdatedReservationTransactionId.setId(reservationTransactionId.getId());

        partialUpdatedReservationTransactionId.transactionId(UPDATED_TRANSACTION_ID);

        restReservationTransactionIdMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedReservationTransactionId.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedReservationTransactionId))
            )
            .andExpect(status().isOk());

        // Validate the ReservationTransactionId in the database
        List<ReservationTransactionId> reservationTransactionIdList = reservationTransactionIdRepository.findAll();
        assertThat(reservationTransactionIdList).hasSize(databaseSizeBeforeUpdate);
        ReservationTransactionId testReservationTransactionId = reservationTransactionIdList.get(reservationTransactionIdList.size() - 1);
        assertThat(testReservationTransactionId.getTransactionDepositId()).isEqualTo(DEFAULT_TRANSACTION_DEPOSIT_ID);
        assertThat(testReservationTransactionId.getTransactionId()).isEqualTo(UPDATED_TRANSACTION_ID);
    }

    @Test
    @Transactional
    void fullUpdateReservationTransactionIdWithPatch() throws Exception {
        // Initialize the database
        reservationTransactionIdRepository.saveAndFlush(reservationTransactionId);

        int databaseSizeBeforeUpdate = reservationTransactionIdRepository.findAll().size();

        // Update the reservationTransactionId using partial update
        ReservationTransactionId partialUpdatedReservationTransactionId = new ReservationTransactionId();
        partialUpdatedReservationTransactionId.setId(reservationTransactionId.getId());

        partialUpdatedReservationTransactionId.transactionDepositId(UPDATED_TRANSACTION_DEPOSIT_ID).transactionId(UPDATED_TRANSACTION_ID);

        restReservationTransactionIdMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedReservationTransactionId.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedReservationTransactionId))
            )
            .andExpect(status().isOk());

        // Validate the ReservationTransactionId in the database
        List<ReservationTransactionId> reservationTransactionIdList = reservationTransactionIdRepository.findAll();
        assertThat(reservationTransactionIdList).hasSize(databaseSizeBeforeUpdate);
        ReservationTransactionId testReservationTransactionId = reservationTransactionIdList.get(reservationTransactionIdList.size() - 1);
        assertThat(testReservationTransactionId.getTransactionDepositId()).isEqualTo(UPDATED_TRANSACTION_DEPOSIT_ID);
        assertThat(testReservationTransactionId.getTransactionId()).isEqualTo(UPDATED_TRANSACTION_ID);
    }

    @Test
    @Transactional
    void patchNonExistingReservationTransactionId() throws Exception {
        int databaseSizeBeforeUpdate = reservationTransactionIdRepository.findAll().size();
        reservationTransactionId.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restReservationTransactionIdMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, reservationTransactionId.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(reservationTransactionId))
            )
            .andExpect(status().isBadRequest());

        // Validate the ReservationTransactionId in the database
        List<ReservationTransactionId> reservationTransactionIdList = reservationTransactionIdRepository.findAll();
        assertThat(reservationTransactionIdList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchReservationTransactionId() throws Exception {
        int databaseSizeBeforeUpdate = reservationTransactionIdRepository.findAll().size();
        reservationTransactionId.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restReservationTransactionIdMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(reservationTransactionId))
            )
            .andExpect(status().isBadRequest());

        // Validate the ReservationTransactionId in the database
        List<ReservationTransactionId> reservationTransactionIdList = reservationTransactionIdRepository.findAll();
        assertThat(reservationTransactionIdList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamReservationTransactionId() throws Exception {
        int databaseSizeBeforeUpdate = reservationTransactionIdRepository.findAll().size();
        reservationTransactionId.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restReservationTransactionIdMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(reservationTransactionId))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ReservationTransactionId in the database
        List<ReservationTransactionId> reservationTransactionIdList = reservationTransactionIdRepository.findAll();
        assertThat(reservationTransactionIdList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteReservationTransactionId() throws Exception {
        // Initialize the database
        reservationTransactionIdRepository.saveAndFlush(reservationTransactionId);

        int databaseSizeBeforeDelete = reservationTransactionIdRepository.findAll().size();

        // Delete the reservationTransactionId
        restReservationTransactionIdMockMvc
            .perform(delete(ENTITY_API_URL_ID, reservationTransactionId.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ReservationTransactionId> reservationTransactionIdList = reservationTransactionIdRepository.findAll();
        assertThat(reservationTransactionIdList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
