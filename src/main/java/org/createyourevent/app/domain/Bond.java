package org.createyourevent.app.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.ZonedDateTime;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Bond.
 */
@Entity
@Table(name = "bond")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Bond implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @Lob
    @Column(name = "description")
    private String description;

    @Column(name = "code")
    private String code;

    @Column(name = "points")
    private Long points;

    @Column(name = "creation_date")
    private ZonedDateTime creationDate;

    @Column(name = "redemption_date")
    private ZonedDateTime redemptionDate;

    @ManyToOne
    private User user;

    @ManyToOne
    @JsonIgnoreProperties(value = { "bonds" }, allowSetters = true)
    private PointsExchange pointsExchange;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Bond id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Bond name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return this.description;
    }

    public Bond description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCode() {
        return this.code;
    }

    public Bond code(String code) {
        this.setCode(code);
        return this;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public Long getPoints() {
        return this.points;
    }

    public Bond points(Long points) {
        this.setPoints(points);
        return this;
    }

    public void setPoints(Long points) {
        this.points = points;
    }

    public ZonedDateTime getCreationDate() {
        return this.creationDate;
    }

    public Bond creationDate(ZonedDateTime creationDate) {
        this.setCreationDate(creationDate);
        return this;
    }

    public void setCreationDate(ZonedDateTime creationDate) {
        this.creationDate = creationDate;
    }

    public ZonedDateTime getRedemptionDate() {
        return this.redemptionDate;
    }

    public Bond redemptionDate(ZonedDateTime redemptionDate) {
        this.setRedemptionDate(redemptionDate);
        return this;
    }

    public void setRedemptionDate(ZonedDateTime redemptionDate) {
        this.redemptionDate = redemptionDate;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Bond user(User user) {
        this.setUser(user);
        return this;
    }

    public PointsExchange getPointsExchange() {
        return this.pointsExchange;
    }

    public void setPointsExchange(PointsExchange pointsExchange) {
        this.pointsExchange = pointsExchange;
    }

    public Bond pointsExchange(PointsExchange pointsExchange) {
        this.setPointsExchange(pointsExchange);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Bond)) {
            return false;
        }
        return id != null && id.equals(((Bond) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Bond{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", description='" + getDescription() + "'" +
            ", code='" + getCode() + "'" +
            ", points=" + getPoints() +
            ", creationDate='" + getCreationDate() + "'" +
            ", redemptionDate='" + getRedemptionDate() + "'" +
            "}";
    }
}
