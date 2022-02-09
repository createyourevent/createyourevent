package org.createyourevent.app.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Hotel.
 */
@Entity
@Table(name = "hotel")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Hotel implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Lob
    @Column(name = "menu")
    private String menu;

    @Column(name = "places_to_sleep")
    private Integer placesToSleep;

    @JsonIgnoreProperties(
        value = { "images", "user", "restaurant", "hotel", "club", "building", "tags" },
        allowSetters = true
    )
    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(unique = true)
    private Organization organization;

    @ManyToOne
    private User user;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Hotel id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMenu() {
        return this.menu;
    }

    public Hotel menu(String menu) {
        this.setMenu(menu);
        return this;
    }

    public void setMenu(String menu) {
        this.menu = menu;
    }

    public Integer getPlacesToSleep() {
        return this.placesToSleep;
    }

    public Hotel placesToSleep(Integer placesToSleep) {
        this.setPlacesToSleep(placesToSleep);
        return this;
    }

    public void setPlacesToSleep(Integer placesToSleep) {
        this.placesToSleep = placesToSleep;
    }

    public Organization getOrganization() {
        return this.organization;
    }

    public void setOrganization(Organization organization) {
        this.organization = organization;
    }

    public Hotel organization(Organization organization) {
        this.setOrganization(organization);
        return this;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Hotel user(User user) {
        this.setUser(user);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Hotel)) {
            return false;
        }
        return id != null && id.equals(((Hotel) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Hotel{" +
            "id=" + getId() +
            ", menu='" + getMenu() + "'" +
            ", placesToSleep=" + getPlacesToSleep() +
            "}";
    }
}
