package org.createyourevent.app.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.createyourevent.app.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class EventProductOrderTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(EventProductOrder.class);
        EventProductOrder eventProductOrder1 = new EventProductOrder();
        eventProductOrder1.setId(1L);
        EventProductOrder eventProductOrder2 = new EventProductOrder();
        eventProductOrder2.setId(eventProductOrder1.getId());
        assertThat(eventProductOrder1).isEqualTo(eventProductOrder2);
        eventProductOrder2.setId(2L);
        assertThat(eventProductOrder1).isNotEqualTo(eventProductOrder2);
        eventProductOrder1.setId(null);
        assertThat(eventProductOrder1).isNotEqualTo(eventProductOrder2);
    }
}
