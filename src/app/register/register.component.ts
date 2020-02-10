import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl} from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private http:HttpClient) { }

  ngOnInit() {
  }

  //getting values from form
  data = new FormGroup({
    Name: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl(''),
  });

  //insert the value to database
  add(){
    // console.log(this.data.value.email)
     var obj=this.data.value
     obj["cart"]=[]
     console.log(obj)
      this.http.post("http://localhost:3800/data/"+this.data.value.email,this.data.value)
      .subscribe(
        (data:any)=>{
        alert(data.mess);
        console.log(data)
      }, error => {
          console.log(error);
      }
      )
    }

}
