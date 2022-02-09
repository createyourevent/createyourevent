package org.createyourevent.app.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.createyourevent.app.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class OrganizationStarRatingTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(OrganizationStarRating.class);
        OrganizationStarRating organizationStarRating1 = new OrganizationStarRating();
        organizationStarRating1.setId(1L);
        OrganizationStarRating organizationStarRating2 = new OrganizationStarRating();
        organizationStarRating2.setId(organizationStarRating1.getId());
        assertThat(organizationStarRating1).isEqualTo(organizationStarRating2);
        organizationStarRating2.setId(2L);
        assertThat(organizationStarRating1).isNotEqualTo(organizationStarRating2);
        organizationStarRating1.setId(null);
        assertThat(organizationStarRating1).isNotEqualTo(organizationStarRating2);
    }
}
