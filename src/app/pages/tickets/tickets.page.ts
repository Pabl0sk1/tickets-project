import { Component, OnInit } from '@angular/core';
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

  constructor(
    private firestore: FirestoreService
  ) { }

  tickets: any[] = [];

  ngOnInit() {
    this.listarTickets();
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

  listarTickets() {
    this.firestore.getCollection<Tickets>('medicos').subscribe(data => {
      if (data) this.tickets = data;
    });
  }
}
