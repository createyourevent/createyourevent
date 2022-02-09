package org.createyourevent.app.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A ChipsCollectionChips.
 */
@Entity
@Table(name = "chips_collection_chips")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class ChipsCollectionChips implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne
    @JsonIgnoreProperties(value = { "user", "chipsCollectionChips" }, allowSetters = true)
    private ChipsCollection chipsCollection;

    @ManyToOne
    @JsonIgnoreProperties(value = { "chipsCollectionChips" }, allowSetters = true)
    private Chips chips;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public ChipsCollectionChips id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ChipsCollection getChipsCollection() {
        return this.chipsCollection;
    }

    public void setChipsCollection(ChipsCollection chipsCollection) {
        this.chipsCollection = chipsCollection;
    }

    public ChipsCollectionChips chipsCollection(ChipsCollection chipsCollection) {
        this.setChipsCollection(chipsCollection);
        return this;
    }

    public Chips getChips() {
        return this.chips;
    }

    public void setChips(Chips chips) {
        this.chips = chips;
    }

    public ChipsCollectionChips chips(Chips chips) {
        this.setChips(chips);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ChipsCollectionChips)) {
            return false;
        }
        return id != null && id.equals(((ChipsCollectionChips) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ChipsCollectionChips{" +
            "id=" + getId() +
            "}";
    }
}
