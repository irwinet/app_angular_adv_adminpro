import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Medico } from 'src/app/models/medico.model';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { MedicoService } from 'src/app/services/medico.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: [
  ]
})
export class MedicosComponent implements OnInit, OnDestroy {

  public cargando: boolean = true;
  public medicos: Medico[] = [];
  public medicosTemp: Medico[] = [];
  private imgSubscribe : Subscription;

  constructor(private medicoService: MedicoService,
              private modalImagenService: ModalImagenService,
              private busquedaService: BusquedasService) { }
  
  ngOnDestroy(): void {
    this.imgSubscribe.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarMedicos();

    this.imgSubscribe = this.modalImagenService.nuevaImagen
      .pipe(delay(100))
      .subscribe(img => this.cargarMedicos());
  }

  cargarMedicos(){
    this.cargando = true;
    this.medicoService.cargarMedicos()
      .subscribe(medicos => {
        this.cargando = false;
        this.medicos = medicos;
        this.medicosTemp = medicos;

        console.log(this.medicos);
      })
  }

  abrirModal(medico: Medico){
    this.modalImagenService.abrirModal('medicos', medico._id, medico.img);
  }

  buscar(termino: string){
    if (termino.length == 0) {
      return this.medicos = this.medicosTemp;
    }

    this.busquedaService.buscar('medicos', termino)
      .subscribe(resp => {
        this.medicos = resp;
      });
  }

}
