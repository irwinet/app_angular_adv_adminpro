import { Component } from '@angular/core';

@Component({
  selector: 'app-grafica1',
  templateUrl: './grafica1.component.html',
  styles: [
  ]
})
export class Grafica1Component {

  public labels1: string[] = ['Download Sales', 'In-Store Sales', 'Mail-Order Sales'];
  public data1 = [
    [50, 100, 150],
  ];

  public labels2: string[] = ['Pan', 'Refresco', 'Tacos'];
  public data2 = [
    [10, 450, 100],
  ];

  public labels3: string[] = ['Download Sales', 'In-Store Sales', 'Mail-Order Sales'];
  public data3 = [
    [60, 120, 180],
  ];

  public labels4: string[] = ['Download Sales', 'In-Store Sales', 'Mail-Order Sales'];
  public data4 = [
    [35, 45, 100],
  ];
}
