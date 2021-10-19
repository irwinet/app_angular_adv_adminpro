import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { environment } from 'src/environments/environment';
import { catchError, map, tap } from 'rxjs/operators';


import { LoginForm } from '../interfaces/login-form.interface';
import { RegisterForm } from '../interfaces/register-form.interface';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.model';
import { CargarUsuario } from '../interfaces/cargar-usuarios.interface';

const base_url = environment.base_url;
declare const gapi: any;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public auth2: any;
  public usuario: Usuario;

  constructor(private http: HttpClient, private router: Router, private ngZone:NgZone) {
    this.googleInit();
  }

  get token(): string{
    return localStorage.getItem('token') || '';
  }

  get uid(): string{
    return this.usuario.uid || '';
  }

  get headers(){
    return {
      headers: {
        'x-token': this.token
      }
    };
  }

  googleInit() {
    
    return new Promise<void>(resolve => {
      // console.log('google init');

      gapi.load('auth2', () => {
        // Retrieve the singleton for the GoogleAuth library and set up the client.
        this.auth2 = gapi.auth2.init({
          client_id: '696072802934-0mi3l4c0mjrhavv7tij9qdlnt0vb39ct.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin'
        });

        resolve();
      });
    });
        
  }

  logout() {
    localStorage.removeItem('token');

    this.auth2.signOut().then(() => {
      this.ngZone.run(()=>{
        this.router.navigateByUrl('/login');
      });      
    });
  }

  validarToken(): Observable<boolean> {
    // const token = localStorage.getItem('token') || '';

    return this.http.get(`${base_url}/login/renew`, {
      headers: {
        'x-token': this.token
      }
    }).pipe(
      map((resp: any) => {
        // console.log(resp);
        const { email, google, nombre, role, img = '', uid } = resp.usuario;
        this.usuario = new Usuario(nombre, email, '', img, google, role, uid);
        
        localStorage.setItem('token', resp.token);
        return true;
      }),
      //map(resp => true),
      catchError(error => of(false))
    );
  }

  crearUsuario(formData: RegisterForm) {

    return this.http.post(`${base_url}/usuarios`, formData)
      .pipe(
        tap((resp: any) => {
          localStorage.setItem('token', resp.token);
        })
      );

  }

  actualizarPerfil(data : {email:string, nombre: string, role: string}){

    data = {
      ...data,
      role: this.usuario.role
    };

    return this.http.put(`${base_url}/usuarios/${this.uid}`, data, {
      headers: {
        'x-token': this.token
      }
    });
  }

  login(formData: LoginForm) {

    return this.http.post(`${base_url}/login`, formData)
      .pipe(
        tap((resp: any) => {
          localStorage.setItem('token', resp.token);
        })
      );

  }

  loginGoogle(token) {

    return this.http.post(`${base_url}/login/google`, { token })
      .pipe(
        tap((resp: any) => {
          localStorage.setItem('token', resp.token);
        })
      );

  }

  cargarUsuarios(desde: number = 0){
    const url = `${base_url}/usuarios?desde=${desde}`;
    return this.http.get<CargarUsuario>(url, this.headers)
      .pipe(
        map(resp => {
          // console.log(resp);
          const usuarios = resp.usuarios.map(
            user => new Usuario(user.nombre, user.email, '', user.img, user.google, user.uid)
          );

          return {
            total: resp.total,
            usuarios
          };
        })
      )
  }
}
