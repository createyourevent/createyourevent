package org.createyourevent.app.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.createyourevent.app.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ChipsAdminTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ChipsAdmin.class);
        ChipsAdmin chipsAdmin1 = new ChipsAdmin();
        chipsAdmin1.setId(1L);
        ChipsAdmin chipsAdmin2 = new ChipsAdmin();
        chipsAdmin2.setId(chipsAdmin1.getId());
        assertThat(chipsAdmin1).isEqualTo(chipsAdmin2);
        chipsAdmin2.setId(2L);
        assertThat(chipsAdmin1).isNotEqualTo(chipsAdmin2);
        chipsAdmin1.setId(null);
        assertThat(chipsAdmin1).isNotEqualTo(chipsAdmin2);
    }
}
