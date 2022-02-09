package org.createyourevent.app.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.createyourevent.app.domain.enumeration.ProductType;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Shop.
 */
@Entity
@Table(name = "shop")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Shop implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "product_type", nullable = false)
    private ProductType productType;

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

    @OneToMany(mappedBy = "shop")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(
        value = { "eventProductOrders", "comments", "worksheets", "images", "mp3s", "shop", "tags", "deliveryTypes" },
        allowSetters = true
    )
    private Set<Product> products = new HashSet<>();

    @OneToMany(mappedBy = "shop")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "user", "feeTransaction", "event", "product", "shop", "cart", "deliveryType" }, allowSetters = true)
    private Set<EventProductOrder> eventProductOrders = new HashSet<>();

    @OneToMany(mappedBy = "shop")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "user", "product", "shop", "event", "service", "organization" }, allowSetters = true)
    private Set<Image> images = new HashSet<>();

    @OneToMany(mappedBy = "shop")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "user", "product", "shop", "event", "service" }, allowSetters = true)
    private Set<Mp3> mp3s = new HashSet<>();

    @ManyToOne
    private User user;

    @OneToMany(mappedBy = "shop")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "shopComments", "shop", "user", "shopComment" }, allowSetters = true)
    private Set<ShopComment> comments = new HashSet<>();

    @OneToMany(mappedBy = "shop")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "event", "product", "shop", "service", "organization" }, allowSetters = true)
    private Set<Tags> tags = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Shop id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Shop name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public ProductType getProductType() {
        return this.productType;
    }

    public Shop productType(ProductType productType) {
        this.setProductType(productType);
        return this;
    }

    public void setProductType(ProductType productType) {
        this.productType = productType;
    }

    public byte[] getLogo() {
        return this.logo;
    }

    public Shop logo(byte[] logo) {
        this.setLogo(logo);
        return this;
    }

    public void setLogo(byte[] logo) {
        this.logo = logo;
    }

    public String getLogoContentType() {
        return this.logoContentType;
    }

    public Shop logoContentType(String logoContentType) {
        this.logoContentType = logoContentType;
        return this;
    }

    public void setLogoContentType(String logoContentType) {
        this.logoContentType = logoContentType;
    }

    public Boolean getActive() {
        return this.active;
    }

    public Shop active(Boolean active) {
        this.setActive(active);
        return this;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public Boolean getActiveOwner() {
        return this.activeOwner;
    }

    public Shop activeOwner(Boolean activeOwner) {
        this.setActiveOwner(activeOwner);
        return this;
    }

    public void setActiveOwner(Boolean activeOwner) {
        this.activeOwner = activeOwner;
    }

    public String getDescription() {
        return this.description;
    }

    public Shop description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getAddress() {
        return this.address;
    }

    public Shop address(String address) {
        this.setAddress(address);
        return this;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getMotto() {
        return this.motto;
    }

    public Shop motto(String motto) {
        this.setMotto(motto);
        return this;
    }

    public void setMotto(String motto) {
        this.motto = motto;
    }

    public String getPhone() {
        return this.phone;
    }

    public Shop phone(String phone) {
        this.setPhone(phone);
        return this;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getWebAddress() {
        return this.webAddress;
    }

    public Shop webAddress(String webAddress) {
        this.setWebAddress(webAddress);
        return this;
    }

    public void setWebAddress(String webAddress) {
        this.webAddress = webAddress;
    }

    public Set<Product> getProducts() {
        return this.products;
    }

    public void setProducts(Set<Product> products) {
        if (this.products != null) {
            this.products.forEach(i -> i.setShop(null));
        }
        if (products != null) {
            products.forEach(i -> i.setShop(this));
        }
        this.products = products;
    }

    public Shop products(Set<Product> products) {
        this.setProducts(products);
        return this;
    }

    public Shop addProduct(Product product) {
        this.products.add(product);
        product.setShop(this);
        return this;
    }

    public Shop removeProduct(Product product) {
        this.products.remove(product);
        product.setShop(null);
        return this;
    }

    public Set<EventProductOrder> getEventProductOrders() {
        return this.eventProductOrders;
    }

    public void setEventProductOrders(Set<EventProductOrder> eventProductOrders) {
        if (this.eventProductOrders != null) {
            this.eventProductOrders.forEach(i -> i.setShop(null));
        }
        if (eventProductOrders != null) {
            eventProductOrders.forEach(i -> i.setShop(this));
        }
        this.eventProductOrders = eventProductOrders;
    }

    public Shop eventProductOrders(Set<EventProductOrder> eventProductOrders) {
        this.setEventProductOrders(eventProductOrders);
        return this;
    }

    public Shop addEventProductOrders(EventProductOrder eventProductOrder) {
        this.eventProductOrders.add(eventProductOrder);
        eventProductOrder.setShop(this);
        return this;
    }

    public Shop removeEventProductOrders(EventProductOrder eventProductOrder) {
        this.eventProductOrders.remove(eventProductOrder);
        eventProductOrder.setShop(null);
        return this;
    }

    public Set<Image> getImages() {
        return this.images;
    }

    public void setImages(Set<Image> images) {
        if (this.images != null) {
            this.images.forEach(i -> i.setShop(null));
        }
        if (images != null) {
            images.forEach(i -> i.setShop(this));
        }
        this.images = images;
    }

    public Shop images(Set<Image> images) {
        this.setImages(images);
        return this;
    }

    public Shop addImages(Image image) {
        this.images.add(image);
        image.setShop(this);
        return this;
    }

    public Shop removeImages(Image image) {
        this.images.remove(image);
        image.setShop(null);
        return this;
    }

    public Set<Mp3> getMp3s() {
        return this.mp3s;
    }

    public void setMp3s(Set<Mp3> mp3s) {
        if (this.mp3s != null) {
            this.mp3s.forEach(i -> i.setShop(null));
        }
        if (mp3s != null) {
            mp3s.forEach(i -> i.setShop(this));
        }
        this.mp3s = mp3s;
    }

    public Shop mp3s(Set<Mp3> mp3s) {
        this.setMp3s(mp3s);
        return this;
    }

    public Shop addMp3s(Mp3 mp3) {
        this.mp3s.add(mp3);
        mp3.setShop(this);
        return this;
    }

    public Shop removeMp3s(Mp3 mp3) {
        this.mp3s.remove(mp3);
        mp3.setShop(null);
        return this;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Shop user(User user) {
        this.setUser(user);
        return this;
    }

    public Set<ShopComment> getComments() {
        return this.comments;
    }

    public void setComments(Set<ShopComment> shopComments) {
        if (this.comments != null) {
            this.comments.forEach(i -> i.setShop(null));
        }
        if (shopComments != null) {
            shopComments.forEach(i -> i.setShop(this));
        }
        this.comments = shopComments;
    }

    public Shop comments(Set<ShopComment> shopComments) {
        this.setComments(shopComments);
        return this;
    }

    public Shop addComments(ShopComment shopComment) {
        this.comments.add(shopComment);
        shopComment.setShop(this);
        return this;
    }

    public Shop removeComments(ShopComment shopComment) {
        this.comments.remove(shopComment);
        shopComment.setShop(null);
        return this;
    }

    public Set<Tags> getTags() {
        return this.tags;
    }

    public void setTags(Set<Tags> tags) {
        if (this.tags != null) {
            this.tags.forEach(i -> i.setShop(null));
        }
        if (tags != null) {
            tags.forEach(i -> i.setShop(this));
        }
        this.tags = tags;
    }

    public Shop tags(Set<Tags> tags) {
        this.setTags(tags);
        return this;
    }

    public Shop addTags(Tags tags) {
        this.tags.add(tags);
        tags.setShop(this);
        return this;
    }

    public Shop removeTags(Tags tags) {
        this.tags.remove(tags);
        tags.setShop(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Shop)) {
            return false;
        }
        return id != null && id.equals(((Shop) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Shop{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", productType='" + getProductType() + "'" +
            ", logo='" + getLogo() + "'" +
            ", logoContentType='" + getLogoContentType() + "'" +
            ", active='" + getActive() + "'" +
            ", activeOwner='" + getActiveOwner() + "'" +
            ", description='" + getDescription() + "'" +
            ", address='" + getAddress() + "'" +
            ", motto='" + getMotto() + "'" +
            ", phone='" + getPhone() + "'" +
            ", webAddress='" + getWebAddress() + "'" +
            "}";
    }
}
