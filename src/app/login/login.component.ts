import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {Router} from'@angular/router'
import {ServService} from '../serv.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private http:HttpClient,private r:Router,private s:ServService) { }

  ngOnInit() {
  }

  loginForm = new FormGroup({
    username: new FormControl('',[
      Validators.required
    ]),
    password: new FormControl('', [
      Validators.required
    ])
  });

  login(){
    // console.log(this.loginForm.value.username)
    this.http.post("http://localhost:3800/login",this.loginForm.value)
    .subscribe(
      (data:any)=>{ 
      // v.push(data.mess)
      localStorage.setItem("token", data.token );
      // alert(data.token);
      alert(data.mess);
      // console.log(v) 
      if(data.mess=="welcome"){
        this.r.navigate(['/home'])   
        this.s.userid=this.loginForm.value.username
        // console.log( this.s.userid)
      }
    }, 
    error => {
        console.log(error);
    } 
    
    )
  }

}
