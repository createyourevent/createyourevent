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
import org.createyourevent.app.domain.SlotListPlum;
import org.createyourevent.app.repository.SlotListPlumRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link SlotListPlumResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class SlotListPlumResourceIT {

    private static final String DEFAULT_COUPONS = "AAAAAAAAAA";
    private static final String UPDATED_COUPONS = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/slot-list-plums";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private SlotListPlumRepository slotListPlumRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restSlotListPlumMockMvc;

    private SlotListPlum slotListPlum;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SlotListPlum createEntity(EntityManager em) {
        SlotListPlum slotListPlum = new SlotListPlum().coupons(DEFAULT_COUPONS);
        return slotListPlum;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SlotListPlum createUpdatedEntity(EntityManager em) {
        SlotListPlum slotListPlum = new SlotListPlum().coupons(UPDATED_COUPONS);
        return slotListPlum;
    }

    @BeforeEach
    public void initTest() {
        slotListPlum = createEntity(em);
    }

    @Test
    @Transactional
    void createSlotListPlum() throws Exception {
        int databaseSizeBeforeCreate = slotListPlumRepository.findAll().size();
        // Create the SlotListPlum
        restSlotListPlumMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(slotListPlum))
            )
            .andExpect(status().isCreated());

        // Validate the SlotListPlum in the database
        List<SlotListPlum> slotListPlumList = slotListPlumRepository.findAll();
        assertThat(slotListPlumList).hasSize(databaseSizeBeforeCreate + 1);
        SlotListPlum testSlotListPlum = slotListPlumList.get(slotListPlumList.size() - 1);
        assertThat(testSlotListPlum.getCoupons()).isEqualTo(DEFAULT_COUPONS);
    }

    @Test
    @Transactional
    void createSlotListPlumWithExistingId() throws Exception {
        // Create the SlotListPlum with an existing ID
        slotListPlum.setId(1L);

        int databaseSizeBeforeCreate = slotListPlumRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restSlotListPlumMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(slotListPlum))
            )
            .andExpect(status().isBadRequest());

        // Validate the SlotListPlum in the database
        List<SlotListPlum> slotListPlumList = slotListPlumRepository.findAll();
        assertThat(slotListPlumList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllSlotListPlums() throws Exception {
        // Initialize the database
        slotListPlumRepository.saveAndFlush(slotListPlum);

        // Get all the slotListPlumList
        restSlotListPlumMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(slotListPlum.getId().intValue())))
            .andExpect(jsonPath("$.[*].coupons").value(hasItem(DEFAULT_COUPONS)));
    }

    @Test
    @Transactional
    void getSlotListPlum() throws Exception {
        // Initialize the database
        slotListPlumRepository.saveAndFlush(slotListPlum);

        // Get the slotListPlum
        restSlotListPlumMockMvc
            .perform(get(ENTITY_API_URL_ID, slotListPlum.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(slotListPlum.getId().intValue()))
            .andExpect(jsonPath("$.coupons").value(DEFAULT_COUPONS));
    }

    @Test
    @Transactional
    void getNonExistingSlotListPlum() throws Exception {
        // Get the slotListPlum
        restSlotListPlumMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewSlotListPlum() throws Exception {
        // Initialize the database
        slotListPlumRepository.saveAndFlush(slotListPlum);

        int databaseSizeBeforeUpdate = slotListPlumRepository.findAll().size();

        // Update the slotListPlum
        SlotListPlum updatedSlotListPlum = slotListPlumRepository.findById(slotListPlum.getId()).get();
        // Disconnect from session so that the updates on updatedSlotListPlum are not directly saved in db
        em.detach(updatedSlotListPlum);
        updatedSlotListPlum.coupons(UPDATED_COUPONS);

        restSlotListPlumMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedSlotListPlum.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedSlotListPlum))
            )
            .andExpect(status().isOk());

        // Validate the SlotListPlum in the database
        List<SlotListPlum> slotListPlumList = slotListPlumRepository.findAll();
        assertThat(slotListPlumList).hasSize(databaseSizeBeforeUpdate);
        SlotListPlum testSlotListPlum = slotListPlumList.get(slotListPlumList.size() - 1);
        assertThat(testSlotListPlum.getCoupons()).isEqualTo(UPDATED_COUPONS);
    }

    @Test
    @Transactional
    void putNonExistingSlotListPlum() throws Exception {
        int databaseSizeBeforeUpdate = slotListPlumRepository.findAll().size();
        slotListPlum.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSlotListPlumMockMvc
            .perform(
                put(ENTITY_API_URL_ID, slotListPlum.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(slotListPlum))
            )
            .andExpect(status().isBadRequest());

        // Validate the SlotListPlum in the database
        List<SlotListPlum> slotListPlumList = slotListPlumRepository.findAll();
        assertThat(slotListPlumList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchSlotListPlum() throws Exception {
        int databaseSizeBeforeUpdate = slotListPlumRepository.findAll().size();
        slotListPlum.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSlotListPlumMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(slotListPlum))
            )
            .andExpect(status().isBadRequest());

        // Validate the SlotListPlum in the database
        List<SlotListPlum> slotListPlumList = slotListPlumRepository.findAll();
        assertThat(slotListPlumList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamSlotListPlum() throws Exception {
        int databaseSizeBeforeUpdate = slotListPlumRepository.findAll().size();
        slotListPlum.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSlotListPlumMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(slotListPlum))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the SlotListPlum in the database
        List<SlotListPlum> slotListPlumList = slotListPlumRepository.findAll();
        assertThat(slotListPlumList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateSlotListPlumWithPatch() throws Exception {
        // Initialize the database
        slotListPlumRepository.saveAndFlush(slotListPlum);

        int databaseSizeBeforeUpdate = slotListPlumRepository.findAll().size();

        // Update the slotListPlum using partial update
        SlotListPlum partialUpdatedSlotListPlum = new SlotListPlum();
        partialUpdatedSlotListPlum.setId(slotListPlum.getId());

        partialUpdatedSlotListPlum.coupons(UPDATED_COUPONS);

        restSlotListPlumMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSlotListPlum.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSlotListPlum))
            )
            .andExpect(status().isOk());

        // Validate the SlotListPlum in the database
        List<SlotListPlum> slotListPlumList = slotListPlumRepository.findAll();
        assertThat(slotListPlumList).hasSize(databaseSizeBeforeUpdate);
        SlotListPlum testSlotListPlum = slotListPlumList.get(slotListPlumList.size() - 1);
        assertThat(testSlotListPlum.getCoupons()).isEqualTo(UPDATED_COUPONS);
    }

    @Test
    @Transactional
    void fullUpdateSlotListPlumWithPatch() throws Exception {
        // Initialize the database
        slotListPlumRepository.saveAndFlush(slotListPlum);

        int databaseSizeBeforeUpdate = slotListPlumRepository.findAll().size();

        // Update the slotListPlum using partial update
        SlotListPlum partialUpdatedSlotListPlum = new SlotListPlum();
        partialUpdatedSlotListPlum.setId(slotListPlum.getId());

        partialUpdatedSlotListPlum.coupons(UPDATED_COUPONS);

        restSlotListPlumMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSlotListPlum.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSlotListPlum))
            )
            .andExpect(status().isOk());

        // Validate the SlotListPlum in the database
        List<SlotListPlum> slotListPlumList = slotListPlumRepository.findAll();
        assertThat(slotListPlumList).hasSize(databaseSizeBeforeUpdate);
        SlotListPlum testSlotListPlum = slotListPlumList.get(slotListPlumList.size() - 1);
        assertThat(testSlotListPlum.getCoupons()).isEqualTo(UPDATED_COUPONS);
    }

    @Test
    @Transactional
    void patchNonExistingSlotListPlum() throws Exception {
        int databaseSizeBeforeUpdate = slotListPlumRepository.findAll().size();
        slotListPlum.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSlotListPlumMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, slotListPlum.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(slotListPlum))
            )
            .andExpect(status().isBadRequest());

        // Validate the SlotListPlum in the database
        List<SlotListPlum> slotListPlumList = slotListPlumRepository.findAll();
        assertThat(slotListPlumList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchSlotListPlum() throws Exception {
        int databaseSizeBeforeUpdate = slotListPlumRepository.findAll().size();
        slotListPlum.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSlotListPlumMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(slotListPlum))
            )
            .andExpect(status().isBadRequest());

        // Validate the SlotListPlum in the database
        List<SlotListPlum> slotListPlumList = slotListPlumRepository.findAll();
        assertThat(slotListPlumList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamSlotListPlum() throws Exception {
        int databaseSizeBeforeUpdate = slotListPlumRepository.findAll().size();
        slotListPlum.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSlotListPlumMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(slotListPlum))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the SlotListPlum in the database
        List<SlotListPlum> slotListPlumList = slotListPlumRepository.findAll();
        assertThat(slotListPlumList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteSlotListPlum() throws Exception {
        // Initialize the database
        slotListPlumRepository.saveAndFlush(slotListPlum);

        int databaseSizeBeforeDelete = slotListPlumRepository.findAll().size();

        // Delete the slotListPlum
        restSlotListPlumMockMvc
            .perform(delete(ENTITY_API_URL_ID, slotListPlum.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<SlotListPlum> slotListPlumList = slotListPlumRepository.findAll();
        assertThat(slotListPlumList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
