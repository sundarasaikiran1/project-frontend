import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Drug } from '../models/drug.model';
import { FOrder } from '../models/FOrder.model';
import { Order } from '../models/order.model';
import { PharmacyService } from '../service/pharmacy.service';

@Component({
  selector: 'app-orderdetails',
  templateUrl: './orderdetails.component.html',
  styleUrls: ['./orderdetails.component.css']
})
export class OrderdetailsComponent implements OnInit {
  drugdata:Drug;
  public totalAmount:number=0;

  public fulldata:FOrder[]=[];
  public NewData:FOrder[]=[];

 
  drugp:Drug={
    drugId: 0,
    drugName: '',
    quantity: 0,
    price: 0,
    expiryDate: 0,
    supplierId: 0
  };
  constructor(private pharmacyService:PharmacyService,private toastr: ToastrService) { }

  ngOnInit(): void {
   
    this.getFinalData()
   
  }
  

  

  getFinalData(){
    this.pharmacyService.getFinalDb()
    .subscribe(
      Response=>{
        console.log(Response);
        
        for(let x of Response){
          if(x.isPicked=="Conform"){
            this.fulldata.push(x)
          }else{
            this.NewData.push(x)
          }
        }
        for (let x of this.fulldata){
          this.totalAmount+=Math.round(x.totalPrice)
        }
      }
    );
  }
  getdrugData(id:number,quan:number){
    this.pharmacyService.getDrugById(id).subscribe(response=>{
      
      this.drugp.drugId=id;
    this.drugp.drugName=response.drugName;
    this.drugp.quantity=response.quantity-quan;
    this.drugp.price=response.price;
    this.drugp.expiryDate=response.expiryDate;
    this.drugp.supplierId=response.supplierId;
    this.pharmacyService.updateDrugs(this.drugp)
    .subscribe(response=>{
      console.log(response)
    })
    });
  }

  Onsubmit(id:number){
    alert("Order Conformed");

    
  }
  delete(x:FOrder,drugid:number,quan:number){
    this.getdrugData(drugid,quan)
    
    
    
    x.isPicked="Conform";
    this.pharmacyService.putFinalDb(x)
    .subscribe(Response=>{
      console.log(Response)
    })
    this.toastr.success('order was confirmed');
    this.toastr.success('Mail Sent');    
    this.getFinalData();
    this.pharmacyService.AdminConform(x).subscribe((data) => {
        console.log(data);
      });
      location.reload();
  }

}
