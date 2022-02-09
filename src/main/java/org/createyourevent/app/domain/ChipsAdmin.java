package org.createyourevent.app.domain;

import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A ChipsAdmin.
 */
@Entity
@Table(name = "chips_admin")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class ChipsAdmin implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "game_active")
    private Boolean gameActive;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public ChipsAdmin id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Boolean getGameActive() {
        return this.gameActive;
    }

    public ChipsAdmin gameActive(Boolean gameActive) {
        this.setGameActive(gameActive);
        return this;
    }

    public void setGameActive(Boolean gameActive) {
        this.gameActive = gameActive;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ChipsAdmin)) {
            return false;
        }
        return id != null && id.equals(((ChipsAdmin) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ChipsAdmin{" +
            "id=" + getId() +
            ", gameActive='" + getGameActive() + "'" +
            "}";
    }
}
