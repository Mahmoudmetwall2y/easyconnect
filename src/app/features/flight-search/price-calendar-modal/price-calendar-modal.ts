import { CommonModule, DatePipe } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

interface DayCell {
  date: Date;
  price: number | null;
}

interface MatrixCell {
  price: number | null;
}

@Component({
  selector: 'app-price-calendar-modal',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './price-calendar-modal.html',
  styleUrl: './price-calendar-modal.css',
})
export class PriceCalendarModal implements OnChanges {
  @Input() departDate: Date | string | null = null;
  @Input() returnDate: Date | string | null = null;
  @Input() currency: string = 'KWD';

  @Input() departDays: any[] = []; // raw from parent
  @Input() returnDays: any[] = [];

  @Output() closed = new EventEmitter<void>();
  @Output() dateSelected = new EventEmitter<{ depart: any; ret: any }>();

  // ما سنستخدمه في التمبلت
  normalizedDepart: DayCell[] = [];
  normalizedReturn: DayCell[] = [];
  matrix: MatrixCell[][] = [];

  // أرخص خلية (ذهاب + عودة)
  cheapestTotal: number | null = null;
  cheapestRowIndex: number | null = null;
  cheapestColIndex: number | null = null;

  // أرخص عمود (أرخص سعر ذهاب)
  minDepartPrice: number | null = null;

  // أرخص صف (أرخص سعر عودة)
  minReturnPrice: number | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    this.prepareData();
  }

  close() {
    this.closed.emit();
  }

  get departAsDate(): Date | null {
    return this.departDate ? new Date(this.departDate) : null;
  }

  get returnAsDate(): Date | null {
    return this.returnDate ? new Date(this.returnDate) : null;
  }

  /** تجهيز الداتا وبناء الماتريكس */
  private prepareData() {
    this.normalizedDepart = this.normalizeDays(this.departDays);
    this.normalizedReturn = this.normalizeDays(this.returnDays);
    this.buildMatrix();
    this.computeCheapestDepart();
    this.computeCheapestReturn();
    console.log("DEPART NORMALIZED:", this.normalizedDepart);
console.log("RETURN NORMALIZED:", this.normalizedReturn);

  }

  /** نتأكد أن التاريخ Date والسعر number ونحصرها في 7 عناصر */
  private normalizeDays(raw: any[]): DayCell[] {
    return (raw || [])
      .slice(0, 7)
      .map((d) => ({
        date: d.date instanceof Date ? d.date : new Date(d.date),
        price:
          d.price === null || d.price === undefined
            ? null
            : Number(d.price),
        // لو حابب تحافظ على بقية الخصائص تقدر تضيفها هنا
      }));
  }

  /** بناء الماتريكس: سعر الخلية = سعر الذهاب + سعر العودة */
  private buildMatrix() {
    this.matrix = [];
    this.cheapestTotal = null;
    this.cheapestRowIndex = null;
    this.cheapestColIndex = null;

    for (let r = 0; r < this.normalizedReturn.length; r++) {
      const row: MatrixCell[] = [];
      const ret = this.normalizedReturn[r];

      for (let c = 0; c < this.normalizedDepart.length; c++) {
        const dep = this.normalizedDepart[c];

        let total: number | null = null;

        if (dep.price != null && ret.price != null) {
          total = dep.price + ret.price; // ✅ دمج السعرين صح
        }

        row.push({ price: total });

        // نحسب أرخص خلية في الماتريكس كلها
        if (total != null && total > 0) {
          if (this.cheapestTotal == null || total < this.cheapestTotal) {
            this.cheapestTotal = total;
            this.cheapestRowIndex = r;
            this.cheapestColIndex = c;
          }
        }
      }

      this.matrix.push(row);
    }
  }

  /** أقل سعر ذهاب → أرخص عمود */
  private computeCheapestDepart() {
    this.minDepartPrice = null;
    for (const d of this.normalizedDepart) {
      if (d.price != null && d.price > 0) {
        if (this.minDepartPrice == null || d.price < this.minDepartPrice) {
          this.minDepartPrice = d.price;
        }
      }
    }
  }

  /** أقل سعر عودة → أرخص صف */
  private computeCheapestReturn() {
    this.minReturnPrice = null;
    for (const r of this.normalizedReturn) {
      if (r.price != null && r.price > 0) {
        if (this.minReturnPrice == null || r.price < this.minReturnPrice) {
          this.minReturnPrice = r.price;
        }
      }
    }
  }

  /** هل هذا العمود هو عمود الذهاب الأرخص؟ */
  isCheapestColumn(colIndex: number): boolean {
    const d = this.normalizedDepart[colIndex];
    return (
      this.minDepartPrice != null &&
      d?.price != null &&
      d.price === this.minDepartPrice
    );
  }

  /** هل هذا الصف هو صف العودة الأرخص؟ */
  isCheapestRow(rowIndex: number): boolean {
    const r = this.normalizedReturn[rowIndex];
    return (
      this.minReturnPrice != null &&
      r?.price != null &&
      r.price === this.minReturnPrice
    );
  }

  /** هل هذه الخلية هي الأرخص في الماتريكس؟ */
  isCheapestCell(rowIndex: number, colIndex: number): boolean {
    return (
      this.cheapestRowIndex === rowIndex &&
      this.cheapestColIndex === colIndex &&
      this.cheapestTotal != null
    );
  }

  /** هل هذه الخلية هي المختارة حاليًا (طبقاً لـ departDate/returnDate)؟ */
  isSelected(rowIndex: number, colIndex: number): boolean {
    const dep = this.normalizedDepart[colIndex];
    const ret = this.normalizedReturn[rowIndex];

    if (!this.departAsDate || !this.returnAsDate) return false;

    return (
      dep.date.toDateString() === this.departAsDate.toDateString() &&
      ret.date.toDateString() === this.returnAsDate.toDateString()
    );
  }

  /** عند الضغط على خلية في الماتريكس */
  onCellClick(rowIndex: number, colIndex: number) {
    const dep = this.normalizedDepart[colIndex];
    const ret = this.normalizedReturn[rowIndex];
    this.dateSelected.emit({ depart: dep, ret });
  }
}
