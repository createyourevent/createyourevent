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
import org.createyourevent.app.domain.Chips;
import org.createyourevent.app.repository.ChipsRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Base64Utils;

/**
 * Integration tests for the {@link ChipsResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ChipsResourceIT {

    private static final Integer DEFAULT_POINTS = 1;
    private static final Integer UPDATED_POINTS = 2;

    private static final String DEFAULT_WEBSITE = "AAAAAAAAAA";
    private static final String UPDATED_WEBSITE = "BBBBBBBBBB";

    private static final Integer DEFAULT_X = 1;
    private static final Integer UPDATED_X = 2;

    private static final Integer DEFAULT_Y = 1;
    private static final Integer UPDATED_Y = 2;

    private static final byte[] DEFAULT_IMAGE = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_IMAGE = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_IMAGE_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_IMAGE_CONTENT_TYPE = "image/png";

    private static final String DEFAULT_COLOR = "AAAAAAAAAA";
    private static final String UPDATED_COLOR = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/chips";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ChipsRepository chipsRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restChipsMockMvc;

    private Chips chips;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Chips createEntity(EntityManager em) {
        Chips chips = new Chips()
            .points(DEFAULT_POINTS)
            .website(DEFAULT_WEBSITE)
            .x(DEFAULT_X)
            .y(DEFAULT_Y)
            .image(DEFAULT_IMAGE)
            .imageContentType(DEFAULT_IMAGE_CONTENT_TYPE)
            .color(DEFAULT_COLOR);
        return chips;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Chips createUpdatedEntity(EntityManager em) {
        Chips chips = new Chips()
            .points(UPDATED_POINTS)
            .website(UPDATED_WEBSITE)
            .x(UPDATED_X)
            .y(UPDATED_Y)
            .image(UPDATED_IMAGE)
            .imageContentType(UPDATED_IMAGE_CONTENT_TYPE)
            .color(UPDATED_COLOR);
        return chips;
    }

    @BeforeEach
    public void initTest() {
        chips = createEntity(em);
    }

    @Test
    @Transactional
    void createChips() throws Exception {
        int databaseSizeBeforeCreate = chipsRepository.findAll().size();
        // Create the Chips
        restChipsMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(chips))
            )
            .andExpect(status().isCreated());

        // Validate the Chips in the database
        List<Chips> chipsList = chipsRepository.findAll();
        assertThat(chipsList).hasSize(databaseSizeBeforeCreate + 1);
        Chips testChips = chipsList.get(chipsList.size() - 1);
        assertThat(testChips.getPoints()).isEqualTo(DEFAULT_POINTS);
        assertThat(testChips.getWebsite()).isEqualTo(DEFAULT_WEBSITE);
        assertThat(testChips.getX()).isEqualTo(DEFAULT_X);
        assertThat(testChips.getY()).isEqualTo(DEFAULT_Y);
        assertThat(testChips.getImage()).isEqualTo(DEFAULT_IMAGE);
        assertThat(testChips.getImageContentType()).isEqualTo(DEFAULT_IMAGE_CONTENT_TYPE);
        assertThat(testChips.getColor()).isEqualTo(DEFAULT_COLOR);
    }

    @Test
    @Transactional
    void createChipsWithExistingId() throws Exception {
        // Create the Chips with an existing ID
        chips.setId(1L);

        int databaseSizeBeforeCreate = chipsRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restChipsMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(chips))
            )
            .andExpect(status().isBadRequest());

        // Validate the Chips in the database
        List<Chips> chipsList = chipsRepository.findAll();
        assertThat(chipsList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllChips() throws Exception {
        // Initialize the database
        chipsRepository.saveAndFlush(chips);

        // Get all the chipsList
        restChipsMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(chips.getId().intValue())))
            .andExpect(jsonPath("$.[*].points").value(hasItem(DEFAULT_POINTS)))
            .andExpect(jsonPath("$.[*].website").value(hasItem(DEFAULT_WEBSITE)))
            .andExpect(jsonPath("$.[*].x").value(hasItem(DEFAULT_X)))
            .andExpect(jsonPath("$.[*].y").value(hasItem(DEFAULT_Y)))
            .andExpect(jsonPath("$.[*].imageContentType").value(hasItem(DEFAULT_IMAGE_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].image").value(hasItem(Base64Utils.encodeToString(DEFAULT_IMAGE))))
            .andExpect(jsonPath("$.[*].color").value(hasItem(DEFAULT_COLOR)));
    }

    @Test
    @Transactional
    void getChips() throws Exception {
        // Initialize the database
        chipsRepository.saveAndFlush(chips);

        // Get the chips
        restChipsMockMvc
            .perform(get(ENTITY_API_URL_ID, chips.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(chips.getId().intValue()))
            .andExpect(jsonPath("$.points").value(DEFAULT_POINTS))
            .andExpect(jsonPath("$.website").value(DEFAULT_WEBSITE))
            .andExpect(jsonPath("$.x").value(DEFAULT_X))
            .andExpect(jsonPath("$.y").value(DEFAULT_Y))
            .andExpect(jsonPath("$.imageContentType").value(DEFAULT_IMAGE_CONTENT_TYPE))
            .andExpect(jsonPath("$.image").value(Base64Utils.encodeToString(DEFAULT_IMAGE)))
            .andExpect(jsonPath("$.color").value(DEFAULT_COLOR));
    }

    @Test
    @Transactional
    void getNonExistingChips() throws Exception {
        // Get the chips
        restChipsMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewChips() throws Exception {
        // Initialize the database
        chipsRepository.saveAndFlush(chips);

        int databaseSizeBeforeUpdate = chipsRepository.findAll().size();

        // Update the chips
        Chips updatedChips = chipsRepository.findById(chips.getId()).get();
        // Disconnect from session so that the updates on updatedChips are not directly saved in db
        em.detach(updatedChips);
        updatedChips
            .points(UPDATED_POINTS)
            .website(UPDATED_WEBSITE)
            .x(UPDATED_X)
            .y(UPDATED_Y)
            .image(UPDATED_IMAGE)
            .imageContentType(UPDATED_IMAGE_CONTENT_TYPE)
            .color(UPDATED_COLOR);

        restChipsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedChips.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedChips))
            )
            .andExpect(status().isOk());

        // Validate the Chips in the database
        List<Chips> chipsList = chipsRepository.findAll();
        assertThat(chipsList).hasSize(databaseSizeBeforeUpdate);
        Chips testChips = chipsList.get(chipsList.size() - 1);
        assertThat(testChips.getPoints()).isEqualTo(UPDATED_POINTS);
        assertThat(testChips.getWebsite()).isEqualTo(UPDATED_WEBSITE);
        assertThat(testChips.getX()).isEqualTo(UPDATED_X);
        assertThat(testChips.getY()).isEqualTo(UPDATED_Y);
        assertThat(testChips.getImage()).isEqualTo(UPDATED_IMAGE);
        assertThat(testChips.getImageContentType()).isEqualTo(UPDATED_IMAGE_CONTENT_TYPE);
        assertThat(testChips.getColor()).isEqualTo(UPDATED_COLOR);
    }

    @Test
    @Transactional
    void putNonExistingChips() throws Exception {
        int databaseSizeBeforeUpdate = chipsRepository.findAll().size();
        chips.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restChipsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, chips.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(chips))
            )
            .andExpect(status().isBadRequest());

        // Validate the Chips in the database
        List<Chips> chipsList = chipsRepository.findAll();
        assertThat(chipsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchChips() throws Exception {
        int databaseSizeBeforeUpdate = chipsRepository.findAll().size();
        chips.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restChipsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(chips))
            )
            .andExpect(status().isBadRequest());

        // Validate the Chips in the database
        List<Chips> chipsList = chipsRepository.findAll();
        assertThat(chipsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamChips() throws Exception {
        int databaseSizeBeforeUpdate = chipsRepository.findAll().size();
        chips.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restChipsMockMvc
            .perform(
                put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(chips))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Chips in the database
        List<Chips> chipsList = chipsRepository.findAll();
        assertThat(chipsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateChipsWithPatch() throws Exception {
        // Initialize the database
        chipsRepository.saveAndFlush(chips);

        int databaseSizeBeforeUpdate = chipsRepository.findAll().size();

        // Update the chips using partial update
        Chips partialUpdatedChips = new Chips();
        partialUpdatedChips.setId(chips.getId());

        partialUpdatedChips.points(UPDATED_POINTS).color(UPDATED_COLOR);

        restChipsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedChips.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedChips))
            )
            .andExpect(status().isOk());

        // Validate the Chips in the database
        List<Chips> chipsList = chipsRepository.findAll();
        assertThat(chipsList).hasSize(databaseSizeBeforeUpdate);
        Chips testChips = chipsList.get(chipsList.size() - 1);
        assertThat(testChips.getPoints()).isEqualTo(UPDATED_POINTS);
        assertThat(testChips.getWebsite()).isEqualTo(DEFAULT_WEBSITE);
        assertThat(testChips.getX()).isEqualTo(DEFAULT_X);
        assertThat(testChips.getY()).isEqualTo(DEFAULT_Y);
        assertThat(testChips.getImage()).isEqualTo(DEFAULT_IMAGE);
        assertThat(testChips.getImageContentType()).isEqualTo(DEFAULT_IMAGE_CONTENT_TYPE);
        assertThat(testChips.getColor()).isEqualTo(UPDATED_COLOR);
    }

    @Test
    @Transactional
    void fullUpdateChipsWithPatch() throws Exception {
        // Initialize the database
        chipsRepository.saveAndFlush(chips);

        int databaseSizeBeforeUpdate = chipsRepository.findAll().size();

        // Update the chips using partial update
        Chips partialUpdatedChips = new Chips();
        partialUpdatedChips.setId(chips.getId());

        partialUpdatedChips
            .points(UPDATED_POINTS)
            .website(UPDATED_WEBSITE)
            .x(UPDATED_X)
            .y(UPDATED_Y)
            .image(UPDATED_IMAGE)
            .imageContentType(UPDATED_IMAGE_CONTENT_TYPE)
            .color(UPDATED_COLOR);

        restChipsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedChips.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedChips))
            )
            .andExpect(status().isOk());

        // Validate the Chips in the database
        List<Chips> chipsList = chipsRepository.findAll();
        assertThat(chipsList).hasSize(databaseSizeBeforeUpdate);
        Chips testChips = chipsList.get(chipsList.size() - 1);
        assertThat(testChips.getPoints()).isEqualTo(UPDATED_POINTS);
        assertThat(testChips.getWebsite()).isEqualTo(UPDATED_WEBSITE);
        assertThat(testChips.getX()).isEqualTo(UPDATED_X);
        assertThat(testChips.getY()).isEqualTo(UPDATED_Y);
        assertThat(testChips.getImage()).isEqualTo(UPDATED_IMAGE);
        assertThat(testChips.getImageContentType()).isEqualTo(UPDATED_IMAGE_CONTENT_TYPE);
        assertThat(testChips.getColor()).isEqualTo(UPDATED_COLOR);
    }

    @Test
    @Transactional
    void patchNonExistingChips() throws Exception {
        int databaseSizeBeforeUpdate = chipsRepository.findAll().size();
        chips.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restChipsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, chips.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(chips))
            )
            .andExpect(status().isBadRequest());

        // Validate the Chips in the database
        List<Chips> chipsList = chipsRepository.findAll();
        assertThat(chipsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchChips() throws Exception {
        int databaseSizeBeforeUpdate = chipsRepository.findAll().size();
        chips.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restChipsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(chips))
            )
            .andExpect(status().isBadRequest());

        // Validate the Chips in the database
        List<Chips> chipsList = chipsRepository.findAll();
        assertThat(chipsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamChips() throws Exception {
        int databaseSizeBeforeUpdate = chipsRepository.findAll().size();
        chips.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restChipsMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(chips))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Chips in the database
        List<Chips> chipsList = chipsRepository.findAll();
        assertThat(chipsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteChips() throws Exception {
        // Initialize the database
        chipsRepository.saveAndFlush(chips);

        int databaseSizeBeforeDelete = chipsRepository.findAll().size();

        // Delete the chips
        restChipsMockMvc
            .perform(delete(ENTITY_API_URL_ID, chips.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Chips> chipsList = chipsRepository.findAll();
        assertThat(chipsList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
