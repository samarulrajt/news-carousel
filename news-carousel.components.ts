import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, OnDestroy, HostListener } from '@angular/core';

export interface NewsItem {
  title: string;
  summary?: string;
  date?: string;         // ISO or formatted string
  link?: string;
  image?: string;        // optional image URL
  tag?: string;          // e.g. "Release", "Portfolio"
}

@Component({
  selector: 'app-news-carousel',
  templateUrl: './news-carousel.component.html',
  styleUrls: ['./news-carousel.component.scss'],
  imports: [CommonModule]
  // keep default change detection for simplicity
})
export class NewsCarouselComponent implements OnInit, OnDestroy {
  @Input() heading = 'Latest updates';
  @Input() description = 'News about releases and portfolio updates';
  @Input() items: NewsItem[] = [];
  @Input() intervalMs = 5000; // default 5 seconds
  placeholderImage = 'assets/images/citi-logo.png';



  currentIndex = 0;
  private timerId: any = null;
  paused = false;

  ngOnInit(): void {
    this.startTimer();
  }

  ngOnDestroy(): void {
    this.clearTimer();
  }

  startTimer(): void {
    this.clearTimer();
    if (this.items.length <= 1) return;
    this.timerId = setInterval(() => {
      if (!this.paused) this.next();
    }, this.intervalMs);
  }

  clearTimer(): void {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  goTo(index: number): void {
    if (index < 0) index = this.items.length - 1;
    if (index >= this.items.length) index = 0;
    this.currentIndex = index;
  }

  next(): void {
    this.currentIndex = (this.currentIndex + 1) % this.items.length;
  }

  prev(): void {
    this.currentIndex = (this.currentIndex - 1 + this.items.length) % this.items.length;
  }

  @HostListener('mouseenter')
  onMouseEnter(): void {
    this.paused = true;
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.paused = false;
  }

  @HostListener('document:keydown.arrowright', ['$event'])
  onArrowRight(event: KeyboardEvent) {
    event.preventDefault();
    this.next();
  }

  @HostListener('document:keydown.arrowleft', ['$event'])
  onArrowLeft(event: KeyboardEvent) {
    event.preventDefault();
    this.prev();
  }
}
