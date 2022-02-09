package org.createyourevent.app.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.createyourevent.app.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class EventCommentTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(EventComment.class);
        EventComment eventComment1 = new EventComment();
        eventComment1.setId(1L);
        EventComment eventComment2 = new EventComment();
        eventComment2.setId(eventComment1.getId());
        assertThat(eventComment1).isEqualTo(eventComment2);
        eventComment2.setId(2L);
        assertThat(eventComment1).isNotEqualTo(eventComment2);
        eventComment1.setId(null);
        assertThat(eventComment1).isNotEqualTo(eventComment2);
    }
}
