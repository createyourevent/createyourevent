package org.createyourevent.app.web.rest;

import org.createyourevent.app.domain.User;
import org.createyourevent.app.service.UserCYEService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api")
public class UserCYEResource {

    private UserCYEService userCYEService;

    public UserCYEResource(UserCYEService userExtService) {
        this.userCYEService = userExtService;
    }

    @GetMapping("/users/{id}/byId")
    public User getUserWithId(@PathVariable String id) {
        return userCYEService.findOneWithAuthoritiesByIdQuery(id);
    }

   @PutMapping("/users/{id}/update/{address}/{phone}")
    public void updateAddressAndPhone(@PathVariable String id, @PathVariable String address,  @PathVariable String phone) {
        userCYEService.updateAddressAndPhone(id, address, phone);
    }

    @PutMapping("/users/{id}/update/{address}/{phone}/{iban}")
    public void updateAddressAndPhoneAndIBan(@PathVariable String id, @PathVariable String address,  @PathVariable String phone,  @PathVariable String iban) {
        userCYEService.updateAddressAndPhoneAndIBan(id, address, phone, iban);
    }

    @PutMapping("/users/{id}/update/{address}/{phone}/{iban}/{bankname}/{bankaddress}")
    public void updateAddressAndPhoneAndIBanAndBanknameAndBankaddress(@PathVariable String id, @PathVariable String address,  @PathVariable String phone,  @PathVariable String iban,  @PathVariable String bankname,  @PathVariable String bankaddress) {
        userCYEService.updateAddressAndPhoneAndIBanAndBanknameAndBankaddress(id, address, phone, iban, bankname, bankaddress);
    }

    @PutMapping("/users/{id}/{loggedIn}")
    public void updateLoggedIn(@PathVariable String id, @PathVariable Boolean loggedIn) {
        userCYEService.updateLoggedIn(id, loggedIn);
    }

    @PutMapping("/users/{id}/{loggedIn}/{points}")
    public void updateLoggedInAndPoints(@PathVariable String id, @PathVariable Boolean loggedIn, @PathVariable Integer points) {
        userCYEService.updateLoggedInAndPoints(id, loggedIn, points);
    }

    @PutMapping("/users/updateAGBTrue/{id}")
    public void updateAGBsetTrue(@PathVariable String id) {
        userCYEService.updateAGB(id, Boolean.TRUE);
    }
}
