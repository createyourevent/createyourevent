package org.createyourevent.app.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.createyourevent.app.web.rest.TestUtil.sameInstant;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.createyourevent.app.IntegrationTest;
import org.createyourevent.app.domain.Event;
import org.createyourevent.app.domain.enumeration.EventCategory;
import org.createyourevent.app.domain.enumeration.EventStatus;
import org.createyourevent.app.repository.EventRepository;
import org.createyourevent.app.service.EventService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Base64Utils;

/**
 * Integration tests for the {@link EventResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class EventResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_DATE_START = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_DATE_START = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ZonedDateTime DEFAULT_DATE_END = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_DATE_END = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final EventCategory DEFAULT_CATEGORY = EventCategory.INDOOR;
    private static final EventCategory UPDATED_CATEGORY = EventCategory.OUTDOOR;

    private static final Float DEFAULT_PRICE = 1F;
    private static final Float UPDATED_PRICE = 2F;

    private static final byte[] DEFAULT_FLYER = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_FLYER = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_FLYER_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_FLYER_CONTENT_TYPE = "image/png";

    private static final String DEFAULT_YOUTUBE = "AAAAAAAAAA";
    private static final String UPDATED_YOUTUBE = "BBBBBBBBBB";

    private static final String DEFAULT_PRIVATE_OR_PUBLIC = "AAAAAAAAAA";
    private static final String UPDATED_PRIVATE_OR_PUBLIC = "BBBBBBBBBB";

    private static final Boolean DEFAULT_ACTIVE = false;
    private static final Boolean UPDATED_ACTIVE = true;

    private static final Integer DEFAULT_MIN_PLACENUMBER = 1;
    private static final Integer UPDATED_MIN_PLACENUMBER = 2;

    private static final Integer DEFAULT_PLACENUMBER = 1;
    private static final Integer UPDATED_PLACENUMBER = 2;

    private static final Float DEFAULT_INVESTMENT = 1F;
    private static final Float UPDATED_INVESTMENT = 2F;

    private static final EventStatus DEFAULT_STATUS = EventStatus.PROCESSING;
    private static final EventStatus UPDATED_STATUS = EventStatus.DEFINITELY;

    private static final Boolean DEFAULT_DEFINITELY_CONFIRMED = false;
    private static final Boolean UPDATED_DEFINITELY_CONFIRMED = true;

    private static final String DEFAULT_MOTTO = "AAAAAAAAAA";
    private static final String UPDATED_MOTTO = "BBBBBBBBBB";

    private static final Boolean DEFAULT_BILLED = false;
    private static final Boolean UPDATED_BILLED = true;

    private static final Float DEFAULT_STARS = 1F;
    private static final Float UPDATED_STARS = 2F;

    private static final Boolean DEFAULT_BILLED_ORGANISATOR = false;
    private static final Boolean UPDATED_BILLED_ORGANISATOR = true;

    private static final Boolean DEFAULT_BILLEDE_CREATE_YOUR_EVENT = false;
    private static final Boolean UPDATED_BILLEDE_CREATE_YOUR_EVENT = true;

    private static final String ENTITY_API_URL = "/api/events";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private EventRepository eventRepository;

    @Mock
    private EventRepository eventRepositoryMock;

    @Mock
    private EventService eventServiceMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restEventMockMvc;

    private Event event;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Event createEntity(EntityManager em) {
        Event event = new Event()
            .name(DEFAULT_NAME)
            .description(DEFAULT_DESCRIPTION)
            .dateStart(DEFAULT_DATE_START)
            .dateEnd(DEFAULT_DATE_END)
            .category(DEFAULT_CATEGORY)
            .price(DEFAULT_PRICE)
            .flyer(DEFAULT_FLYER)
            .flyerContentType(DEFAULT_FLYER_CONTENT_TYPE)
            .youtube(DEFAULT_YOUTUBE)
            .privateOrPublic(DEFAULT_PRIVATE_OR_PUBLIC)
            .active(DEFAULT_ACTIVE)
            .minPlacenumber(DEFAULT_MIN_PLACENUMBER)
            .placenumber(DEFAULT_PLACENUMBER)
            .investment(DEFAULT_INVESTMENT)
            .status(DEFAULT_STATUS)
            .definitelyConfirmed(DEFAULT_DEFINITELY_CONFIRMED)
            .motto(DEFAULT_MOTTO)
            .billed(DEFAULT_BILLED)
            .stars(DEFAULT_STARS)
            .billedOrganisator(DEFAULT_BILLED_ORGANISATOR)
            .billedeCreateYourEvent(DEFAULT_BILLEDE_CREATE_YOUR_EVENT);
        return event;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Event createUpdatedEntity(EntityManager em) {
        Event event = new Event()
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .dateStart(UPDATED_DATE_START)
            .dateEnd(UPDATED_DATE_END)
            .category(UPDATED_CATEGORY)
            .price(UPDATED_PRICE)
            .flyer(UPDATED_FLYER)
            .flyerContentType(UPDATED_FLYER_CONTENT_TYPE)
            .youtube(UPDATED_YOUTUBE)
            .privateOrPublic(UPDATED_PRIVATE_OR_PUBLIC)
            .active(UPDATED_ACTIVE)
            .minPlacenumber(UPDATED_MIN_PLACENUMBER)
            .placenumber(UPDATED_PLACENUMBER)
            .investment(UPDATED_INVESTMENT)
            .status(UPDATED_STATUS)
            .definitelyConfirmed(UPDATED_DEFINITELY_CONFIRMED)
            .motto(UPDATED_MOTTO)
            .billed(UPDATED_BILLED)
            .stars(UPDATED_STARS)
            .billedOrganisator(UPDATED_BILLED_ORGANISATOR)
            .billedeCreateYourEvent(UPDATED_BILLEDE_CREATE_YOUR_EVENT);
        return event;
    }

    @BeforeEach
    public void initTest() {
        event = createEntity(em);
    }

    @Test
    @Transactional
    void createEvent() throws Exception {
        int databaseSizeBeforeCreate = eventRepository.findAll().size();
        // Create the Event
        restEventMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(event))
            )
            .andExpect(status().isCreated());

        // Validate the Event in the database
        List<Event> eventList = eventRepository.findAll();
        assertThat(eventList).hasSize(databaseSizeBeforeCreate + 1);
        Event testEvent = eventList.get(eventList.size() - 1);
        assertThat(testEvent.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testEvent.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testEvent.getDateStart()).isEqualTo(DEFAULT_DATE_START);
        assertThat(testEvent.getDateEnd()).isEqualTo(DEFAULT_DATE_END);
        assertThat(testEvent.getCategory()).isEqualTo(DEFAULT_CATEGORY);
        assertThat(testEvent.getPrice()).isEqualTo(DEFAULT_PRICE);
        assertThat(testEvent.getFlyer()).isEqualTo(DEFAULT_FLYER);
        assertThat(testEvent.getFlyerContentType()).isEqualTo(DEFAULT_FLYER_CONTENT_TYPE);
        assertThat(testEvent.getYoutube()).isEqualTo(DEFAULT_YOUTUBE);
        assertThat(testEvent.getPrivateOrPublic()).isEqualTo(DEFAULT_PRIVATE_OR_PUBLIC);
        assertThat(testEvent.getActive()).isEqualTo(DEFAULT_ACTIVE);
        assertThat(testEvent.getMinPlacenumber()).isEqualTo(DEFAULT_MIN_PLACENUMBER);
        assertThat(testEvent.getPlacenumber()).isEqualTo(DEFAULT_PLACENUMBER);
        assertThat(testEvent.getInvestment()).isEqualTo(DEFAULT_INVESTMENT);
        assertThat(testEvent.getStatus()).isEqualTo(DEFAULT_STATUS);
        assertThat(testEvent.getDefinitelyConfirmed()).isEqualTo(DEFAULT_DEFINITELY_CONFIRMED);
        assertThat(testEvent.getMotto()).isEqualTo(DEFAULT_MOTTO);
        assertThat(testEvent.getBilled()).isEqualTo(DEFAULT_BILLED);
        assertThat(testEvent.getStars()).isEqualTo(DEFAULT_STARS);
        assertThat(testEvent.getBilledOrganisator()).isEqualTo(DEFAULT_BILLED_ORGANISATOR);
        assertThat(testEvent.getBilledeCreateYourEvent()).isEqualTo(DEFAULT_BILLEDE_CREATE_YOUR_EVENT);
    }

    @Test
    @Transactional
    void createEventWithExistingId() throws Exception {
        // Create the Event with an existing ID
        event.setId(1L);

        int databaseSizeBeforeCreate = eventRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restEventMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(event))
            )
            .andExpect(status().isBadRequest());

        // Validate the Event in the database
        List<Event> eventList = eventRepository.findAll();
        assertThat(eventList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = eventRepository.findAll().size();
        // set the field null
        event.setName(null);

        // Create the Event, which fails.

        restEventMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(event))
            )
            .andExpect(status().isBadRequest());

        List<Event> eventList = eventRepository.findAll();
        assertThat(eventList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkDateStartIsRequired() throws Exception {
        int databaseSizeBeforeTest = eventRepository.findAll().size();
        // set the field null
        event.setDateStart(null);

        // Create the Event, which fails.

        restEventMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(event))
            )
            .andExpect(status().isBadRequest());

        List<Event> eventList = eventRepository.findAll();
        assertThat(eventList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkDateEndIsRequired() throws Exception {
        int databaseSizeBeforeTest = eventRepository.findAll().size();
        // set the field null
        event.setDateEnd(null);

        // Create the Event, which fails.

        restEventMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(event))
            )
            .andExpect(status().isBadRequest());

        List<Event> eventList = eventRepository.findAll();
        assertThat(eventList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkCategoryIsRequired() throws Exception {
        int databaseSizeBeforeTest = eventRepository.findAll().size();
        // set the field null
        event.setCategory(null);

        // Create the Event, which fails.

        restEventMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(event))
            )
            .andExpect(status().isBadRequest());

        List<Event> eventList = eventRepository.findAll();
        assertThat(eventList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkPriceIsRequired() throws Exception {
        int databaseSizeBeforeTest = eventRepository.findAll().size();
        // set the field null
        event.setPrice(null);

        // Create the Event, which fails.

        restEventMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(event))
            )
            .andExpect(status().isBadRequest());

        List<Event> eventList = eventRepository.findAll();
        assertThat(eventList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkPrivateOrPublicIsRequired() throws Exception {
        int databaseSizeBeforeTest = eventRepository.findAll().size();
        // set the field null
        event.setPrivateOrPublic(null);

        // Create the Event, which fails.

        restEventMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(event))
            )
            .andExpect(status().isBadRequest());

        List<Event> eventList = eventRepository.findAll();
        assertThat(eventList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkMinPlacenumberIsRequired() throws Exception {
        int databaseSizeBeforeTest = eventRepository.findAll().size();
        // set the field null
        event.setMinPlacenumber(null);

        // Create the Event, which fails.

        restEventMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(event))
            )
            .andExpect(status().isBadRequest());

        List<Event> eventList = eventRepository.findAll();
        assertThat(eventList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkPlacenumberIsRequired() throws Exception {
        int databaseSizeBeforeTest = eventRepository.findAll().size();
        // set the field null
        event.setPlacenumber(null);

        // Create the Event, which fails.

        restEventMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(event))
            )
            .andExpect(status().isBadRequest());

        List<Event> eventList = eventRepository.findAll();
        assertThat(eventList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkInvestmentIsRequired() throws Exception {
        int databaseSizeBeforeTest = eventRepository.findAll().size();
        // set the field null
        event.setInvestment(null);

        // Create the Event, which fails.

        restEventMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(event))
            )
            .andExpect(status().isBadRequest());

        List<Event> eventList = eventRepository.findAll();
        assertThat(eventList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkMottoIsRequired() throws Exception {
        int databaseSizeBeforeTest = eventRepository.findAll().size();
        // set the field null
        event.setMotto(null);

        // Create the Event, which fails.

        restEventMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(event))
            )
            .andExpect(status().isBadRequest());

        List<Event> eventList = eventRepository.findAll();
        assertThat(eventList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllEvents() throws Exception {
        // Initialize the database
        eventRepository.saveAndFlush(event);

        // Get all the eventList
        restEventMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(event.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())))
            .andExpect(jsonPath("$.[*].dateStart").value(hasItem(sameInstant(DEFAULT_DATE_START))))
            .andExpect(jsonPath("$.[*].dateEnd").value(hasItem(sameInstant(DEFAULT_DATE_END))))
            .andExpect(jsonPath("$.[*].category").value(hasItem(DEFAULT_CATEGORY.toString())))
            .andExpect(jsonPath("$.[*].price").value(hasItem(DEFAULT_PRICE.doubleValue())))
            .andExpect(jsonPath("$.[*].flyerContentType").value(hasItem(DEFAULT_FLYER_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].flyer").value(hasItem(Base64Utils.encodeToString(DEFAULT_FLYER))))
            .andExpect(jsonPath("$.[*].youtube").value(hasItem(DEFAULT_YOUTUBE)))
            .andExpect(jsonPath("$.[*].privateOrPublic").value(hasItem(DEFAULT_PRIVATE_OR_PUBLIC)))
            .andExpect(jsonPath("$.[*].active").value(hasItem(DEFAULT_ACTIVE.booleanValue())))
            .andExpect(jsonPath("$.[*].minPlacenumber").value(hasItem(DEFAULT_MIN_PLACENUMBER)))
            .andExpect(jsonPath("$.[*].placenumber").value(hasItem(DEFAULT_PLACENUMBER)))
            .andExpect(jsonPath("$.[*].investment").value(hasItem(DEFAULT_INVESTMENT.doubleValue())))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())))
            .andExpect(jsonPath("$.[*].definitelyConfirmed").value(hasItem(DEFAULT_DEFINITELY_CONFIRMED.booleanValue())))
            .andExpect(jsonPath("$.[*].motto").value(hasItem(DEFAULT_MOTTO)))
            .andExpect(jsonPath("$.[*].billed").value(hasItem(DEFAULT_BILLED.booleanValue())))
            .andExpect(jsonPath("$.[*].stars").value(hasItem(DEFAULT_STARS.doubleValue())))
            .andExpect(jsonPath("$.[*].billedOrganisator").value(hasItem(DEFAULT_BILLED_ORGANISATOR.booleanValue())))
            .andExpect(jsonPath("$.[*].billedeCreateYourEvent").value(hasItem(DEFAULT_BILLEDE_CREATE_YOUR_EVENT.booleanValue())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllEventsWithEagerRelationshipsIsEnabled() throws Exception {
        when(eventServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restEventMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(eventServiceMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllEventsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(eventServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restEventMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(eventServiceMock, times(1)).findAllWithEagerRelationships(any());
    }

    @Test
    @Transactional
    void getEvent() throws Exception {
        // Initialize the database
        eventRepository.saveAndFlush(event);

        // Get the event
        restEventMockMvc
            .perform(get(ENTITY_API_URL_ID, event.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(event.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION.toString()))
            .andExpect(jsonPath("$.dateStart").value(sameInstant(DEFAULT_DATE_START)))
            .andExpect(jsonPath("$.dateEnd").value(sameInstant(DEFAULT_DATE_END)))
            .andExpect(jsonPath("$.category").value(DEFAULT_CATEGORY.toString()))
            .andExpect(jsonPath("$.price").value(DEFAULT_PRICE.doubleValue()))
            .andExpect(jsonPath("$.flyerContentType").value(DEFAULT_FLYER_CONTENT_TYPE))
            .andExpect(jsonPath("$.flyer").value(Base64Utils.encodeToString(DEFAULT_FLYER)))
            .andExpect(jsonPath("$.youtube").value(DEFAULT_YOUTUBE))
            .andExpect(jsonPath("$.privateOrPublic").value(DEFAULT_PRIVATE_OR_PUBLIC))
            .andExpect(jsonPath("$.active").value(DEFAULT_ACTIVE.booleanValue()))
            .andExpect(jsonPath("$.minPlacenumber").value(DEFAULT_MIN_PLACENUMBER))
            .andExpect(jsonPath("$.placenumber").value(DEFAULT_PLACENUMBER))
            .andExpect(jsonPath("$.investment").value(DEFAULT_INVESTMENT.doubleValue()))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS.toString()))
            .andExpect(jsonPath("$.definitelyConfirmed").value(DEFAULT_DEFINITELY_CONFIRMED.booleanValue()))
            .andExpect(jsonPath("$.motto").value(DEFAULT_MOTTO))
            .andExpect(jsonPath("$.billed").value(DEFAULT_BILLED.booleanValue()))
            .andExpect(jsonPath("$.stars").value(DEFAULT_STARS.doubleValue()))
            .andExpect(jsonPath("$.billedOrganisator").value(DEFAULT_BILLED_ORGANISATOR.booleanValue()))
            .andExpect(jsonPath("$.billedeCreateYourEvent").value(DEFAULT_BILLEDE_CREATE_YOUR_EVENT.booleanValue()));
    }

    @Test
    @Transactional
    void getNonExistingEvent() throws Exception {
        // Get the event
        restEventMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewEvent() throws Exception {
        // Initialize the database
        eventRepository.saveAndFlush(event);

        int databaseSizeBeforeUpdate = eventRepository.findAll().size();

        // Update the event
        Event updatedEvent = eventRepository.findById(event.getId()).get();
        // Disconnect from session so that the updates on updatedEvent are not directly saved in db
        em.detach(updatedEvent);
        updatedEvent
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .dateStart(UPDATED_DATE_START)
            .dateEnd(UPDATED_DATE_END)
            .category(UPDATED_CATEGORY)
            .price(UPDATED_PRICE)
            .flyer(UPDATED_FLYER)
            .flyerContentType(UPDATED_FLYER_CONTENT_TYPE)
            .youtube(UPDATED_YOUTUBE)
            .privateOrPublic(UPDATED_PRIVATE_OR_PUBLIC)
            .active(UPDATED_ACTIVE)
            .minPlacenumber(UPDATED_MIN_PLACENUMBER)
            .placenumber(UPDATED_PLACENUMBER)
            .investment(UPDATED_INVESTMENT)
            .status(UPDATED_STATUS)
            .definitelyConfirmed(UPDATED_DEFINITELY_CONFIRMED)
            .motto(UPDATED_MOTTO)
            .billed(UPDATED_BILLED)
            .stars(UPDATED_STARS)
            .billedOrganisator(UPDATED_BILLED_ORGANISATOR)
            .billedeCreateYourEvent(UPDATED_BILLEDE_CREATE_YOUR_EVENT);

        restEventMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedEvent.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedEvent))
            )
            .andExpect(status().isOk());

        // Validate the Event in the database
        List<Event> eventList = eventRepository.findAll();
        assertThat(eventList).hasSize(databaseSizeBeforeUpdate);
        Event testEvent = eventList.get(eventList.size() - 1);
        assertThat(testEvent.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testEvent.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testEvent.getDateStart()).isEqualTo(UPDATED_DATE_START);
        assertThat(testEvent.getDateEnd()).isEqualTo(UPDATED_DATE_END);
        assertThat(testEvent.getCategory()).isEqualTo(UPDATED_CATEGORY);
        assertThat(testEvent.getPrice()).isEqualTo(UPDATED_PRICE);
        assertThat(testEvent.getFlyer()).isEqualTo(UPDATED_FLYER);
        assertThat(testEvent.getFlyerContentType()).isEqualTo(UPDATED_FLYER_CONTENT_TYPE);
        assertThat(testEvent.getYoutube()).isEqualTo(UPDATED_YOUTUBE);
        assertThat(testEvent.getPrivateOrPublic()).isEqualTo(UPDATED_PRIVATE_OR_PUBLIC);
        assertThat(testEvent.getActive()).isEqualTo(UPDATED_ACTIVE);
        assertThat(testEvent.getMinPlacenumber()).isEqualTo(UPDATED_MIN_PLACENUMBER);
        assertThat(testEvent.getPlacenumber()).isEqualTo(UPDATED_PLACENUMBER);
        assertThat(testEvent.getInvestment()).isEqualTo(UPDATED_INVESTMENT);
        assertThat(testEvent.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testEvent.getDefinitelyConfirmed()).isEqualTo(UPDATED_DEFINITELY_CONFIRMED);
        assertThat(testEvent.getMotto()).isEqualTo(UPDATED_MOTTO);
        assertThat(testEvent.getBilled()).isEqualTo(UPDATED_BILLED);
        assertThat(testEvent.getStars()).isEqualTo(UPDATED_STARS);
        assertThat(testEvent.getBilledOrganisator()).isEqualTo(UPDATED_BILLED_ORGANISATOR);
        assertThat(testEvent.getBilledeCreateYourEvent()).isEqualTo(UPDATED_BILLEDE_CREATE_YOUR_EVENT);
    }

    @Test
    @Transactional
    void putNonExistingEvent() throws Exception {
        int databaseSizeBeforeUpdate = eventRepository.findAll().size();
        event.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEventMockMvc
            .perform(
                put(ENTITY_API_URL_ID, event.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(event))
            )
            .andExpect(status().isBadRequest());

        // Validate the Event in the database
        List<Event> eventList = eventRepository.findAll();
        assertThat(eventList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchEvent() throws Exception {
        int databaseSizeBeforeUpdate = eventRepository.findAll().size();
        event.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEventMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(event))
            )
            .andExpect(status().isBadRequest());

        // Validate the Event in the database
        List<Event> eventList = eventRepository.findAll();
        assertThat(eventList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamEvent() throws Exception {
        int databaseSizeBeforeUpdate = eventRepository.findAll().size();
        event.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEventMockMvc
            .perform(
                put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(event))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Event in the database
        List<Event> eventList = eventRepository.findAll();
        assertThat(eventList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateEventWithPatch() throws Exception {
        // Initialize the database
        eventRepository.saveAndFlush(event);

        int databaseSizeBeforeUpdate = eventRepository.findAll().size();

        // Update the event using partial update
        Event partialUpdatedEvent = new Event();
        partialUpdatedEvent.setId(event.getId());

        partialUpdatedEvent
            .description(UPDATED_DESCRIPTION)
            .youtube(UPDATED_YOUTUBE)
            .placenumber(UPDATED_PLACENUMBER)
            .investment(UPDATED_INVESTMENT)
            .motto(UPDATED_MOTTO)
            .billed(UPDATED_BILLED)
            .stars(UPDATED_STARS)
            .billedOrganisator(UPDATED_BILLED_ORGANISATOR);

        restEventMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEvent.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedEvent))
            )
            .andExpect(status().isOk());

        // Validate the Event in the database
        List<Event> eventList = eventRepository.findAll();
        assertThat(eventList).hasSize(databaseSizeBeforeUpdate);
        Event testEvent = eventList.get(eventList.size() - 1);
        assertThat(testEvent.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testEvent.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testEvent.getDateStart()).isEqualTo(DEFAULT_DATE_START);
        assertThat(testEvent.getDateEnd()).isEqualTo(DEFAULT_DATE_END);
        assertThat(testEvent.getCategory()).isEqualTo(DEFAULT_CATEGORY);
        assertThat(testEvent.getPrice()).isEqualTo(DEFAULT_PRICE);
        assertThat(testEvent.getFlyer()).isEqualTo(DEFAULT_FLYER);
        assertThat(testEvent.getFlyerContentType()).isEqualTo(DEFAULT_FLYER_CONTENT_TYPE);
        assertThat(testEvent.getYoutube()).isEqualTo(UPDATED_YOUTUBE);
        assertThat(testEvent.getPrivateOrPublic()).isEqualTo(DEFAULT_PRIVATE_OR_PUBLIC);
        assertThat(testEvent.getActive()).isEqualTo(DEFAULT_ACTIVE);
        assertThat(testEvent.getMinPlacenumber()).isEqualTo(DEFAULT_MIN_PLACENUMBER);
        assertThat(testEvent.getPlacenumber()).isEqualTo(UPDATED_PLACENUMBER);
        assertThat(testEvent.getInvestment()).isEqualTo(UPDATED_INVESTMENT);
        assertThat(testEvent.getStatus()).isEqualTo(DEFAULT_STATUS);
        assertThat(testEvent.getDefinitelyConfirmed()).isEqualTo(DEFAULT_DEFINITELY_CONFIRMED);
        assertThat(testEvent.getMotto()).isEqualTo(UPDATED_MOTTO);
        assertThat(testEvent.getBilled()).isEqualTo(UPDATED_BILLED);
        assertThat(testEvent.getStars()).isEqualTo(UPDATED_STARS);
        assertThat(testEvent.getBilledOrganisator()).isEqualTo(UPDATED_BILLED_ORGANISATOR);
        assertThat(testEvent.getBilledeCreateYourEvent()).isEqualTo(DEFAULT_BILLEDE_CREATE_YOUR_EVENT);
    }

    @Test
    @Transactional
    void fullUpdateEventWithPatch() throws Exception {
        // Initialize the database
        eventRepository.saveAndFlush(event);

        int databaseSizeBeforeUpdate = eventRepository.findAll().size();

        // Update the event using partial update
        Event partialUpdatedEvent = new Event();
        partialUpdatedEvent.setId(event.getId());

        partialUpdatedEvent
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .dateStart(UPDATED_DATE_START)
            .dateEnd(UPDATED_DATE_END)
            .category(UPDATED_CATEGORY)
            .price(UPDATED_PRICE)
            .flyer(UPDATED_FLYER)
            .flyerContentType(UPDATED_FLYER_CONTENT_TYPE)
            .youtube(UPDATED_YOUTUBE)
            .privateOrPublic(UPDATED_PRIVATE_OR_PUBLIC)
            .active(UPDATED_ACTIVE)
            .minPlacenumber(UPDATED_MIN_PLACENUMBER)
            .placenumber(UPDATED_PLACENUMBER)
            .investment(UPDATED_INVESTMENT)
            .status(UPDATED_STATUS)
            .definitelyConfirmed(UPDATED_DEFINITELY_CONFIRMED)
            .motto(UPDATED_MOTTO)
            .billed(UPDATED_BILLED)
            .stars(UPDATED_STARS)
            .billedOrganisator(UPDATED_BILLED_ORGANISATOR)
            .billedeCreateYourEvent(UPDATED_BILLEDE_CREATE_YOUR_EVENT);

        restEventMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEvent.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedEvent))
            )
            .andExpect(status().isOk());

        // Validate the Event in the database
        List<Event> eventList = eventRepository.findAll();
        assertThat(eventList).hasSize(databaseSizeBeforeUpdate);
        Event testEvent = eventList.get(eventList.size() - 1);
        assertThat(testEvent.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testEvent.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testEvent.getDateStart()).isEqualTo(UPDATED_DATE_START);
        assertThat(testEvent.getDateEnd()).isEqualTo(UPDATED_DATE_END);
        assertThat(testEvent.getCategory()).isEqualTo(UPDATED_CATEGORY);
        assertThat(testEvent.getPrice()).isEqualTo(UPDATED_PRICE);
        assertThat(testEvent.getFlyer()).isEqualTo(UPDATED_FLYER);
        assertThat(testEvent.getFlyerContentType()).isEqualTo(UPDATED_FLYER_CONTENT_TYPE);
        assertThat(testEvent.getYoutube()).isEqualTo(UPDATED_YOUTUBE);
        assertThat(testEvent.getPrivateOrPublic()).isEqualTo(UPDATED_PRIVATE_OR_PUBLIC);
        assertThat(testEvent.getActive()).isEqualTo(UPDATED_ACTIVE);
        assertThat(testEvent.getMinPlacenumber()).isEqualTo(UPDATED_MIN_PLACENUMBER);
        assertThat(testEvent.getPlacenumber()).isEqualTo(UPDATED_PLACENUMBER);
        assertThat(testEvent.getInvestment()).isEqualTo(UPDATED_INVESTMENT);
        assertThat(testEvent.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testEvent.getDefinitelyConfirmed()).isEqualTo(UPDATED_DEFINITELY_CONFIRMED);
        assertThat(testEvent.getMotto()).isEqualTo(UPDATED_MOTTO);
        assertThat(testEvent.getBilled()).isEqualTo(UPDATED_BILLED);
        assertThat(testEvent.getStars()).isEqualTo(UPDATED_STARS);
        assertThat(testEvent.getBilledOrganisator()).isEqualTo(UPDATED_BILLED_ORGANISATOR);
        assertThat(testEvent.getBilledeCreateYourEvent()).isEqualTo(UPDATED_BILLEDE_CREATE_YOUR_EVENT);
    }

    @Test
    @Transactional
    void patchNonExistingEvent() throws Exception {
        int databaseSizeBeforeUpdate = eventRepository.findAll().size();
        event.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEventMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, event.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(event))
            )
            .andExpect(status().isBadRequest());

        // Validate the Event in the database
        List<Event> eventList = eventRepository.findAll();
        assertThat(eventList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchEvent() throws Exception {
        int databaseSizeBeforeUpdate = eventRepository.findAll().size();
        event.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEventMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(event))
            )
            .andExpect(status().isBadRequest());

        // Validate the Event in the database
        List<Event> eventList = eventRepository.findAll();
        assertThat(eventList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamEvent() throws Exception {
        int databaseSizeBeforeUpdate = eventRepository.findAll().size();
        event.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEventMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(event))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Event in the database
        List<Event> eventList = eventRepository.findAll();
        assertThat(eventList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteEvent() throws Exception {
        // Initialize the database
        eventRepository.saveAndFlush(event);

        int databaseSizeBeforeDelete = eventRepository.findAll().size();

        // Delete the event
        restEventMockMvc
            .perform(delete(ENTITY_API_URL_ID, event.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Event> eventList = eventRepository.findAll();
        assertThat(eventList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
