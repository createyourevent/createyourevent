package org.createyourevent.app.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.createyourevent.app.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class FeeTransactionIdTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(FeeTransactionId.class);
        FeeTransactionId feeTransactionId1 = new FeeTransactionId();
        feeTransactionId1.setId(1L);
        FeeTransactionId feeTransactionId2 = new FeeTransactionId();
        feeTransactionId2.setId(feeTransactionId1.getId());
        assertThat(feeTransactionId1).isEqualTo(feeTransactionId2);
        feeTransactionId2.setId(2L);
        assertThat(feeTransactionId1).isNotEqualTo(feeTransactionId2);
        feeTransactionId1.setId(null);
        assertThat(feeTransactionId1).isNotEqualTo(feeTransactionId2);
    }
}
