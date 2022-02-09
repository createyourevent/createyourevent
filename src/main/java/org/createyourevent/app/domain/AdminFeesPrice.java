package org.createyourevent.app.domain;

import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A AdminFeesPrice.
 */
@Entity
@Table(name = "admin_fees_price")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class AdminFeesPrice implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "fees_organisator")
    private Float feesOrganisator;

    @Column(name = "fees_supplier")
    private Float feesSupplier;

    @Column(name = "fees_service")
    private Float feesService;

    @Column(name = "fees_organizations")
    private Float feesOrganizations;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public AdminFeesPrice id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Float getFeesOrganisator() {
        return this.feesOrganisator;
    }

    public AdminFeesPrice feesOrganisator(Float feesOrganisator) {
        this.setFeesOrganisator(feesOrganisator);
        return this;
    }

    public void setFeesOrganisator(Float feesOrganisator) {
        this.feesOrganisator = feesOrganisator;
    }

    public Float getFeesSupplier() {
        return this.feesSupplier;
    }

    public AdminFeesPrice feesSupplier(Float feesSupplier) {
        this.setFeesSupplier(feesSupplier);
        return this;
    }

    public void setFeesSupplier(Float feesSupplier) {
        this.feesSupplier = feesSupplier;
    }

    public Float getFeesService() {
        return this.feesService;
    }

    public AdminFeesPrice feesService(Float feesService) {
        this.setFeesService(feesService);
        return this;
    }

    public void setFeesService(Float feesService) {
        this.feesService = feesService;
    }

    public Float getFeesOrganizations() {
        return this.feesOrganizations;
    }

    public AdminFeesPrice feesOrganizations(Float feesOrganizations) {
        this.setFeesOrganizations(feesOrganizations);
        return this;
    }

    public void setFeesOrganizations(Float feesOrganizations) {
        this.feesOrganizations = feesOrganizations;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof AdminFeesPrice)) {
            return false;
        }
        return id != null && id.equals(((AdminFeesPrice) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "AdminFeesPrice{" +
            "id=" + getId() +
            ", feesOrganisator=" + getFeesOrganisator() +
            ", feesSupplier=" + getFeesSupplier() +
            ", feesService=" + getFeesService() +
            ", feesOrganizations=" + getFeesOrganizations() +
            "}";
    }
}
