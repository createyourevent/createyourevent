package org.createyourevent.app.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.createyourevent.app.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class FeeBalanceTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(FeeBalance.class);
        FeeBalance feeBalance1 = new FeeBalance();
        feeBalance1.setId(1L);
        FeeBalance feeBalance2 = new FeeBalance();
        feeBalance2.setId(feeBalance1.getId());
        assertThat(feeBalance1).isEqualTo(feeBalance2);
        feeBalance2.setId(2L);
        assertThat(feeBalance1).isNotEqualTo(feeBalance2);
        feeBalance1.setId(null);
        assertThat(feeBalance1).isNotEqualTo(feeBalance2);
    }
}
