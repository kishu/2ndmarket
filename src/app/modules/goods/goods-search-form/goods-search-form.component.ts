import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-goods-search-form',
  templateUrl: './goods-search-form.component.html',
  styleUrls: ['./goods-search-form.component.scss']
})
export class GoodsSearchFormComponent implements OnInit {
  @ViewChild('keywordRef', { static: true }) keywordRef: ElementRef;
  searchForm = this.fb.group({
    keyword: [],
  });
  isSearchResults = false;
  get keywordCtl() {
    return this.searchForm.get('keyword');
  }

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.activatedRoute.queryParamMap.pipe(
      map(m => m.get('tag')?.trim())
    ).subscribe(keyword => {
      this.isSearchResults = !!keyword;
      this.keywordCtl.setValue(keyword);
      this.keywordRef.nativeElement.blur();
    });
  }

  onSubmit() {
    if (this.keywordCtl.value?.trim()) {
      this.router.navigate(
        ['/goods/search'],
        {queryParams: {tag: this.keywordCtl.value?.trim()}}
      );
    }
  }

}
