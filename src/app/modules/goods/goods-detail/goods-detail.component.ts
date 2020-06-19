import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-goods-detail',
  templateUrl: './goods-detail.component.html',
  styleUrls: ['./goods-detail.component.scss']
})
export class GoodsDetailComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute
  ) {
    console.log(this.activatedRoute.snapshot.paramMap.get('goodsId'));
  }

  ngOnInit(): void {
  }

}
