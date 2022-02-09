package org.createyourevent.app.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.createyourevent.app.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class EventProductRatingCommentTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(EventProductRatingComment.class);
        EventProductRatingComment eventProductRatingComment1 = new EventProductRatingComment();
        eventProductRatingComment1.setId(1L);
        EventProductRatingComment eventProductRatingComment2 = new EventProductRatingComment();
        eventProductRatingComment2.setId(eventProductRatingComment1.getId());
        assertThat(eventProductRatingComment1).isEqualTo(eventProductRatingComment2);
        eventProductRatingComment2.setId(2L);
        assertThat(eventProductRatingComment1).isNotEqualTo(eventProductRatingComment2);
        eventProductRatingComment1.setId(null);
        assertThat(eventProductRatingComment1).isNotEqualTo(eventProductRatingComment2);
    }
}
