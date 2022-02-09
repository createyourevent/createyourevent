package org.createyourevent.app.repository;

import java.util.List;
import org.createyourevent.app.domain.GiftShoppingCart;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the GiftShoppingCart entity.
 */
@SuppressWarnings("unused")
@Repository
public interface GiftShoppingCartRepository extends JpaRepository<GiftShoppingCart, Long> {
    @Query(
        "select giftShoppingCart from GiftShoppingCart giftShoppingCart where giftShoppingCart.user.login = ?#{principal.preferredUsername}"
    )
    List<GiftShoppingCart> findByUserIsCurrentUser();
}
