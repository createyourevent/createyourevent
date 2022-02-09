package org.createyourevent.app.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.createyourevent.app.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class EventProductRatingTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(EventProductRating.class);
        EventProductRating eventProductRating1 = new EventProductRating();
        eventProductRating1.setId(1L);
        EventProductRating eventProductRating2 = new EventProductRating();
        eventProductRating2.setId(eventProductRating1.getId());
        assertThat(eventProductRating1).isEqualTo(eventProductRating2);
        eventProductRating2.setId(2L);
        assertThat(eventProductRating1).isNotEqualTo(eventProductRating2);
        eventProductRating1.setId(null);
        assertThat(eventProductRating1).isNotEqualTo(eventProductRating2);
    }
}
