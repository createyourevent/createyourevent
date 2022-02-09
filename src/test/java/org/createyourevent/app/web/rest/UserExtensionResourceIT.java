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
import org.createyourevent.app.domain.UserExtension;
import org.createyourevent.app.repository.UserExtensionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link UserExtensionResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class UserExtensionResourceIT {

    private static final String DEFAULT_ADDRESS = "AAAAAAAAAA";
    private static final String UPDATED_ADDRESS = "BBBBBBBBBB";

    private static final String DEFAULT_PHONE = "AAAAAAAAAA";
    private static final String UPDATED_PHONE = "BBBBBBBBBB";

    private static final Boolean DEFAULT_LOGGED_IN = false;
    private static final Boolean UPDATED_LOGGED_IN = true;

    private static final Integer DEFAULT_POINTS = 1;
    private static final Integer UPDATED_POINTS = 2;

    private static final String ENTITY_API_URL = "/api/user-extensions";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private UserExtensionRepository userExtensionRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restUserExtensionMockMvc;

    private UserExtension userExtension;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static UserExtension createEntity(EntityManager em) {
        UserExtension userExtension = new UserExtension()
            .address(DEFAULT_ADDRESS)
            .phone(DEFAULT_PHONE)
            .loggedIn(DEFAULT_LOGGED_IN)
            .points(DEFAULT_POINTS);
        return userExtension;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static UserExtension createUpdatedEntity(EntityManager em) {
        UserExtension userExtension = new UserExtension()
            .address(UPDATED_ADDRESS)
            .phone(UPDATED_PHONE)
            .loggedIn(UPDATED_LOGGED_IN)
            .points(UPDATED_POINTS);
        return userExtension;
    }

    @BeforeEach
    public void initTest() {
        userExtension = createEntity(em);
    }

    @Test
    @Transactional
    void createUserExtension() throws Exception {
        int databaseSizeBeforeCreate = userExtensionRepository.findAll().size();
        // Create the UserExtension
        restUserExtensionMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(userExtension))
            )
            .andExpect(status().isCreated());

        // Validate the UserExtension in the database
        List<UserExtension> userExtensionList = userExtensionRepository.findAll();
        assertThat(userExtensionList).hasSize(databaseSizeBeforeCreate + 1);
        UserExtension testUserExtension = userExtensionList.get(userExtensionList.size() - 1);
        assertThat(testUserExtension.getAddress()).isEqualTo(DEFAULT_ADDRESS);
        assertThat(testUserExtension.getPhone()).isEqualTo(DEFAULT_PHONE);
        assertThat(testUserExtension.getLoggedIn()).isEqualTo(DEFAULT_LOGGED_IN);
        assertThat(testUserExtension.getPoints()).isEqualTo(DEFAULT_POINTS);
    }

    @Test
    @Transactional
    void createUserExtensionWithExistingId() throws Exception {
        // Create the UserExtension with an existing ID
        userExtension.setId(1L);

        int databaseSizeBeforeCreate = userExtensionRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restUserExtensionMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(userExtension))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserExtension in the database
        List<UserExtension> userExtensionList = userExtensionRepository.findAll();
        assertThat(userExtensionList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllUserExtensions() throws Exception {
        // Initialize the database
        userExtensionRepository.saveAndFlush(userExtension);

        // Get all the userExtensionList
        restUserExtensionMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(userExtension.getId().intValue())))
            .andExpect(jsonPath("$.[*].address").value(hasItem(DEFAULT_ADDRESS)))
            .andExpect(jsonPath("$.[*].phone").value(hasItem(DEFAULT_PHONE)))
            .andExpect(jsonPath("$.[*].loggedIn").value(hasItem(DEFAULT_LOGGED_IN.booleanValue())))
            .andExpect(jsonPath("$.[*].points").value(hasItem(DEFAULT_POINTS)));
    }

    @Test
    @Transactional
    void getUserExtension() throws Exception {
        // Initialize the database
        userExtensionRepository.saveAndFlush(userExtension);

        // Get the userExtension
        restUserExtensionMockMvc
            .perform(get(ENTITY_API_URL_ID, userExtension.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(userExtension.getId().intValue()))
            .andExpect(jsonPath("$.address").value(DEFAULT_ADDRESS))
            .andExpect(jsonPath("$.phone").value(DEFAULT_PHONE))
            .andExpect(jsonPath("$.loggedIn").value(DEFAULT_LOGGED_IN.booleanValue()))
            .andExpect(jsonPath("$.points").value(DEFAULT_POINTS));
    }

    @Test
    @Transactional
    void getNonExistingUserExtension() throws Exception {
        // Get the userExtension
        restUserExtensionMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewUserExtension() throws Exception {
        // Initialize the database
        userExtensionRepository.saveAndFlush(userExtension);

        int databaseSizeBeforeUpdate = userExtensionRepository.findAll().size();

        // Update the userExtension
        UserExtension updatedUserExtension = userExtensionRepository.findById(userExtension.getId()).get();
        // Disconnect from session so that the updates on updatedUserExtension are not directly saved in db
        em.detach(updatedUserExtension);
        updatedUserExtension.address(UPDATED_ADDRESS).phone(UPDATED_PHONE).loggedIn(UPDATED_LOGGED_IN).points(UPDATED_POINTS);

        restUserExtensionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedUserExtension.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedUserExtension))
            )
            .andExpect(status().isOk());

        // Validate the UserExtension in the database
        List<UserExtension> userExtensionList = userExtensionRepository.findAll();
        assertThat(userExtensionList).hasSize(databaseSizeBeforeUpdate);
        UserExtension testUserExtension = userExtensionList.get(userExtensionList.size() - 1);
        assertThat(testUserExtension.getAddress()).isEqualTo(UPDATED_ADDRESS);
        assertThat(testUserExtension.getPhone()).isEqualTo(UPDATED_PHONE);
        assertThat(testUserExtension.getLoggedIn()).isEqualTo(UPDATED_LOGGED_IN);
        assertThat(testUserExtension.getPoints()).isEqualTo(UPDATED_POINTS);
    }

    @Test
    @Transactional
    void putNonExistingUserExtension() throws Exception {
        int databaseSizeBeforeUpdate = userExtensionRepository.findAll().size();
        userExtension.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUserExtensionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, userExtension.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(userExtension))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserExtension in the database
        List<UserExtension> userExtensionList = userExtensionRepository.findAll();
        assertThat(userExtensionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchUserExtension() throws Exception {
        int databaseSizeBeforeUpdate = userExtensionRepository.findAll().size();
        userExtension.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserExtensionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(userExtension))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserExtension in the database
        List<UserExtension> userExtensionList = userExtensionRepository.findAll();
        assertThat(userExtensionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamUserExtension() throws Exception {
        int databaseSizeBeforeUpdate = userExtensionRepository.findAll().size();
        userExtension.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserExtensionMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(userExtension))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the UserExtension in the database
        List<UserExtension> userExtensionList = userExtensionRepository.findAll();
        assertThat(userExtensionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateUserExtensionWithPatch() throws Exception {
        // Initialize the database
        userExtensionRepository.saveAndFlush(userExtension);

        int databaseSizeBeforeUpdate = userExtensionRepository.findAll().size();

        // Update the userExtension using partial update
        UserExtension partialUpdatedUserExtension = new UserExtension();
        partialUpdatedUserExtension.setId(userExtension.getId());

        partialUpdatedUserExtension.phone(UPDATED_PHONE).points(UPDATED_POINTS);

        restUserExtensionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedUserExtension.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedUserExtension))
            )
            .andExpect(status().isOk());

        // Validate the UserExtension in the database
        List<UserExtension> userExtensionList = userExtensionRepository.findAll();
        assertThat(userExtensionList).hasSize(databaseSizeBeforeUpdate);
        UserExtension testUserExtension = userExtensionList.get(userExtensionList.size() - 1);
        assertThat(testUserExtension.getAddress()).isEqualTo(DEFAULT_ADDRESS);
        assertThat(testUserExtension.getPhone()).isEqualTo(UPDATED_PHONE);
        assertThat(testUserExtension.getLoggedIn()).isEqualTo(DEFAULT_LOGGED_IN);
        assertThat(testUserExtension.getPoints()).isEqualTo(UPDATED_POINTS);
    }

    @Test
    @Transactional
    void fullUpdateUserExtensionWithPatch() throws Exception {
        // Initialize the database
        userExtensionRepository.saveAndFlush(userExtension);

        int databaseSizeBeforeUpdate = userExtensionRepository.findAll().size();

        // Update the userExtension using partial update
        UserExtension partialUpdatedUserExtension = new UserExtension();
        partialUpdatedUserExtension.setId(userExtension.getId());

        partialUpdatedUserExtension.address(UPDATED_ADDRESS).phone(UPDATED_PHONE).loggedIn(UPDATED_LOGGED_IN).points(UPDATED_POINTS);

        restUserExtensionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedUserExtension.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedUserExtension))
            )
            .andExpect(status().isOk());

        // Validate the UserExtension in the database
        List<UserExtension> userExtensionList = userExtensionRepository.findAll();
        assertThat(userExtensionList).hasSize(databaseSizeBeforeUpdate);
        UserExtension testUserExtension = userExtensionList.get(userExtensionList.size() - 1);
        assertThat(testUserExtension.getAddress()).isEqualTo(UPDATED_ADDRESS);
        assertThat(testUserExtension.getPhone()).isEqualTo(UPDATED_PHONE);
        assertThat(testUserExtension.getLoggedIn()).isEqualTo(UPDATED_LOGGED_IN);
        assertThat(testUserExtension.getPoints()).isEqualTo(UPDATED_POINTS);
    }

    @Test
    @Transactional
    void patchNonExistingUserExtension() throws Exception {
        int databaseSizeBeforeUpdate = userExtensionRepository.findAll().size();
        userExtension.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUserExtensionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, userExtension.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(userExtension))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserExtension in the database
        List<UserExtension> userExtensionList = userExtensionRepository.findAll();
        assertThat(userExtensionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchUserExtension() throws Exception {
        int databaseSizeBeforeUpdate = userExtensionRepository.findAll().size();
        userExtension.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserExtensionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(userExtension))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserExtension in the database
        List<UserExtension> userExtensionList = userExtensionRepository.findAll();
        assertThat(userExtensionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamUserExtension() throws Exception {
        int databaseSizeBeforeUpdate = userExtensionRepository.findAll().size();
        userExtension.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserExtensionMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(userExtension))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the UserExtension in the database
        List<UserExtension> userExtensionList = userExtensionRepository.findAll();
        assertThat(userExtensionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteUserExtension() throws Exception {
        // Initialize the database
        userExtensionRepository.saveAndFlush(userExtension);

        int databaseSizeBeforeDelete = userExtensionRepository.findAll().size();

        // Delete the userExtension
        restUserExtensionMockMvc
            .perform(delete(ENTITY_API_URL_ID, userExtension.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<UserExtension> userExtensionList = userExtensionRepository.findAll();
        assertThat(userExtensionList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
