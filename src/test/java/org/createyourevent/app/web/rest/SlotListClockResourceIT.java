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
import org.createyourevent.app.domain.SlotListClock;
import org.createyourevent.app.repository.SlotListClockRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link SlotListClockResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class SlotListClockResourceIT {

    private static final String DEFAULT_COUPONS = "AAAAAAAAAA";
    private static final String UPDATED_COUPONS = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/slot-list-clocks";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private SlotListClockRepository slotListClockRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restSlotListClockMockMvc;

    private SlotListClock slotListClock;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SlotListClock createEntity(EntityManager em) {
        SlotListClock slotListClock = new SlotListClock().coupons(DEFAULT_COUPONS);
        return slotListClock;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SlotListClock createUpdatedEntity(EntityManager em) {
        SlotListClock slotListClock = new SlotListClock().coupons(UPDATED_COUPONS);
        return slotListClock;
    }

    @BeforeEach
    public void initTest() {
        slotListClock = createEntity(em);
    }

    @Test
    @Transactional
    void createSlotListClock() throws Exception {
        int databaseSizeBeforeCreate = slotListClockRepository.findAll().size();
        // Create the SlotListClock
        restSlotListClockMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(slotListClock))
            )
            .andExpect(status().isCreated());

        // Validate the SlotListClock in the database
        List<SlotListClock> slotListClockList = slotListClockRepository.findAll();
        assertThat(slotListClockList).hasSize(databaseSizeBeforeCreate + 1);
        SlotListClock testSlotListClock = slotListClockList.get(slotListClockList.size() - 1);
        assertThat(testSlotListClock.getCoupons()).isEqualTo(DEFAULT_COUPONS);
    }

    @Test
    @Transactional
    void createSlotListClockWithExistingId() throws Exception {
        // Create the SlotListClock with an existing ID
        slotListClock.setId(1L);

        int databaseSizeBeforeCreate = slotListClockRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restSlotListClockMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(slotListClock))
            )
            .andExpect(status().isBadRequest());

        // Validate the SlotListClock in the database
        List<SlotListClock> slotListClockList = slotListClockRepository.findAll();
        assertThat(slotListClockList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllSlotListClocks() throws Exception {
        // Initialize the database
        slotListClockRepository.saveAndFlush(slotListClock);

        // Get all the slotListClockList
        restSlotListClockMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(slotListClock.getId().intValue())))
            .andExpect(jsonPath("$.[*].coupons").value(hasItem(DEFAULT_COUPONS)));
    }

    @Test
    @Transactional
    void getSlotListClock() throws Exception {
        // Initialize the database
        slotListClockRepository.saveAndFlush(slotListClock);

        // Get the slotListClock
        restSlotListClockMockMvc
            .perform(get(ENTITY_API_URL_ID, slotListClock.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(slotListClock.getId().intValue()))
            .andExpect(jsonPath("$.coupons").value(DEFAULT_COUPONS));
    }

    @Test
    @Transactional
    void getNonExistingSlotListClock() throws Exception {
        // Get the slotListClock
        restSlotListClockMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewSlotListClock() throws Exception {
        // Initialize the database
        slotListClockRepository.saveAndFlush(slotListClock);

        int databaseSizeBeforeUpdate = slotListClockRepository.findAll().size();

        // Update the slotListClock
        SlotListClock updatedSlotListClock = slotListClockRepository.findById(slotListClock.getId()).get();
        // Disconnect from session so that the updates on updatedSlotListClock are not directly saved in db
        em.detach(updatedSlotListClock);
        updatedSlotListClock.coupons(UPDATED_COUPONS);

        restSlotListClockMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedSlotListClock.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedSlotListClock))
            )
            .andExpect(status().isOk());

        // Validate the SlotListClock in the database
        List<SlotListClock> slotListClockList = slotListClockRepository.findAll();
        assertThat(slotListClockList).hasSize(databaseSizeBeforeUpdate);
        SlotListClock testSlotListClock = slotListClockList.get(slotListClockList.size() - 1);
        assertThat(testSlotListClock.getCoupons()).isEqualTo(UPDATED_COUPONS);
    }

    @Test
    @Transactional
    void putNonExistingSlotListClock() throws Exception {
        int databaseSizeBeforeUpdate = slotListClockRepository.findAll().size();
        slotListClock.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSlotListClockMockMvc
            .perform(
                put(ENTITY_API_URL_ID, slotListClock.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(slotListClock))
            )
            .andExpect(status().isBadRequest());

        // Validate the SlotListClock in the database
        List<SlotListClock> slotListClockList = slotListClockRepository.findAll();
        assertThat(slotListClockList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchSlotListClock() throws Exception {
        int databaseSizeBeforeUpdate = slotListClockRepository.findAll().size();
        slotListClock.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSlotListClockMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(slotListClock))
            )
            .andExpect(status().isBadRequest());

        // Validate the SlotListClock in the database
        List<SlotListClock> slotListClockList = slotListClockRepository.findAll();
        assertThat(slotListClockList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamSlotListClock() throws Exception {
        int databaseSizeBeforeUpdate = slotListClockRepository.findAll().size();
        slotListClock.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSlotListClockMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(slotListClock))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the SlotListClock in the database
        List<SlotListClock> slotListClockList = slotListClockRepository.findAll();
        assertThat(slotListClockList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateSlotListClockWithPatch() throws Exception {
        // Initialize the database
        slotListClockRepository.saveAndFlush(slotListClock);

        int databaseSizeBeforeUpdate = slotListClockRepository.findAll().size();

        // Update the slotListClock using partial update
        SlotListClock partialUpdatedSlotListClock = new SlotListClock();
        partialUpdatedSlotListClock.setId(slotListClock.getId());

        partialUpdatedSlotListClock.coupons(UPDATED_COUPONS);

        restSlotListClockMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSlotListClock.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSlotListClock))
            )
            .andExpect(status().isOk());

        // Validate the SlotListClock in the database
        List<SlotListClock> slotListClockList = slotListClockRepository.findAll();
        assertThat(slotListClockList).hasSize(databaseSizeBeforeUpdate);
        SlotListClock testSlotListClock = slotListClockList.get(slotListClockList.size() - 1);
        assertThat(testSlotListClock.getCoupons()).isEqualTo(UPDATED_COUPONS);
    }

    @Test
    @Transactional
    void fullUpdateSlotListClockWithPatch() throws Exception {
        // Initialize the database
        slotListClockRepository.saveAndFlush(slotListClock);

        int databaseSizeBeforeUpdate = slotListClockRepository.findAll().size();

        // Update the slotListClock using partial update
        SlotListClock partialUpdatedSlotListClock = new SlotListClock();
        partialUpdatedSlotListClock.setId(slotListClock.getId());

        partialUpdatedSlotListClock.coupons(UPDATED_COUPONS);

        restSlotListClockMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSlotListClock.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSlotListClock))
            )
            .andExpect(status().isOk());

        // Validate the SlotListClock in the database
        List<SlotListClock> slotListClockList = slotListClockRepository.findAll();
        assertThat(slotListClockList).hasSize(databaseSizeBeforeUpdate);
        SlotListClock testSlotListClock = slotListClockList.get(slotListClockList.size() - 1);
        assertThat(testSlotListClock.getCoupons()).isEqualTo(UPDATED_COUPONS);
    }

    @Test
    @Transactional
    void patchNonExistingSlotListClock() throws Exception {
        int databaseSizeBeforeUpdate = slotListClockRepository.findAll().size();
        slotListClock.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSlotListClockMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, slotListClock.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(slotListClock))
            )
            .andExpect(status().isBadRequest());

        // Validate the SlotListClock in the database
        List<SlotListClock> slotListClockList = slotListClockRepository.findAll();
        assertThat(slotListClockList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchSlotListClock() throws Exception {
        int databaseSizeBeforeUpdate = slotListClockRepository.findAll().size();
        slotListClock.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSlotListClockMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(slotListClock))
            )
            .andExpect(status().isBadRequest());

        // Validate the SlotListClock in the database
        List<SlotListClock> slotListClockList = slotListClockRepository.findAll();
        assertThat(slotListClockList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamSlotListClock() throws Exception {
        int databaseSizeBeforeUpdate = slotListClockRepository.findAll().size();
        slotListClock.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSlotListClockMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(slotListClock))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the SlotListClock in the database
        List<SlotListClock> slotListClockList = slotListClockRepository.findAll();
        assertThat(slotListClockList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteSlotListClock() throws Exception {
        // Initialize the database
        slotListClockRepository.saveAndFlush(slotListClock);

        int databaseSizeBeforeDelete = slotListClockRepository.findAll().size();

        // Delete the slotListClock
        restSlotListClockMockMvc
            .perform(delete(ENTITY_API_URL_ID, slotListClock.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<SlotListClock> slotListClockList = slotListClockRepository.findAll();
        assertThat(slotListClockList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
