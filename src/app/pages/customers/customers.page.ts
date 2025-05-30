import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Customers } from 'src/app/models/customers.model';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.page.html',
  styleUrls: ['./customers.page.scss'],
  standalone: false
})
export class CustomersPage implements OnInit {

  customers: Customers[] = [];
  newCustomer!: Customers;
  showAlert = false;
  customerToDelete!: Customers;
  isMobile: boolean = false;


  openMenu = () => {
    this.menuCtrl.toggle('principal');
  }

  constructor(private firestore: FirestoreService, private menuCtrl: MenuController) {
    this.listarCustomers();
    this.initCustomer();
  }

  ngOnInit() {
    this.checkScreen();
    window.addEventListener('resize', () => this.checkScreen());
  }

  checkScreen() {
    this.isMobile = window.innerWidth < 768; // Puedes ajustar el valor según tus necesidades
  }

  initCustomer() {
    this.newCustomer = {
      id: this.firestore.createIdDoc(),
      nombre: '',
      documento: '',
      nacionalidad: '',
      pais: '',
      direccion: '',
      telefono: ''
    };
  }


  listarCustomers() {
    this.firestore.getCollection<Customers>('clientes').subscribe(data => {
      this.customers = data || [];
    });
  }

  edit(customer: Customers) {
    this.newCustomer = { ...customer };
  }

  showDeleteAlert(customer: Customers) {
    this.customerToDelete = customer;
    this.showAlert = true;
  }

  async delete(customer: Customers) {
    await this.firestore.deleteDocument('clientes', customer.id);
    this.listarCustomers();
  }

  async save() {
    await this.firestore.createDocument(this.newCustomer, 'clientes', this.newCustomer.id);
    this.initCustomer();
  }

  async cancel() {
    this.initCustomer();
  }

  get alertButtons() {
    return [
      {
        text: 'Cancelar',
        role: 'cancel',
        handler: () => {
          this.showAlert = false;
        }
      },
      {
        text: 'Eliminar',
        handler: () => {
          this.delete(this.customerToDelete);
          this.showAlert = false;
        }
      }
    ];
  }
}
