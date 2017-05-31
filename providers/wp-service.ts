import { Injectable, Inject } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { EnvVariables } from '../../environments/environment-variables.token';

@Injectable()
export class WpService {

  //wpURL: string;

  constructor(public http: Http, @Inject(EnvVariables) public environment) {
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
            var consulta = this.http.get(this.environment.WP_API + 'posts?filter[posts_per_page]=8&filter[order]=DESC&status=publish&filter[tag]=' + this.environment.WP_TAGS)
                    .map(res => res.json())
            ;
            return consulta;
      //}
   
  }
  
  load(id) {    
    return this.http.get(this.environment.WP_API + 'posts/' + id)
        .map(res => res.json())
       ;   
  }

}
