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
import org.createyourevent.app.domain.SlotListCherry;
import org.createyourevent.app.repository.SlotListCherryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link SlotListCherryResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class SlotListCherryResourceIT {

    private static final String DEFAULT_COUPONS = "AAAAAAAAAA";
    private static final String UPDATED_COUPONS = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/slot-list-cherries";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private SlotListCherryRepository slotListCherryRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restSlotListCherryMockMvc;

    private SlotListCherry slotListCherry;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SlotListCherry createEntity(EntityManager em) {
        SlotListCherry slotListCherry = new SlotListCherry().coupons(DEFAULT_COUPONS);
        return slotListCherry;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SlotListCherry createUpdatedEntity(EntityManager em) {
        SlotListCherry slotListCherry = new SlotListCherry().coupons(UPDATED_COUPONS);
        return slotListCherry;
    }

    @BeforeEach
    public void initTest() {
        slotListCherry = createEntity(em);
    }

    @Test
    @Transactional
    void createSlotListCherry() throws Exception {
        int databaseSizeBeforeCreate = slotListCherryRepository.findAll().size();
        // Create the SlotListCherry
        restSlotListCherryMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(slotListCherry))
            )
            .andExpect(status().isCreated());

        // Validate the SlotListCherry in the database
        List<SlotListCherry> slotListCherryList = slotListCherryRepository.findAll();
        assertThat(slotListCherryList).hasSize(databaseSizeBeforeCreate + 1);
        SlotListCherry testSlotListCherry = slotListCherryList.get(slotListCherryList.size() - 1);
        assertThat(testSlotListCherry.getCoupons()).isEqualTo(DEFAULT_COUPONS);
    }

    @Test
    @Transactional
    void createSlotListCherryWithExistingId() throws Exception {
        // Create the SlotListCherry with an existing ID
        slotListCherry.setId(1L);

        int databaseSizeBeforeCreate = slotListCherryRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restSlotListCherryMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(slotListCherry))
            )
            .andExpect(status().isBadRequest());

        // Validate the SlotListCherry in the database
        List<SlotListCherry> slotListCherryList = slotListCherryRepository.findAll();
        assertThat(slotListCherryList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllSlotListCherries() throws Exception {
        // Initialize the database
        slotListCherryRepository.saveAndFlush(slotListCherry);

        // Get all the slotListCherryList
        restSlotListCherryMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(slotListCherry.getId().intValue())))
            .andExpect(jsonPath("$.[*].coupons").value(hasItem(DEFAULT_COUPONS)));
    }

    @Test
    @Transactional
    void getSlotListCherry() throws Exception {
        // Initialize the database
        slotListCherryRepository.saveAndFlush(slotListCherry);

        // Get the slotListCherry
        restSlotListCherryMockMvc
            .perform(get(ENTITY_API_URL_ID, slotListCherry.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(slotListCherry.getId().intValue()))
            .andExpect(jsonPath("$.coupons").value(DEFAULT_COUPONS));
    }

    @Test
    @Transactional
    void getNonExistingSlotListCherry() throws Exception {
        // Get the slotListCherry
        restSlotListCherryMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewSlotListCherry() throws Exception {
        // Initialize the database
        slotListCherryRepository.saveAndFlush(slotListCherry);

        int databaseSizeBeforeUpdate = slotListCherryRepository.findAll().size();

        // Update the slotListCherry
        SlotListCherry updatedSlotListCherry = slotListCherryRepository.findById(slotListCherry.getId()).get();
        // Disconnect from session so that the updates on updatedSlotListCherry are not directly saved in db
        em.detach(updatedSlotListCherry);
        updatedSlotListCherry.coupons(UPDATED_COUPONS);

        restSlotListCherryMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedSlotListCherry.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedSlotListCherry))
            )
            .andExpect(status().isOk());

        // Validate the SlotListCherry in the database
        List<SlotListCherry> slotListCherryList = slotListCherryRepository.findAll();
        assertThat(slotListCherryList).hasSize(databaseSizeBeforeUpdate);
        SlotListCherry testSlotListCherry = slotListCherryList.get(slotListCherryList.size() - 1);
        assertThat(testSlotListCherry.getCoupons()).isEqualTo(UPDATED_COUPONS);
    }

    @Test
    @Transactional
    void putNonExistingSlotListCherry() throws Exception {
        int databaseSizeBeforeUpdate = slotListCherryRepository.findAll().size();
        slotListCherry.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSlotListCherryMockMvc
            .perform(
                put(ENTITY_API_URL_ID, slotListCherry.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(slotListCherry))
            )
            .andExpect(status().isBadRequest());

        // Validate the SlotListCherry in the database
        List<SlotListCherry> slotListCherryList = slotListCherryRepository.findAll();
        assertThat(slotListCherryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchSlotListCherry() throws Exception {
        int databaseSizeBeforeUpdate = slotListCherryRepository.findAll().size();
        slotListCherry.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSlotListCherryMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(slotListCherry))
            )
            .andExpect(status().isBadRequest());

        // Validate the SlotListCherry in the database
        List<SlotListCherry> slotListCherryList = slotListCherryRepository.findAll();
        assertThat(slotListCherryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamSlotListCherry() throws Exception {
        int databaseSizeBeforeUpdate = slotListCherryRepository.findAll().size();
        slotListCherry.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSlotListCherryMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(slotListCherry))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the SlotListCherry in the database
        List<SlotListCherry> slotListCherryList = slotListCherryRepository.findAll();
        assertThat(slotListCherryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateSlotListCherryWithPatch() throws Exception {
        // Initialize the database
        slotListCherryRepository.saveAndFlush(slotListCherry);

        int databaseSizeBeforeUpdate = slotListCherryRepository.findAll().size();

        // Update the slotListCherry using partial update
        SlotListCherry partialUpdatedSlotListCherry = new SlotListCherry();
        partialUpdatedSlotListCherry.setId(slotListCherry.getId());

        restSlotListCherryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSlotListCherry.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSlotListCherry))
            )
            .andExpect(status().isOk());

        // Validate the SlotListCherry in the database
        List<SlotListCherry> slotListCherryList = slotListCherryRepository.findAll();
        assertThat(slotListCherryList).hasSize(databaseSizeBeforeUpdate);
        SlotListCherry testSlotListCherry = slotListCherryList.get(slotListCherryList.size() - 1);
        assertThat(testSlotListCherry.getCoupons()).isEqualTo(DEFAULT_COUPONS);
    }

    @Test
    @Transactional
    void fullUpdateSlotListCherryWithPatch() throws Exception {
        // Initialize the database
        slotListCherryRepository.saveAndFlush(slotListCherry);

        int databaseSizeBeforeUpdate = slotListCherryRepository.findAll().size();

        // Update the slotListCherry using partial update
        SlotListCherry partialUpdatedSlotListCherry = new SlotListCherry();
        partialUpdatedSlotListCherry.setId(slotListCherry.getId());

        partialUpdatedSlotListCherry.coupons(UPDATED_COUPONS);

        restSlotListCherryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSlotListCherry.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSlotListCherry))
            )
            .andExpect(status().isOk());

        // Validate the SlotListCherry in the database
        List<SlotListCherry> slotListCherryList = slotListCherryRepository.findAll();
        assertThat(slotListCherryList).hasSize(databaseSizeBeforeUpdate);
        SlotListCherry testSlotListCherry = slotListCherryList.get(slotListCherryList.size() - 1);
        assertThat(testSlotListCherry.getCoupons()).isEqualTo(UPDATED_COUPONS);
    }

    @Test
    @Transactional
    void patchNonExistingSlotListCherry() throws Exception {
        int databaseSizeBeforeUpdate = slotListCherryRepository.findAll().size();
        slotListCherry.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSlotListCherryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, slotListCherry.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(slotListCherry))
            )
            .andExpect(status().isBadRequest());

        // Validate the SlotListCherry in the database
        List<SlotListCherry> slotListCherryList = slotListCherryRepository.findAll();
        assertThat(slotListCherryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchSlotListCherry() throws Exception {
        int databaseSizeBeforeUpdate = slotListCherryRepository.findAll().size();
        slotListCherry.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSlotListCherryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(slotListCherry))
            )
            .andExpect(status().isBadRequest());

        // Validate the SlotListCherry in the database
        List<SlotListCherry> slotListCherryList = slotListCherryRepository.findAll();
        assertThat(slotListCherryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamSlotListCherry() throws Exception {
        int databaseSizeBeforeUpdate = slotListCherryRepository.findAll().size();
        slotListCherry.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSlotListCherryMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(slotListCherry))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the SlotListCherry in the database
        List<SlotListCherry> slotListCherryList = slotListCherryRepository.findAll();
        assertThat(slotListCherryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteSlotListCherry() throws Exception {
        // Initialize the database
        slotListCherryRepository.saveAndFlush(slotListCherry);

        int databaseSizeBeforeDelete = slotListCherryRepository.findAll().size();

        // Delete the slotListCherry
        restSlotListCherryMockMvc
            .perform(delete(ENTITY_API_URL_ID, slotListCherry.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<SlotListCherry> slotListCherryList = slotListCherryRepository.findAll();
        assertThat(slotListCherryList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
