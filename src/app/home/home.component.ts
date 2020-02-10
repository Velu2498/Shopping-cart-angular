import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { ServService } from "../serv.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private r: Router,
    private s: ServService
  ) {

//getting token from local storage and checking
    setTimeout(() => {
      var data = localStorage.getItem("token");
      var json = { data };
      // console.log(json)

      this.http.post("http://localhost:3800/home", json).subscribe(
        (res: any) => {
          // console.log(res.status)
          // alert(res.mssg);
          if (res.mssg == "permitted") {
            // ser.auth =true;
            // console.log(ser.auth)
            console.log("okkkkk");
          } else {
            if (confirm("session end log in again")) {
              this.r.navigate(["/login"]);
            } else {
              this.r.navigate(["/error"]);
            }
          }
        },
        error => {
          console.log(error);
        }
      );
    }, 1000);

//to display user cart info
    this.http
      .get("http://localhost:3800/cartdetails/" + this.s.userid)
      .subscribe(data => {
        console.log(data);
        this.array = data;
        // alert("ok")
      });
  }

//products 
  products = [
    {
      productName: "T-Shirt",
      basePrice: 500,
      image: "http://placehold.it/200x200",
      description: "Des",
      selectedVar: {
        size: "xl",
        meterial: "cotton",
        color: "yellow"
      },
      varients: [
        {
          type: "Size",
          values: ["xl", "xxl"]
        },
        {
          type: "Meterial",
          values: ["cotton", "silk"]
        },
        {
          type: "Color",
          values: ["yellow", "red"]
        }
      ],
      varientDetails: [
        {
          size: "xl",
          meterial: "cotton",
          color: "red",
          addOnprice: 30
        },
        {
          size: "xl",
          meterial: "cotton",
          color: "yellow",
          addOnprice: 40
        },
        {
          size: "xl",
          meterial: "silk",
          color: "red",
          addOnprice: 50
        },
        {
          size: "xl",
          meterial: "silk",
          color: "yellow",
          addOnprice: 60
        },
        {
          size: "xxl",
          meterial: "cotton",
          color: "red",
          addOnprice: 70
        },
        {
          size: "xxl",
          meterial: "cotton",
          color: "yellow",
          addOnprice: 80
        },
        {
          size: "xxl",
          meterial: "silk",
          color: "red",
          addOnprice: 90
        },
        {
          size: "xxl",
          meterial: "silk",
          color: "yellow",
          addOnprice: 100
        }
      ]
    },
    {
      productName: "Saree",
      basePrice: 5000,
      image: "http://placehold.it/200x200",
      description: "Des",
      selectedVar: {
        meterial: "cotton",
        color: "yellow"
      },
      varients: [
        {
          type: "Meterial",
          values: ["cotton", "silk"]
        },
        {
          type: "Color",
          values: ["yellow", "red"]
        }
      ],
      varientDetails: [
        {
          meterial: "cotton",
          color: "red",
          addOnprice: 30
        },
        {
          meterial: "cotton",
          color: "yellow",
          addOnprice: 40
        },
        {
          meterial: "silk",
          color: "red",
          addOnprice: 50
        },
        {
          meterial: "silk",
          color: "yellow",
          addOnprice: 60
        }
      ]
    }
  ];
//cart array
  array: any = [];

//add to cart function
  fun(para) {
    this.c = 0;
    // console.log(document.getElementById("T-Shirt-Size").value)
    // console.log(document.getElementById("Saree-Meterial").value)

    if (para == "T-Shirt") {
      let obj = {
        name: "T-Shirt",
        size: document.getElementById("T-Shirt-Size").value,
        material: document.getElementById("T-Shirt-Meterial").value,
        color: document.getElementById("T-Shirt-Color").value,
        price: document.getElementById("T-Shirt-cost").innerText
      };

      this.array.push(obj);

     //  console.log(`userID-${this.s.userid}`);
// add to database 
      this.http
        .post("http://localhost:3800/addcart/" + this.s.userid, this.array)
        .subscribe((res: any) => {
          // console.log(res.status)
          alert(res.mess);
        });

    }

    if (para == "Saree") {
      let obj = {
        name: "Saree",
        material: document.getElementById("Saree-Meterial").value,
        color: document.getElementById("Saree-Color").value,
        price: document.getElementById("Saree-cost").innerText
      };

      this.array.push(obj);

      this.http
        .post("http://localhost:3800/addcart/" + this.s.userid, this.array)
        .subscribe((res: any) => {
          // console.log(res.status)
          alert(res.mess);
        });
    }
  }

  orgprice;
  c = 0;

  onchange(name, type, val) {
    //   console.log(name)
//     console.log(name, type, val);

    let product = this.products.find(para => {
      return para.productName == name;
    });

    product.selectedVar[type.toLowerCase()] = val;

    let varientDetails = product.varientDetails.find(para => {
      return (
        para.size == product.selectedVar.size &&
        para.color == product.selectedVar.color &&
        para.meterial == product.selectedVar.meterial
      );
    });
    //   console.log(varientDetails)
    var addon = varientDetails.addOnprice;
    //   console.log(addon)

    if (this.c == 0) {
      this.orgprice = product.basePrice;
    }
    product.basePrice = this.orgprice + addon;
    //   if(name == "T-Shirt"){
    //      product.basePrice=500+addon
    //   }
    //   if(name == "Saree"){
    //      product.basePrice=5000+addon
    //   }
    //   product.basePrice=product.basePrice+addon
    //   console.log(this.orgprice)
    console.log(
      document.getElementById("Saree-Meterial").getAttribute("value")
    );
    this.c++;
  }

  del(index) {
    console.log(index);
    if(confirm("It will remove item from your cart")){
    var elem=this.array[index]
//     this.array.pop(index)
     this.array.splice(index,1);
//     console.log(this.array)
    this.http
    .post("http://localhost:3800/addcart/" + this.s.userid, this.array)
    .subscribe((res: any) => {
    });
}
  }

  ngOnInit() {}
}
