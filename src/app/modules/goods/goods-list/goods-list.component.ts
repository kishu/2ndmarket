import { Component, OnInit } from '@angular/core';
import { GoodsService } from '@app/core/http/goods.service';
import { tap } from "rxjs/operators";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'app-goods-list',
  templateUrl: './goods-list.component.html',
  styleUrls: ['./goods-list.component.scss']
})
export class GoodsListComponent implements OnInit {

  goodsList$: any;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private goodsService: GoodsService
  ) {
    this.router.events.subscribe(e => console.log(e));
    // this.activatedRoute.url.subscribe(r => console.log('asdfasdfasdf', r));
    this.goodsList$ = this.goodsService.getAll([['updated', 'desc']]).pipe(tap(r => console.log(r)))
  }

  ngOnInit(): void {
  }

}
