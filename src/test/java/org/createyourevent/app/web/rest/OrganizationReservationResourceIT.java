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
import org.createyourevent.app.domain.OrganizationReservation;
import org.createyourevent.app.repository.OrganizationReservationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link OrganizationReservationResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class OrganizationReservationResourceIT {

    private static final ZonedDateTime DEFAULT_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_DATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ZonedDateTime DEFAULT_DATE_FROM = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_DATE_FROM = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ZonedDateTime DEFAULT_DATE_UNTIL = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_DATE_UNTIL = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final Boolean DEFAULT_SEEN = false;
    private static final Boolean UPDATED_SEEN = true;

    private static final Boolean DEFAULT_APPROVED = false;
    private static final Boolean UPDATED_APPROVED = true;

    private static final Float DEFAULT_TOTAL = 1F;
    private static final Float UPDATED_TOTAL = 2F;

    private static final Boolean DEFAULT_FEE_BILLED = false;
    private static final Boolean UPDATED_FEE_BILLED = true;

    private static final String ENTITY_API_URL = "/api/organization-reservations";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private OrganizationReservationRepository organizationReservationRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restOrganizationReservationMockMvc;

    private OrganizationReservation organizationReservation;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static OrganizationReservation createEntity(EntityManager em) {
        OrganizationReservation organizationReservation = new OrganizationReservation()
            .date(DEFAULT_DATE)
            .dateFrom(DEFAULT_DATE_FROM)
            .dateUntil(DEFAULT_DATE_UNTIL)
            .seen(DEFAULT_SEEN)
            .approved(DEFAULT_APPROVED)
            .total(DEFAULT_TOTAL)
            .feeBilled(DEFAULT_FEE_BILLED);
        return organizationReservation;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static OrganizationReservation createUpdatedEntity(EntityManager em) {
        OrganizationReservation organizationReservation = new OrganizationReservation()
            .date(UPDATED_DATE)
            .dateFrom(UPDATED_DATE_FROM)
            .dateUntil(UPDATED_DATE_UNTIL)
            .seen(UPDATED_SEEN)
            .approved(UPDATED_APPROVED)
            .total(UPDATED_TOTAL)
            .feeBilled(UPDATED_FEE_BILLED);
        return organizationReservation;
    }

    @BeforeEach
    public void initTest() {
        organizationReservation = createEntity(em);
    }

    @Test
    @Transactional
    void createOrganizationReservation() throws Exception {
        int databaseSizeBeforeCreate = organizationReservationRepository.findAll().size();
        // Create the OrganizationReservation
        restOrganizationReservationMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(organizationReservation))
            )
            .andExpect(status().isCreated());

        // Validate the OrganizationReservation in the database
        List<OrganizationReservation> organizationReservationList = organizationReservationRepository.findAll();
        assertThat(organizationReservationList).hasSize(databaseSizeBeforeCreate + 1);
        OrganizationReservation testOrganizationReservation = organizationReservationList.get(organizationReservationList.size() - 1);
        assertThat(testOrganizationReservation.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testOrganizationReservation.getDateFrom()).isEqualTo(DEFAULT_DATE_FROM);
        assertThat(testOrganizationReservation.getDateUntil()).isEqualTo(DEFAULT_DATE_UNTIL);
        assertThat(testOrganizationReservation.getSeen()).isEqualTo(DEFAULT_SEEN);
        assertThat(testOrganizationReservation.getApproved()).isEqualTo(DEFAULT_APPROVED);
        assertThat(testOrganizationReservation.getTotal()).isEqualTo(DEFAULT_TOTAL);
        assertThat(testOrganizationReservation.getFeeBilled()).isEqualTo(DEFAULT_FEE_BILLED);
    }

    @Test
    @Transactional
    void createOrganizationReservationWithExistingId() throws Exception {
        // Create the OrganizationReservation with an existing ID
        organizationReservation.setId(1L);

        int databaseSizeBeforeCreate = organizationReservationRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restOrganizationReservationMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(organizationReservation))
            )
            .andExpect(status().isBadRequest());

        // Validate the OrganizationReservation in the database
        List<OrganizationReservation> organizationReservationList = organizationReservationRepository.findAll();
        assertThat(organizationReservationList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllOrganizationReservations() throws Exception {
        // Initialize the database
        organizationReservationRepository.saveAndFlush(organizationReservation);

        // Get all the organizationReservationList
        restOrganizationReservationMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(organizationReservation.getId().intValue())))
            .andExpect(jsonPath("$.[*].date").value(hasItem(sameInstant(DEFAULT_DATE))))
            .andExpect(jsonPath("$.[*].dateFrom").value(hasItem(sameInstant(DEFAULT_DATE_FROM))))
            .andExpect(jsonPath("$.[*].dateUntil").value(hasItem(sameInstant(DEFAULT_DATE_UNTIL))))
            .andExpect(jsonPath("$.[*].seen").value(hasItem(DEFAULT_SEEN.booleanValue())))
            .andExpect(jsonPath("$.[*].approved").value(hasItem(DEFAULT_APPROVED.booleanValue())))
            .andExpect(jsonPath("$.[*].total").value(hasItem(DEFAULT_TOTAL.doubleValue())))
            .andExpect(jsonPath("$.[*].feeBilled").value(hasItem(DEFAULT_FEE_BILLED.booleanValue())));
    }

    @Test
    @Transactional
    void getOrganizationReservation() throws Exception {
        // Initialize the database
        organizationReservationRepository.saveAndFlush(organizationReservation);

        // Get the organizationReservation
        restOrganizationReservationMockMvc
            .perform(get(ENTITY_API_URL_ID, organizationReservation.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(organizationReservation.getId().intValue()))
            .andExpect(jsonPath("$.date").value(sameInstant(DEFAULT_DATE)))
            .andExpect(jsonPath("$.dateFrom").value(sameInstant(DEFAULT_DATE_FROM)))
            .andExpect(jsonPath("$.dateUntil").value(sameInstant(DEFAULT_DATE_UNTIL)))
            .andExpect(jsonPath("$.seen").value(DEFAULT_SEEN.booleanValue()))
            .andExpect(jsonPath("$.approved").value(DEFAULT_APPROVED.booleanValue()))
            .andExpect(jsonPath("$.total").value(DEFAULT_TOTAL.doubleValue()))
            .andExpect(jsonPath("$.feeBilled").value(DEFAULT_FEE_BILLED.booleanValue()));
    }

    @Test
    @Transactional
    void getNonExistingOrganizationReservation() throws Exception {
        // Get the organizationReservation
        restOrganizationReservationMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewOrganizationReservation() throws Exception {
        // Initialize the database
        organizationReservationRepository.saveAndFlush(organizationReservation);

        int databaseSizeBeforeUpdate = organizationReservationRepository.findAll().size();

        // Update the organizationReservation
        OrganizationReservation updatedOrganizationReservation = organizationReservationRepository
            .findById(organizationReservation.getId())
            .get();
        // Disconnect from session so that the updates on updatedOrganizationReservation are not directly saved in db
        em.detach(updatedOrganizationReservation);
        updatedOrganizationReservation
            .date(UPDATED_DATE)
            .dateFrom(UPDATED_DATE_FROM)
            .dateUntil(UPDATED_DATE_UNTIL)
            .seen(UPDATED_SEEN)
            .approved(UPDATED_APPROVED)
            .total(UPDATED_TOTAL)
            .feeBilled(UPDATED_FEE_BILLED);

        restOrganizationReservationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedOrganizationReservation.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedOrganizationReservation))
            )
            .andExpect(status().isOk());

        // Validate the OrganizationReservation in the database
        List<OrganizationReservation> organizationReservationList = organizationReservationRepository.findAll();
        assertThat(organizationReservationList).hasSize(databaseSizeBeforeUpdate);
        OrganizationReservation testOrganizationReservation = organizationReservationList.get(organizationReservationList.size() - 1);
        assertThat(testOrganizationReservation.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testOrganizationReservation.getDateFrom()).isEqualTo(UPDATED_DATE_FROM);
        assertThat(testOrganizationReservation.getDateUntil()).isEqualTo(UPDATED_DATE_UNTIL);
        assertThat(testOrganizationReservation.getSeen()).isEqualTo(UPDATED_SEEN);
        assertThat(testOrganizationReservation.getApproved()).isEqualTo(UPDATED_APPROVED);
        assertThat(testOrganizationReservation.getTotal()).isEqualTo(UPDATED_TOTAL);
        assertThat(testOrganizationReservation.getFeeBilled()).isEqualTo(UPDATED_FEE_BILLED);
    }

    @Test
    @Transactional
    void putNonExistingOrganizationReservation() throws Exception {
        int databaseSizeBeforeUpdate = organizationReservationRepository.findAll().size();
        organizationReservation.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restOrganizationReservationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, organizationReservation.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(organizationReservation))
            )
            .andExpect(status().isBadRequest());

        // Validate the OrganizationReservation in the database
        List<OrganizationReservation> organizationReservationList = organizationReservationRepository.findAll();
        assertThat(organizationReservationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchOrganizationReservation() throws Exception {
        int databaseSizeBeforeUpdate = organizationReservationRepository.findAll().size();
        organizationReservation.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOrganizationReservationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(organizationReservation))
            )
            .andExpect(status().isBadRequest());

        // Validate the OrganizationReservation in the database
        List<OrganizationReservation> organizationReservationList = organizationReservationRepository.findAll();
        assertThat(organizationReservationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamOrganizationReservation() throws Exception {
        int databaseSizeBeforeUpdate = organizationReservationRepository.findAll().size();
        organizationReservation.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOrganizationReservationMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(organizationReservation))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the OrganizationReservation in the database
        List<OrganizationReservation> organizationReservationList = organizationReservationRepository.findAll();
        assertThat(organizationReservationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateOrganizationReservationWithPatch() throws Exception {
        // Initialize the database
        organizationReservationRepository.saveAndFlush(organizationReservation);

        int databaseSizeBeforeUpdate = organizationReservationRepository.findAll().size();

        // Update the organizationReservation using partial update
        OrganizationReservation partialUpdatedOrganizationReservation = new OrganizationReservation();
        partialUpdatedOrganizationReservation.setId(organizationReservation.getId());

        partialUpdatedOrganizationReservation.seen(UPDATED_SEEN).feeBilled(UPDATED_FEE_BILLED);

        restOrganizationReservationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedOrganizationReservation.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedOrganizationReservation))
            )
            .andExpect(status().isOk());

        // Validate the OrganizationReservation in the database
        List<OrganizationReservation> organizationReservationList = organizationReservationRepository.findAll();
        assertThat(organizationReservationList).hasSize(databaseSizeBeforeUpdate);
        OrganizationReservation testOrganizationReservation = organizationReservationList.get(organizationReservationList.size() - 1);
        assertThat(testOrganizationReservation.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testOrganizationReservation.getDateFrom()).isEqualTo(DEFAULT_DATE_FROM);
        assertThat(testOrganizationReservation.getDateUntil()).isEqualTo(DEFAULT_DATE_UNTIL);
        assertThat(testOrganizationReservation.getSeen()).isEqualTo(UPDATED_SEEN);
        assertThat(testOrganizationReservation.getApproved()).isEqualTo(DEFAULT_APPROVED);
        assertThat(testOrganizationReservation.getTotal()).isEqualTo(DEFAULT_TOTAL);
        assertThat(testOrganizationReservation.getFeeBilled()).isEqualTo(UPDATED_FEE_BILLED);
    }

    @Test
    @Transactional
    void fullUpdateOrganizationReservationWithPatch() throws Exception {
        // Initialize the database
        organizationReservationRepository.saveAndFlush(organizationReservation);

        int databaseSizeBeforeUpdate = organizationReservationRepository.findAll().size();

        // Update the organizationReservation using partial update
        OrganizationReservation partialUpdatedOrganizationReservation = new OrganizationReservation();
        partialUpdatedOrganizationReservation.setId(organizationReservation.getId());

        partialUpdatedOrganizationReservation
            .date(UPDATED_DATE)
            .dateFrom(UPDATED_DATE_FROM)
            .dateUntil(UPDATED_DATE_UNTIL)
            .seen(UPDATED_SEEN)
            .approved(UPDATED_APPROVED)
            .total(UPDATED_TOTAL)
            .feeBilled(UPDATED_FEE_BILLED);

        restOrganizationReservationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedOrganizationReservation.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedOrganizationReservation))
            )
            .andExpect(status().isOk());

        // Validate the OrganizationReservation in the database
        List<OrganizationReservation> organizationReservationList = organizationReservationRepository.findAll();
        assertThat(organizationReservationList).hasSize(databaseSizeBeforeUpdate);
        OrganizationReservation testOrganizationReservation = organizationReservationList.get(organizationReservationList.size() - 1);
        assertThat(testOrganizationReservation.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testOrganizationReservation.getDateFrom()).isEqualTo(UPDATED_DATE_FROM);
        assertThat(testOrganizationReservation.getDateUntil()).isEqualTo(UPDATED_DATE_UNTIL);
        assertThat(testOrganizationReservation.getSeen()).isEqualTo(UPDATED_SEEN);
        assertThat(testOrganizationReservation.getApproved()).isEqualTo(UPDATED_APPROVED);
        assertThat(testOrganizationReservation.getTotal()).isEqualTo(UPDATED_TOTAL);
        assertThat(testOrganizationReservation.getFeeBilled()).isEqualTo(UPDATED_FEE_BILLED);
    }

    @Test
    @Transactional
    void patchNonExistingOrganizationReservation() throws Exception {
        int databaseSizeBeforeUpdate = organizationReservationRepository.findAll().size();
        organizationReservation.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restOrganizationReservationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, organizationReservation.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(organizationReservation))
            )
            .andExpect(status().isBadRequest());

        // Validate the OrganizationReservation in the database
        List<OrganizationReservation> organizationReservationList = organizationReservationRepository.findAll();
        assertThat(organizationReservationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchOrganizationReservation() throws Exception {
        int databaseSizeBeforeUpdate = organizationReservationRepository.findAll().size();
        organizationReservation.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOrganizationReservationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(organizationReservation))
            )
            .andExpect(status().isBadRequest());

        // Validate the OrganizationReservation in the database
        List<OrganizationReservation> organizationReservationList = organizationReservationRepository.findAll();
        assertThat(organizationReservationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamOrganizationReservation() throws Exception {
        int databaseSizeBeforeUpdate = organizationReservationRepository.findAll().size();
        organizationReservation.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOrganizationReservationMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(organizationReservation))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the OrganizationReservation in the database
        List<OrganizationReservation> organizationReservationList = organizationReservationRepository.findAll();
        assertThat(organizationReservationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteOrganizationReservation() throws Exception {
        // Initialize the database
        organizationReservationRepository.saveAndFlush(organizationReservation);

        int databaseSizeBeforeDelete = organizationReservationRepository.findAll().size();

        // Delete the organizationReservation
        restOrganizationReservationMockMvc
            .perform(delete(ENTITY_API_URL_ID, organizationReservation.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<OrganizationReservation> organizationReservationList = organizationReservationRepository.findAll();
        assertThat(organizationReservationList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
