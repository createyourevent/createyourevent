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
import org.createyourevent.app.domain.CreateYourEventService;
import org.createyourevent.app.domain.enumeration.ServiceCategory;
import org.createyourevent.app.repository.CreateYourEventServiceRepository;
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
 * Integration tests for the {@link CreateYourEventServiceResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class CreateYourEventServiceResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final byte[] DEFAULT_LOGO = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_LOGO = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_LOGO_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_LOGO_CONTENT_TYPE = "image/png";

    private static final Boolean DEFAULT_ACTIVE = false;
    private static final Boolean UPDATED_ACTIVE = true;

    private static final Boolean DEFAULT_ACTIVE_OWNER = false;
    private static final Boolean UPDATED_ACTIVE_OWNER = true;

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String DEFAULT_ADDRESS = "AAAAAAAAAA";
    private static final String UPDATED_ADDRESS = "BBBBBBBBBB";

    private static final String DEFAULT_MOTTO = "AAAAAAAAAA";
    private static final String UPDATED_MOTTO = "BBBBBBBBBB";

    private static final String DEFAULT_PHONE = "AAAAAAAAAA";
    private static final String UPDATED_PHONE = "BBBBBBBBBB";

    private static final String DEFAULT_WEB_ADDRESS = "AAAAAAAAAA";
    private static final String UPDATED_WEB_ADDRESS = "BBBBBBBBBB";

    private static final ServiceCategory DEFAULT_CATEGORY = ServiceCategory.SECURITAS;
    private static final ServiceCategory UPDATED_CATEGORY = ServiceCategory.SHUTTLESERVICE;

    private static final String ENTITY_API_URL = "/api/create-your-event-services";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private CreateYourEventServiceRepository createYourEventServiceRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restCreateYourEventServiceMockMvc;

    private CreateYourEventService createYourEventService;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CreateYourEventService createEntity(EntityManager em) {
        CreateYourEventService createYourEventService = new CreateYourEventService()
            .name(DEFAULT_NAME)
            .logo(DEFAULT_LOGO)
            .logoContentType(DEFAULT_LOGO_CONTENT_TYPE)
            .active(DEFAULT_ACTIVE)
            .activeOwner(DEFAULT_ACTIVE_OWNER)
            .description(DEFAULT_DESCRIPTION)
            .address(DEFAULT_ADDRESS)
            .motto(DEFAULT_MOTTO)
            .phone(DEFAULT_PHONE)
            .webAddress(DEFAULT_WEB_ADDRESS)
            .category(DEFAULT_CATEGORY);
        return createYourEventService;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CreateYourEventService createUpdatedEntity(EntityManager em) {
        CreateYourEventService createYourEventService = new CreateYourEventService()
            .name(UPDATED_NAME)
            .logo(UPDATED_LOGO)
            .logoContentType(UPDATED_LOGO_CONTENT_TYPE)
            .active(UPDATED_ACTIVE)
            .activeOwner(UPDATED_ACTIVE_OWNER)
            .description(UPDATED_DESCRIPTION)
            .address(UPDATED_ADDRESS)
            .motto(UPDATED_MOTTO)
            .phone(UPDATED_PHONE)
            .webAddress(UPDATED_WEB_ADDRESS)
            .category(UPDATED_CATEGORY);
        return createYourEventService;
    }

    @BeforeEach
    public void initTest() {
        createYourEventService = createEntity(em);
    }

    @Test
    @Transactional
    void createCreateYourEventService() throws Exception {
        int databaseSizeBeforeCreate = createYourEventServiceRepository.findAll().size();
        // Create the CreateYourEventService
        restCreateYourEventServiceMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(createYourEventService))
            )
            .andExpect(status().isCreated());

        // Validate the CreateYourEventService in the database
        List<CreateYourEventService> createYourEventServiceList = createYourEventServiceRepository.findAll();
        assertThat(createYourEventServiceList).hasSize(databaseSizeBeforeCreate + 1);
        CreateYourEventService testCreateYourEventService = createYourEventServiceList.get(createYourEventServiceList.size() - 1);
        assertThat(testCreateYourEventService.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testCreateYourEventService.getLogo()).isEqualTo(DEFAULT_LOGO);
        assertThat(testCreateYourEventService.getLogoContentType()).isEqualTo(DEFAULT_LOGO_CONTENT_TYPE);
        assertThat(testCreateYourEventService.getActive()).isEqualTo(DEFAULT_ACTIVE);
        assertThat(testCreateYourEventService.getActiveOwner()).isEqualTo(DEFAULT_ACTIVE_OWNER);
        assertThat(testCreateYourEventService.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testCreateYourEventService.getAddress()).isEqualTo(DEFAULT_ADDRESS);
        assertThat(testCreateYourEventService.getMotto()).isEqualTo(DEFAULT_MOTTO);
        assertThat(testCreateYourEventService.getPhone()).isEqualTo(DEFAULT_PHONE);
        assertThat(testCreateYourEventService.getWebAddress()).isEqualTo(DEFAULT_WEB_ADDRESS);
        assertThat(testCreateYourEventService.getCategory()).isEqualTo(DEFAULT_CATEGORY);
    }

    @Test
    @Transactional
    void createCreateYourEventServiceWithExistingId() throws Exception {
        // Create the CreateYourEventService with an existing ID
        createYourEventService.setId(1L);

        int databaseSizeBeforeCreate = createYourEventServiceRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restCreateYourEventServiceMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(createYourEventService))
            )
            .andExpect(status().isBadRequest());

        // Validate the CreateYourEventService in the database
        List<CreateYourEventService> createYourEventServiceList = createYourEventServiceRepository.findAll();
        assertThat(createYourEventServiceList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = createYourEventServiceRepository.findAll().size();
        // set the field null
        createYourEventService.setName(null);

        // Create the CreateYourEventService, which fails.

        restCreateYourEventServiceMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(createYourEventService))
            )
            .andExpect(status().isBadRequest());

        List<CreateYourEventService> createYourEventServiceList = createYourEventServiceRepository.findAll();
        assertThat(createYourEventServiceList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkAddressIsRequired() throws Exception {
        int databaseSizeBeforeTest = createYourEventServiceRepository.findAll().size();
        // set the field null
        createYourEventService.setAddress(null);

        // Create the CreateYourEventService, which fails.

        restCreateYourEventServiceMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(createYourEventService))
            )
            .andExpect(status().isBadRequest());

        List<CreateYourEventService> createYourEventServiceList = createYourEventServiceRepository.findAll();
        assertThat(createYourEventServiceList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkMottoIsRequired() throws Exception {
        int databaseSizeBeforeTest = createYourEventServiceRepository.findAll().size();
        // set the field null
        createYourEventService.setMotto(null);

        // Create the CreateYourEventService, which fails.

        restCreateYourEventServiceMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(createYourEventService))
            )
            .andExpect(status().isBadRequest());

        List<CreateYourEventService> createYourEventServiceList = createYourEventServiceRepository.findAll();
        assertThat(createYourEventServiceList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkPhoneIsRequired() throws Exception {
        int databaseSizeBeforeTest = createYourEventServiceRepository.findAll().size();
        // set the field null
        createYourEventService.setPhone(null);

        // Create the CreateYourEventService, which fails.

        restCreateYourEventServiceMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(createYourEventService))
            )
            .andExpect(status().isBadRequest());

        List<CreateYourEventService> createYourEventServiceList = createYourEventServiceRepository.findAll();
        assertThat(createYourEventServiceList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkCategoryIsRequired() throws Exception {
        int databaseSizeBeforeTest = createYourEventServiceRepository.findAll().size();
        // set the field null
        createYourEventService.setCategory(null);

        // Create the CreateYourEventService, which fails.

        restCreateYourEventServiceMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(createYourEventService))
            )
            .andExpect(status().isBadRequest());

        List<CreateYourEventService> createYourEventServiceList = createYourEventServiceRepository.findAll();
        assertThat(createYourEventServiceList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllCreateYourEventServices() throws Exception {
        // Initialize the database
        createYourEventServiceRepository.saveAndFlush(createYourEventService);

        // Get all the createYourEventServiceList
        restCreateYourEventServiceMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(createYourEventService.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].logoContentType").value(hasItem(DEFAULT_LOGO_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].logo").value(hasItem(Base64Utils.encodeToString(DEFAULT_LOGO))))
            .andExpect(jsonPath("$.[*].active").value(hasItem(DEFAULT_ACTIVE.booleanValue())))
            .andExpect(jsonPath("$.[*].activeOwner").value(hasItem(DEFAULT_ACTIVE_OWNER.booleanValue())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())))
            .andExpect(jsonPath("$.[*].address").value(hasItem(DEFAULT_ADDRESS)))
            .andExpect(jsonPath("$.[*].motto").value(hasItem(DEFAULT_MOTTO)))
            .andExpect(jsonPath("$.[*].phone").value(hasItem(DEFAULT_PHONE)))
            .andExpect(jsonPath("$.[*].webAddress").value(hasItem(DEFAULT_WEB_ADDRESS)))
            .andExpect(jsonPath("$.[*].category").value(hasItem(DEFAULT_CATEGORY.toString())));
    }

    @Test
    @Transactional
    void getCreateYourEventService() throws Exception {
        // Initialize the database
        createYourEventServiceRepository.saveAndFlush(createYourEventService);

        // Get the createYourEventService
        restCreateYourEventServiceMockMvc
            .perform(get(ENTITY_API_URL_ID, createYourEventService.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(createYourEventService.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.logoContentType").value(DEFAULT_LOGO_CONTENT_TYPE))
            .andExpect(jsonPath("$.logo").value(Base64Utils.encodeToString(DEFAULT_LOGO)))
            .andExpect(jsonPath("$.active").value(DEFAULT_ACTIVE.booleanValue()))
            .andExpect(jsonPath("$.activeOwner").value(DEFAULT_ACTIVE_OWNER.booleanValue()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION.toString()))
            .andExpect(jsonPath("$.address").value(DEFAULT_ADDRESS))
            .andExpect(jsonPath("$.motto").value(DEFAULT_MOTTO))
            .andExpect(jsonPath("$.phone").value(DEFAULT_PHONE))
            .andExpect(jsonPath("$.webAddress").value(DEFAULT_WEB_ADDRESS))
            .andExpect(jsonPath("$.category").value(DEFAULT_CATEGORY.toString()));
    }

    @Test
    @Transactional
    void getNonExistingCreateYourEventService() throws Exception {
        // Get the createYourEventService
        restCreateYourEventServiceMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewCreateYourEventService() throws Exception {
        // Initialize the database
        createYourEventServiceRepository.saveAndFlush(createYourEventService);

        int databaseSizeBeforeUpdate = createYourEventServiceRepository.findAll().size();

        // Update the createYourEventService
        CreateYourEventService updatedCreateYourEventService = createYourEventServiceRepository
            .findById(createYourEventService.getId())
            .get();
        // Disconnect from session so that the updates on updatedCreateYourEventService are not directly saved in db
        em.detach(updatedCreateYourEventService);
        updatedCreateYourEventService
            .name(UPDATED_NAME)
            .logo(UPDATED_LOGO)
            .logoContentType(UPDATED_LOGO_CONTENT_TYPE)
            .active(UPDATED_ACTIVE)
            .activeOwner(UPDATED_ACTIVE_OWNER)
            .description(UPDATED_DESCRIPTION)
            .address(UPDATED_ADDRESS)
            .motto(UPDATED_MOTTO)
            .phone(UPDATED_PHONE)
            .webAddress(UPDATED_WEB_ADDRESS)
            .category(UPDATED_CATEGORY);

        restCreateYourEventServiceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedCreateYourEventService.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedCreateYourEventService))
            )
            .andExpect(status().isOk());

        // Validate the CreateYourEventService in the database
        List<CreateYourEventService> createYourEventServiceList = createYourEventServiceRepository.findAll();
        assertThat(createYourEventServiceList).hasSize(databaseSizeBeforeUpdate);
        CreateYourEventService testCreateYourEventService = createYourEventServiceList.get(createYourEventServiceList.size() - 1);
        assertThat(testCreateYourEventService.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testCreateYourEventService.getLogo()).isEqualTo(UPDATED_LOGO);
        assertThat(testCreateYourEventService.getLogoContentType()).isEqualTo(UPDATED_LOGO_CONTENT_TYPE);
        assertThat(testCreateYourEventService.getActive()).isEqualTo(UPDATED_ACTIVE);
        assertThat(testCreateYourEventService.getActiveOwner()).isEqualTo(UPDATED_ACTIVE_OWNER);
        assertThat(testCreateYourEventService.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testCreateYourEventService.getAddress()).isEqualTo(UPDATED_ADDRESS);
        assertThat(testCreateYourEventService.getMotto()).isEqualTo(UPDATED_MOTTO);
        assertThat(testCreateYourEventService.getPhone()).isEqualTo(UPDATED_PHONE);
        assertThat(testCreateYourEventService.getWebAddress()).isEqualTo(UPDATED_WEB_ADDRESS);
        assertThat(testCreateYourEventService.getCategory()).isEqualTo(UPDATED_CATEGORY);
    }

    @Test
    @Transactional
    void putNonExistingCreateYourEventService() throws Exception {
        int databaseSizeBeforeUpdate = createYourEventServiceRepository.findAll().size();
        createYourEventService.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCreateYourEventServiceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, createYourEventService.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(createYourEventService))
            )
            .andExpect(status().isBadRequest());

        // Validate the CreateYourEventService in the database
        List<CreateYourEventService> createYourEventServiceList = createYourEventServiceRepository.findAll();
        assertThat(createYourEventServiceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchCreateYourEventService() throws Exception {
        int databaseSizeBeforeUpdate = createYourEventServiceRepository.findAll().size();
        createYourEventService.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCreateYourEventServiceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(createYourEventService))
            )
            .andExpect(status().isBadRequest());

        // Validate the CreateYourEventService in the database
        List<CreateYourEventService> createYourEventServiceList = createYourEventServiceRepository.findAll();
        assertThat(createYourEventServiceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamCreateYourEventService() throws Exception {
        int databaseSizeBeforeUpdate = createYourEventServiceRepository.findAll().size();
        createYourEventService.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCreateYourEventServiceMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(createYourEventService))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the CreateYourEventService in the database
        List<CreateYourEventService> createYourEventServiceList = createYourEventServiceRepository.findAll();
        assertThat(createYourEventServiceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateCreateYourEventServiceWithPatch() throws Exception {
        // Initialize the database
        createYourEventServiceRepository.saveAndFlush(createYourEventService);

        int databaseSizeBeforeUpdate = createYourEventServiceRepository.findAll().size();

        // Update the createYourEventService using partial update
        CreateYourEventService partialUpdatedCreateYourEventService = new CreateYourEventService();
        partialUpdatedCreateYourEventService.setId(createYourEventService.getId());

        partialUpdatedCreateYourEventService
            .logo(UPDATED_LOGO)
            .logoContentType(UPDATED_LOGO_CONTENT_TYPE)
            .activeOwner(UPDATED_ACTIVE_OWNER)
            .description(UPDATED_DESCRIPTION)
            .address(UPDATED_ADDRESS)
            .motto(UPDATED_MOTTO)
            .phone(UPDATED_PHONE)
            .webAddress(UPDATED_WEB_ADDRESS);

        restCreateYourEventServiceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCreateYourEventService.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCreateYourEventService))
            )
            .andExpect(status().isOk());

        // Validate the CreateYourEventService in the database
        List<CreateYourEventService> createYourEventServiceList = createYourEventServiceRepository.findAll();
        assertThat(createYourEventServiceList).hasSize(databaseSizeBeforeUpdate);
        CreateYourEventService testCreateYourEventService = createYourEventServiceList.get(createYourEventServiceList.size() - 1);
        assertThat(testCreateYourEventService.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testCreateYourEventService.getLogo()).isEqualTo(UPDATED_LOGO);
        assertThat(testCreateYourEventService.getLogoContentType()).isEqualTo(UPDATED_LOGO_CONTENT_TYPE);
        assertThat(testCreateYourEventService.getActive()).isEqualTo(DEFAULT_ACTIVE);
        assertThat(testCreateYourEventService.getActiveOwner()).isEqualTo(UPDATED_ACTIVE_OWNER);
        assertThat(testCreateYourEventService.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testCreateYourEventService.getAddress()).isEqualTo(UPDATED_ADDRESS);
        assertThat(testCreateYourEventService.getMotto()).isEqualTo(UPDATED_MOTTO);
        assertThat(testCreateYourEventService.getPhone()).isEqualTo(UPDATED_PHONE);
        assertThat(testCreateYourEventService.getWebAddress()).isEqualTo(UPDATED_WEB_ADDRESS);
        assertThat(testCreateYourEventService.getCategory()).isEqualTo(DEFAULT_CATEGORY);
    }

    @Test
    @Transactional
    void fullUpdateCreateYourEventServiceWithPatch() throws Exception {
        // Initialize the database
        createYourEventServiceRepository.saveAndFlush(createYourEventService);

        int databaseSizeBeforeUpdate = createYourEventServiceRepository.findAll().size();

        // Update the createYourEventService using partial update
        CreateYourEventService partialUpdatedCreateYourEventService = new CreateYourEventService();
        partialUpdatedCreateYourEventService.setId(createYourEventService.getId());

        partialUpdatedCreateYourEventService
            .name(UPDATED_NAME)
            .logo(UPDATED_LOGO)
            .logoContentType(UPDATED_LOGO_CONTENT_TYPE)
            .active(UPDATED_ACTIVE)
            .activeOwner(UPDATED_ACTIVE_OWNER)
            .description(UPDATED_DESCRIPTION)
            .address(UPDATED_ADDRESS)
            .motto(UPDATED_MOTTO)
            .phone(UPDATED_PHONE)
            .webAddress(UPDATED_WEB_ADDRESS)
            .category(UPDATED_CATEGORY);

        restCreateYourEventServiceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCreateYourEventService.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCreateYourEventService))
            )
            .andExpect(status().isOk());

        // Validate the CreateYourEventService in the database
        List<CreateYourEventService> createYourEventServiceList = createYourEventServiceRepository.findAll();
        assertThat(createYourEventServiceList).hasSize(databaseSizeBeforeUpdate);
        CreateYourEventService testCreateYourEventService = createYourEventServiceList.get(createYourEventServiceList.size() - 1);
        assertThat(testCreateYourEventService.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testCreateYourEventService.getLogo()).isEqualTo(UPDATED_LOGO);
        assertThat(testCreateYourEventService.getLogoContentType()).isEqualTo(UPDATED_LOGO_CONTENT_TYPE);
        assertThat(testCreateYourEventService.getActive()).isEqualTo(UPDATED_ACTIVE);
        assertThat(testCreateYourEventService.getActiveOwner()).isEqualTo(UPDATED_ACTIVE_OWNER);
        assertThat(testCreateYourEventService.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testCreateYourEventService.getAddress()).isEqualTo(UPDATED_ADDRESS);
        assertThat(testCreateYourEventService.getMotto()).isEqualTo(UPDATED_MOTTO);
        assertThat(testCreateYourEventService.getPhone()).isEqualTo(UPDATED_PHONE);
        assertThat(testCreateYourEventService.getWebAddress()).isEqualTo(UPDATED_WEB_ADDRESS);
        assertThat(testCreateYourEventService.getCategory()).isEqualTo(UPDATED_CATEGORY);
    }

    @Test
    @Transactional
    void patchNonExistingCreateYourEventService() throws Exception {
        int databaseSizeBeforeUpdate = createYourEventServiceRepository.findAll().size();
        createYourEventService.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCreateYourEventServiceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, createYourEventService.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(createYourEventService))
            )
            .andExpect(status().isBadRequest());

        // Validate the CreateYourEventService in the database
        List<CreateYourEventService> createYourEventServiceList = createYourEventServiceRepository.findAll();
        assertThat(createYourEventServiceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchCreateYourEventService() throws Exception {
        int databaseSizeBeforeUpdate = createYourEventServiceRepository.findAll().size();
        createYourEventService.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCreateYourEventServiceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(createYourEventService))
            )
            .andExpect(status().isBadRequest());

        // Validate the CreateYourEventService in the database
        List<CreateYourEventService> createYourEventServiceList = createYourEventServiceRepository.findAll();
        assertThat(createYourEventServiceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamCreateYourEventService() throws Exception {
        int databaseSizeBeforeUpdate = createYourEventServiceRepository.findAll().size();
        createYourEventService.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCreateYourEventServiceMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(createYourEventService))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the CreateYourEventService in the database
        List<CreateYourEventService> createYourEventServiceList = createYourEventServiceRepository.findAll();
        assertThat(createYourEventServiceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteCreateYourEventService() throws Exception {
        // Initialize the database
        createYourEventServiceRepository.saveAndFlush(createYourEventService);

        int databaseSizeBeforeDelete = createYourEventServiceRepository.findAll().size();

        // Delete the createYourEventService
        restCreateYourEventServiceMockMvc
            .perform(delete(ENTITY_API_URL_ID, createYourEventService.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<CreateYourEventService> createYourEventServiceList = createYourEventServiceRepository.findAll();
        assertThat(createYourEventServiceList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
