package org.createyourevent.app.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.createyourevent.app.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class EventStarRatingTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(EventStarRating.class);
        EventStarRating eventStarRating1 = new EventStarRating();
        eventStarRating1.setId(1L);
        EventStarRating eventStarRating2 = new EventStarRating();
        eventStarRating2.setId(eventStarRating1.getId());
        assertThat(eventStarRating1).isEqualTo(eventStarRating2);
        eventStarRating2.setId(2L);
        assertThat(eventStarRating1).isNotEqualTo(eventStarRating2);
        eventStarRating1.setId(null);
        assertThat(eventStarRating1).isNotEqualTo(eventStarRating2);
    }
}
