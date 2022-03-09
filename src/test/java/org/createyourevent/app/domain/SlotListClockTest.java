package org.createyourevent.app.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.createyourevent.app.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class SlotListClockTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(SlotListClock.class);
        SlotListClock slotListClock1 = new SlotListClock();
        slotListClock1.setId(1L);
        SlotListClock slotListClock2 = new SlotListClock();
        slotListClock2.setId(slotListClock1.getId());
        assertThat(slotListClock1).isEqualTo(slotListClock2);
        slotListClock2.setId(2L);
        assertThat(slotListClock1).isNotEqualTo(slotListClock2);
        slotListClock1.setId(null);
        assertThat(slotListClock1).isNotEqualTo(slotListClock2);
    }
}
