import {
  Component,
  OnInit,
  ViewChild
} from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { tap, takeUntil } from 'rxjs/operators';
import { LoginData, Author } from 'src/app/services/auhtor.interface';
import { Subject } from 'rxjs';
import { AuthorService } from 'src/app/services/author.service';

@Component({
  selector: 'app-authors',
  templateUrl: './authors.component.html',
  styleUrls: ['./authors.component.css']
})
export class AuthorsComponent implements OnInit {
  loading: boolean = false
 authors: Array<Author> = []
 author: Author

 //toast errors
 toastMessage: string = "";
 toastStyle: string = "bg-danger";
 toastVisible: boolean = false;

 //modal
 deleteId: any;
 valueDelete: any;
 deleteModal: boolean = false;
 titleDeleteModal: string = "";
 titleDelete: string = "";
 descriptionDelete: string = "";

   //modal
   addModal: Boolean = false;
   hasCancelAddButton: Boolean = true;
   name: any

   private ngUnsubscribe = new Subject();


 @ViewChild('addForm', {static: false}) addForm: any;

 constructor(private http: HttpClient,
             private authorService: AuthorService) { }
 

  ngOnInit() {
    this.getAuthentication()
    this.search()
    this.addModal = false
  }
    
  getAuthentication(){
  return this.http.get(`${environment.appApiUrl}/authentication`, this.getHeaderOption())
    .pipe(tap((data: LoginData)=> {
      window.localStorage.setItem('az-token', data.token);
      window.localStorage.setItem('az-name', data.name);
      window.localStorage.setItem('az-username', data.username);
    }))
  }

  
  search(){
    this.loading = true
    this.authors = []
  
    this.authorService.getAll()
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((data) => {

       this.loading = false;
       let authors = JSON.parse(JSON.stringify(data));

       let result: Array<Author> = [];
       let exception: Array<any> = ['da', 'de', 'do', 'das', 'dos']

       authors.forEach(element => {
         var auts = element.name.split(' ')
         let firstname = ''
         let lastname = ''
          for (let index = 0; index < auts.length; index++) {
            if(index == 0){
              firstname = auts[index].substring(0, 1).toUpperCase() + auts[index].substring(1)
            }
            else{
              if(exception.find(f => f == auts[index].toLowerCase()) != undefined){
                firstname += ' ' + auts[index].toLowerCase()
              }
              else {
              if(lastname != undefined && lastname != ""){
                lastname += ' '
              }
              lastname += auts[index].toUpperCase()
            }
          }

            if(index == (auts.length-1))
              result.push(Object.assign({}, {
                id: element.id,
                name: lastname + ', ' + firstname
              }))
          }
       });
         
  
        window.setTimeout(() => {
          this.loading = false;
        }, 3000);

        this.authors = result
      
      },
      err => {
        this.loading = false;
        this.toastStyle = "bg-danger";
        this.toastMessage = err.error != undefined ? err.error.message : err.message;
        this.toastVisible = true;
  
          window.setTimeout(() => {
              this.toastMessage = '';
              this.toastVisible = false;
              this.toastStyle = "";
          }, 3000);

    });

  }

  save(){
    if(this.name == undefined || this.name == ''){
      alert('Favor informar um nome');
      return
    }

    let author = Object.assign({}, {
      name: this.name
    })
    
    this.authorService.save(author)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(data => {
      alert('salvo com sucesso')
      this.name = ''
      this.search()
    })

  }

  getHeaderOption() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': ''
      })
    }
  }

}
