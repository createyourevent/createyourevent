import { Component, EventEmitter, Input, OnInit, Output, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { StripeIbanComponent, StripeCardComponent, StripeService } from 'ngx-stripe';
import { StripeElementsOptions, StripeIbanElementOptions, PaymentIntent, StripeCardElementOptions } from '@stripe/stripe-js';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { MessageService } from 'primeng/api';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { GeneralService } from 'app/general.service';
import { ActivatedRoute } from '@angular/router';

declare var window: any;

@Component({
  selector: 'jhi-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
  providers: [MessageService],
})
export class PaymentComponent implements OnInit, OnChanges {
  @ViewChild(StripeIbanComponent) iban!: StripeIbanComponent;
  @ViewChild(StripeCardComponent, { static: false }) card!: StripeCardComponent;

  @Input() value = 0;
  @Output() successEvent = new EventEmitter<any>();
  @Input() type = '';
  @Input() id = -1;

  transactionId: string;
  production: boolean;

  public payPalConfig?: IPayPalConfig;

  ibanOptions: StripeIbanElementOptions = {
    style: {
      base: {
        iconColor: '#666EE8',
        color: '#31325F',
        fontWeight: '300',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSize: '18px',
        '::placeholder': {
          color: '#CFD7E0',
        },
      },
    },
  };

  cardOptions: StripeCardElementOptions = {
    style: {
      base: {
        iconColor: '#8118de',
        color: '#000',
        fontWeight: '300',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSize: '18px',
      },
    },
  };

  elementsOptions: StripeElementsOptions = {
    locale: 'auto',
  };

  ccGroup!: UntypedFormGroup;

  datatransTrxId: string;

  constructor(
    private fb: UntypedFormBuilder,
    private messageService: MessageService,
    private stripeService: StripeService,
    private http: HttpClient,
    private translate: TranslateService,
    private generalService: GeneralService,
    private route: ActivatedRoute
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value'] !== undefined && changes['value'].currentValue !== undefined) {
      this.value = changes['value'].currentValue;
      this.initConfig();
    }
  }

  ngOnInit(): void {
    const host = window.location.host;
    if (host.startsWith('dev.')) {
      this.production = false;
    } else {
      this.production = true;
    }

    this.ccGroup = this.fb.group({
      name: ['', [Validators.required]],
    });
    this.route.queryParams.subscribe(params => {
      this.datatransTrxId = params['datatransTrxId'];
      if (this.datatransTrxId) {
        this.generalService.getStatusFromTransactionIdFromDatatrans(this.datatransTrxId).subscribe(res => {
          const z = res.body;
          if (z.status === 'authorized' || z.status === 'settled') {
            this.successEvent.emit(z);
          }
        });
      }
    });
  }

  onLoaded(e: any): void {
    console.log('OnLoaded');
  }
  onOpened(e: any): void {
    console.log('OnOpened');
  }
  onCancelled(e: any): void {
    console.log('OnCancelled');
  }
  onError(e: any): void {
    console.log('OnError');
  }

  pay(): void {
    if (this.ccGroup.valid) {
      this.createPaymentIntent(this.value * 100)
        .pipe(
          switchMap(pi =>
            this.stripeService.confirmCardPayment(pi.client_secret!, {
              payment_method: {
                card: this.card.element,
                billing_details: {
                  name: this.ccGroup.get('name')!.value,
                },
              },
            })
          )
        )
        .subscribe(result => {
          if (result.error) {
            this.messageService.add({ severity: 'error', summary: result.error.message, detail: result.error.message });
          } else {
            // The payment has been processed!
            if (result.paymentIntent!.status === 'succeeded') {
              this.messageService.add({
                severity: 'success',
                summary: this.translate.instant('cashbox.payment-successfull'),
                detail: this.translate.instant('cashbox.cc-form.successful.info'),
              });
              this.ccGroup.reset();
              this.card.element.clear();
              this.successEvent.emit(result);
            }
          }
        });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: this.translate.instant('cashbox.cc-form.error'),
        detail: this.translate.instant('cashbox.cc-form.error.info'),
      });
    }
  }

  createPaymentIntent(amount: number): Observable<PaymentIntent> {
    return this.http.post<PaymentIntent>(`https://stripe.createyourevent.org/api/create-payment-intent`, { amount: amount });
  }

  private initConfig(): void {
    this.payPalConfig = {
      currency: 'CHF',
      clientId: 'AcFPWJ-j150ofAt93PIKeb5oCzEBv7dO1NKeaaX9oKsJJNLCcmuVEPIvn_UOf9HAiBPX2Xz1npanBgU7',
      createOrderOnClient: data =>
        <ICreateOrderRequest>{
          intent: 'CAPTURE',
          purchase_units: [
            {
              amount: {
                currency_code: 'CHF',
                value: '' + this.value,
                breakdown: {
                  item_total: {
                    currency_code: 'CHF',
                    value: '' + this.value,
                  },
                },
              },
            },
          ],
        },
      advanced: {
        commit: 'true',
      },
      style: {
        label: 'paypal',
        layout: 'vertical',
      },
      onApprove: (data, actions) => {
        console.log('onApprove - transaction was approved, but not authorized', data, actions);
        actions.order.get().then((details: any) => {
          console.log('onApprove - you can get full order details inside onApprove: ', details);
        });
      },
      onClientAuthorization: data => {
        console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
        this.successEvent.emit({ data: data });
        this.messageService.add({
          severity: 'success',
          summary: this.translate.instant('cashbox.payment-successfull'),
          detail: this.translate.instant('cashbox.cc-form.successful.info'),
        });
      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);
      },
      onError: err => {
        console.log('OnError', err);
      },
      onClick: (data, actions) => {
        console.log('onClick', data, actions);
      },
    };
  }
}
