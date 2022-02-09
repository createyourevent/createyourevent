package org.createyourevent.app.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.createyourevent.app.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class EventDetailsTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(EventDetails.class);
        EventDetails eventDetails1 = new EventDetails();
        eventDetails1.setId(1L);
        EventDetails eventDetails2 = new EventDetails();
        eventDetails2.setId(eventDetails1.getId());
        assertThat(eventDetails1).isEqualTo(eventDetails2);
        eventDetails2.setId(2L);
        assertThat(eventDetails1).isNotEqualTo(eventDetails2);
        eventDetails1.setId(null);
        assertThat(eventDetails1).isNotEqualTo(eventDetails2);
    }
}
