package org.createyourevent.app.web.rest;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.createyourevent.app.IntegrationTest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

/**
 * Test class for the DataTransControllerResource REST controller.
 *
 * @see DataTransControllerResource
 */
@IntegrationTest
class DataTransControllerResourceIT {

    private MockMvc restMockMvc;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.initMocks(this);

        DataTransControllerResource dataTransControllerResource = new DataTransControllerResource();
        restMockMvc = MockMvcBuilders.standaloneSetup(dataTransControllerResource).build();
    }

    /**
     * Test getTransactionId
     */
    @Test
    void testGetTransactionId() throws Exception {
        restMockMvc.perform(get("/api/data-trans-controller/get-transaction-id")).andExpect(status().isOk());
    }

    /**
     * Test getStatus
     */
    @Test
    void testGetStatus() throws Exception {
        restMockMvc.perform(get("/api/data-trans-controller/get-status")).andExpect(status().isOk());
    }
}
