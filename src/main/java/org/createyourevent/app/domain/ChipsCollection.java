package org.createyourevent.app.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A ChipsCollection.
 */
@Entity
@Table(name = "chips_collection")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class ChipsCollection implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @OneToOne
    @JoinColumn(unique = true)
    private User user;

    @OneToMany(mappedBy = "chipsCollection")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "chipsCollection", "chips" }, allowSetters = true)
    private Set<ChipsCollectionChips> chipsCollectionChips = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public ChipsCollection id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public ChipsCollection user(User user) {
        this.setUser(user);
        return this;
    }

    public Set<ChipsCollectionChips> getChipsCollectionChips() {
        return this.chipsCollectionChips;
    }

    public void setChipsCollectionChips(Set<ChipsCollectionChips> chipsCollectionChips) {
        if (this.chipsCollectionChips != null) {
            this.chipsCollectionChips.forEach(i -> i.setChipsCollection(null));
        }
        if (chipsCollectionChips != null) {
            chipsCollectionChips.forEach(i -> i.setChipsCollection(this));
        }
        this.chipsCollectionChips = chipsCollectionChips;
    }

    public ChipsCollection chipsCollectionChips(Set<ChipsCollectionChips> chipsCollectionChips) {
        this.setChipsCollectionChips(chipsCollectionChips);
        return this;
    }

    public ChipsCollection addChipsCollectionChips(ChipsCollectionChips chipsCollectionChips) {
        this.chipsCollectionChips.add(chipsCollectionChips);
        chipsCollectionChips.setChipsCollection(this);
        return this;
    }

    public ChipsCollection removeChipsCollectionChips(ChipsCollectionChips chipsCollectionChips) {
        this.chipsCollectionChips.remove(chipsCollectionChips);
        chipsCollectionChips.setChipsCollection(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ChipsCollection)) {
            return false;
        }
        return id != null && id.equals(((ChipsCollection) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ChipsCollection{" +
            "id=" + getId() +
            "}";
    }
}
