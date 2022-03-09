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
import org.createyourevent.app.domain.SlotListOrange;
import org.createyourevent.app.repository.SlotListOrangeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link SlotListOrangeResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class SlotListOrangeResourceIT {

    private static final String DEFAULT_COUPONS = "AAAAAAAAAA";
    private static final String UPDATED_COUPONS = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/slot-list-oranges";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private SlotListOrangeRepository slotListOrangeRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restSlotListOrangeMockMvc;

    private SlotListOrange slotListOrange;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SlotListOrange createEntity(EntityManager em) {
        SlotListOrange slotListOrange = new SlotListOrange().coupons(DEFAULT_COUPONS);
        return slotListOrange;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SlotListOrange createUpdatedEntity(EntityManager em) {
        SlotListOrange slotListOrange = new SlotListOrange().coupons(UPDATED_COUPONS);
        return slotListOrange;
    }

    @BeforeEach
    public void initTest() {
        slotListOrange = createEntity(em);
    }

    @Test
    @Transactional
    void createSlotListOrange() throws Exception {
        int databaseSizeBeforeCreate = slotListOrangeRepository.findAll().size();
        // Create the SlotListOrange
        restSlotListOrangeMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(slotListOrange))
            )
            .andExpect(status().isCreated());

        // Validate the SlotListOrange in the database
        List<SlotListOrange> slotListOrangeList = slotListOrangeRepository.findAll();
        assertThat(slotListOrangeList).hasSize(databaseSizeBeforeCreate + 1);
        SlotListOrange testSlotListOrange = slotListOrangeList.get(slotListOrangeList.size() - 1);
        assertThat(testSlotListOrange.getCoupons()).isEqualTo(DEFAULT_COUPONS);
    }

    @Test
    @Transactional
    void createSlotListOrangeWithExistingId() throws Exception {
        // Create the SlotListOrange with an existing ID
        slotListOrange.setId(1L);

        int databaseSizeBeforeCreate = slotListOrangeRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restSlotListOrangeMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(slotListOrange))
            )
            .andExpect(status().isBadRequest());

        // Validate the SlotListOrange in the database
        List<SlotListOrange> slotListOrangeList = slotListOrangeRepository.findAll();
        assertThat(slotListOrangeList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllSlotListOranges() throws Exception {
        // Initialize the database
        slotListOrangeRepository.saveAndFlush(slotListOrange);

        // Get all the slotListOrangeList
        restSlotListOrangeMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(slotListOrange.getId().intValue())))
            .andExpect(jsonPath("$.[*].coupons").value(hasItem(DEFAULT_COUPONS)));
    }

    @Test
    @Transactional
    void getSlotListOrange() throws Exception {
        // Initialize the database
        slotListOrangeRepository.saveAndFlush(slotListOrange);

        // Get the slotListOrange
        restSlotListOrangeMockMvc
            .perform(get(ENTITY_API_URL_ID, slotListOrange.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(slotListOrange.getId().intValue()))
            .andExpect(jsonPath("$.coupons").value(DEFAULT_COUPONS));
    }

    @Test
    @Transactional
    void getNonExistingSlotListOrange() throws Exception {
        // Get the slotListOrange
        restSlotListOrangeMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewSlotListOrange() throws Exception {
        // Initialize the database
        slotListOrangeRepository.saveAndFlush(slotListOrange);

        int databaseSizeBeforeUpdate = slotListOrangeRepository.findAll().size();

        // Update the slotListOrange
        SlotListOrange updatedSlotListOrange = slotListOrangeRepository.findById(slotListOrange.getId()).get();
        // Disconnect from session so that the updates on updatedSlotListOrange are not directly saved in db
        em.detach(updatedSlotListOrange);
        updatedSlotListOrange.coupons(UPDATED_COUPONS);

        restSlotListOrangeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedSlotListOrange.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedSlotListOrange))
            )
            .andExpect(status().isOk());

        // Validate the SlotListOrange in the database
        List<SlotListOrange> slotListOrangeList = slotListOrangeRepository.findAll();
        assertThat(slotListOrangeList).hasSize(databaseSizeBeforeUpdate);
        SlotListOrange testSlotListOrange = slotListOrangeList.get(slotListOrangeList.size() - 1);
        assertThat(testSlotListOrange.getCoupons()).isEqualTo(UPDATED_COUPONS);
    }

    @Test
    @Transactional
    void putNonExistingSlotListOrange() throws Exception {
        int databaseSizeBeforeUpdate = slotListOrangeRepository.findAll().size();
        slotListOrange.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSlotListOrangeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, slotListOrange.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(slotListOrange))
            )
            .andExpect(status().isBadRequest());

        // Validate the SlotListOrange in the database
        List<SlotListOrange> slotListOrangeList = slotListOrangeRepository.findAll();
        assertThat(slotListOrangeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchSlotListOrange() throws Exception {
        int databaseSizeBeforeUpdate = slotListOrangeRepository.findAll().size();
        slotListOrange.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSlotListOrangeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(slotListOrange))
            )
            .andExpect(status().isBadRequest());

        // Validate the SlotListOrange in the database
        List<SlotListOrange> slotListOrangeList = slotListOrangeRepository.findAll();
        assertThat(slotListOrangeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamSlotListOrange() throws Exception {
        int databaseSizeBeforeUpdate = slotListOrangeRepository.findAll().size();
        slotListOrange.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSlotListOrangeMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(slotListOrange))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the SlotListOrange in the database
        List<SlotListOrange> slotListOrangeList = slotListOrangeRepository.findAll();
        assertThat(slotListOrangeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateSlotListOrangeWithPatch() throws Exception {
        // Initialize the database
        slotListOrangeRepository.saveAndFlush(slotListOrange);

        int databaseSizeBeforeUpdate = slotListOrangeRepository.findAll().size();

        // Update the slotListOrange using partial update
        SlotListOrange partialUpdatedSlotListOrange = new SlotListOrange();
        partialUpdatedSlotListOrange.setId(slotListOrange.getId());

        restSlotListOrangeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSlotListOrange.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSlotListOrange))
            )
            .andExpect(status().isOk());

        // Validate the SlotListOrange in the database
        List<SlotListOrange> slotListOrangeList = slotListOrangeRepository.findAll();
        assertThat(slotListOrangeList).hasSize(databaseSizeBeforeUpdate);
        SlotListOrange testSlotListOrange = slotListOrangeList.get(slotListOrangeList.size() - 1);
        assertThat(testSlotListOrange.getCoupons()).isEqualTo(DEFAULT_COUPONS);
    }

    @Test
    @Transactional
    void fullUpdateSlotListOrangeWithPatch() throws Exception {
        // Initialize the database
        slotListOrangeRepository.saveAndFlush(slotListOrange);

        int databaseSizeBeforeUpdate = slotListOrangeRepository.findAll().size();

        // Update the slotListOrange using partial update
        SlotListOrange partialUpdatedSlotListOrange = new SlotListOrange();
        partialUpdatedSlotListOrange.setId(slotListOrange.getId());

        partialUpdatedSlotListOrange.coupons(UPDATED_COUPONS);

        restSlotListOrangeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSlotListOrange.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSlotListOrange))
            )
            .andExpect(status().isOk());

        // Validate the SlotListOrange in the database
        List<SlotListOrange> slotListOrangeList = slotListOrangeRepository.findAll();
        assertThat(slotListOrangeList).hasSize(databaseSizeBeforeUpdate);
        SlotListOrange testSlotListOrange = slotListOrangeList.get(slotListOrangeList.size() - 1);
        assertThat(testSlotListOrange.getCoupons()).isEqualTo(UPDATED_COUPONS);
    }

    @Test
    @Transactional
    void patchNonExistingSlotListOrange() throws Exception {
        int databaseSizeBeforeUpdate = slotListOrangeRepository.findAll().size();
        slotListOrange.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSlotListOrangeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, slotListOrange.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(slotListOrange))
            )
            .andExpect(status().isBadRequest());

        // Validate the SlotListOrange in the database
        List<SlotListOrange> slotListOrangeList = slotListOrangeRepository.findAll();
        assertThat(slotListOrangeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchSlotListOrange() throws Exception {
        int databaseSizeBeforeUpdate = slotListOrangeRepository.findAll().size();
        slotListOrange.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSlotListOrangeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(slotListOrange))
            )
            .andExpect(status().isBadRequest());

        // Validate the SlotListOrange in the database
        List<SlotListOrange> slotListOrangeList = slotListOrangeRepository.findAll();
        assertThat(slotListOrangeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamSlotListOrange() throws Exception {
        int databaseSizeBeforeUpdate = slotListOrangeRepository.findAll().size();
        slotListOrange.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSlotListOrangeMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(slotListOrange))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the SlotListOrange in the database
        List<SlotListOrange> slotListOrangeList = slotListOrangeRepository.findAll();
        assertThat(slotListOrangeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteSlotListOrange() throws Exception {
        // Initialize the database
        slotListOrangeRepository.saveAndFlush(slotListOrange);

        int databaseSizeBeforeDelete = slotListOrangeRepository.findAll().size();

        // Delete the slotListOrange
        restSlotListOrangeMockMvc
            .perform(delete(ENTITY_API_URL_ID, slotListOrange.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<SlotListOrange> slotListOrangeList = slotListOrangeRepository.findAll();
        assertThat(slotListOrangeList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
