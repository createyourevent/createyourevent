package org.createyourevent.app.web.rest;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.InetAddress;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.UnknownHostException;
import java.nio.charset.StandardCharsets;
import java.util.stream.Collectors;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.configurationprocessor.json.JSONException;
import org.springframework.boot.configurationprocessor.json.JSONObject;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.web.servlet.view.RedirectView;

import io.swagger.v3.oas.annotations.parameters.RequestBody;

@RestController
@RequestMapping("/api/datatrans")
public class DataTrans {

    private final Logger log = LoggerFactory.getLogger(DataTrans.class);

    @GetMapping("/{amount}/{type}/{id}")
    public String getTransactionId(HttpServletRequest request, @PathVariable Integer amount, @PathVariable  String type, @PathVariable Integer id) {
        log.debug("REST request for TransactionId");

        String successURL = "";
        String errorURL = "";
        String cancelURL = "";
        String refNo = this.getRefNo();

        String url = "https://api.sandbox.datatrans.com/v1/transactions";
        String account = "";
        String hostAddress = "localhost";
        hostAddress = ServletUriComponentsBuilder.fromRequestUri(request)
        .replacePath(null)
        .build()
        .toUriString();

        if(hostAddress.startsWith("https://dev.")) {

            account = "1100032109:PfzwZzluXkvPMlX0";
            url = "https://api.sandbox.datatrans.com/v1/transactions";

            if(type.equals("event")) {
                successURL = "https://dev.createyourevent.org/success/event/" + id + "/" + refNo + "/" + amount;
                errorURL = "https://dev.createyourevent.org/error/event/" + id + "/" + refNo + "/" + amount;
                cancelURL = "https://dev.createyourevent.org/cancel/event/" + id + "/" + refNo + "/" + amount;
            }else if(type.equals("cashbox")) {
                successURL = "https://dev.createyourevent.org/success/cashbox/" + id + "/" + refNo + "/" + amount;
                errorURL = "https://dev.createyourevent.org/error/cashbox/" + id + "/" + refNo + "/" + amount;
                cancelURL = "https://dev.createyourevent.org/cancel/cashbox/" + id + "/" + refNo + "/" + amount;
            }else if(type.equals("ticket")) {
                successURL = "https://dev.createyourevent.org/success/ticket/" + id + "/" + refNo + "/" + amount;
                errorURL = "https://dev.createyourevent.org/error/ticket/" + id + "/" + refNo + "/" + amount;
                cancelURL = "https://dev.createyourevent.org/cancel/ticket/" + id + "/" + refNo + "/" + amount;
            }else if(type.equals("fee")) {
                successURL = "https://dev.createyourevent.org/success/fee/" + id + "/" + refNo + "/" + amount;
                errorURL = "https://dev.createyourevent.org/error/fee/" + id + "/" + refNo + "/" + amount;
                cancelURL = "https://dev.createyourevent.org/cancel/fee/" + id + "/" + refNo + "/" + amount;
            }else if(type.equals("buyTicket")) {
                successURL = "https://dev.createyourevent.org/success/buyTicket/" + id + "/" + refNo + "/" + amount;
                errorURL = "https://dev.createyourevent.org/error/buyTicket/" + id + "/" + refNo + "/" + amount;
                cancelURL = "https://dev.createyourevent.org/cancel/buyTicket/" + id + "/" + refNo + "/" + amount;
            }
        } else {

            account = "3000021668:x0TiV1zxiujXObDx";
            url = "https://api.datatrans.com/v1/transactions";

            if(type.equals("event")) {
                successURL = "https://createyourevent.org/success/event/" + id + "/" + refNo + "/" + amount;
                errorURL = "https://createyourevent.org/error/event/" + id + "/" + refNo + "/" + amount;
                cancelURL = "https://createyourevent.org/cancel/event/" + id + "/" + refNo + "/" + amount;
            }else if(type.equals("cashbox")) {
                successURL = "https://createyourevent.org/success/cashbox/" + id + "/" + refNo + "/" + amount;
                errorURL = "https://createyourevent.org/error/cashbox/" + id + "/" + refNo + "/" + amount;
                cancelURL = "https://createyourevent.org/cancel/cashbox/" + id + "/" + refNo + "/" + amount;
            }else if(type.equals("ticket")) {
                successURL = "https://createyourevent.org/success/ticket/" + id + "/" + refNo + "/" + amount;
                errorURL = "https://createyourevent.org/error/ticket/" + id + "/" + refNo + "/" + amount;
                cancelURL = "https://createyourevent.org/cancel/ticket/" + id + "/" + refNo + "/" + amount;
            }else if(type.equals("fee")) {
                successURL = "https://createyourevent.org/success/fee/" + id + "/" + refNo + "/" + amount;
                errorURL = "https://createyourevent.org/error/fee/" + id + "/" + refNo + "/" + amount;
                cancelURL = "https://createyourevent.org/cancel/fee/" + id + "/" + refNo + "/" + amount;
            }else if(type.equals("buyTicket")) {
                successURL = "https://createyourevent.org/success/buyTicket/" + id + "/" + refNo + "/" + amount;
                errorURL = "https://createyourevent.org/error/buyTicket/" + id + "/" + refNo + "/" + amount;
                cancelURL = "https://createyourevent.org/cancel/buyTicket/" + id + "/" + refNo + "/" + amount;
            }
        }

        String[] commands = new String[]{"curl", "--user", account, "-H", "Content-Type: application/json", "--data-raw", "{\"redirect\": {\"successUrl\": \"" + successURL + "\", \"cancelUrl\": \"" + cancelURL + "\",\"errorUrl\": \"" + errorURL + "\", \"method\": \"GET\"}, \"autoSettle\": true, \"currency\":\"CHF\",\"refno\": \"" + refNo + "\",\"amount\":" + amount + "}", url};
        log.info("REST CURL request to :" + commands.toString());
        String response = "";
        JSONObject json;
        String text = "";
        try {
            String line;
            Process process = Runtime.getRuntime().exec(commands);
            BufferedReader reader = new BufferedReader(new
            InputStreamReader(process.getInputStream()));
            while ((line = reader.readLine()) != null) {
                response += line;
            }
            log.debug("JSONObject" + response);
            json = new JSONObject(response);
            text = json.getString("transactionId");
        } catch (IOException e) {
            e.printStackTrace();
        } catch (Exception e) {
            e.printStackTrace();
        }

        return response;
    }

