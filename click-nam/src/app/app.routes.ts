import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LogInComponent } from './pages/log-in/log-in.component';
import { RegistroUsuarioClienteComponent } from './pages/registro/registro-usuario-cliente/registro-usuario-cliente.component';
import { RegistroUsuarioRestauranteComponent } from './pages/registro/registro-usuario-restaurante/registro-usuario-restaurante.component';
import { RegistroRestauranteComponent } from './pages/registro/registro-restaurante/registro-restaurante.component';
import { RestauranteDetalleComponent } from './pages/restaurante-detalle/restaurante-detalle.component';
import { DashboardRestauranteComponent } from './pages/dashboard-restaurante/dashboard-restaurante.component';
import { RestaurantesFiltradosComponent } from './pages/restaurantes-filtrados/restaurantes-filtrados.component';
import { ListaReservasComponent } from './pages/lista-reservas/lista-reservas.component';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home',component: HomeComponent},
    { path: 'log-in', component: LogInComponent},
    { path: 'registro-cliente', component: RegistroUsuarioClienteComponent},
    { path: 'registro-restaurante', component: RegistroUsuarioRestauranteComponent},
    { path: 'alta-restaurante', component: RegistroRestauranteComponent}, //modificar nombre
    { path: 'home-restaurante', component: RestauranteDetalleComponent},
    { path: 'home-restaurante/:id', component: RestauranteDetalleComponent},
    { path: 'dashboard-restaurante', component: DashboardRestauranteComponent},
    { path: 'restaurantes-filtrados', component: RestaurantesFiltradosComponent},
    { path: 'lista-reservas', component: ListaReservasComponent}
];
