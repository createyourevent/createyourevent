package org.createyourevent.app.domain;

import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A SlotListCherry.
 */
@Entity
@Table(name = "slot_list_cherry")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class SlotListCherry implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "coupons")
    private String coupons;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public SlotListCherry id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCoupons() {
        return this.coupons;
    }

    public SlotListCherry coupons(String coupons) {
        this.setCoupons(coupons);
        return this;
    }

    public void setCoupons(String coupons) {
        this.coupons = coupons;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof SlotListCherry)) {
            return false;
        }
        return id != null && id.equals(((SlotListCherry) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "SlotListCherry{" +
            "id=" + getId() +
            ", coupons='" + getCoupons() + "'" +
            "}";
    }
}
