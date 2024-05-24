import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { CreateorderService } from '../../services/createorder.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { Products, ProductsOrder, Customer } from '../../interfaces/interfaces';


@Component({
  selector: 'app-create-orden',
  standalone: true,
  imports: [FormsModule , CommonModule, HttpClientModule],
  providers: [CreateorderService],
  templateUrl: './create-orden.component.html',
  styleUrl: './create-orden.component.css'
})
export class CreateOrdenComponent implements OnInit  {
  @ViewChild('myButtonClose') myButtonClose!: ElementRef;
  @Output() evento = new EventEmitter<any>();
  documentId: string = '';
  address: string = '';
  query: string = '';
  count!: number;
  results: Products[] = [];
  products: Products[] = [];
  productsOrder: ProductsOrder[] = [];
  productFilter: Products[] = [];
  customer: Customer[] = [];
  isButtonDisabled: boolean = true;
  Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    }
  });

  constructor(private createOrderService: CreateorderService) { }

  ngOnInit(): void {}

  getSubTotal(products: any[]): number {
    return products.reduce((acumulador, obj) => acumulador + obj.total, 0).toLocaleString('en-US');
  }

  onSearch() {
    if (this.query.length > 0) {
      this.createOrderService.searchProductsByName(this.query).subscribe(result => {
        this.products = result;
        this.results = this.products;
      }, error => console.error(error));
    } else {
      this.results = [];
    }
  }

  selectItem(item:Products){
    this.query = item.productName;
    this.products = [];
  }

  deleteProduct(id:number) {
    this.productsOrder = this.productsOrder.filter(item => item.productID !== id);
    if(this.productsOrder.length <= 0){
      this.isButtonDisabled = true;
    }
  }

  addProduct(){
    if(this.count < 1 || this.count == undefined || this.query.trim() == ''){
      this.Toast.fire({ icon: "error", title: "Faltan datos por ingresar" });
      return;
    }

    let productFilter = this.results.find(item => item.productName == this.query);

    if(productFilter == undefined){
      this.Toast.fire({ icon: "error", title: "El producto no existe." });
      return;
    }

    const validateExist = this.productsOrder.findIndex(item => item.productID === productFilter?.productID);
    if(validateExist != -1){
      this.productsOrder[validateExist].count = +this.productsOrder[validateExist].count + +this.count;
      this.productsOrder[validateExist].total = this.productsOrder[validateExist].total + this.count * this.productsOrder[validateExist].price;
      this.isButtonDisabled = false;
    }
    else{
      this.productsOrder.push({productID: productFilter?.productID||0, productName: productFilter?.productName||'', price: Number(productFilter?.price)||0, count: this.count, total: this.count * Number(productFilter?.price)||0});
      this.isButtonDisabled = false;
    }
    this.count = 0;
    this.query = '';
  }

  findCostumer(){
    if (this.documentId != null && this.documentId?.toString()?.trim() != '') {
      console.log("docuemte id", this.documentId)
      this.createOrderService.searchClientById(this.documentId.toString()).subscribe(result => {
        this.customer = result;
        if(this.customer.length > 0){
          this.address = this.customer[0].address;
          this.Toast.fire({ icon: "success", title: "Cliente encontrado." });
        }else{
          this.Toast.fire({ icon: "error", title: "El usuario no se encuentra registrado." });
        }
      }, error => console.error(error));
    } else {
      this.customer = [];
    }
  }

  saveOrder(){
    console.log("al guardar", this.documentId?.toString()?.trim())
    if(this.documentId == null || this.documentId?.toString()?.trim() == '' || this.address?.trim() == '' || this.productsOrder.length <= 0 || this.address == null){
      this.Toast.fire({ icon: "error", title: "Faltan datos por ingresar" });
      return;
    }

    if (this.documentId != '' && this.documentId != null) {
      this.createOrderService.searchClientById(this.documentId.toString()).subscribe(result => {
        this.customer = result;
        if(this.customer.length > 0){
          this.address = this.customer[0].address;
          this.createOrderService.saveNewOrderAPI({CustomerID: this.customer[0].customerID, CustomerAddress: this.address, ProductsOrder: this.productsOrder}).subscribe(result => {
            if(result.status == 200){
              this.Toast.fire({ icon: "success", title: "Pedido registrado con exito." });
              this.productsOrder = [];
              this.isButtonDisabled = true;
              this.documentId = '';
              this.address = ''
              this.evento.emit();
            }
          }, error => console.error(error));
        }else{
          this.Toast.fire({ icon: "error", title: "El usuario no se encuentra registrado." });
        }
      }, error => console.error(error));
    } else {
      this.customer = [];
    }
  }
}