    @GetMapping("/txId/{txId}")
    public String getStatus(HttpServletRequest request, @PathVariable String txId) {
        log.debug("REST request for TransactionId-Status");

        String url = "https://api.sandbox.datatrans.com/v1/transactions/" + txId;
        String account = "";
        String hostAddress = "localhost";
        hostAddress = ServletUriComponentsBuilder.fromRequestUri(request)
        .replacePath(null)
        .build()
        .toUriString();

        if(hostAddress.startsWith("https://dev.")) {
            account = "1100032109:PfzwZzluXkvPMlX0";
            url = "https://api.sandbox.datatrans.com/v1/transactions/" + txId;
        } else {
            account = "3000021668:x0TiV1zxiujXObDx";
            url = "https://api.datatrans.com/v1/transactions/" + txId;
        }


        String[] commands = new String[]{"curl", "--user", account, "-i", "-X", "GET", url};
        String response = "";
        JSONObject json;
        String text = "";
        try {
            String line;
            Process process = Runtime.getRuntime().exec(commands);
            BufferedReader reader = new BufferedReader(new
            InputStreamReader(process.getInputStream()));
            while ((line = reader.readLine()) != null) {
                response += line;
            }
            text = response.substring(response.indexOf("{"), response.length());
        } catch (IOException e) {
            e.printStackTrace();
        }
        log.debug("JSONObject builded...................." + response);
        return text;
    }


    private String getRefNo() {
        String ref = "";
        String possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (int i = 0; i < 20; i++) {
          ref += possible.charAt((int)(Math.floor(Math.random() * possible.length())));
        }

     return ref;
    }


}
