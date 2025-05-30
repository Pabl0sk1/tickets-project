import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Timestamp } from 'firebase/firestore';
import { Tickets } from 'src/app/models/tickets.model';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.page.html',
  styleUrls: ['./tickets.page.scss'],
  standalone: false
})
export class TicketsPage implements OnInit {

  tickets: Tickets[] = [];
  newTicket!: Tickets & { fechahoraStr?: string };
  showAlert = false;
  ticketToDelete!: Tickets;
  isMobile: boolean = false;

  openMenu = () => {
    this.menuCtrl.toggle('principal');
  }

  constructor(private firestore: FirestoreService, private menuCtrl: MenuController) {
    this.listarTickets();
    this.initTickets();
  }

  ngOnInit() {
    this.checkScreen();
    window.addEventListener('resize', () => this.checkScreen());
  }

  checkScreen() {
    this.isMobile = window.innerWidth < 768; // Puedes ajustar el valor según tus necesidades
  }

  colorEstado(estado: string): string {
    return estado == 'Activo' ? 'verde' : 'rojo';
  }

  fechaTexto(fechaHora: any, op: number) {
    if (!fechaHora) return '';

    const opciones: Intl.DateTimeFormatOptions =
      op === 1
        ? { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }
        : { day: '2-digit', month: '2-digit', year: 'numeric' };

    let fecha: Date | null = null;

    if (fechaHora instanceof Timestamp) {
      fecha = fechaHora.toDate();
    } else if (fechaHora.seconds) {
      fecha = new Date(fechaHora.seconds * 1000);
    } else if (typeof fechaHora === 'string') {
      const parsedDate = new Date(fechaHora);
      if (!isNaN(parsedDate.getTime())) fecha = parsedDate;
    }

    return fecha ? fecha.toLocaleString('es-ES', opciones) : '';
  }

  initTickets() {
    this.newTicket = {
      id: this.firestore.createIdDoc(),
      asunto: '',
      descripcion: '',
      estado: '',
      fechahora: Timestamp.now(),
      asignado_a: ''
    }
  }

  listarTickets() {
    this.firestore.getCollection<Tickets>('medicos').subscribe(data => {
      if (data) {
        this.tickets = data.sort((a, b) => {
          const fechaA = a.fechahora instanceof Timestamp ? a.fechahora.toDate().getTime() : 0;
          const fechaB = b.fechahora instanceof Timestamp ? b.fechahora.toDate().getTime() : 0;
          return fechaB - fechaA; // orden descendente (más reciente primero)
        });
      }
    });
  }

  edit(ticket: Tickets) {
    this.newTicket = { ...ticket };
    // Si fechahora es Timestamp, conviértelo a string ISO
    if (this.newTicket.fechahora instanceof Timestamp) {
      const fecha = this.newTicket.fechahora.toDate();
      fecha.setHours(fecha.getHours() - 3);
      this.newTicket.fechahoraStr = fecha.toISOString().slice(0, 16);
    }
  }

  showDeleteAlert(ticket: Tickets) {
    this.ticketToDelete = ticket;
    this.showAlert = true;
  }

  async delete(ticket: Tickets) {
    await this.firestore.deleteDocument('medicos', ticket.id);
  }

  async save() {
    const ticketToSave = { ...this.newTicket };

    if (ticketToSave.fechahoraStr) {
      ticketToSave.fechahora = Timestamp.fromDate(new Date(ticketToSave.fechahoraStr));
    }

    delete ticketToSave.fechahoraStr; // Eliminamos el campo auxiliar

    await this.firestore.createDocument(ticketToSave, 'medicos', ticketToSave.id);
    this.initTickets();
  }

  async cancel() {
    this.initTickets();
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
          this.delete(this.ticketToDelete);
          this.showAlert = false;
        }
      }
    ];
  }
}
