import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CinemaService } from '../services/cinema.service';

@Component({
  selector: 'app-cinema',
  templateUrl: './cinema.component.html',
  styleUrls: ['./cinema.component.css']
})
export class CinemaComponent implements OnInit {

  public villes;
  public cinemas;
  public salles;
  public currentProjection;
  public currentVille;
  public currentCinemas;
  public selectedTicket ;
  constructor(public cinemaService:CinemaService) { }

  ngOnInit(): void {

    this.cinemaService.getVilles()
    .subscribe(data=>{
      this.villes=data;
    },err=>{
      console.log(err);
    })
  }
  onGetCinema(v){
    this.currentVille=v;
    this.salles=undefined;
    this.cinemaService.getCinema(v)
    .subscribe(data=>{
      this.cinemas=data;
    },err=>{
      console.log(err);
    })
  }
  onGetSalles(c)
  {
    this.currentCinemas=c;
    this.cinemaService.getSalles(c)
    .subscribe(data=>{
      this.salles=data;
      this.salles._embedded.salles.forEach(salle => {
        this.cinemaService.getProjection(salle)
        .subscribe(data=>{
          salle.projections=data;
        },err=>{
          console.log(err);
        })
      })
    },err=>{
      console.log(err);
    })
  }
  onGetTicketPlaces(p)
  {
    
    this.currentProjection=p;
    console.log(this.currentProjection);
    this.cinemaService.getTicketPlaces(p)
    .subscribe(data=>{
      this.currentProjection.tickets=data;
      this.selectedTicket=[];
    },err=>{
      console.log(err);
    })
  }
  OnSeletctTicket(t)
  {
    if(!t.selected){
      t.selected=true;
      this.selectedTicket.push(t);
    }
    else{
      t.selected=false;
      this.selectedTicket.splice(this.selectedTicket.indexOf(t),1);
    }
    console.log(this.selectedTicket);
  }
  getTicketClass(t){
  
    let str="btn ticket ";
    if(t.reservee==true)
    {
      str+="btn-danger";
    }
    else if(t.selected)
    {
      str+="btn-warning";
    }
    else{
      str+="btn-success";
    }
    return str;
  }
  OnPayeTickets(dataForm){
  
    let ticket=[];
    this.selectedTicket.forEach(t => {
      ticket.push(t.id_ticket)
      
    });
    dataForm.tickets=ticket;
    this.cinemaService.payerTicket(dataForm)
    .subscribe(data=>{
      alert("Ticket réservée avec succée!");
      this.onGetTicketPlaces(this.currentProjection);
    },err=>{
      console.log(err);
    })

  }
    
  

}
