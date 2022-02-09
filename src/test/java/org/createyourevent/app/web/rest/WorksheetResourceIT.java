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
import org.createyourevent.app.domain.Worksheet;
import org.createyourevent.app.domain.enumeration.UserType;
import org.createyourevent.app.domain.enumeration.WorksheetType;
import org.createyourevent.app.repository.WorksheetRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link WorksheetResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class WorksheetResourceIT {

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_START = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_START = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ZonedDateTime DEFAULT_END = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_END = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final Float DEFAULT_COST_HOUR = 1F;
    private static final Float UPDATED_COST_HOUR = 2F;

    private static final Float DEFAULT_TOTAL = 1F;
    private static final Float UPDATED_TOTAL = 2F;

    private static final WorksheetType DEFAULT_BILLING_TYPE = WorksheetType.OFFER;
    private static final WorksheetType UPDATED_BILLING_TYPE = WorksheetType.BILLING;

    private static final UserType DEFAULT_USER_TYPE = UserType.USER;
    private static final UserType UPDATED_USER_TYPE = UserType.SUPPLIER;

    private static final String ENTITY_API_URL = "/api/worksheets";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private WorksheetRepository worksheetRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restWorksheetMockMvc;

    private Worksheet worksheet;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Worksheet createEntity(EntityManager em) {
        Worksheet worksheet = new Worksheet()
            .description(DEFAULT_DESCRIPTION)
            .start(DEFAULT_START)
            .end(DEFAULT_END)
            .costHour(DEFAULT_COST_HOUR)
            .total(DEFAULT_TOTAL)
            .billingType(DEFAULT_BILLING_TYPE)
            .userType(DEFAULT_USER_TYPE);
        return worksheet;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Worksheet createUpdatedEntity(EntityManager em) {
        Worksheet worksheet = new Worksheet()
            .description(UPDATED_DESCRIPTION)
            .start(UPDATED_START)
            .end(UPDATED_END)
            .costHour(UPDATED_COST_HOUR)
            .total(UPDATED_TOTAL)
            .billingType(UPDATED_BILLING_TYPE)
            .userType(UPDATED_USER_TYPE);
        return worksheet;
    }

    @BeforeEach
    public void initTest() {
        worksheet = createEntity(em);
    }

    @Test
    @Transactional
    void createWorksheet() throws Exception {
        int databaseSizeBeforeCreate = worksheetRepository.findAll().size();
        // Create the Worksheet
        restWorksheetMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(worksheet))
            )
            .andExpect(status().isCreated());

        // Validate the Worksheet in the database
        List<Worksheet> worksheetList = worksheetRepository.findAll();
        assertThat(worksheetList).hasSize(databaseSizeBeforeCreate + 1);
        Worksheet testWorksheet = worksheetList.get(worksheetList.size() - 1);
        assertThat(testWorksheet.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testWorksheet.getStart()).isEqualTo(DEFAULT_START);
        assertThat(testWorksheet.getEnd()).isEqualTo(DEFAULT_END);
        assertThat(testWorksheet.getCostHour()).isEqualTo(DEFAULT_COST_HOUR);
        assertThat(testWorksheet.getTotal()).isEqualTo(DEFAULT_TOTAL);
        assertThat(testWorksheet.getBillingType()).isEqualTo(DEFAULT_BILLING_TYPE);
        assertThat(testWorksheet.getUserType()).isEqualTo(DEFAULT_USER_TYPE);
    }

    @Test
    @Transactional
    void createWorksheetWithExistingId() throws Exception {
        // Create the Worksheet with an existing ID
        worksheet.setId(1L);

        int databaseSizeBeforeCreate = worksheetRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restWorksheetMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(worksheet))
            )
            .andExpect(status().isBadRequest());

        // Validate the Worksheet in the database
        List<Worksheet> worksheetList = worksheetRepository.findAll();
        assertThat(worksheetList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkDescriptionIsRequired() throws Exception {
        int databaseSizeBeforeTest = worksheetRepository.findAll().size();
        // set the field null
        worksheet.setDescription(null);

        // Create the Worksheet, which fails.

        restWorksheetMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(worksheet))
            )
            .andExpect(status().isBadRequest());

        List<Worksheet> worksheetList = worksheetRepository.findAll();
        assertThat(worksheetList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkStartIsRequired() throws Exception {
        int databaseSizeBeforeTest = worksheetRepository.findAll().size();
        // set the field null
        worksheet.setStart(null);

        // Create the Worksheet, which fails.

        restWorksheetMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(worksheet))
            )
            .andExpect(status().isBadRequest());

        List<Worksheet> worksheetList = worksheetRepository.findAll();
        assertThat(worksheetList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkEndIsRequired() throws Exception {
        int databaseSizeBeforeTest = worksheetRepository.findAll().size();
        // set the field null
        worksheet.setEnd(null);

        // Create the Worksheet, which fails.

        restWorksheetMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(worksheet))
            )
            .andExpect(status().isBadRequest());

        List<Worksheet> worksheetList = worksheetRepository.findAll();
        assertThat(worksheetList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkCostHourIsRequired() throws Exception {
        int databaseSizeBeforeTest = worksheetRepository.findAll().size();
        // set the field null
        worksheet.setCostHour(null);

        // Create the Worksheet, which fails.

        restWorksheetMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(worksheet))
            )
            .andExpect(status().isBadRequest());

        List<Worksheet> worksheetList = worksheetRepository.findAll();
        assertThat(worksheetList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkTotalIsRequired() throws Exception {
        int databaseSizeBeforeTest = worksheetRepository.findAll().size();
        // set the field null
        worksheet.setTotal(null);

        // Create the Worksheet, which fails.

        restWorksheetMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(worksheet))
            )
            .andExpect(status().isBadRequest());

        List<Worksheet> worksheetList = worksheetRepository.findAll();
        assertThat(worksheetList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllWorksheets() throws Exception {
        // Initialize the database
        worksheetRepository.saveAndFlush(worksheet);

        // Get all the worksheetList
        restWorksheetMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(worksheet.getId().intValue())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].start").value(hasItem(sameInstant(DEFAULT_START))))
            .andExpect(jsonPath("$.[*].end").value(hasItem(sameInstant(DEFAULT_END))))
            .andExpect(jsonPath("$.[*].costHour").value(hasItem(DEFAULT_COST_HOUR.doubleValue())))
            .andExpect(jsonPath("$.[*].total").value(hasItem(DEFAULT_TOTAL.doubleValue())))
            .andExpect(jsonPath("$.[*].billingType").value(hasItem(DEFAULT_BILLING_TYPE.toString())))
            .andExpect(jsonPath("$.[*].userType").value(hasItem(DEFAULT_USER_TYPE.toString())));
    }

    @Test
    @Transactional
    void getWorksheet() throws Exception {
        // Initialize the database
        worksheetRepository.saveAndFlush(worksheet);

        // Get the worksheet
        restWorksheetMockMvc
            .perform(get(ENTITY_API_URL_ID, worksheet.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(worksheet.getId().intValue()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.start").value(sameInstant(DEFAULT_START)))
            .andExpect(jsonPath("$.end").value(sameInstant(DEFAULT_END)))
            .andExpect(jsonPath("$.costHour").value(DEFAULT_COST_HOUR.doubleValue()))
            .andExpect(jsonPath("$.total").value(DEFAULT_TOTAL.doubleValue()))
            .andExpect(jsonPath("$.billingType").value(DEFAULT_BILLING_TYPE.toString()))
            .andExpect(jsonPath("$.userType").value(DEFAULT_USER_TYPE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingWorksheet() throws Exception {
        // Get the worksheet
        restWorksheetMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewWorksheet() throws Exception {
        // Initialize the database
        worksheetRepository.saveAndFlush(worksheet);

        int databaseSizeBeforeUpdate = worksheetRepository.findAll().size();

        // Update the worksheet
        Worksheet updatedWorksheet = worksheetRepository.findById(worksheet.getId()).get();
        // Disconnect from session so that the updates on updatedWorksheet are not directly saved in db
        em.detach(updatedWorksheet);
        updatedWorksheet
            .description(UPDATED_DESCRIPTION)
            .start(UPDATED_START)
            .end(UPDATED_END)
            .costHour(UPDATED_COST_HOUR)
            .total(UPDATED_TOTAL)
            .billingType(UPDATED_BILLING_TYPE)
            .userType(UPDATED_USER_TYPE);

        restWorksheetMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedWorksheet.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedWorksheet))
            )
            .andExpect(status().isOk());

        // Validate the Worksheet in the database
        List<Worksheet> worksheetList = worksheetRepository.findAll();
        assertThat(worksheetList).hasSize(databaseSizeBeforeUpdate);
        Worksheet testWorksheet = worksheetList.get(worksheetList.size() - 1);
        assertThat(testWorksheet.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testWorksheet.getStart()).isEqualTo(UPDATED_START);
        assertThat(testWorksheet.getEnd()).isEqualTo(UPDATED_END);
        assertThat(testWorksheet.getCostHour()).isEqualTo(UPDATED_COST_HOUR);
        assertThat(testWorksheet.getTotal()).isEqualTo(UPDATED_TOTAL);
        assertThat(testWorksheet.getBillingType()).isEqualTo(UPDATED_BILLING_TYPE);
        assertThat(testWorksheet.getUserType()).isEqualTo(UPDATED_USER_TYPE);
    }

    @Test
    @Transactional
    void putNonExistingWorksheet() throws Exception {
        int databaseSizeBeforeUpdate = worksheetRepository.findAll().size();
        worksheet.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restWorksheetMockMvc
            .perform(
                put(ENTITY_API_URL_ID, worksheet.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(worksheet))
            )
            .andExpect(status().isBadRequest());

        // Validate the Worksheet in the database
        List<Worksheet> worksheetList = worksheetRepository.findAll();
        assertThat(worksheetList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchWorksheet() throws Exception {
        int databaseSizeBeforeUpdate = worksheetRepository.findAll().size();
        worksheet.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restWorksheetMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(worksheet))
            )
            .andExpect(status().isBadRequest());

        // Validate the Worksheet in the database
        List<Worksheet> worksheetList = worksheetRepository.findAll();
        assertThat(worksheetList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamWorksheet() throws Exception {
        int databaseSizeBeforeUpdate = worksheetRepository.findAll().size();
        worksheet.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restWorksheetMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(worksheet))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Worksheet in the database
        List<Worksheet> worksheetList = worksheetRepository.findAll();
        assertThat(worksheetList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateWorksheetWithPatch() throws Exception {
        // Initialize the database
        worksheetRepository.saveAndFlush(worksheet);

        int databaseSizeBeforeUpdate = worksheetRepository.findAll().size();

        // Update the worksheet using partial update
        Worksheet partialUpdatedWorksheet = new Worksheet();
        partialUpdatedWorksheet.setId(worksheet.getId());

        partialUpdatedWorksheet.start(UPDATED_START).total(UPDATED_TOTAL).userType(UPDATED_USER_TYPE);

        restWorksheetMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedWorksheet.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedWorksheet))
            )
            .andExpect(status().isOk());

        // Validate the Worksheet in the database
        List<Worksheet> worksheetList = worksheetRepository.findAll();
        assertThat(worksheetList).hasSize(databaseSizeBeforeUpdate);
        Worksheet testWorksheet = worksheetList.get(worksheetList.size() - 1);
        assertThat(testWorksheet.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testWorksheet.getStart()).isEqualTo(UPDATED_START);
        assertThat(testWorksheet.getEnd()).isEqualTo(DEFAULT_END);
        assertThat(testWorksheet.getCostHour()).isEqualTo(DEFAULT_COST_HOUR);
        assertThat(testWorksheet.getTotal()).isEqualTo(UPDATED_TOTAL);
        assertThat(testWorksheet.getBillingType()).isEqualTo(DEFAULT_BILLING_TYPE);
        assertThat(testWorksheet.getUserType()).isEqualTo(UPDATED_USER_TYPE);
    }

    @Test
    @Transactional
    void fullUpdateWorksheetWithPatch() throws Exception {
        // Initialize the database
        worksheetRepository.saveAndFlush(worksheet);

        int databaseSizeBeforeUpdate = worksheetRepository.findAll().size();

        // Update the worksheet using partial update
        Worksheet partialUpdatedWorksheet = new Worksheet();
        partialUpdatedWorksheet.setId(worksheet.getId());

        partialUpdatedWorksheet
            .description(UPDATED_DESCRIPTION)
            .start(UPDATED_START)
            .end(UPDATED_END)
            .costHour(UPDATED_COST_HOUR)
            .total(UPDATED_TOTAL)
            .billingType(UPDATED_BILLING_TYPE)
            .userType(UPDATED_USER_TYPE);

        restWorksheetMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedWorksheet.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedWorksheet))
            )
            .andExpect(status().isOk());

        // Validate the Worksheet in the database
        List<Worksheet> worksheetList = worksheetRepository.findAll();
        assertThat(worksheetList).hasSize(databaseSizeBeforeUpdate);
        Worksheet testWorksheet = worksheetList.get(worksheetList.size() - 1);
        assertThat(testWorksheet.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testWorksheet.getStart()).isEqualTo(UPDATED_START);
        assertThat(testWorksheet.getEnd()).isEqualTo(UPDATED_END);
        assertThat(testWorksheet.getCostHour()).isEqualTo(UPDATED_COST_HOUR);
        assertThat(testWorksheet.getTotal()).isEqualTo(UPDATED_TOTAL);
        assertThat(testWorksheet.getBillingType()).isEqualTo(UPDATED_BILLING_TYPE);
        assertThat(testWorksheet.getUserType()).isEqualTo(UPDATED_USER_TYPE);
    }

    @Test
    @Transactional
    void patchNonExistingWorksheet() throws Exception {
        int databaseSizeBeforeUpdate = worksheetRepository.findAll().size();
        worksheet.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restWorksheetMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, worksheet.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(worksheet))
            )
            .andExpect(status().isBadRequest());

        // Validate the Worksheet in the database
        List<Worksheet> worksheetList = worksheetRepository.findAll();
        assertThat(worksheetList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchWorksheet() throws Exception {
        int databaseSizeBeforeUpdate = worksheetRepository.findAll().size();
        worksheet.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restWorksheetMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(worksheet))
            )
            .andExpect(status().isBadRequest());

        // Validate the Worksheet in the database
        List<Worksheet> worksheetList = worksheetRepository.findAll();
        assertThat(worksheetList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamWorksheet() throws Exception {
        int databaseSizeBeforeUpdate = worksheetRepository.findAll().size();
        worksheet.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restWorksheetMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(worksheet))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Worksheet in the database
        List<Worksheet> worksheetList = worksheetRepository.findAll();
        assertThat(worksheetList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteWorksheet() throws Exception {
        // Initialize the database
        worksheetRepository.saveAndFlush(worksheet);

        int databaseSizeBeforeDelete = worksheetRepository.findAll().size();

        // Delete the worksheet
        restWorksheetMockMvc
            .perform(delete(ENTITY_API_URL_ID, worksheet.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Worksheet> worksheetList = worksheetRepository.findAll();
        assertThat(worksheetList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
