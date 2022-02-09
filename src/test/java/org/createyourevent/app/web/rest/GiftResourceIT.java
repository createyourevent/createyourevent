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
import org.createyourevent.app.domain.Gift;
import org.createyourevent.app.repository.GiftRepository;
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
 * Integration tests for the {@link GiftResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class GiftResourceIT {

    private static final String DEFAULT_TITLE = "AAAAAAAAAA";
    private static final String UPDATED_TITLE = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final byte[] DEFAULT_PHOTO = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_PHOTO = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_PHOTO_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_PHOTO_CONTENT_TYPE = "image/png";

    private static final Integer DEFAULT_POINTS = 1;
    private static final Integer UPDATED_POINTS = 2;

    private static final Boolean DEFAULT_ACTIVE = false;
    private static final Boolean UPDATED_ACTIVE = true;

    private static final Long DEFAULT_STOCK = 1L;
    private static final Long UPDATED_STOCK = 2L;

    private static final String ENTITY_API_URL = "/api/gifts";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private GiftRepository giftRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restGiftMockMvc;

    private Gift gift;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Gift createEntity(EntityManager em) {
        Gift gift = new Gift()
            .title(DEFAULT_TITLE)
            .description(DEFAULT_DESCRIPTION)
            .photo(DEFAULT_PHOTO)
            .photoContentType(DEFAULT_PHOTO_CONTENT_TYPE)
            .points(DEFAULT_POINTS)
            .active(DEFAULT_ACTIVE)
            .stock(DEFAULT_STOCK);
        return gift;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Gift createUpdatedEntity(EntityManager em) {
        Gift gift = new Gift()
            .title(UPDATED_TITLE)
            .description(UPDATED_DESCRIPTION)
            .photo(UPDATED_PHOTO)
            .photoContentType(UPDATED_PHOTO_CONTENT_TYPE)
            .points(UPDATED_POINTS)
            .active(UPDATED_ACTIVE)
            .stock(UPDATED_STOCK);
        return gift;
    }

    @BeforeEach
    public void initTest() {
        gift = createEntity(em);
    }

    @Test
    @Transactional
    void createGift() throws Exception {
        int databaseSizeBeforeCreate = giftRepository.findAll().size();
        // Create the Gift
        restGiftMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(gift))
            )
            .andExpect(status().isCreated());

        // Validate the Gift in the database
        List<Gift> giftList = giftRepository.findAll();
        assertThat(giftList).hasSize(databaseSizeBeforeCreate + 1);
        Gift testGift = giftList.get(giftList.size() - 1);
        assertThat(testGift.getTitle()).isEqualTo(DEFAULT_TITLE);
        assertThat(testGift.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testGift.getPhoto()).isEqualTo(DEFAULT_PHOTO);
        assertThat(testGift.getPhotoContentType()).isEqualTo(DEFAULT_PHOTO_CONTENT_TYPE);
        assertThat(testGift.getPoints()).isEqualTo(DEFAULT_POINTS);
        assertThat(testGift.getActive()).isEqualTo(DEFAULT_ACTIVE);
        assertThat(testGift.getStock()).isEqualTo(DEFAULT_STOCK);
    }

    @Test
    @Transactional
    void createGiftWithExistingId() throws Exception {
        // Create the Gift with an existing ID
        gift.setId(1L);

        int databaseSizeBeforeCreate = giftRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restGiftMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(gift))
            )
            .andExpect(status().isBadRequest());

        // Validate the Gift in the database
        List<Gift> giftList = giftRepository.findAll();
        assertThat(giftList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkTitleIsRequired() throws Exception {
        int databaseSizeBeforeTest = giftRepository.findAll().size();
        // set the field null
        gift.setTitle(null);

        // Create the Gift, which fails.

        restGiftMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(gift))
            )
            .andExpect(status().isBadRequest());

        List<Gift> giftList = giftRepository.findAll();
        assertThat(giftList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkPointsIsRequired() throws Exception {
        int databaseSizeBeforeTest = giftRepository.findAll().size();
        // set the field null
        gift.setPoints(null);

        // Create the Gift, which fails.

        restGiftMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(gift))
            )
            .andExpect(status().isBadRequest());

        List<Gift> giftList = giftRepository.findAll();
        assertThat(giftList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllGifts() throws Exception {
        // Initialize the database
        giftRepository.saveAndFlush(gift);

        // Get all the giftList
        restGiftMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(gift.getId().intValue())))
            .andExpect(jsonPath("$.[*].title").value(hasItem(DEFAULT_TITLE)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())))
            .andExpect(jsonPath("$.[*].photoContentType").value(hasItem(DEFAULT_PHOTO_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].photo").value(hasItem(Base64Utils.encodeToString(DEFAULT_PHOTO))))
            .andExpect(jsonPath("$.[*].points").value(hasItem(DEFAULT_POINTS)))
            .andExpect(jsonPath("$.[*].active").value(hasItem(DEFAULT_ACTIVE.booleanValue())))
            .andExpect(jsonPath("$.[*].stock").value(hasItem(DEFAULT_STOCK.intValue())));
    }

    @Test
    @Transactional
    void getGift() throws Exception {
        // Initialize the database
        giftRepository.saveAndFlush(gift);

        // Get the gift
        restGiftMockMvc
            .perform(get(ENTITY_API_URL_ID, gift.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(gift.getId().intValue()))
            .andExpect(jsonPath("$.title").value(DEFAULT_TITLE))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION.toString()))
            .andExpect(jsonPath("$.photoContentType").value(DEFAULT_PHOTO_CONTENT_TYPE))
            .andExpect(jsonPath("$.photo").value(Base64Utils.encodeToString(DEFAULT_PHOTO)))
            .andExpect(jsonPath("$.points").value(DEFAULT_POINTS))
            .andExpect(jsonPath("$.active").value(DEFAULT_ACTIVE.booleanValue()))
            .andExpect(jsonPath("$.stock").value(DEFAULT_STOCK.intValue()));
    }

    @Test
    @Transactional
    void getNonExistingGift() throws Exception {
        // Get the gift
        restGiftMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewGift() throws Exception {
        // Initialize the database
        giftRepository.saveAndFlush(gift);

        int databaseSizeBeforeUpdate = giftRepository.findAll().size();

        // Update the gift
        Gift updatedGift = giftRepository.findById(gift.getId()).get();
        // Disconnect from session so that the updates on updatedGift are not directly saved in db
        em.detach(updatedGift);
        updatedGift
            .title(UPDATED_TITLE)
            .description(UPDATED_DESCRIPTION)
            .photo(UPDATED_PHOTO)
            .photoContentType(UPDATED_PHOTO_CONTENT_TYPE)
            .points(UPDATED_POINTS)
            .active(UPDATED_ACTIVE)
            .stock(UPDATED_STOCK);

        restGiftMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedGift.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedGift))
            )
            .andExpect(status().isOk());

        // Validate the Gift in the database
        List<Gift> giftList = giftRepository.findAll();
        assertThat(giftList).hasSize(databaseSizeBeforeUpdate);
        Gift testGift = giftList.get(giftList.size() - 1);
        assertThat(testGift.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testGift.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testGift.getPhoto()).isEqualTo(UPDATED_PHOTO);
        assertThat(testGift.getPhotoContentType()).isEqualTo(UPDATED_PHOTO_CONTENT_TYPE);
        assertThat(testGift.getPoints()).isEqualTo(UPDATED_POINTS);
        assertThat(testGift.getActive()).isEqualTo(UPDATED_ACTIVE);
        assertThat(testGift.getStock()).isEqualTo(UPDATED_STOCK);
    }

    @Test
    @Transactional
    void putNonExistingGift() throws Exception {
        int databaseSizeBeforeUpdate = giftRepository.findAll().size();
        gift.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restGiftMockMvc
            .perform(
                put(ENTITY_API_URL_ID, gift.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(gift))
            )
            .andExpect(status().isBadRequest());

        // Validate the Gift in the database
        List<Gift> giftList = giftRepository.findAll();
        assertThat(giftList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchGift() throws Exception {
        int databaseSizeBeforeUpdate = giftRepository.findAll().size();
        gift.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGiftMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(gift))
            )
            .andExpect(status().isBadRequest());

        // Validate the Gift in the database
        List<Gift> giftList = giftRepository.findAll();
        assertThat(giftList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamGift() throws Exception {
        int databaseSizeBeforeUpdate = giftRepository.findAll().size();
        gift.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGiftMockMvc
            .perform(
                put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(gift))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Gift in the database
        List<Gift> giftList = giftRepository.findAll();
        assertThat(giftList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateGiftWithPatch() throws Exception {
        // Initialize the database
        giftRepository.saveAndFlush(gift);

        int databaseSizeBeforeUpdate = giftRepository.findAll().size();

        // Update the gift using partial update
        Gift partialUpdatedGift = new Gift();
        partialUpdatedGift.setId(gift.getId());

        partialUpdatedGift.title(UPDATED_TITLE).description(UPDATED_DESCRIPTION).points(UPDATED_POINTS).active(UPDATED_ACTIVE);

        restGiftMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedGift.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedGift))
            )
            .andExpect(status().isOk());

        // Validate the Gift in the database
        List<Gift> giftList = giftRepository.findAll();
        assertThat(giftList).hasSize(databaseSizeBeforeUpdate);
        Gift testGift = giftList.get(giftList.size() - 1);
        assertThat(testGift.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testGift.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testGift.getPhoto()).isEqualTo(DEFAULT_PHOTO);
        assertThat(testGift.getPhotoContentType()).isEqualTo(DEFAULT_PHOTO_CONTENT_TYPE);
        assertThat(testGift.getPoints()).isEqualTo(UPDATED_POINTS);
        assertThat(testGift.getActive()).isEqualTo(UPDATED_ACTIVE);
        assertThat(testGift.getStock()).isEqualTo(DEFAULT_STOCK);
    }

    @Test
    @Transactional
    void fullUpdateGiftWithPatch() throws Exception {
        // Initialize the database
        giftRepository.saveAndFlush(gift);

        int databaseSizeBeforeUpdate = giftRepository.findAll().size();

        // Update the gift using partial update
        Gift partialUpdatedGift = new Gift();
        partialUpdatedGift.setId(gift.getId());

        partialUpdatedGift
            .title(UPDATED_TITLE)
            .description(UPDATED_DESCRIPTION)
            .photo(UPDATED_PHOTO)
            .photoContentType(UPDATED_PHOTO_CONTENT_TYPE)
            .points(UPDATED_POINTS)
            .active(UPDATED_ACTIVE)
            .stock(UPDATED_STOCK);

        restGiftMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedGift.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedGift))
            )
            .andExpect(status().isOk());

        // Validate the Gift in the database
        List<Gift> giftList = giftRepository.findAll();
        assertThat(giftList).hasSize(databaseSizeBeforeUpdate);
        Gift testGift = giftList.get(giftList.size() - 1);
        assertThat(testGift.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testGift.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testGift.getPhoto()).isEqualTo(UPDATED_PHOTO);
        assertThat(testGift.getPhotoContentType()).isEqualTo(UPDATED_PHOTO_CONTENT_TYPE);
        assertThat(testGift.getPoints()).isEqualTo(UPDATED_POINTS);
        assertThat(testGift.getActive()).isEqualTo(UPDATED_ACTIVE);
        assertThat(testGift.getStock()).isEqualTo(UPDATED_STOCK);
    }

    @Test
    @Transactional
    void patchNonExistingGift() throws Exception {
        int databaseSizeBeforeUpdate = giftRepository.findAll().size();
        gift.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restGiftMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, gift.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(gift))
            )
            .andExpect(status().isBadRequest());

        // Validate the Gift in the database
        List<Gift> giftList = giftRepository.findAll();
        assertThat(giftList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchGift() throws Exception {
        int databaseSizeBeforeUpdate = giftRepository.findAll().size();
        gift.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGiftMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(gift))
            )
            .andExpect(status().isBadRequest());

        // Validate the Gift in the database
        List<Gift> giftList = giftRepository.findAll();
        assertThat(giftList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamGift() throws Exception {
        int databaseSizeBeforeUpdate = giftRepository.findAll().size();
        gift.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGiftMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(gift))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Gift in the database
        List<Gift> giftList = giftRepository.findAll();
        assertThat(giftList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteGift() throws Exception {
        // Initialize the database
        giftRepository.saveAndFlush(gift);

        int databaseSizeBeforeDelete = giftRepository.findAll().size();

        // Delete the gift
        restGiftMockMvc
            .perform(delete(ENTITY_API_URL_ID, gift.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Gift> giftList = giftRepository.findAll();
        assertThat(giftList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
