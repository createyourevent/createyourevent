package org.createyourevent.app.config;

import java.time.Duration;
import org.ehcache.config.builders.*;
import org.ehcache.jsr107.Eh107Configuration;
import org.hibernate.cache.jcache.ConfigSettings;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.cache.JCacheManagerCustomizer;
import org.springframework.boot.autoconfigure.orm.jpa.HibernatePropertiesCustomizer;
import org.springframework.boot.info.BuildProperties;
import org.springframework.boot.info.GitProperties;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.interceptor.KeyGenerator;
import org.springframework.context.annotation.*;
import tech.jhipster.config.JHipsterProperties;
import tech.jhipster.config.cache.PrefixedKeyGenerator;

@Configuration
@EnableCaching
public class CacheConfiguration {

    private GitProperties gitProperties;
    private BuildProperties buildProperties;
    private final javax.cache.configuration.Configuration<Object, Object> jcacheConfiguration;

    public CacheConfiguration(JHipsterProperties jHipsterProperties) {
        JHipsterProperties.Cache.Ehcache ehcache = jHipsterProperties.getCache().getEhcache();

        jcacheConfiguration =
            Eh107Configuration.fromEhcacheCacheConfiguration(
                CacheConfigurationBuilder
                    .newCacheConfigurationBuilder(Object.class, Object.class, ResourcePoolsBuilder.heap(ehcache.getMaxEntries()))
                    .withExpiry(ExpiryPolicyBuilder.timeToLiveExpiration(Duration.ofSeconds(ehcache.getTimeToLiveSeconds())))
                    .build()
            );
    }

    @Bean
    public HibernatePropertiesCustomizer hibernatePropertiesCustomizer(javax.cache.CacheManager cacheManager) {
        return hibernateProperties -> hibernateProperties.put(ConfigSettings.CACHE_MANAGER, cacheManager);
    }

