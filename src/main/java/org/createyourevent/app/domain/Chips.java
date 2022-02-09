package org.createyourevent.app.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Chips.
 */
@Entity
@Table(name = "chips")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Chips implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "points")
    private Integer points;

    @Column(name = "website")
    private String website;

    @Column(name = "x")
    private Integer x;

    @Column(name = "y")
    private Integer y;

    @Lob
    @Column(name = "image")
    private byte[] image;

    @Column(name = "image_content_type")
    private String imageContentType;

    @Column(name = "color")
    private String color;

    @OneToMany(mappedBy = "chips")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "chipsCollection", "chips" }, allowSetters = true)
    private Set<ChipsCollectionChips> chipsCollectionChips = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Chips id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getPoints() {
        return this.points;
    }

    public Chips points(Integer points) {
        this.setPoints(points);
        return this;
    }

    public void setPoints(Integer points) {
        this.points = points;
    }

    public String getWebsite() {
        return this.website;
    }

    public Chips website(String website) {
        this.setWebsite(website);
        return this;
    }

    public void setWebsite(String website) {
        this.website = website;
    }

    public Integer getX() {
        return this.x;
    }

    public Chips x(Integer x) {
        this.setX(x);
        return this;
    }

    public void setX(Integer x) {
        this.x = x;
    }

    public Integer getY() {
        return this.y;
    }

    public Chips y(Integer y) {
        this.setY(y);
        return this;
    }

    public void setY(Integer y) {
        this.y = y;
    }

    public byte[] getImage() {
        return this.image;
    }

    public Chips image(byte[] image) {
        this.setImage(image);
        return this;
    }

    public void setImage(byte[] image) {
        this.image = image;
    }

    public String getImageContentType() {
        return this.imageContentType;
    }

    public Chips imageContentType(String imageContentType) {
        this.imageContentType = imageContentType;
        return this;
    }

    public void setImageContentType(String imageContentType) {
        this.imageContentType = imageContentType;
    }

    public String getColor() {
        return this.color;
    }

    public Chips color(String color) {
        this.setColor(color);
        return this;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public Set<ChipsCollectionChips> getChipsCollectionChips() {
        return this.chipsCollectionChips;
    }

    public void setChipsCollectionChips(Set<ChipsCollectionChips> chipsCollectionChips) {
        if (this.chipsCollectionChips != null) {
            this.chipsCollectionChips.forEach(i -> i.setChips(null));
        }
        if (chipsCollectionChips != null) {
            chipsCollectionChips.forEach(i -> i.setChips(this));
        }
        this.chipsCollectionChips = chipsCollectionChips;
    }

    public Chips chipsCollectionChips(Set<ChipsCollectionChips> chipsCollectionChips) {
        this.setChipsCollectionChips(chipsCollectionChips);
        return this;
    }

    public Chips addChipsCollectionChips(ChipsCollectionChips chipsCollectionChips) {
        this.chipsCollectionChips.add(chipsCollectionChips);
        chipsCollectionChips.setChips(this);
        return this;
    }

    public Chips removeChipsCollectionChips(ChipsCollectionChips chipsCollectionChips) {
        this.chipsCollectionChips.remove(chipsCollectionChips);
        chipsCollectionChips.setChips(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Chips)) {
            return false;
        }
        return id != null && id.equals(((Chips) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Chips{" +
            "id=" + getId() +
            ", points=" + getPoints() +
            ", website='" + getWebsite() + "'" +
            ", x=" + getX() +
            ", y=" + getY() +
            ", image='" + getImage() + "'" +
            ", imageContentType='" + getImageContentType() + "'" +
            ", color='" + getColor() + "'" +
            "}";
    }
}
