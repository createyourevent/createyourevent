package org.createyourevent.app.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A PointsExchange.
 */
@Entity
@Table(name = "points_exchange")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class PointsExchange implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "points_total")
    private Long pointsTotal;

    @Column(name = "bond_points_total")
    private Long bondPointsTotal;

    @OneToMany(mappedBy = "pointsExchange")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "user", "pointsExchange" }, allowSetters = true)
    private Set<Bond> bonds = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public PointsExchange id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getPointsTotal() {
        return this.pointsTotal;
    }

    public PointsExchange pointsTotal(Long pointsTotal) {
        this.setPointsTotal(pointsTotal);
        return this;
    }

    public void setPointsTotal(Long pointsTotal) {
        this.pointsTotal = pointsTotal;
    }

    public Long getBondPointsTotal() {
        return this.bondPointsTotal;
    }

    public PointsExchange bondPointsTotal(Long bondPointsTotal) {
        this.setBondPointsTotal(bondPointsTotal);
        return this;
    }

    public void setBondPointsTotal(Long bondPointsTotal) {
        this.bondPointsTotal = bondPointsTotal;
    }

    public Set<Bond> getBonds() {
        return this.bonds;
    }

    public void setBonds(Set<Bond> bonds) {
        if (this.bonds != null) {
            this.bonds.forEach(i -> i.setPointsExchange(null));
        }
        if (bonds != null) {
            bonds.forEach(i -> i.setPointsExchange(this));
        }
        this.bonds = bonds;
    }

    public PointsExchange bonds(Set<Bond> bonds) {
        this.setBonds(bonds);
        return this;
    }

    public PointsExchange addBonds(Bond bond) {
        this.bonds.add(bond);
        bond.setPointsExchange(this);
        return this;
    }

    public PointsExchange removeBonds(Bond bond) {
        this.bonds.remove(bond);
        bond.setPointsExchange(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof PointsExchange)) {
            return false;
        }
        return id != null && id.equals(((PointsExchange) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "PointsExchange{" +
            "id=" + getId() +
            ", pointsTotal=" + getPointsTotal() +
            ", bondPointsTotal=" + getBondPointsTotal() +
            "}";
    }
}
