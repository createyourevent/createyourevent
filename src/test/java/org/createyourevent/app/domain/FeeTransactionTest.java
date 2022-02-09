package org.createyourevent.app.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.createyourevent.app.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class FeeTransactionTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(FeeTransaction.class);
        FeeTransaction feeTransaction1 = new FeeTransaction();
        feeTransaction1.setId(1L);
        FeeTransaction feeTransaction2 = new FeeTransaction();
        feeTransaction2.setId(feeTransaction1.getId());
        assertThat(feeTransaction1).isEqualTo(feeTransaction2);
        feeTransaction2.setId(2L);
        assertThat(feeTransaction1).isNotEqualTo(feeTransaction2);
        feeTransaction1.setId(null);
        assertThat(feeTransaction1).isNotEqualTo(feeTransaction2);
    }
}
