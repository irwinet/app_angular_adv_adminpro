import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public formSubmitted = false;

  public loginForm = this.fb.group({
    email: ['irwinet@gmail.com', [Validators.required, Validators.email]],
    password: ['123456', Validators.required],
    remember: [false]    
  });

  constructor(private router: Router,
              private fb: FormBuilder,
              private usuarioService : UsuarioService) { }

  ngOnInit(): void {
  }

  login(){
    
    this.usuarioService.login(this.loginForm.value)
      .subscribe(resp  => {
        console.log(resp);
      }, (err) => {
        // si sucede un error
        Swal.fire('Error', err.error.msg, 'error');
      });
    
    // console.log(this.loginForm.value);

    // this.router.navigateByUrl('/');
  }

}
