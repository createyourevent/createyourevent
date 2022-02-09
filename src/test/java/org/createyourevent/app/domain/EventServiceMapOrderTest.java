package org.createyourevent.app.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.createyourevent.app.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class EventServiceMapOrderTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(EventServiceMapOrder.class);
        EventServiceMapOrder eventServiceMapOrder1 = new EventServiceMapOrder();
        eventServiceMapOrder1.setId(1L);
        EventServiceMapOrder eventServiceMapOrder2 = new EventServiceMapOrder();
        eventServiceMapOrder2.setId(eventServiceMapOrder1.getId());
        assertThat(eventServiceMapOrder1).isEqualTo(eventServiceMapOrder2);
        eventServiceMapOrder2.setId(2L);
        assertThat(eventServiceMapOrder1).isNotEqualTo(eventServiceMapOrder2);
        eventServiceMapOrder1.setId(null);
        assertThat(eventServiceMapOrder1).isNotEqualTo(eventServiceMapOrder2);
    }
}
