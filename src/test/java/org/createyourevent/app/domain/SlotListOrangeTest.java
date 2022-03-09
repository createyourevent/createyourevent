package org.createyourevent.app.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.createyourevent.app.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class SlotListOrangeTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(SlotListOrange.class);
        SlotListOrange slotListOrange1 = new SlotListOrange();
        slotListOrange1.setId(1L);
        SlotListOrange slotListOrange2 = new SlotListOrange();
        slotListOrange2.setId(slotListOrange1.getId());
        assertThat(slotListOrange1).isEqualTo(slotListOrange2);
        slotListOrange2.setId(2L);
        assertThat(slotListOrange1).isNotEqualTo(slotListOrange2);
        slotListOrange1.setId(null);
        assertThat(slotListOrange1).isNotEqualTo(slotListOrange2);
    }
}
