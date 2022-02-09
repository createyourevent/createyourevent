package org.createyourevent.app.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A RideCosts.
 */
@Entity
@Table(name = "ride_costs")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class RideCosts implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "price_per_kilometre", nullable = false)
    private Float pricePerKilometre;

    @JsonIgnoreProperties(value = { "rideCost", "serviceOffers", "eventServiceMapOrders", "createYourEventService" }, allowSetters = true)
    @OneToOne(mappedBy = "rideCost", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private ServiceMap serviceMap;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public RideCosts id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Float getPricePerKilometre() {
        return this.pricePerKilometre;
    }

    public RideCosts pricePerKilometre(Float pricePerKilometre) {
        this.setPricePerKilometre(pricePerKilometre);
        return this;
    }

    public void setPricePerKilometre(Float pricePerKilometre) {
        this.pricePerKilometre = pricePerKilometre;
    }

    public ServiceMap getServiceMap() {
        return this.serviceMap;
    }

    public void setServiceMap(ServiceMap serviceMap) {
        if (this.serviceMap != null) {
            this.serviceMap.setRideCost(null);
        }
        if (serviceMap != null) {
            serviceMap.setRideCost(this);
        }
        this.serviceMap = serviceMap;
    }

    public RideCosts serviceMap(ServiceMap serviceMap) {
        this.setServiceMap(serviceMap);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof RideCosts)) {
            return false;
        }
        return id != null && id.equals(((RideCosts) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "RideCosts{" +
            "id=" + getId() +
            ", pricePerKilometre=" + getPricePerKilometre() +
            "}";
    }
}
