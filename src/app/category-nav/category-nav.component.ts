import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit, HostListener } from '@angular/core';
import { ProductsService } from '../products.service';
import { Product } from '../product.model';

@Component({
  selector: 'app-category-nav',
  templateUrl: './category-nav.component.html',
  styleUrls: ['./category-nav.component.css']
})
export class CategoryNavComponent implements OnInit {
  categories: string[] = [];
  showLeftIndicator = false;
  showRightIndicator = false;
  products: Product[] = [];
  @ViewChild('categoryNav') categoryNav!: ElementRef;
  @Output() categorySelected = new EventEmitter<string>();
  @Input() activeCategory: string = 'all';

  constructor(private productsService: ProductsService) { }

  ngOnInit(): void {
    this.productsService.getAllProducts().subscribe((data) => {
      this.products = data;
      this.categories = this.productsService.getAllCategories(data);
    });
    
  }

  ngAfterViewInit(): void {
    this.checkScrollIndicators();
    setTimeout(() => this.checkScrollIndicators(), 300); // Check after render
  }

  @HostListener('window:resize')
  onResize(): void {
    this.checkScrollIndicators();
  }

  onScroll(): void {
    this.checkScrollIndicators();
  }

  checkScrollIndicators(): void {
    const element = this.categoryNav.nativeElement;
    this.showLeftIndicator = element.scrollLeft > 10;
    this.showRightIndicator = element.scrollLeft < (element.scrollWidth - element.clientWidth - 10);
  }

  selectCategory(category: string) {
    this.categorySelected.emit(category);
     this.scrollToCategory(category);
  }
   scrollToCategory(category: string): void {
    const index = category === 'all' ? 0 : this.categories.indexOf(category) + 1;
    const element = this.categoryNav.nativeElement;
    const items = element.querySelectorAll('li');
    
    if (items[index]) {
      items[index].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  }
}