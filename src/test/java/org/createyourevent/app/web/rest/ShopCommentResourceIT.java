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
import org.createyourevent.app.domain.ShopComment;
import org.createyourevent.app.repository.ShopCommentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link ShopCommentResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ShopCommentResourceIT {

    private static final String DEFAULT_COMMENT = "AAAAAAAAAA";
    private static final String UPDATED_COMMENT = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_DATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String ENTITY_API_URL = "/api/shop-comments";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ShopCommentRepository shopCommentRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restShopCommentMockMvc;

    private ShopComment shopComment;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ShopComment createEntity(EntityManager em) {
        ShopComment shopComment = new ShopComment().comment(DEFAULT_COMMENT).date(DEFAULT_DATE);
        return shopComment;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ShopComment createUpdatedEntity(EntityManager em) {
        ShopComment shopComment = new ShopComment().comment(UPDATED_COMMENT).date(UPDATED_DATE);
        return shopComment;
    }

    @BeforeEach
    public void initTest() {
        shopComment = createEntity(em);
    }

    @Test
    @Transactional
    void createShopComment() throws Exception {
        int databaseSizeBeforeCreate = shopCommentRepository.findAll().size();
        // Create the ShopComment
        restShopCommentMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(shopComment))
            )
            .andExpect(status().isCreated());

        // Validate the ShopComment in the database
        List<ShopComment> shopCommentList = shopCommentRepository.findAll();
        assertThat(shopCommentList).hasSize(databaseSizeBeforeCreate + 1);
        ShopComment testShopComment = shopCommentList.get(shopCommentList.size() - 1);
        assertThat(testShopComment.getComment()).isEqualTo(DEFAULT_COMMENT);
        assertThat(testShopComment.getDate()).isEqualTo(DEFAULT_DATE);
    }

    @Test
    @Transactional
    void createShopCommentWithExistingId() throws Exception {
        // Create the ShopComment with an existing ID
        shopComment.setId(1L);

        int databaseSizeBeforeCreate = shopCommentRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restShopCommentMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(shopComment))
            )
            .andExpect(status().isBadRequest());

        // Validate the ShopComment in the database
        List<ShopComment> shopCommentList = shopCommentRepository.findAll();
        assertThat(shopCommentList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllShopComments() throws Exception {
        // Initialize the database
        shopCommentRepository.saveAndFlush(shopComment);

        // Get all the shopCommentList
        restShopCommentMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(shopComment.getId().intValue())))
            .andExpect(jsonPath("$.[*].comment").value(hasItem(DEFAULT_COMMENT)))
            .andExpect(jsonPath("$.[*].date").value(hasItem(sameInstant(DEFAULT_DATE))));
    }

    @Test
    @Transactional
    void getShopComment() throws Exception {
        // Initialize the database
        shopCommentRepository.saveAndFlush(shopComment);

        // Get the shopComment
        restShopCommentMockMvc
            .perform(get(ENTITY_API_URL_ID, shopComment.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(shopComment.getId().intValue()))
            .andExpect(jsonPath("$.comment").value(DEFAULT_COMMENT))
            .andExpect(jsonPath("$.date").value(sameInstant(DEFAULT_DATE)));
    }

    @Test
    @Transactional
    void getNonExistingShopComment() throws Exception {
        // Get the shopComment
        restShopCommentMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewShopComment() throws Exception {
        // Initialize the database
        shopCommentRepository.saveAndFlush(shopComment);

        int databaseSizeBeforeUpdate = shopCommentRepository.findAll().size();

        // Update the shopComment
        ShopComment updatedShopComment = shopCommentRepository.findById(shopComment.getId()).get();
        // Disconnect from session so that the updates on updatedShopComment are not directly saved in db
        em.detach(updatedShopComment);
        updatedShopComment.comment(UPDATED_COMMENT).date(UPDATED_DATE);

        restShopCommentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedShopComment.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedShopComment))
            )
            .andExpect(status().isOk());

        // Validate the ShopComment in the database
        List<ShopComment> shopCommentList = shopCommentRepository.findAll();
        assertThat(shopCommentList).hasSize(databaseSizeBeforeUpdate);
        ShopComment testShopComment = shopCommentList.get(shopCommentList.size() - 1);
        assertThat(testShopComment.getComment()).isEqualTo(UPDATED_COMMENT);
        assertThat(testShopComment.getDate()).isEqualTo(UPDATED_DATE);
    }

    @Test
    @Transactional
    void putNonExistingShopComment() throws Exception {
        int databaseSizeBeforeUpdate = shopCommentRepository.findAll().size();
        shopComment.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restShopCommentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, shopComment.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(shopComment))
            )
            .andExpect(status().isBadRequest());

        // Validate the ShopComment in the database
        List<ShopComment> shopCommentList = shopCommentRepository.findAll();
        assertThat(shopCommentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchShopComment() throws Exception {
        int databaseSizeBeforeUpdate = shopCommentRepository.findAll().size();
        shopComment.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restShopCommentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(shopComment))
            )
            .andExpect(status().isBadRequest());

        // Validate the ShopComment in the database
        List<ShopComment> shopCommentList = shopCommentRepository.findAll();
        assertThat(shopCommentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamShopComment() throws Exception {
        int databaseSizeBeforeUpdate = shopCommentRepository.findAll().size();
        shopComment.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restShopCommentMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(shopComment))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ShopComment in the database
        List<ShopComment> shopCommentList = shopCommentRepository.findAll();
        assertThat(shopCommentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateShopCommentWithPatch() throws Exception {
        // Initialize the database
        shopCommentRepository.saveAndFlush(shopComment);

        int databaseSizeBeforeUpdate = shopCommentRepository.findAll().size();

        // Update the shopComment using partial update
        ShopComment partialUpdatedShopComment = new ShopComment();
        partialUpdatedShopComment.setId(shopComment.getId());

        restShopCommentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedShopComment.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedShopComment))
            )
            .andExpect(status().isOk());

        // Validate the ShopComment in the database
        List<ShopComment> shopCommentList = shopCommentRepository.findAll();
        assertThat(shopCommentList).hasSize(databaseSizeBeforeUpdate);
        ShopComment testShopComment = shopCommentList.get(shopCommentList.size() - 1);
        assertThat(testShopComment.getComment()).isEqualTo(DEFAULT_COMMENT);
        assertThat(testShopComment.getDate()).isEqualTo(DEFAULT_DATE);
    }

    @Test
    @Transactional
    void fullUpdateShopCommentWithPatch() throws Exception {
        // Initialize the database
        shopCommentRepository.saveAndFlush(shopComment);

        int databaseSizeBeforeUpdate = shopCommentRepository.findAll().size();

        // Update the shopComment using partial update
        ShopComment partialUpdatedShopComment = new ShopComment();
        partialUpdatedShopComment.setId(shopComment.getId());

        partialUpdatedShopComment.comment(UPDATED_COMMENT).date(UPDATED_DATE);

        restShopCommentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedShopComment.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedShopComment))
            )
            .andExpect(status().isOk());

        // Validate the ShopComment in the database
        List<ShopComment> shopCommentList = shopCommentRepository.findAll();
        assertThat(shopCommentList).hasSize(databaseSizeBeforeUpdate);
        ShopComment testShopComment = shopCommentList.get(shopCommentList.size() - 1);
        assertThat(testShopComment.getComment()).isEqualTo(UPDATED_COMMENT);
        assertThat(testShopComment.getDate()).isEqualTo(UPDATED_DATE);
    }

    @Test
    @Transactional
    void patchNonExistingShopComment() throws Exception {
        int databaseSizeBeforeUpdate = shopCommentRepository.findAll().size();
        shopComment.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restShopCommentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, shopComment.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(shopComment))
            )
            .andExpect(status().isBadRequest());

        // Validate the ShopComment in the database
        List<ShopComment> shopCommentList = shopCommentRepository.findAll();
        assertThat(shopCommentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchShopComment() throws Exception {
        int databaseSizeBeforeUpdate = shopCommentRepository.findAll().size();
        shopComment.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restShopCommentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(shopComment))
            )
            .andExpect(status().isBadRequest());

        // Validate the ShopComment in the database
        List<ShopComment> shopCommentList = shopCommentRepository.findAll();
        assertThat(shopCommentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamShopComment() throws Exception {
        int databaseSizeBeforeUpdate = shopCommentRepository.findAll().size();
        shopComment.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restShopCommentMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(shopComment))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ShopComment in the database
        List<ShopComment> shopCommentList = shopCommentRepository.findAll();
        assertThat(shopCommentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteShopComment() throws Exception {
        // Initialize the database
        shopCommentRepository.saveAndFlush(shopComment);

        int databaseSizeBeforeDelete = shopCommentRepository.findAll().size();

        // Delete the shopComment
        restShopCommentMockMvc
            .perform(delete(ENTITY_API_URL_ID, shopComment.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ShopComment> shopCommentList = shopCommentRepository.findAll();
        assertThat(shopCommentList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
