import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { environment } from '../../app/environment';

@Injectable()
export class WpService {

  //wpURL: string;

  constructor(public http: Http) {
    //this.wpURL = 'http://portalespi.manaus.am.gov.br/wp-json/';
  }

  loadPosts() {   
      
      /*(if(this.cache.get('wpPosts')){
          this.data = this.cache.get('wpPosts');
          return new Observable(data => this.data)
                            .startWith(this.data)
                            .share();;   
      }else{
            */
            var consulta = this.http.get(environment.WP_API + 'posts?filter[posts_per_page]=8&filter[order]=DESC&status=publish&filter[tag]=' + environment.WP_TAGS)
                    .map(res => res.json())
            ;
            return consulta;
      //}
   
  }
  
  load(id) {    
    return this.http.get(environment.WP_API + 'posts/' + id)
        .map(res => res.json())
       ;   
  }

}
