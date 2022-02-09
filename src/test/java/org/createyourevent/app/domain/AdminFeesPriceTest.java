package org.createyourevent.app.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.createyourevent.app.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class AdminFeesPriceTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(AdminFeesPrice.class);
        AdminFeesPrice adminFeesPrice1 = new AdminFeesPrice();
        adminFeesPrice1.setId(1L);
        AdminFeesPrice adminFeesPrice2 = new AdminFeesPrice();
        adminFeesPrice2.setId(adminFeesPrice1.getId());
        assertThat(adminFeesPrice1).isEqualTo(adminFeesPrice2);
        adminFeesPrice2.setId(2L);
        assertThat(adminFeesPrice1).isNotEqualTo(adminFeesPrice2);
        adminFeesPrice1.setId(null);
        assertThat(adminFeesPrice1).isNotEqualTo(adminFeesPrice2);
    }
}
