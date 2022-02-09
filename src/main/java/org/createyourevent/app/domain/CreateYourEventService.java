package org.createyourevent.app.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.createyourevent.app.domain.enumeration.ServiceCategory;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A CreateYourEventService.
 */
@Entity
@Table(name = "create_your_event_service")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class CreateYourEventService implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @Lob
    @Column(name = "logo")
    private byte[] logo;

    @Column(name = "logo_content_type")
    private String logoContentType;

    @Column(name = "active")
    private Boolean active;

    @Column(name = "active_owner")
    private Boolean activeOwner;

    @Lob
    @Column(name = "description", nullable = false)
    private String description;

    @NotNull
    @Column(name = "address", nullable = false)
    private String address;

    @NotNull
    @Column(name = "motto", nullable = false)
    private String motto;

    @NotNull
    @Column(name = "phone", nullable = false)
    private String phone;

    @Column(name = "web_address")
    private String webAddress;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "category", nullable = false)
    private ServiceCategory category;

    @OneToMany(mappedBy = "createYourEventService", cascade = CascadeType.ALL, orphanRemoval = true)
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "eventServiceMapOrders" }, allowSetters = true)
    private Set<ServiceMap> serviceMaps = new HashSet<>();

    @OneToMany(mappedBy = "service")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "user", "product", "shop", "event", "service", "organization" }, allowSetters = true)
    private Set<Image> images = new HashSet<>();

    @OneToMany(mappedBy = "service")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "user", "product", "shop", "event", "service" }, allowSetters = true)
    private Set<Mp3> mp3s = new HashSet<>();

    @ManyToOne
    private User user;

    @OneToMany(mappedBy = "service")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "event", "product", "shop", "service", "organization" }, allowSetters = true)
    private Set<Tags> tags = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public CreateYourEventService id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public CreateYourEventService name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public byte[] getLogo() {
        return this.logo;
    }

    public CreateYourEventService logo(byte[] logo) {
        this.setLogo(logo);
        return this;
    }

    public void setLogo(byte[] logo) {
        this.logo = logo;
    }

    public String getLogoContentType() {
        return this.logoContentType;
    }

    public CreateYourEventService logoContentType(String logoContentType) {
        this.logoContentType = logoContentType;
        return this;
    }

    public void setLogoContentType(String logoContentType) {
        this.logoContentType = logoContentType;
    }

    public Boolean getActive() {
        return this.active;
    }

    public CreateYourEventService active(Boolean active) {
        this.setActive(active);
        return this;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public Boolean getActiveOwner() {
        return this.activeOwner;
    }

    public CreateYourEventService activeOwner(Boolean activeOwner) {
        this.setActiveOwner(activeOwner);
        return this;
    }

    public void setActiveOwner(Boolean activeOwner) {
        this.activeOwner = activeOwner;
    }

    public String getDescription() {
        return this.description;
    }

    public CreateYourEventService description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getAddress() {
        return this.address;
    }

    public CreateYourEventService address(String address) {
        this.setAddress(address);
        return this;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getMotto() {
        return this.motto;
    }

    public CreateYourEventService motto(String motto) {
        this.setMotto(motto);
        return this;
    }

    public void setMotto(String motto) {
        this.motto = motto;
    }

    public String getPhone() {
        return this.phone;
    }

    public CreateYourEventService phone(String phone) {
        this.setPhone(phone);
        return this;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getWebAddress() {
        return this.webAddress;
    }

    public CreateYourEventService webAddress(String webAddress) {
        this.setWebAddress(webAddress);
        return this;
    }

    public void setWebAddress(String webAddress) {
        this.webAddress = webAddress;
    }

    public ServiceCategory getCategory() {
        return this.category;
    }

    public CreateYourEventService category(ServiceCategory category) {
        this.setCategory(category);
        return this;
    }

    public void setCategory(ServiceCategory category) {
        this.category = category;
    }

    public Set<ServiceMap> getServiceMaps() {
        return this.serviceMaps;
    }

    public void setServiceMaps(Set<ServiceMap> serviceMaps) {
        if (this.serviceMaps != null) {
            this.serviceMaps.forEach(i -> i.setCreateYourEventService(null));
        }
        if (serviceMaps != null) {
            serviceMaps.forEach(i -> i.setCreateYourEventService(this));
        }
        this.serviceMaps = serviceMaps;
    }

    public CreateYourEventService serviceMaps(Set<ServiceMap> serviceMaps) {
        this.setServiceMaps(serviceMaps);
        return this;
    }

    public CreateYourEventService addServiceMaps(ServiceMap serviceMap) {
        this.serviceMaps.add(serviceMap);
        serviceMap.setCreateYourEventService(this);
        return this;
    }

    public CreateYourEventService removeServiceMaps(ServiceMap serviceMap) {
        this.serviceMaps.remove(serviceMap);
        serviceMap.setCreateYourEventService(null);
        return this;
    }

    public Set<Image> getImages() {
        return this.images;
    }

    public void setImages(Set<Image> images) {
        if (this.images != null) {
            this.images.forEach(i -> i.setService(null));
        }
        if (images != null) {
            images.forEach(i -> i.setService(this));
        }
        this.images = images;
    }

    public CreateYourEventService images(Set<Image> images) {
        this.setImages(images);
        return this;
    }

    public CreateYourEventService addImages(Image image) {
        this.images.add(image);
        image.setService(this);
        return this;
    }

    public CreateYourEventService removeImages(Image image) {
        this.images.remove(image);
        image.setService(null);
        return this;
    }

    public Set<Mp3> getMp3s() {
        return this.mp3s;
    }

    public void setMp3s(Set<Mp3> mp3s) {
        if (this.mp3s != null) {
            this.mp3s.forEach(i -> i.setService(null));
        }
        if (mp3s != null) {
            mp3s.forEach(i -> i.setService(this));
        }
        this.mp3s = mp3s;
    }

    public CreateYourEventService mp3s(Set<Mp3> mp3s) {
        this.setMp3s(mp3s);
        return this;
    }

    public CreateYourEventService addMp3s(Mp3 mp3) {
        this.mp3s.add(mp3);
        mp3.setService(this);
        return this;
    }

    public CreateYourEventService removeMp3s(Mp3 mp3) {
        this.mp3s.remove(mp3);
        mp3.setService(null);
        return this;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public CreateYourEventService user(User user) {
        this.setUser(user);
        return this;
    }

    public Set<Tags> getTags() {
        return this.tags;
    }

    public void setTags(Set<Tags> tags) {
        if (this.tags != null) {
            this.tags.forEach(i -> i.setService(null));
        }
        if (tags != null) {
            tags.forEach(i -> i.setService(this));
        }
        this.tags = tags;
    }

    public CreateYourEventService tags(Set<Tags> tags) {
        this.setTags(tags);
        return this;
    }

    public CreateYourEventService addTags(Tags tags) {
        this.tags.add(tags);
        tags.setService(this);
        return this;
    }

    public CreateYourEventService removeTags(Tags tags) {
        this.tags.remove(tags);
        tags.setService(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof CreateYourEventService)) {
            return false;
        }
        return id != null && id.equals(((CreateYourEventService) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "CreateYourEventService{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", logo='" + getLogo() + "'" +
            ", logoContentType='" + getLogoContentType() + "'" +
            ", active='" + getActive() + "'" +
            ", activeOwner='" + getActiveOwner() + "'" +
            ", description='" + getDescription() + "'" +
            ", address='" + getAddress() + "'" +
            ", motto='" + getMotto() + "'" +
            ", phone='" + getPhone() + "'" +
            ", webAddress='" + getWebAddress() + "'" +
            ", category='" + getCategory() + "'" +
            "}";
    }
}
