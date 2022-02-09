package org.createyourevent.app.repository;

import org.createyourevent.app.domain.GiftShoppingCart;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data  repository for the GiftShoppingCart entity.
 */
@SuppressWarnings("unused")
@Repository
public interface GiftShoppingCartExtRepository extends JpaRepository<GiftShoppingCart, Long> {

    @Query("select giftShoppingCart from GiftShoppingCart giftShoppingCart where giftShoppingCart.user.id = :id")
    List<GiftShoppingCart> findByUserId(@Param("id") String userId);
}
