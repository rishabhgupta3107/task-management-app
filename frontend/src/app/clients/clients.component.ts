import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClientService } from '../services/client.service';
import { ConfirmService } from '../services/confirm.service';
import { Client } from '../models/agency';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css'],
})
export class ClientsComponent implements OnInit {
  clients: Client[] = [];
  loading = true;
  adding = false;

  form = { name: '', industry: '', brandColor: '#6e8bff' };

  constructor(
    private clientService: ClientService,
    private confirmService: ConfirmService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.clientService.listClients().subscribe({
      next: (c) => {
        this.clients = c;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  open(client: Client): void {
    this.router.navigate(['/app/clients', client.id]);
  }

  createClient(): void {
    if (!this.form.name.trim()) return;
    this.clientService
      .createClient({
        name: this.form.name.trim(),
        industry: this.form.industry.trim() || undefined,
        brandColor: this.form.brandColor,
      })
      .subscribe((created) => {
        this.adding = false;
        this.form = { name: '', industry: '', brandColor: '#6e8bff' };
        this.router.navigate(['/app/clients', created.id]);
      });
  }

  deleteClient(client: Client, event: MouseEvent): void {
    event.stopPropagation();
    this.confirmService
      .confirm(`Delete "${client.name}" and all its dashboards?`, 'Delete client')
      .subscribe((ok) => {
        if (ok) {
          this.clientService.deleteClient(client.id).subscribe(() => this.load());
        }
      });
  }

  initials(name: string): string {
    return name.split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
  }
}
