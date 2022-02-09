package org.createyourevent.app.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.createyourevent.app.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class EventLikeDislikeTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(EventLikeDislike.class);
        EventLikeDislike eventLikeDislike1 = new EventLikeDislike();
        eventLikeDislike1.setId(1L);
        EventLikeDislike eventLikeDislike2 = new EventLikeDislike();
        eventLikeDislike2.setId(eventLikeDislike1.getId());
        assertThat(eventLikeDislike1).isEqualTo(eventLikeDislike2);
        eventLikeDislike2.setId(2L);
        assertThat(eventLikeDislike1).isNotEqualTo(eventLikeDislike2);
        eventLikeDislike1.setId(null);
        assertThat(eventLikeDislike1).isNotEqualTo(eventLikeDislike2);
    }
}