    @Bean
    public JCacheManagerCustomizer cacheManagerCustomizer() {
        return cm -> {
            createCache(cm, org.createyourevent.app.repository.UserRepository.USERS_BY_LOGIN_CACHE);
            createCache(cm, org.createyourevent.app.repository.UserRepository.USERS_BY_EMAIL_CACHE);
            createCache(cm, org.createyourevent.app.domain.User.class.getName());
            createCache(cm, org.createyourevent.app.domain.Authority.class.getName());
            createCache(cm, org.createyourevent.app.domain.User.class.getName() + ".authorities");
            createCache(cm, org.createyourevent.app.domain.Point.class.getName());
            createCache(cm, org.createyourevent.app.domain.UserPointAssociation.class.getName());
            createCache(cm, org.createyourevent.app.domain.Organization.class.getName());
            createCache(cm, org.createyourevent.app.domain.Organization.class.getName() + ".events");
            createCache(cm, org.createyourevent.app.domain.Worksheet.class.getName());
            createCache(cm, org.createyourevent.app.domain.AdminFeesPrice.class.getName());
            createCache(cm, org.createyourevent.app.domain.Shop.class.getName());
            createCache(cm, org.createyourevent.app.domain.Shop.class.getName() + ".products");
            createCache(cm, org.createyourevent.app.domain.Shop.class.getName() + ".eventProductOrders");
            createCache(cm, org.createyourevent.app.domain.Restaurant.class.getName());
            createCache(cm, org.createyourevent.app.domain.Club.class.getName());
            createCache(cm, org.createyourevent.app.domain.CreateYourEventService.class.getName());
            createCache(cm, org.createyourevent.app.domain.CreateYourEventService.class.getName() + ".serviceMaps");
            createCache(cm, org.createyourevent.app.domain.ServiceOffer.class.getName());
            createCache(cm, org.createyourevent.app.domain.ServiceMap.class.getName());
            createCache(cm, org.createyourevent.app.domain.ServiceMap.class.getName() + ".serviceOffers");
            createCache(cm, org.createyourevent.app.domain.ServiceMap.class.getName() + ".eventServiceMapOrders");
            createCache(cm, org.createyourevent.app.domain.RideCosts.class.getName());
            createCache(cm, org.createyourevent.app.domain.Order.class.getName());
            createCache(cm, org.createyourevent.app.domain.ShopComment.class.getName());
            createCache(cm, org.createyourevent.app.domain.EventDetails.class.getName());
            createCache(cm, org.createyourevent.app.domain.Reservation.class.getName());
            createCache(cm, org.createyourevent.app.domain.Product.class.getName());
            createCache(cm, org.createyourevent.app.domain.Product.class.getName() + ".eventProductOrders");
            createCache(cm, org.createyourevent.app.domain.Product.class.getName() + ".comments");
            createCache(cm, org.createyourevent.app.domain.Product.class.getName() + ".worksheets");
            createCache(cm, org.createyourevent.app.domain.DeliveryType.class.getName());
            createCache(cm, org.createyourevent.app.domain.DeliveryType.class.getName() + ".eventProductOrders");
            createCache(cm, org.createyourevent.app.domain.ShopLikeDislike.class.getName());
            createCache(cm, org.createyourevent.app.domain.ServiceLikeDislike.class.getName());
            createCache(cm, org.createyourevent.app.domain.ProductLikeDislike.class.getName());
            createCache(cm, org.createyourevent.app.domain.ProductComment.class.getName());
            createCache(cm, org.createyourevent.app.domain.OrganizationLikeDislike.class.getName());
            createCache(cm, org.createyourevent.app.domain.OrganizationComment.class.getName());
            createCache(cm, org.createyourevent.app.domain.ServiceComment.class.getName());
            createCache(cm, org.createyourevent.app.domain.EventLikeDislike.class.getName());
            createCache(cm, org.createyourevent.app.domain.EventComment.class.getName());
            createCache(cm, org.createyourevent.app.domain.EventProductRating.class.getName());
            createCache(cm, org.createyourevent.app.domain.EventStarRating.class.getName());
            createCache(cm, org.createyourevent.app.domain.ShopStarRating.class.getName());
            createCache(cm, org.createyourevent.app.domain.ProductStarRating.class.getName());
            createCache(cm, org.createyourevent.app.domain.ServiceStarRating.class.getName());
            createCache(cm, org.createyourevent.app.domain.EventProductOrder.class.getName());
            createCache(cm, org.createyourevent.app.domain.EventServiceMapOrder.class.getName());
            createCache(cm, org.createyourevent.app.domain.Cart.class.getName());
            createCache(cm, org.createyourevent.app.domain.Cart.class.getName() + ".products");
            createCache(cm, org.createyourevent.app.domain.Cart.class.getName() + ".services");
            createCache(cm, org.createyourevent.app.domain.EventProductRatingComment.class.getName());
            createCache(cm, org.createyourevent.app.domain.Event.class.getName());
            createCache(cm, org.createyourevent.app.domain.Event.class.getName() + ".eventProductOrders");
            createCache(cm, org.createyourevent.app.domain.Event.class.getName() + ".reservations");
            createCache(cm, org.createyourevent.app.domain.Event.class.getName() + ".comments");
            createCache(cm, org.createyourevent.app.domain.Event.class.getName() + ".worksheets");
            createCache(cm, org.createyourevent.app.domain.Event.class.getName() + ".eventServiceMapOrders");
            createCache(cm, org.createyourevent.app.domain.Image.class.getName());
            createCache(cm, org.createyourevent.app.domain.Chips.class.getName());
            createCache(cm, org.createyourevent.app.domain.Chips.class.getName() + ".chipsCollectionChips");
            createCache(cm, org.createyourevent.app.domain.ChipsCollectionChips.class.getName());
            createCache(cm, org.createyourevent.app.domain.ChipsCollection.class.getName());
            createCache(cm, org.createyourevent.app.domain.ChipsCollection.class.getName() + ".chipsCollectionChips");
            createCache(cm, org.createyourevent.app.domain.ChipsAdmin.class.getName());
            createCache(cm, org.createyourevent.app.domain.Location.class.getName());
            createCache(cm, org.createyourevent.app.domain.Address.class.getName());
            createCache(cm, org.createyourevent.app.domain.Contact.class.getName());
            createCache(cm, org.createyourevent.app.domain.Tags.class.getName());
            createCache(cm, org.createyourevent.app.domain.Gift.class.getName());
            createCache(cm, org.createyourevent.app.domain.Gift.class.getName() + ".giftShoppingCarts");
            createCache(cm, org.createyourevent.app.domain.GiftShoppingCart.class.getName());
            createCache(cm, org.createyourevent.app.domain.Property.class.getName());
            createCache(cm, org.createyourevent.app.domain.Partner.class.getName());
            createCache(cm, org.createyourevent.app.domain.UserExtension.class.getName());
            createCache(cm, org.createyourevent.app.domain.Organization.class.getName() + ".tags");
            createCache(cm, org.createyourevent.app.domain.Shop.class.getName() + ".tags");
            createCache(cm, org.createyourevent.app.domain.CreateYourEventService.class.getName() + ".tags");
            createCache(cm, org.createyourevent.app.domain.Product.class.getName() + ".tags");
            createCache(cm, org.createyourevent.app.domain.Event.class.getName() + ".tags");
            createCache(cm, org.createyourevent.app.domain.Product.class.getName() + ".deliveryTypes");
            createCache(cm, org.createyourevent.app.domain.Shop.class.getName() + ".images");
            createCache(cm, org.createyourevent.app.domain.Product.class.getName() + ".images");
            createCache(cm, org.createyourevent.app.domain.CreateYourEventService.class.getName() + ".images");
            createCache(cm, org.createyourevent.app.domain.Event.class.getName() + ".images");
            createCache(cm, org.createyourevent.app.domain.Shop.class.getName() + ".comments");
            createCache(cm, org.createyourevent.app.domain.Shop.class.getName() + ".mp3s");
            createCache(cm, org.createyourevent.app.domain.CreateYourEventService.class.getName() + ".mp3s");
            createCache(cm, org.createyourevent.app.domain.Product.class.getName() + ".mp3s");
            createCache(cm, org.createyourevent.app.domain.Event.class.getName() + ".mp3s");
            createCache(cm, org.createyourevent.app.domain.Mp3.class.getName());
            createCache(cm, org.createyourevent.app.domain.Hotel.class.getName());
            createCache(cm, org.createyourevent.app.domain.FeeTransaction.class.getName());
            createCache(cm, org.createyourevent.app.domain.FeeTransaction.class.getName() + ".entries");
            createCache(cm, org.createyourevent.app.domain.FeeTransactionEntry.class.getName());
            createCache(cm, org.createyourevent.app.domain.PointsExchange.class.getName());
            createCache(cm, org.createyourevent.app.domain.PointsExchange.class.getName() + ".bonds");
            createCache(cm, org.createyourevent.app.domain.Bond.class.getName());
            createCache(cm, org.createyourevent.app.domain.FeeBalance.class.getName());
            createCache(cm, org.createyourevent.app.domain.ShopComment.class.getName() + ".comments");
            createCache(cm, org.createyourevent.app.domain.ShopComment.class.getName() + ".answers");
            createCache(cm, org.createyourevent.app.domain.ShopComment.class.getName() + ".shopComments");
            createCache(cm, org.createyourevent.app.domain.ProductComment.class.getName() + ".productComments");
            createCache(cm, org.createyourevent.app.domain.ServiceComment.class.getName() + ".serviceComments");
            createCache(cm, org.createyourevent.app.domain.EventComment.class.getName() + ".eventComments");
            createCache(cm, org.createyourevent.app.domain.ReservationTransactionId.class.getName());
            createCache(cm, org.createyourevent.app.domain.FeeTransactionId.class.getName());
            createCache(cm, org.createyourevent.app.domain.Event.class.getName() + ".reservedUsers");
            createCache(cm, org.createyourevent.app.domain.Ticket.class.getName());
            createCache(cm, org.createyourevent.app.domain.Organization.class.getName() + ".images");
            createCache(cm, org.createyourevent.app.domain.Organization.class.getName() + ".organizationReservations");
            createCache(cm, org.createyourevent.app.domain.OrganizationComment.class.getName() + ".organizationComments");
            createCache(cm, org.createyourevent.app.domain.OrganizationReservation.class.getName());
            createCache(cm, org.createyourevent.app.domain.Building.class.getName());
            createCache(cm, org.createyourevent.app.domain.OrganizationStarRating.class.getName());
            createCache(cm, org.createyourevent.app.domain.Event.class.getName() + ".organizations");
            createCache(cm, org.createyourevent.app.domain.OrganizationReservation.class.getName() + ".events");
            createCache(cm, org.createyourevent.app.domain.Event.class.getName() + ".organizationReservations");
            // jhipster-needle-ehcache-add-entry
        };
    }

    private void createCache(javax.cache.CacheManager cm, String cacheName) {
        javax.cache.Cache<Object, Object> cache = cm.getCache(cacheName);
        if (cache != null) {
            cache.clear();
        } else {
            cm.createCache(cacheName, jcacheConfiguration);
        }
    }

    @Autowired(required = false)
    public void setGitProperties(GitProperties gitProperties) {
        this.gitProperties = gitProperties;
    }

    @Autowired(required = false)
    public void setBuildProperties(BuildProperties buildProperties) {
        this.buildProperties = buildProperties;
    }

    @Bean
    public KeyGenerator keyGenerator() {
        return new PrefixedKeyGenerator(this.gitProperties, this.buildProperties);
    }
}
